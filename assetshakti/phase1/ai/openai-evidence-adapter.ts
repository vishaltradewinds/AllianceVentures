import type { EvidenceItem } from "../property-schema";

export interface OpenAIAnalysisRequest {
  sourceText: string;
  sourceName: string;
  sourceReference?: string;
  observedAt?: string;
}

export interface OpenAIExtraction {
  assertions: Array<{
    category: EvidenceItem["category"];
    assertion: string;
    status: Extract<EvidenceItem["status"], "REPORTED_BY_SOURCE" | "UNVERIFIED">;
    confidence: number;
    rationale: string;
  }>;
  missingCategories: EvidenceItem["category"][];
  contradictions: string[];
}

const CATEGORIES: EvidenceItem["category"][] = [
  "IDENTITY",
  "TITLE",
  "ENCUMBRANCE",
  "LITIGATION",
  "POSSESSION",
  "PHYSICAL",
  "LOCATION",
  "VALUATION",
  "AUCTION",
  "AUTHORITY"
];

const SYSTEM_INSTRUCTIONS = `
You are the AssetShakti evidence-extraction layer.

Your job is extraction and evidence triage only. Never decide whether a property
should be bid on. Never upgrade an assertion to VERIFIED. VERIFIED evidence must
come from an authoritative validation process outside the model.

Rules:
1. Extract only facts explicitly supported by the supplied source text.
2. Source-reported facts use REPORTED_BY_SOURCE.
3. Facts that are plausible but not explicitly supported must not be invented;
   represent them as missing instead.
4. Treat TITLE, POSSESSION, AUTHORITY and IDENTITY as critical categories.
5. Preserve uncertainty, conflicting statements and adverse proceedings.
6. Missing evidence is a state, not a reason to guess.
7. Return JSON matching the requested schema.
`;

function extractJson(text: string): OpenAIExtraction {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("OpenAI response did not contain a JSON object");
  }

  const parsed = JSON.parse(text.slice(start, end + 1)) as OpenAIExtraction;
  if (!Array.isArray(parsed.assertions) ||
      !Array.isArray(parsed.missingCategories) ||
      !Array.isArray(parsed.contradictions)) {
    throw new Error("OpenAI response failed AssetShakti extraction schema");
  }

  return parsed;
}

/**
 * Advisory OpenAI extraction adapter.
 *
 * The API key is read server-side from OPENAI_API_KEY. It must never be placed
 * in browser/client code, source control, or an AssetShakti evidence record.
 *
 * This adapter deliberately returns evidence states that remain non-verified.
 * The deterministic Shakti engine remains the sole decision authority.
 */
export async function extractEvidenceWithOpenAI(
  request: OpenAIAnalysisRequest,
  options: { model?: string; apiKey?: string } = {}
): Promise<OpenAIExtraction> {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = options.model ?? process.env.OPENAI_ASSET_SHAKTI_MODEL ?? "gpt-6-astra";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: SYSTEM_INSTRUCTIONS,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                sourceName: request.sourceName,
                sourceReference: request.sourceReference,
                observedAt: request.observedAt,
                allowedCategories: CATEGORIES,
                requiredOutput: {
                  assertions: [
                    {
                      category: "IDENTITY | TITLE | ENCUMBRANCE | LITIGATION | POSSESSION | PHYSICAL | LOCATION | VALUATION | AUCTION | AUTHORITY",
                      assertion: "string",
                      status: "REPORTED_BY_SOURCE | UNVERIFIED",
                      confidence: "number 0..1",
                      rationale: "string"
                    }
                  ],
                  missingCategories: ["one or more allowed categories"],
                  contradictions: ["explicit conflicts found in source"]
                },
                sourceText: request.sourceText
              })
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI Responses API error ${response.status}: ${detail.slice(0, 500)}`);
  }

  const payload = await response.json() as { output_text?: string };
  if (!payload.output_text) {
    throw new Error("OpenAI Responses API returned no output_text");
  }

  return extractJson(payload.output_text);
}

export function toEvidenceItems(
  extraction: OpenAIExtraction,
  request: OpenAIAnalysisRequest
): EvidenceItem[] {
  const assertions: EvidenceItem[] = extraction.assertions.map((item, index) => ({
    id: `AI-${index + 1}`,
    category: item.category,
    sourceName: request.sourceName,
    sourceReference: request.sourceReference,
    observedAt: request.observedAt,
    status: item.status,
    assertion: item.assertion,
    confidence: Math.max(0, Math.min(1, item.confidence)),
    notes: `AI extraction only: ${item.rationale}`
  }));

  const missing: EvidenceItem[] = extraction.missingCategories.map((category, index) => ({
    id: `AI-MISSING-${index + 1}`,
    category,
    sourceName: request.sourceName,
    sourceReference: request.sourceReference,
    observedAt: request.observedAt,
    status: "MISSING",
    assertion: `No supporting evidence for ${category} was established by this source.`,
    confidence: 1,
    notes: "Explicitly recorded as missing; not inferred."
  }));

  return [...assertions, ...missing];
}

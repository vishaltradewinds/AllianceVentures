import { readFileSync } from "node:fs";
import { evaluateCase, type CaseEvaluationInput } from "./case-evaluation-engine";

const load = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));

const normalizeCase = (raw: any): CaseEvaluationInput => ({
  caseId: raw.caseId,
  source: {
    authority: raw.source?.authority ?? raw.sourceAuthority ?? "IBBI",
    sourceReference: raw.source?.sourceReference ?? raw.source?.sourceUrl ?? raw.sourceReference ?? "",
    observedAt: raw.source?.observedAt ?? raw.observedAt ?? "1970-01-01",
  },
  expectedDecision: raw.expectedDecision,
  asset: raw.asset ?? (raw.assetClass ? {
    class: raw.assetClass,
    subtype: raw.subtype,
    description: raw.description,
  } : undefined),
  evidence: raw.evidence ?? raw.observedEvidence ?? [],
  notes: raw.notes ?? raw.reason,
});

const inputs: CaseEvaluationInput[] = [
  load("assetshakti/phase1/validation-case-vs-matrix.json") as CaseEvaluationInput,
  ...(load("assetshakti/phase1/case-evaluation-negative-controls.json") as CaseEvaluationInput[]),
  ...(load("assetshakti/phase1/real-evidence-pilot.json") as CaseEvaluationInput[]),
];

const results = inputs.map(normalizeCase).map(evaluateCase);
const failed = results.filter((result) => !result.passed);

const report = {
  generatedAt: new Date().toISOString(),
  evaluator: "assetshakti/phase1/case-evaluation-engine.ts",
  productionDecisionEngine: "assetshakti/phase1/decision-engine.ts",
  totalCases: results.length,
  passedCases: results.length - failed.length,
  failedCases: failed.length,
  productionCertified: false,
  results,
};

console.log(JSON.stringify(report, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}

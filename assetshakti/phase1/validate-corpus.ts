import fs from "node:fs";
import { evaluateProperty } from "./shakti-score";
import type { PropertyAsset } from "./property-schema";

const corpus = JSON.parse(
  fs.readFileSync(new URL("./validation-corpus.json", import.meta.url), "utf8")
) as { records: any[] };

const TARGET = 50;
const REQUIRED = {
  RESIDENTIAL: 10,
  COMMERCIAL: 8,
  INDUSTRIAL: 10,
  AGRICULTURAL: 6,
  OTHER_IMMOVABLE: 4,
  COMPOSITE: 12
};

const errors: string[] = [];
for (const record of corpus.records) {
  if (!record.caseId || !record.source?.sourceUrl || !record.source?.observedAt) {
    errors.push(`${record.caseId ?? "UNKNOWN"}: missing source reference`);
  }
  if (!Array.isArray(record.evidence) || !record.evidence.length) {
    errors.push(`${record.caseId ?? "UNKNOWN"}: missing evidence ledger`);
    continue;
  }
  for (const e of record.evidence) {
    if (!e.category || !e.status || !e.assertion) {
      errors.push(`${record.caseId}: incomplete evidence item`);
    }
  }
  if (record.decision === "BID_READY") {
    errors.push(`${record.caseId}: discovery corpus cannot contain BID_READY`);
  }
}

const counts = Object.fromEntries(
  Object.keys(REQUIRED).map(k => [k, corpus.records.filter(r => r.asset.class === k).length])
);

const negative = JSON.parse(
  fs.readFileSync(new URL("./validation-case-vs-matrix.json", import.meta.url), "utf8")
);
const negativeAsset = {
  assetId: negative.caseId,
  source: {
    platform: "IBBI",
    sourceUrl: negative.source.sourceUrl
  },
  identity: {
    class: negative.asset.class,
    subtype: negative.asset.subtype,
    address: negative.asset.description
  },
  legalRoute: { regime: "IBC", authority: "IBBI" },
  evidence: negative.observedEvidence.map((e: any, i: number) => ({
    id: `${negative.caseId}-E${i + 1}`,
    category: e.category,
    sourceName: "IBBI liquidation auction notice",
    sourceReference: negative.source.sourceUrl,
    observedAt: "2026-10-06",
    status: e.status,
    assertion: e.assertion,
    confidence: e.confidence
  })),
  shakti: {
    legal: 0, physical: 0, location: 0, market: 0,
    economics: 0, auction: 0, criticalGatePassed: false,
    decision: "INSUFFICIENT_EVIDENCE"
  }
} as PropertyAsset;

const negativeResult = evaluateProperty(negativeAsset);
if (negativeResult.decision !== negative.expectedDecision) {
  errors.push(
    `negative control ${negative.caseId}: expected ${negative.expectedDecision}, got ${negativeResult.decision}`
  );
}

console.log("AssetShakti Phase-1 validation");
console.log(`Corpus: ${corpus.records.length}/${TARGET} records`);
console.log("Class counts:", counts);
console.log("Remaining to certification:", Math.max(0, TARGET - corpus.records.length));
console.log(`Negative control: ${negative.caseId} => ${negativeResult.decision}`);

for (const [cls, minimum] of Object.entries(REQUIRED)) {
  const actual = counts[cls] as number;
  if (actual < minimum) {
    console.log(`GAP ${cls}: ${actual}/${minimum}`);
  }
}

if (errors.length) {
  console.error("\nVALIDATION ERRORS:");
  for (const error of errors) console.error(" -", error);
  process.exit(1);
}

console.log("\nPASS: structural validation and negative-control gate passed.");
if (corpus.records.length < TARGET) {
  console.log("STATUS: NOT PRODUCTION CERTIFIED — 50-case gate remains open.");
}

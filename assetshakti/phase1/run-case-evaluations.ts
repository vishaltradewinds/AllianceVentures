import { readFileSync } from "node:fs";
import { evaluateCase, type CaseEvaluationInput } from "./case-evaluation-engine";

const load = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));

const inputs: CaseEvaluationInput[] = [
  load("assetshakti/phase1/validation-case-vs-matrix.json") as CaseEvaluationInput,
  ...(load("assetshakti/phase1/case-evaluation-negative-controls.json") as CaseEvaluationInput[]),
];

const results = inputs.map(evaluateCase);
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

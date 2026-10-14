import { evaluatePhase15Completion } from "./phase15-completion-gate";

const base = {
  directAuctionPolicyActive: true,
  sixDirectSourcesRegistered: true,
  exactLotIdentityGateActive: true,
  processTermGateActive: true,
  ciValidationPassed: true,
  ciSecurityPassed: true,
  ciDependencyPassed: true,
  productionCertificationOn: false,
  currentPilotEvidenceComplete: false,
  shaktiSignOff: false
};

const engineering = evaluatePhase15Completion(base);
if (engineering.state !== "ENGINEERING_COMPLETE_EVIDENCE_BLOCKED") throw new Error("expected evidence-blocked state");

const ready = evaluatePhase15Completion({
  ...base,
  currentPilotEvidenceComplete: true,
  shaktiSignOff: true
});
if (ready.state !== "READY_FOR_PRODUCTION_CERTIFICATION") throw new Error("expected certification-ready state");

console.log("Phase 1.5 completion gate tests passed.");

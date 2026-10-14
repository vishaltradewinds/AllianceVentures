export type Phase15CompletionState =
  | "ENGINEERING_COMPLETE_EVIDENCE_BLOCKED"
  | "READY_FOR_PRODUCTION_CERTIFICATION"
  | "REJECTED";

export interface Phase15CompletionInput {
  directAuctionPolicyActive: boolean;
  sixDirectSourcesRegistered: boolean;
  exactLotIdentityGateActive: boolean;
  processTermGateActive: boolean;
  ciValidationPassed: boolean;
  ciSecurityPassed: boolean;
  ciDependencyPassed: boolean;
  productionCertificationOn: boolean;
  currentPilotEvidenceComplete: boolean;
  shaktiSignOff: boolean;
}

export function evaluatePhase15Completion(
  input: Phase15CompletionInput,
): { state: Phase15CompletionState; reasons: string[] } {
  const reasons: string[] = [];

  if (!input.directAuctionPolicyActive) reasons.push("direct-auction-only policy is not active");
  if (!input.sixDirectSourcesRegistered) reasons.push("six direct auction sources are not registered");
  if (!input.exactLotIdentityGateActive) reasons.push("exact-lot identity gate is not active");
  if (!input.processTermGateActive) reasons.push("process-term evidence gate is not active");
  if (!input.ciValidationPassed) reasons.push("validation CI has not passed");
  if (!input.ciSecurityPassed) reasons.push("security CI has not passed");
  if (!input.ciDependencyPassed) reasons.push("dependency remediation CI has not passed");
  if (input.productionCertificationOn) reasons.push("production certification must remain OFF until certification gates pass");

  if (reasons.length) {
    return { state: "REJECTED", reasons };
  }

  if (!input.currentPilotEvidenceComplete || !input.shaktiSignOff) {
    return {
      state: "ENGINEERING_COMPLETE_EVIDENCE_BLOCKED",
      reasons: [
        "engineering/source-control gates are complete",
        "real-world pilot evidence and/or independent Shakti sign-off remain incomplete"
      ]
    };
  }

  return { state: "READY_FOR_PRODUCTION_CERTIFICATION", reasons: [] };
}

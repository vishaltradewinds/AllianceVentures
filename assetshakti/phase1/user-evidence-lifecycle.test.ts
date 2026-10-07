import { canPromoteToDecisionEvidence, projectVerifiedEvidence, type UserEvidenceRecord } from "./user-evidence-lifecycle";

const base:UserEvidenceRecord={intakeId:"TEST-INTAKE-001",caseId:"P1-PILOT-005",documentType:"AUCTION_NOTICE",auctionRound:"2026-09-23",sourceReference:"TEST://IBBI/JOSAN/CURRENT-2026-09-23",contentSha256:"test-sha256",state:"UPLOADED_PENDING_VERIFICATION"};
if(canPromoteToDecisionEvidence(base)) throw new Error("Pending evidence must remain fail-closed.");
const verified:UserEvidenceRecord={...base,state:"VERIFIED",verification:{currentOrSuperseded:"CURRENT",reconciliationStatus:"RECONCILED",verifiedAt:"2026-10-07T09:00:00Z",verifierId:"TEST-VERIFIER"}};
if(!canPromoteToDecisionEvidence(verified)) throw new Error("Verified current evidence should promote.");
if(!projectVerifiedEvidence(verified,"BIDDER_OBLIGATION","TEST-only bidder obligations","2026-10-07T09:00:00Z")) throw new Error("Projection failed.");
if(canPromoteToDecisionEvidence({...verified,verification:{...verified.verification!,reconciliationStatus:"UNRESOLVED"}})) throw new Error("Unresolved reconciliation must block.");
if(canPromoteToDecisionEvidence({...verified,verification:{...verified.verification!,currentOrSuperseded:"SUPERSEDED"}})) throw new Error("Superseded evidence must block current-round G16.");
console.log("user-evidence-lifecycle: PASS");

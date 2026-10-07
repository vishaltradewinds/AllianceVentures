import assert from 'node:assert/strict';

type IntakeStatus = 'REQUESTED' | 'UPLOADED_PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
type Intake = { caseId:string; documentType:string; sourceReference:string; auctionRound:string; status:IntakeStatus; contentSha256:string };

function canSatisfyG16(intake:Intake){
  return intake.status === 'VERIFIED' && Boolean(intake.sourceReference) && Boolean(intake.auctionRound) && Boolean(intake.contentSha256);
}

const pending:Intake={caseId:'P1-PILOT-005',documentType:'AUCTION_NOTICE',sourceReference:'ibbi://current-round',auctionRound:'2026-09-23',status:'UPLOADED_PENDING_VERIFICATION',contentSha256:'abc'};
const verified:Intake={...pending,status:'VERIFIED'};
assert.equal(canSatisfyG16(pending),false);
assert.equal(canSatisfyG16(verified),true);
console.log('user-evidence-intake: PASS');
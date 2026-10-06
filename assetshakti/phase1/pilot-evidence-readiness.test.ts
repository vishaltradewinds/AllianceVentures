import { strict as assert } from "node:assert";
import { assessPilotReadiness } from "./pilot-evidence-readiness";

const blocked = assessPilotReadiness({
  caseId: "PILOT-001",
  evidence: [
    {category:"IDENTITY",status:"VERIFIED"},
    {category:"AUTHORITY",status:"VERIFIED"},
    {category:"BIDDER_OBLIGATION",status:"REPORTED_BY_SOURCE",sourceReference:"ibbi://notice"}
  ],
  documentVersions: [{versionStatus:"UNRESOLVED",sourceReference:"ibbi://corrigendum"}]
});
assert.equal(blocked.readiness, "BLOCKED");

const complete = assessPilotReadiness({
  caseId: "PILOT-002",
  evidence: [
    "IDENTITY","AUTHORITY","TITLE","POSSESSION","ENCUMBRANCE","LITIGATION",
    "PHYSICAL","LOCATION","VALUATION","AUCTION","BIDDER_OBLIGATION","PROVENANCE_PARTY_RISK"
  ].map(category => ({category,status:"VERIFIED",sourceReference:"ibbi://notice"}))
});
assert.equal(complete.readiness, "COMPLETE");

console.log("PASS: Pilot evidence readiness gate");

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
  ].map(category => ({category,status:"VERIFIED",sourceReference: category === "BIDDER_OBLIGATION" ? "ibbi://exact-auction" : "ibbi://notice"})),
  auctionLotBinding: {
    auctionDate: "2026-10-07", assetDescription: "Land and Building",
    reservePrice: 1000000, emdDeadline: "2026-10-05",
    sourceReference: "ibbi://exact-auction", documentVersionReference: "ibbi://exact-auction", status: "VERIFIED"
  }
});
assert.equal(complete.readiness, "COMPLETE");

const unbound = assessPilotReadiness({
  caseId: "PILOT-003",
  evidence: [
    "IDENTITY","AUTHORITY","TITLE","POSSESSION","ENCUMBRANCE","LITIGATION",
    "PHYSICAL","LOCATION","VALUATION","AUCTION","BIDDER_OBLIGATION","PROVENANCE_PARTY_RISK"
  ].map(category => ({category,status:"VERIFIED",sourceReference:"ibbi://notice"})),
  auctionLotBinding: {
    auctionDate: "2026-10-10",
    assetDescription: "Land and Building at Edathala",
    reservePrice: 133668963,
    emdDeadline: "2026-10-09",
    sourceReference: "ibbi://current-auction",
    status: "UNRESOLVED"
  }
});
assert.equal(unbound.readiness, "BLOCKED");
assert.equal(unbound.auctionLotBinding, "UNRESOLVED");

const bound = assessPilotReadiness({
  caseId: "PILOT-004",
  evidence: [
    "IDENTITY","AUTHORITY","TITLE","POSSESSION","ENCUMBRANCE","LITIGATION",
    "PHYSICAL","LOCATION","VALUATION","AUCTION","BIDDER_OBLIGATION","PROVENANCE_PARTY_RISK"
  ].map(category => ({category,status:"VERIFIED",sourceReference:"ibbi://notice"})),
  auctionLotBinding: {
    auctionDate: "2026-08-20",
    assetDescription: "First Floor, Municipal No. 1588-89, Azis Ganj Bahadurgarh Road, Delhi",
    reservePrice: 6723000,
    emdDeadline: "2026-08-18",
    sourceReference: "ibbi://exact-auction", documentVersionReference: "ibbi://exact-auction",
    status: "VERIFIED"
  }
});
assert.equal(bound.readiness, "COMPLETE");
assert.equal(bound.auctionLotBinding, "VERIFIED");

console.log("PASS: Pilot evidence readiness gate");

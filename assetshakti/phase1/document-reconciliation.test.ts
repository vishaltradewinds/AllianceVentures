import { strict as assert } from "node:assert";
import { reconcileAuctionDocuments } from "./document-reconciliation";

const r = reconcileAuctionDocuments({
  documents: [
    {
      documentType: "AUCTION_NOTICE",
      sourceReference: "ibbi://gei/original",
      observedAt: "2026-03-31",
      versionStatus: "SUPERSEDED",
      materialChanges: ["Original wording described Land & Building."]
    },
    {
      documentType: "CORRIGENDUM",
      sourceReference: "ibbi://gei/corrigendum-2026-04-02",
      observedAt: "2026-04-02",
      versionStatus: "CURRENT",
      materialChanges: ["Land & Building corrected to Leasehold Rights of Land & Building."]
    }
  ]
});
assert.equal(r.status, "RECONCILED");
assert.equal(r.latestApplicableReference, "ibbi://gei/corrigendum-2026-04-02");
assert.deepEqual(r.supersededReferences, ["ibbi://gei/original"]);
assert.equal(r.materialConflicts.length, 1);

const unresolved = reconcileAuctionDocuments({
  documents: [{
    documentType: "CORRIGENDUM",
    sourceReference: "ibbi://unknown",
    observedAt: "2026-04-02",
    versionStatus: "UNRESOLVED"
  }]
});
assert.equal(unresolved.status, "UNRESOLVED");

console.log("PASS: Auction document reconciliation tests");

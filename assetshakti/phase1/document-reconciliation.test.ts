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

const addressCorrection = reconcileAuctionDocuments({
  documents: [
    {
      documentType: "AUCTION_NOTICE",
      sourceReference: "ibbi://gitanjali/original",
      observedAt: "2026-05-20",
      versionStatus: "SUPERSEDED",
      materialChanges: ["Original asset address recorded Plot Nos. 16(P), 17, 18 and 29."]
    },
    {
      documentType: "CORRIGENDUM",
      sourceReference: "ibbi://gitanjali/corrigendum",
      observedAt: "2026-05-20",
      versionStatus: "CURRENT",
      materialChanges: ["Corrected asset address to Plot Nos. 16(P), 17, 28 and 29(P)."]
    }
  ]
});
assert.equal(addressCorrection.status, "RECONCILED");
assert.equal(addressCorrection.latestApplicableReference, "ibbi://gitanjali/corrigendum");
assert.deepEqual(addressCorrection.supersededReferences, ["ibbi://gitanjali/original"]);

console.log("PASS: Auction document reconciliation tests");


import { strict as assert } from "node:assert";
import { verifyUserSuppliedEvidence } from "./user-evidence-verification";

const complete = verifyUserSuppliedEvidence({
  documentIdentityConfirmed: true,
  authoritativeSourceConfirmed: true,
  applicableRoundConfirmed: true,
  currentOrSupersededStatusConfirmed: true,
  corrigendaConsistencyConfirmed: true,
  hashIntegrityConfirmed: true,
  materialAssertionsHavePageReferences: true,
  verifierNote: "Verified against the applicable auction document and captured corrigenda.",
});

assert.equal(complete.outcome, "VERIFIED");
assert.deepEqual(complete.reasons, []);

const pendingLike = verifyUserSuppliedEvidence({
  documentIdentityConfirmed: true,
  authoritativeSourceConfirmed: true,
  applicableRoundConfirmed: false,
  currentOrSupersededStatusConfirmed: false,
  corrigendaConsistencyConfirmed: false,
  hashIntegrityConfirmed: true,
  materialAssertionsHavePageReferences: false,
  verifierNote: "",
});

assert.equal(pendingLike.outcome, "REJECTED");
assert.ok(pendingLike.reasons.includes("applicable auction round is confirmed"));
assert.ok(pendingLike.reasons.includes("verifier note is required"));

console.log("AssetShakti user evidence verification tests passed.");

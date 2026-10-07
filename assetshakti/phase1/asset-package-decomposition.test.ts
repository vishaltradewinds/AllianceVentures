import { strict as assert } from "node:assert";
import { assessAssetPackage } from "./asset-package-decomposition";

const composite = assessAssetPackage({
  caseId: "GEI-2026",
  auctionDescription: "Composite Sale of Leasehold rights of Land & Building, Plant & Machinery and Securities & Financial Assets",
  components: []
});
assert.equal(composite.structure, "COMPOSITE_PACKAGE");
assert.equal(composite.componentCount, 4);
assert.equal(composite.requiresComponentLevelEvidence, true);
assert.equal(composite.propertyOnlyDecisionAllowed, false);

const nrra = assessAssetPackage({
  caseId: "NRRA-2026",
  auctionDescription: "Assignment of Non-Readily Realisable Assets (NRRA)",
  components: []
});
assert.equal(nrra.structure, "NRRA_TRANSFER");
assert.equal(nrra.propertyOnlyDecisionAllowed, false);

const property = assessAssetPackage({
  caseId: "PROP-2026",
  auctionDescription: "Land and Building",
  components: []
});
assert.equal(property.structure, "PROPERTY_ONLY");
assert.equal(property.propertyOnlyDecisionAllowed, true);

console.log("PASS: AssetShakti asset-package decomposition tests");

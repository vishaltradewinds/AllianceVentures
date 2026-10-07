import fs from "node:fs";
import assert from "node:assert/strict";

type Evidence = { category: string; status: string };
type Pilot = { caseId: string; expectedDecision: string; evidence?: Evidence[] };

const pilots = JSON.parse(
  fs.readFileSync(new URL("./real-evidence-pilot.json", import.meta.url), "utf8"),
) as Pilot[];

const REQUIRED = ["IDENTITY", "AUTHORITY", "TITLE", "POSSESSION", "AUCTION", "BIDDER_OBLIGATION"];

assert.equal(pilots.length, 6, "Six real pilot cases must remain in the certification corpus.");

for (const pilot of pilots) {
  assert.equal(pilot.expectedDecision, "DO_NOT_BID", `${pilot.caseId} cannot be promoted by the certification fixture.`);
  const evidence = pilot.evidence ?? [];
  for (const category of REQUIRED) {
    assert.ok(evidence.some((item) => item.category === category),
      `${pilot.caseId} is missing required evidence category ${category}`);
  }
  const critical = new Map<string, string>();
  for (const item of evidence) {
    if (REQUIRED.includes(item.category)) critical.set(item.category, item.status);
  }
  const blocking = ["TITLE", "POSSESSION", "BIDDER_OBLIGATION"].filter(
    (category) => critical.get(category) !== "VERIFIED",
  );
  assert.ok(blocking.length > 0,
    `${pilot.caseId} must not pass certification while all critical domains are verified.`);
}

console.log("AssetShakti six-pilot certification gate: BLOCKED AS EXPECTED");

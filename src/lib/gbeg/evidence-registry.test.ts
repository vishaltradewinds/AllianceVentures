import { EvidenceRegistryService, InMemoryEvidenceRegistryStore, type RegisteredEvidence } from "./evidence-registry";

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
async function rejects(fn: () => Promise<unknown>, messagePart: string): Promise<void> {
  try { await fn(); } catch (error) {
    if (error instanceof Error && error.message.includes(messagePart)) return;
    throw error;
  }
  throw new Error(`Expected rejection containing: ${messagePart}`);
}

const service = new EvidenceRegistryService(new InMemoryEvidenceRegistryStore());
const base: RegisteredEvidence = {
  tenantId: "tenant-a",
  caseId: "case-1",
  registeredBy: "user-1",
  registeredAt: "2026-10-10T15:00:00Z",
  evidence: {
    id: "EV-REG-001",
    claimKey: "company.identity",
    status: "VERIFIED",
    sourceKind: "OFFICIAL_AUTHORITY",
    sourceName: "Official registry",
    sourceUrl: "https://example.gov/companies/123",
    assertion: "Test company registration record",
    observedAt: "2026-10-10T14:00:00Z",
  },
};

await service.register(base);
expect((await service.get("tenant-a", "EV-REG-001"))?.caseId === "case-1", "Evidence should be retrievable within its tenant.");
expect(await service.get("tenant-b", "EV-REG-001") === undefined, "Evidence must not be visible across tenants.");
expect((await service.listCase("tenant-a", "case-1")).length === 1, "Case listing should return the tenant's record.");
await rejects(() => service.register(base), "already exists");

const corrected: RegisteredEvidence = {
  ...base,
  registeredAt: "2026-10-10T15:10:00Z",
  supersedesEvidenceId: "EV-REG-001",
  evidence: { ...base.evidence, id: "EV-REG-002", assertion: "Corrected assertion" },
};
await service.register(corrected);
expect((await service.listCase("tenant-a", "case-1")).length === 2, "Corrections should append a new record rather than overwrite history.");

await rejects(() => service.register({ ...base, evidence: { ...base.evidence, id: "EV-REG-003", sourceUrl: undefined } }), "source URL or content hash");
await rejects(() => service.register({ ...base, evidence: { ...base.evidence, id: "EV-REG-004", sourceUrl: "file:///private/key" } }), "HTTP or HTTPS");
await rejects(() => service.register({ ...base, supersedesEvidenceId: "missing-id", evidence: { ...base.evidence, id: "EV-REG-005" } }), "must exist");
await rejects(() => service.register({ ...base, caseId: "case-2", supersedesEvidenceId: "EV-REG-001", evidence: { ...base.evidence, id: "EV-REG-006" } }), "same case");
await rejects(() => service.register({ ...base, evidence: { ...base.evidence, id: "EV-REG-007", contentHash: "sha256:not-a-real-hash" } }), "64 hexadecimal");

console.log("GBEG evidence registry tests passed: append-only, tenant isolation and provenance checks.");

import type { EvidenceRecord } from "./gate-engine";

export interface RegisteredEvidence {
  tenantId: string;
  caseId: string;
  registeredBy: string;
  registeredAt: string;
  supersedesEvidenceId?: string;
  evidence: EvidenceRecord;
}

export interface EvidenceRegistryStore {
  getById(tenantId: string, evidenceId: string): Promise<RegisteredEvidence | undefined>;
  listForCase(tenantId: string, caseId: string): Promise<RegisteredEvidence[]>;
  append(record: RegisteredEvidence): Promise<void>;
}

/**
 * Append-only registry service. Production use requires a durable store adapter,
 * authenticated tenant identity, access policy, backups and audit monitoring.
 * This module deliberately does not provide an in-memory production database.
 */
export class EvidenceRegistryService {
  constructor(private readonly store: EvidenceRegistryStore) {}

  async register(record: RegisteredEvidence): Promise<RegisteredEvidence> {
    this.validate(record);
    const existing = await this.store.getById(record.tenantId, record.evidence.id);
    if (existing) throw new Error("Evidence ID already exists; evidence records are immutable.");

    if (record.supersedesEvidenceId) {
      const prior = await this.store.getById(record.tenantId, record.supersedesEvidenceId);
      if (!prior) throw new Error("Superseded evidence must exist in the same tenant.");
      if (prior.caseId !== record.caseId) throw new Error("Evidence can only supersede a record in the same case.");
      if (prior.evidence.id === record.evidence.id) throw new Error("Evidence cannot supersede itself.");
    }

    await this.store.append(structuredClone(record));
    return structuredClone(record);
  }

  async get(tenantId: string, evidenceId: string): Promise<RegisteredEvidence | undefined> {
    if (!tenantId.trim() || !evidenceId.trim()) throw new Error("Tenant and evidence identifiers are required.");
    const record = await this.store.getById(tenantId, evidenceId);
    return record ? structuredClone(record) : undefined;
  }

  async listCase(tenantId: string, caseId: string): Promise<RegisteredEvidence[]> {
    if (!tenantId.trim() || !caseId.trim()) throw new Error("Tenant and case identifiers are required.");
    const records = await this.store.listForCase(tenantId, caseId);
    return records.map(record => structuredClone(record));
  }

  private validate(record: RegisteredEvidence): void {
    if (!record.tenantId.trim() || !record.caseId.trim() || !record.registeredBy.trim()) {
      throw new Error("Tenant, case and registering actor are required.");
    }
    const registeredAt = Date.parse(record.registeredAt);
    if (!Number.isFinite(registeredAt)) throw new Error("Registration timestamp must be a valid date.");
    const evidence = record.evidence;
    if (!evidence.id.trim() || !evidence.claimKey.trim() || !evidence.sourceName.trim() || !evidence.assertion.trim()) {
      throw new Error("Evidence ID, claim key, source name and assertion are required.");
    }
    if (!Number.isFinite(Date.parse(evidence.observedAt))) throw new Error("Evidence observation timestamp must be a valid date.");
    if (evidence.sourceUrl) {
      let url: URL;
      try { url = new URL(evidence.sourceUrl); } catch { throw new Error("Evidence source URL must be an absolute URL."); }
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Evidence source URL must use HTTP or HTTPS.");
    }
    if (evidence.contentHash && !/^sha256:[a-f0-9]{64}$/i.test(evidence.contentHash)) {
      throw new Error("Evidence content hash must use sha256:<64 hexadecimal characters>.");
    }
    if (evidence.status === "VERIFIED" && !evidence.sourceUrl && !evidence.contentHash) {
      throw new Error("Verified evidence requires a source URL or content hash.");
    }
    if (evidence.status === "VERIFIED" && evidence.sourceKind === "OTHER") {
      throw new Error("Verified evidence cannot use an unclassified source kind.");
    }
  }
}

/** In-memory adapter for deterministic tests only; never use for production data. */
export class InMemoryEvidenceRegistryStore implements EvidenceRegistryStore {
  private readonly records = new Map<string, RegisteredEvidence>();

  async getById(tenantId: string, evidenceId: string): Promise<RegisteredEvidence | undefined> {
    const record = this.records.get(`${tenantId}::${evidenceId}`);
    return record ? structuredClone(record) : undefined;
  }

  async listForCase(tenantId: string, caseId: string): Promise<RegisteredEvidence[]> {
    return [...this.records.values()]
      .filter(record => record.tenantId === tenantId && record.caseId === caseId)
      .map(record => structuredClone(record));
  }

  async append(record: RegisteredEvidence): Promise<void> {
    const key = `${record.tenantId}::${record.evidence.id}`;
    if (this.records.has(key)) throw new Error("Evidence ID already exists.");
    this.records.set(key, structuredClone(record));
  }
}

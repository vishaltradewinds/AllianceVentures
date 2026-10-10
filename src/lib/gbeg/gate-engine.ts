/**
 * Global Business Establishment & Growth OS — deterministic evidence gate.
 *
 * This engine checks evidence/process readiness only. It does not determine
 * legal eligibility, provide professional advice, or grant an approval.
 * A positive result means a human decision-maker may review a traceable dossier.
 */
export type EvidenceStatus =
  | "VERIFIED"
  | "REPORTED_BY_SOURCE"
  | "UNVERIFIED"
  | "MISSING"
  | "CONTRADICTED";

export type SourceKind =
  | "OFFICIAL_AUTHORITY"
  | "LEGISLATION"
  | "QUALIFIED_PROFESSIONAL"
  | "CUSTOMER"
  | "COMMERCIAL"
  | "OTHER";

export type Applicability = "APPLICABLE" | "NOT_APPLICABLE" | "UNKNOWN";
export type ProfessionalReview = "APPROVED" | "PENDING" | "NOT_REQUIRED";
export type GateStatus = "PASS" | "BLOCKED" | "PENDING_REVIEW" | "NOT_COVERED";

export interface EvidenceRecord {
  id: string;
  claimKey: string;
  status: EvidenceStatus;
  sourceKind: SourceKind;
  sourceName: string;
  sourceUrl?: string;
  assertion: string;
  observedAt: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  reviewer?: string;
  contentHash?: string;
}

export interface RequiredControl {
  gateId: string;
  claimKey: string;
  label: string;
  mandatory: boolean;
  legalControl: boolean;
  applicability: Applicability;
  applicabilityRationale?: string;
  professionalReview: ProfessionalReview;
  professionalReviewer?: string;
  professionalReviewEvidenceId?: string;
  maxEvidenceAgeDays?: number;
  acceptedSourceKinds?: SourceKind[];
}

export interface JurisdictionCoverage {
  status: "COVERED" | "PARTIAL" | "NOT_COVERED";
  jurisdictionPath: string[];
  moduleVersion?: string;
  reviewedAt?: string;
  exclusions: string[];
}

export interface GateInput {
  caseId: string;
  asOf: string;
  jurisdictionCoverage: JurisdictionCoverage;
  controls: RequiredControl[];
  evidence: EvidenceRecord[];
}

export interface GateFinding {
  gateId: string;
  claimKey: string;
  status: GateStatus;
  reasons: string[];
  evidenceIds: string[];
}

export interface GateEvaluation {
  caseId: string;
  outcome: "EVIDENCE_COMPLETE_FOR_HUMAN_REVIEW" | "BLOCKED" | "PENDING_REVIEW" | "NOT_COVERED";
  isLegalEligibilityDecision: false;
  findings: GateFinding[];
  blockers: string[];
  warnings: string[];
  evidenceIdsUsed: string[];
  evaluatedAt: string;
  jurisdictionModuleVersion?: string;
}

const VERIFIED_SOURCE_KINDS = new Set<SourceKind>([
  "OFFICIAL_AUTHORITY",
  "LEGISLATION",
  "QUALIFIED_PROFESSIONAL",
]);

function validDate(value: string): number | null {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function evidenceIsFresh(evidence: EvidenceRecord, asOf: string, maxAgeDays: number): boolean {
  const observed = validDate(evidence.observedAt);
  const now = validDate(asOf);
  if (observed === null || now === null || observed > now) return false;
  const ageDays = (now - observed) / 86_400_000;
  if (ageDays > maxAgeDays) return false;
  const from = evidence.effectiveFrom ? validDate(evidence.effectiveFrom) : null;
  const to = evidence.effectiveTo ? validDate(evidence.effectiveTo) : null;
  if (evidence.effectiveFrom && from === null) return false;
  if (evidence.effectiveTo && to === null) return false;
  if (from !== null && from > now) return false;
  if (to !== null && to < now) return false;
  return true;
}

export function evaluateGbegCase(input: GateInput): GateEvaluation {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const now = validDate(input.asOf);

  if (!input.caseId.trim()) blockers.push("Case identifier is required.");
  if (now === null) blockers.push("Evaluation as-of date is invalid.");
  if (!input.jurisdictionCoverage.jurisdictionPath.length) {
    blockers.push("A jurisdiction path is required; do not infer a country or subnational authority.");
  }

  const controls = input.controls;
  if (!controls.length) blockers.push("At least one required control is needed for a meaningful evaluation.");
  const duplicateGateIds = controls.map(c => c.gateId).filter((id, i, all) => all.indexOf(id) !== i);
  if (duplicateGateIds.length) blockers.push(`Duplicate gate identifiers: ${[...new Set(duplicateGateIds)].join(", ")}.`);
  const evidenceIds = input.evidence.map(e => e.id);
  const duplicateEvidenceIds = evidenceIds.filter((id, i, all) => !id.trim() || all.indexOf(id) !== i);
  if (duplicateEvidenceIds.length) blockers.push("Evidence identifiers must be non-empty and unique.");

  const findings: GateFinding[] = controls.map(control => {
    const reasons: string[] = [];
    const matching = input.evidence.filter(e => e.claimKey === control.claimKey);
    const evidenceIds = matching.map(e => e.id);
    if (control.legalControl && control.professionalReviewEvidenceId && input.evidence.some(e => e.id === control.professionalReviewEvidenceId)) {
      evidenceIds.push(control.professionalReviewEvidenceId);
    }

    if (!control.mandatory) {
      return { gateId: control.gateId, claimKey: control.claimKey, status: "PASS", reasons: ["Optional control; no mandatory pass implied."], evidenceIds };
    }

    if (input.jurisdictionCoverage.status === "NOT_COVERED") {
      return { gateId: control.gateId, claimKey: control.claimKey, status: "NOT_COVERED", reasons: ["Jurisdiction module explicitly does not cover this case."], evidenceIds };
    }
    if (input.jurisdictionCoverage.status === "PARTIAL") {
      reasons.push("Jurisdiction coverage is partial; scope must be reviewed before relying on this control.");
    }

    if (control.applicability === "UNKNOWN") {
      reasons.push("Applicability has not been determined.");
      return { gateId: control.gateId, claimKey: control.claimKey, status: "PENDING_REVIEW", reasons, evidenceIds };
    }

    if (control.applicability === "NOT_APPLICABLE") {
      if (!control.applicabilityRationale?.trim()) reasons.push("Non-applicability has no documented rationale.");
      if (control.legalControl) {
        const reviewEvidence = input.evidence.find(e => e.id === control.professionalReviewEvidenceId);
        const validReviewEvidence = !!reviewEvidence &&
          reviewEvidence.status === "VERIFIED" &&
          reviewEvidence.sourceKind === "QUALIFIED_PROFESSIONAL" &&
          !!reviewEvidence.reviewer?.trim() &&
          !!reviewEvidence.sourceName.trim() && !!reviewEvidence.assertion.trim() &&
          !!(reviewEvidence.sourceUrl?.trim() || reviewEvidence.contentHash?.trim()) &&
          evidenceIsFresh(reviewEvidence, input.asOf, control.maxEvidenceAgeDays ?? 365);
        if (control.professionalReview !== "APPROVED" || !control.professionalReviewer?.trim() || !validReviewEvidence) {
          reasons.push("Legal non-applicability requires linked, fresh, traceable evidence of qualified-professional review.");
        }
      }
      if (reasons.length) return { gateId: control.gateId, claimKey: control.claimKey, status: "PENDING_REVIEW", reasons, evidenceIds };
      return { gateId: control.gateId, claimKey: control.claimKey, status: "PASS", reasons: ["Non-applicability documented; this is not an approval."], evidenceIds };
    }

    if (control.legalControl) {
      const reviewEvidence = input.evidence.find(e => e.id === control.professionalReviewEvidenceId);
      const validReviewEvidence = !!reviewEvidence &&
        reviewEvidence.status === "VERIFIED" &&
        reviewEvidence.sourceKind === "QUALIFIED_PROFESSIONAL" &&
        !!reviewEvidence.reviewer?.trim() &&
        !!reviewEvidence.sourceName.trim() && !!reviewEvidence.assertion.trim() &&
        !!(reviewEvidence.sourceUrl?.trim() || reviewEvidence.contentHash?.trim()) &&
        evidenceIsFresh(reviewEvidence, input.asOf, control.maxEvidenceAgeDays ?? 365);
      if (control.professionalReview !== "APPROVED" || !control.professionalReviewer?.trim() || !validReviewEvidence) {
        reasons.push("Mandatory legal control lacks linked, fresh, traceable evidence of qualified-professional review.");
      }
      if (input.jurisdictionCoverage.status !== "COVERED") {
        reasons.push("Legal control cannot pass under partial jurisdiction coverage.");
      }
    }

    if (!matching.length) {
      reasons.push("Required claim has no linked evidence.");
    } else {
      const contradicted = matching.filter(e => e.status === "CONTRADICTED");
      const missing = matching.filter(e => e.status === "MISSING");
      if (contradicted.length) reasons.push("Conflicting/contradictory evidence exists; no positive conclusion is permitted.");
      if (missing.length) reasons.push("Evidence is explicitly marked missing.");
      const usable = matching.filter(e => e.status === "VERIFIED");
      if (!usable.length && !contradicted.length && !missing.length) {
        reasons.push("No evidence record is verified.");
      }
      if (usable.length) {
        const maxAge = control.maxEvidenceAgeDays ?? 365;
        const fresh = usable.filter(e => evidenceIsFresh(e, input.asOf, maxAge));
        if (!fresh.length) reasons.push(`Verified evidence is stale, future-dated, invalidly dated, or outside its effective period (max age ${maxAge} days).`);
        const acceptedKinds = control.legalControl
          ? VERIFIED_SOURCE_KINDS
          : new Set<SourceKind>(control.acceptedSourceKinds ?? [
              "OFFICIAL_AUTHORITY", "LEGISLATION", "QUALIFIED_PROFESSIONAL", "CUSTOMER", "COMMERCIAL", "OTHER"
            ]);
        const accepted = fresh.filter(e => acceptedKinds.has(e.sourceKind));
        const traceable = accepted.filter(e => !!(e.sourceUrl?.trim() || e.contentHash?.trim()));
        if (!traceable.length) {
          reasons.push(control.legalControl
            ? "No fresh verified evidence from an official authority, legislation, or qualified professional has a source URL or content hash."
            : "No fresh verified evidence from an allowed source kind has a source URL or content hash.");
        }
        if (traceable.some(e => !e.sourceName.trim() || !e.assertion.trim())) reasons.push("Evidence provenance/assertion is incomplete.");
      }
    }

    if (reasons.length) {
      const isCoverageIssue = input.jurisdictionCoverage.status !== "COVERED" &&
        reasons.some(r => r.includes("coverage"));
      const isContradiction = reasons.some(r => r.includes("contradictory"));
      const unsupportedLegalSource = reasons.some(r => r.includes("No fresh verified evidence"));
      const status: GateStatus = isCoverageIssue && control.legalControl
        ? "NOT_COVERED"
        : isContradiction || unsupportedLegalSource || reasons.some(r => r.includes("missing") || r.includes("stale") || r.includes("no linked evidence"))
          ? "BLOCKED"
          : "PENDING_REVIEW";
      return { gateId: control.gateId, claimKey: control.claimKey, status, reasons, evidenceIds };
    }
    return { gateId: control.gateId, claimKey: control.claimKey, status: "PASS", reasons: ["Evidence/process checks passed; no legal eligibility conclusion is made."], evidenceIds };
  });

  for (const finding of findings) {
    if (finding.status !== "PASS") blockers.push(`${finding.gateId} [${finding.status}]: ${finding.reasons.join(" ")}`);
  }
  if (input.jurisdictionCoverage.status !== "COVERED") {
    warnings.push(`Jurisdiction coverage is ${input.jurisdictionCoverage.status}; exclusions: ${input.jurisdictionCoverage.exclusions.join("; ") || "not specified"}.`);
  }
  if (!input.jurisdictionCoverage.moduleVersion) warnings.push("No versioned jurisdiction module was supplied.");
  if (input.evidence.some(e => !e.sourceUrl && !e.contentHash)) {
    warnings.push("At least one evidence record has neither a source URL nor a content hash; provenance may be insufficient.");
  }

  const hasNotCovered = findings.some(f => f.status === "NOT_COVERED");
  const hasBlocked = findings.some(f => f.status === "BLOCKED") || blockers.some(b => b.includes("identifier") || b.includes("date is invalid") || b.includes("Duplicate") || b.includes("At least one required control") || b.includes("jurisdiction path"));
  const hasPending = findings.some(f => f.status === "PENDING_REVIEW") || blockers.length > 0;
  const outcome: GateEvaluation["outcome"] = hasNotCovered
    ? "NOT_COVERED"
    : hasBlocked
      ? "BLOCKED"
      : hasPending
        ? "PENDING_REVIEW"
        : "EVIDENCE_COMPLETE_FOR_HUMAN_REVIEW";

  return {
    caseId: input.caseId,
    outcome,
    isLegalEligibilityDecision: false,
    findings,
    blockers,
    warnings,
    evidenceIdsUsed: [...new Set(findings.flatMap(f => f.evidenceIds))],
    evaluatedAt: input.asOf,
    jurisdictionModuleVersion: input.jurisdictionCoverage.moduleVersion,
  };
}

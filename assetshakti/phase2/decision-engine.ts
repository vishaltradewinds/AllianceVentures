export type EvidenceStatus="VERIFIED"|"REPORTED_BY_SOURCE"|"UNVERIFIED"|"MISSING"|"CONTRADICTED";
export type ProjectDecision="INVESTMENT_READY"|"BUY_READY"|"CONDITIONAL"|"DO_NOT_PROCEED"|"INSUFFICIENT_EVIDENCE";
export type ProjectClass="RESIDENTIAL"|"COMMERCIAL"|"INDUSTRIAL"|"MIXED_USE"|"PLOTTED_DEVELOPMENT"|"TOWNSHIP"|"REDEVELOPMENT"|"OTHER";
export type ProjectEvidence={category:string;status:EvidenceStatus;source?:string;observedAt?:string;assertion?:string;confidence?:number};
export type ProjectRecord={projectId:string;projectClass:ProjectClass;jurisdiction:{state:string;country?:string;district?:string;city?:string};evidence:ProjectEvidence[];applicability?:Partial<Record<string,boolean>>};

const W:Record<EvidenceStatus,number>={VERIFIED:1,REPORTED_BY_SOURCE:.8,UNVERIFIED:.35,MISSING:0,CONTRADICTED:0};
const DEFAULT_CRITICAL=["IDENTITY","JURISDICTION","TITLE","LAND_RIGHTS","RERA","PLANNING","BUILDING_APPROVAL"];

function applicable(p:ProjectRecord,c:string){ return p.applicability?.[c]!==false; }
export function criticalCategories(p:ProjectRecord){return DEFAULT_CRITICAL.filter(c=>applicable(p,c));}
export function evaluateProject(p:ProjectRecord){
  const by=new Map<string,ProjectEvidence[]>();
  for(const e of p.evidence) by.set(e.category,[...(by.get(e.category)||[]),e]);
  const critical=criticalCategories(p);
  const failures=critical.filter(c=>{const x=by.get(c)||[];return !x.length||x.some(e=>e.status==="MISSING"||e.status==="CONTRADICTED")});
  const contradictions=critical.filter(c=>(by.get(c)||[]).some(e=>e.status==="CONTRADICTED"));
  const all= p.evidence.length ? Math.round(p.evidence.reduce((s,e)=>s+W[e.status]*Math.max(0,Math.min(1,e.confidence??1)),0)/p.evidence.length*100):0;
  const criticalCoverage=critical.length ? Math.round(critical.reduce((s,c)=>{const x=by.get(c)||[];if(!x.length)return s;const best=Math.max(...x.map(e=>W[e.status]*Math.max(0,Math.min(1,e.confidence??1))));return s+best},0)/critical.length*100):0;
  const audit=p.evidence.every(e=>!!e.category&&!!e.status&&!!e.assertion&&!!e.source&&!!e.observedAt);
  let decision:ProjectDecision="INSUFFICIENT_EVIDENCE";
  if(contradictions.length) decision="DO_NOT_PROCEED";
  else if(failures.length) decision=criticalCoverage<50?"INSUFFICIENT_EVIDENCE":"CONDITIONAL";
  else if(!audit||criticalCoverage<85) decision="CONDITIONAL";
  else decision="BUY_READY";
  return {decision,coverage:all,criticalCoverage,criticalFailures:failures,contradictions,auditabilityPassed:audit};
}

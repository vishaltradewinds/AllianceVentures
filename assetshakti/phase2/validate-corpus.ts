import fs from "node:fs";
import path from "node:path";

type Status="VERIFIED"|"REPORTED_BY_SOURCE"|"UNVERIFIED"|"MISSING"|"CONTRADICTED";
const file=path.join(process.cwd(),"assetshakti/phase2/validation-corpus.json");
const corpus=JSON.parse(fs.readFileSync(file,"utf8")) as {cases:Array<any>};
const critical=["IDENTITY","JURISDICTION","TITLE","LAND_RIGHTS","RERA","PLANNING","BUILDING_APPROVAL"];
let errors=0;
const seenProjectIds=new Set<string>();
const seenNames=new Set<string>();
const states=new Set<string>();
for(const c of corpus.cases){
  const state=c.jurisdiction?.state;
  if(state) states.add(state);
  if(c.projectId){ if(seenProjectIds.has(c.projectId)){console.error(`ERROR ${c.caseId}: duplicate projectId ${c.projectId}`);errors++;} else seenProjectIds.add(c.projectId); }
  const normalizedName=String(c.projectName||"").trim().toUpperCase();
  if(normalizedName && seenNames.has(normalizedName)){console.error(`ERROR ${c.caseId}: duplicate projectName ${c.projectName}`);errors++;} else if(normalizedName) seenNames.add(normalizedName);
  const byCategory=new Map<string,Status>();
  for(const e of c.evidence ?? []) byCategory.set(e.category,e.status);
  const applicability=c.applicability ?? {};
  for(const category of critical){
    if(applicability[category]===false) continue;
    if(!byCategory.has(category)){ console.error(`ERROR ${c.caseId}: missing applicable evidence category ${category}`); errors++; }
  }
  const applicableCritical=critical.filter(x=>applicability[x]!==false);
  const criticalFailure=applicableCritical.some(category=>{const s=byCategory.get(category);return !s||s==="MISSING"||s==="CONTRADICTED";});
  if(criticalFailure&&(c.expectedDecision==="BUY_READY"||c.expectedDecision==="INVESTMENT_READY")){console.error(`ERROR ${c.caseId}: failed critical gate cannot be ready`);errors++;}
  if(applicableCritical.some(category=>byCategory.get(category)==="CONTRADICTED")&&c.expectedDecision!=="DO_NOT_PROCEED"){console.error(`ERROR ${c.caseId}: contradicted critical evidence must be DO_NOT_PROCEED`);errors++;}
  for(const e of c.evidence ?? []){
    if(!e.category||!e.status){console.error(`ERROR ${c.caseId}: incomplete evidence item`);errors++;break;} if(e.status!=="MISSING" && (!e.source||!e.observedAt||!e.assertion)){console.error(`ERROR ${c.caseId}: non-missing evidence lacks provenance`);errors++;break;}
  }
  if(!c.source){console.error(`ERROR ${c.caseId}: missing source`);errors++;}
}
if(corpus.cases.length<50){console.error(`ERROR: corpus has ${corpus.cases.length} cases; minimum is 50`);errors++;}
if(states.size<5){console.error(`ERROR: corpus covers ${states.size} jurisdictions; minimum is 5 States/UTs`);errors++;}
console.log(`AssetShakti Phase 2 validation corpus: ${corpus.cases.length} cases across ${states.size} States/UTs`);
console.log("Production certification: NO — 50-case corpus and Shakti sign-off remain required.");
if(errors){console.error(`FAIL: ${errors} validation error(s)`);process.exit(1);}
console.log("PASS: structural, provenance and applicability-aware critical-gate checks passed.");

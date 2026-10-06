import fs from "node:fs";
import path from "node:path";

type Status="VERIFIED"|"REPORTED_BY_SOURCE"|"UNVERIFIED"|"MISSING"|"CONTRADICTED";

const file=path.join(process.cwd(),"assetshakti/phase2/validation-corpus.json");
const corpus=JSON.parse(fs.readFileSync(file,"utf8")) as {cases:Array<any>};

const critical=["IDENTITY","JURISDICTION","TITLE","LAND_RIGHTS","RERA","PLANNING","BUILDING_APPROVAL"];

let errors=0;
for(const c of corpus.cases){
  const byCategory=new Map<string,Status>();
  for(const e of c.evidence ?? []) byCategory.set(e.category,e.status);

  for(const category of critical){
    if(!byCategory.has(category)){
      console.error(`ERROR ${c.caseId}: missing evidence ledger category ${category}`);
      errors++;
    }
  }

  const criticalFailure=critical.some(category=>{
    const s=byCategory.get(category);
    return !s || s==="MISSING" || s==="CONTRADICTED";
  });

  if(criticalFailure && c.expectedDecision==="BUY_READY"){
    console.error(`ERROR ${c.caseId}: failed critical gate cannot be BUY_READY`);
    errors++;
  }

  if(!c.source){
    console.error(`ERROR ${c.caseId}: missing source`);
    errors++;
  }
}

console.log(`AssetShakti Phase 2 validation corpus: ${corpus.cases.length} cases`);
console.log(`Production certification: NO — corpus and gate validation are incomplete.`);
if(errors){
  console.error(`FAIL: ${errors} validation error(s)`);
  process.exit(1);
}
console.log("PASS: structural and critical-gate negative-control checks passed.");

import { evaluateProject } from "./decision-engine";

const categories=["IDENTITY","JURISDICTION","TITLE","LAND_RIGHTS","RERA","PLANNING","BUILDING_APPROVAL"];
const evidence=categories.map(category=>({category,status:"VERIFIED" as const,source:"OFFICIAL",observedAt:"2026-10-06T00:00:00Z",assertion:"verified test evidence",confidence:1}));
const base={projectId:"TEST",projectClass:"RESIDENTIAL" as const,jurisdiction:{state:"Madhya Pradesh"},evidence};
const ready=evaluateProject(base);
if(ready.decision!=="BUY_READY") throw new Error("Expected BUY_READY for fully evidenced test project.");
const investor=evaluateProject({...base,decisionIntent:"INVESTOR"});
if(investor.decision!=="INVESTMENT_READY") throw new Error("Investor intent must produce INVESTMENT_READY when all gates pass.");
const contradiction=evaluateProject({...base,evidence:evidence.map(e=>e.category==="TITLE"?{...e,status:"CONTRADICTED" as const}:e)});
if(contradiction.decision!=="DO_NOT_PROCEED") throw new Error("Critical contradiction must block.");
const missing=evaluateProject({...base,evidence:evidence.filter(e=>e.category!=="RERA")});
if(missing.decision==="BUY_READY"||missing.decision==="INVESTMENT_READY") throw new Error("Missing critical evidence must block ready state.");
console.log("PASS: AssetShakti Phase 2 decision-engine tests");

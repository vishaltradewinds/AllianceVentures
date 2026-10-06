import type { DecisionState, EvidenceItem, PropertyAsset } from "./property-schema";

export type GateResult = { gate:string; passed:boolean; reason:string };
const CRITICAL = ["IDENTITY","TITLE","AUTHORITY","POSSESSION"] as const;
const AUCTION_TERM_CRITICAL = "BIDDER_OBLIGATION" as const;
const W:Record<EvidenceItem["status"],number>={VERIFIED:1,REPORTED_BY_SOURCE:.8,UNVERIFIED:.35,MISSING:0,CONTRADICTED:0};

export function evaluatePropertyGates(asset:PropertyAsset):GateResult[]{
  const out:GateResult[]=[];
  for(const c of CRITICAL){
    const items=asset.evidence.filter(e=>e.category===c);
    if(!items.length) out.push({gate:c,passed:false,reason:"No evidence item exists for a critical category."});
    else if(items.some(e=>e.status==="MISSING"||e.status==="CONTRADICTED")) out.push({gate:c,passed:false,reason:"Critical evidence is missing or contradicted."});
    else out.push({gate:c,passed:true,reason:"Critical evidence exists without a blocking status."});
  }
  const auctionTerms=asset.evidence.filter(e=>e.category===AUCTION_TERM_CRITICAL);
  if(!auctionTerms.length) out.push({gate:"AUCTION_TERMS",passed:false,reason:"No decision-critical auction-term evidence exists for EMD/payment/eligibility/forfeiture conditions."});
  else if(auctionTerms.some(e=>e.status==="MISSING"||e.status==="CONTRADICTED")) out.push({gate:"AUCTION_TERMS",passed:false,reason:"Auction-term evidence is missing or contradicted."});
  else out.push({gate:"AUCTION_TERMS",passed:true,reason:"Auction-term evidence exists without a blocking status."});
  const audit=asset.evidence.every(e=>!!e.id&&!!e.sourceName&&!!e.assertion&&Number.isFinite(e.confidence)&&e.confidence>=0&&e.confidence<=1);
  out.push({gate:"AUDITABILITY",passed:audit,reason:audit?"Evidence records are structurally auditable.":"Evidence provenance is incomplete."});
  return out;
}

export function evaluatePropertyProductionDecision(asset:PropertyAsset):PropertyAsset["shakti"]{
  const e=asset.evidence;
  const domains:Record<string,string[]>={legal:["IDENTITY","TITLE","AUTHORITY","ENCUMBRANCE","LITIGATION"],physical:["POSSESSION","PHYSICAL"],location:["LOCATION"],market:["VALUATION"],economics:["VALUATION","AUCTION"],auction:["AUCTION"]};
  const score=(cats:string[])=>{const a=e.filter(x=>cats.includes(x.category));if(!a.length)return 0;return Math.round(a.reduce((s,x)=>s+W[x.status]*Math.max(0,Math.min(1,x.confidence)),0)/a.length*100)};
  const coverage=e.length?Math.round(e.reduce((s,x)=>s+W[x.status]*Math.max(0,Math.min(1,x.confidence)),0)/e.length*100):0;
  const gates=evaluatePropertyGates(asset);
  const criticalFailure=gates.some(g=>(CRITICAL.includes(g.gate as any)||g.gate==="AUCTION_TERMS")&&!g.passed);
  const criticalGatePassed=!criticalFailure&&coverage>=75;
  let decision:DecisionState="INSUFFICIENT_EVIDENCE";
  if(criticalFailure)decision="DO_NOT_BID";else if(criticalGatePassed&&coverage>=85)decision="BID_READY";else if(coverage>=45)decision="CONDITIONAL";
  return {legal:score(domains.legal),physical:score(domains.physical),location:score(domains.location),market:score(domains.market),economics:score(domains.economics),auction:score(domains.auction),criticalGatePassed,decision};
}

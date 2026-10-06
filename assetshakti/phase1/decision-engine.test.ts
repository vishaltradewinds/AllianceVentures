import assert from "node:assert/strict";
import { evaluatePropertyProductionDecision } from "./decision-engine";
import type { PropertyAsset } from "./property-schema";

const evidence=(status:any,category:any,confidence=1)=>({id:category,category,sourceName:"TEST",status,assertion:"test",confidence});
const base=(extra:any[]=[]):PropertyAsset=>({assetId:"TEST",source:{platform:"IBBI"},identity:{class:"INDUSTRIAL",subtype:"INDUSTRIAL_LAND_BUILDING"},evidence:[
 evidence("VERIFIED","IDENTITY"),evidence("VERIFIED","TITLE"),evidence("VERIFIED","AUTHORITY"),evidence("VERIFIED","POSSESSION"),
 evidence("VERIFIED","PHYSICAL"),evidence("VERIFIED","LOCATION"),evidence("VERIFIED","VALUATION"),evidence("VERIFIED","AUCTION"),evidence("VERIFIED","BIDDER_OBLIGATION"),...extra
],shakti:{legal:0,physical:0,location:0,market:0,economics:0,auction:0,criticalGatePassed:false,decision:"INSUFFICIENT_EVIDENCE"}});

assert.equal(evaluatePropertyProductionDecision(base()).decision,"BID_READY");
assert.equal(evaluatePropertyProductionDecision(base([evidence("CONTRADICTED","POSSESSION")])).decision,"DO_NOT_BID");
assert.equal(evaluatePropertyProductionDecision(base([evidence("MISSING","TITLE")])).decision,"DO_NOT_BID");
assert.equal(evaluatePropertyProductionDecision(base([evidence("MISSING","BIDDER_OBLIGATION")])).decision,"DO_NOT_BID");
assert.equal(evaluatePropertyProductionDecision({...base(),evidence:base().evidence.filter(x=>x.category!=="BIDDER_OBLIGATION")}).decision,"DO_NOT_BID");
const low=base().evidence.filter(x=>x.category!=="VALUATION"&&x.category!=="AUCTION"&&x.category!=="PHYSICAL"&&x.category!=="LOCATION");
assert.equal(evaluatePropertyProductionDecision({...base(),evidence:low}).decision,"INSUFFICIENT_EVIDENCE");
console.log("PASS: AssetShakti Phase 1 decision-engine tests");


const adverseAuction=base([
  evidence("CONTRADICTED","BIDDER_OBLIGATION")
]);
assert.equal(evaluatePropertyProductionDecision(adverseAuction).decision,"DO_NOT_BID");

const auctionMissing=base().evidence.filter(x=>x.category!=="BIDDER_OBLIGATION");
assert.equal(evaluatePropertyProductionDecision({...base(),evidence:auctionMissing}).decision,"DO_NOT_BID");

console.log("PASS: auction-term critical negative controls");

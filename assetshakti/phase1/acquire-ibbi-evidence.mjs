import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

// Shakti evidence acquisition: acquisition is never verification.\nconst OUT = process.argv[2] ?? ".assetshakti-acquisition";
fs.mkdirSync(OUT, { recursive: true });

const sourceUrl = "https://ibbi.gov.in/liquidation-auction-notices/lists";
const htmlPath = path.join(OUT, "ibbi-liquidation-auction-notices.html");
execFileSync("curl", ["-fsSL", "--max-time", "60", "-o", htmlPath, sourceUrl]);

const html = fs.readFileSync(htmlPath, "utf8");
const rows = [...html.matchAll(/<tr[\\s\\S]*?<\\/tr>/gi)].map(m => m[0]);

const targets = [
  { caseId:"P1-PILOT-001", name:"GENERAL COMPOSITES PRIVATE LIMITED", rounds:["07-10-2026"] },
  { caseId:"P1-PILOT-002", name:"HALLMARK LIVING SPACE PRIVATE LIMITED", rounds:["15-10-2026"] },
  { caseId:"P1-PILOT-003", name:"Vysali Pharmaceuticals Limited", rounds:["10-10-2026"] },
  { caseId:"P1-PILOT-004", name:"PARAKKOTT INVESTMENTS INDIA PRIVATE LIMITED", rounds:["29-09-2026"] },
  { caseId:"P1-PILOT-005", name:"JOSAN FOODS PRIVATE LIMITED", rounds:[] },
  { caseId:"P1-PILOT-006", name:"Silverton Spinners Limited", rounds:[] }
];

function clean(s) {
  return s.replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\\s+/g," ").trim();
}
function dateToKey(s) {
  const m=s.match(/(\\d{2})-(\\d{2})-(\\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

const acquired=[];
for (const t of targets) {
  const matched=rows.filter(r => clean(r).toLowerCase().includes(t.name.toLowerCase()));
  for (const row of matched) {
    const text=clean(row);
    const dates=[...text.matchAll(/\\b\\d{2}-\\d{2}-\\d{4}\\b/g)].map(x=>x[0]);
    const auctionDate=dates[1] ?? "";
    if (t.rounds.length && !t.rounds.includes(auctionDate)) continue;

    const links=[...row.matchAll(/href=["']([^"']+\\.pdf(?:\\?[^"']*)?)["']/gi)].map(x=>x[1]);
    const pdfs=links.map(x=>new URL(x,sourceUrl).href);
    if (!pdfs.length) continue;

    const dir=path.join(OUT,t.caseId,dateToKey(auctionDate)||"round-unspecified");
    fs.mkdirSync(dir,{recursive:true});
    for (let i=0;i<Math.min(2,pdfs.length);i++) {
      const fileName=i===0 ? "auction-notice.pdf" : "details.pdf";
      const filePath=path.join(dir,fileName);
      try {
        execFileSync("curl",["-fsSL","--max-time","90","-o",filePath,pdfs[i]]);
        const sha256=crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
        acquired.push({
          caseId:t.caseId,
          corporateDebtor:t.name,
          auctionDate,
          documentType:i===0?"AUCTION_NOTICE":"DETAILS",
          sourceReference:pdfs[i],
          contentSha256:sha256,
          bytes:fs.statSync(filePath).size,
          localPath:filePath
        });
      } catch {}
    }
  }
}

const manifest={
  schemaVersion:"1.0",
  acquiredAt:new Date().toISOString(),
  source:sourceUrl,
  authoritativeSource:"IBBI Liquidation Auction Notices",
  acquisitionMode:"AUTHORITATIVE_SOURCE_DIRECT",
  productionCertification:"OFF",
  records:acquired,
  failClosedRules:[
    "Acquisition does not equal verification.",
    "Exact auction round is preserved.",
    "PDF SHA-256 is computed from downloaded bytes.",
    "Title, possession, valuation and bidder eligibility are not inferred from an auction index.",
    "A record cannot enter decision evidence until the existing verification and reconciliation gates pass."
  ]
};
fs.writeFileSync(path.join(OUT,"manifest.json"),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({records:acquired.length,manifest:path.join(OUT,"manifest.json")}));

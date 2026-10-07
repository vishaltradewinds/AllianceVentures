import React, {useState} from 'react';

export default function AssetShaktiEvidence(){
  const [caseId,setCaseId]=useState('P1-PILOT-005');
  const [documentType,setDocumentType]=useState('AUCTION_NOTICE');
  const [auctionRound,setAuctionRound]=useState('2026-09-23');
  const [sourceReference,setSourceReference]=useState('');
  const [observedAt,setObservedAt]=useState('2026-10-07');
  const [file,setFile]=useState<File|null>(null);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setStatus('');
    if(!file){setStatus('Select the authoritative document first.');return;}
    if(file.type!=='application/pdf'){setStatus('Only PDF evidence is accepted by this intake.');return;}
    if(file.size>10*1024*1024){setStatus('PDF exceeds the 10 MB intake limit.');return;}
    setBusy(true);
    try{
      const bytes=new Uint8Array(await file.arrayBuffer());
      let binary=''; for(let i=0;i<bytes.length;i+=0x8000) binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
      const contentBase64=btoa(binary);
      const r=await fetch('/api/assetshakti/evidence-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({caseId,documentType,auctionRound,sourceReference,observedAt,fileName:file.name,contentType:file.type,contentBase64})});
      const data=await r.json();
      setStatus(r.ok ? 'Uploaded: USER_SUPPLIED_PENDING_VERIFICATION. G16 remains fail-closed until verification.' : (data.error||'Upload failed.'));
    }catch{setStatus('Upload failed. Please retry.');}
    finally{setBusy(false);}
  }

  return <main style={{minHeight:'100vh',background:'#050505',color:'#fff',padding:32,fontFamily:'Inter,system-ui'}}>
    <div style={{maxWidth:820,margin:'0 auto'}}>
      <h1>AssetShakti — Evidence Intake</h1>
      <p style={{color:'#aaa'}}>Upload an authoritative document when automated retrieval is unavailable. Upload does not make evidence verified.</p>
      <form onSubmit={submit} style={{display:'grid',gap:16,background:'#111',padding:24,borderRadius:12,border:'1px solid #333'}}>
        <label>Case ID<input value={caseId} onChange={e=>setCaseId(e.target.value)} style={{display:'block',width:'100%',padding:10,marginTop:6}}/></label>
        <label>Document type<select value={documentType} onChange={e=>setDocumentType(e.target.value)} style={{display:'block',width:'100%',padding:10,marginTop:6}}><option>AUCTION_NOTICE</option><option>CORRIGENDUM</option><option>ADDENDUM</option><option>PROCESS_DOCUMENT</option><option>TITLE_DOCUMENT</option><option>POSSESSION_DOCUMENT</option><option>VALUATION_REPORT</option><option>COURT_DOCUMENT</option><option>OTHER</option></select></label>
        <label>Auction round<input value={auctionRound} onChange={e=>setAuctionRound(e.target.value)} style={{display:'block',width:'100%',padding:10,marginTop:6}}/></label>
        <label>Authoritative source reference<input required value={sourceReference} onChange={e=>setSourceReference(e.target.value)} placeholder="IBBI/BAANKNET source reference" style={{display:'block',width:'100%',padding:10,marginTop:6}}/></label>
        <label>Observed/source date<input type="date" value={observedAt} onChange={e=>setObservedAt(e.target.value)} style={{display:'block',padding:10,marginTop:6}}/></label>
        <label>PDF document<input type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)} style={{display:'block',marginTop:6}}/></label>
        <button disabled={busy} style={{padding:12}}>{busy?'Uploading…':'Submit for verification'}</button>
        {status&&<div style={{padding:12,border:'1px solid #555'}}>{status}</div>}
      </form>
    </div>
  </main>;
}

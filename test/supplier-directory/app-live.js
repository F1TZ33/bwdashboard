(function(){
'use strict';
const $ = id => document.getElementById(id);
const DATA = Array.isArray(window.SUPPLIER_DIRECTORY_DATA) ? window.SUPPLIER_DIRECTORY_DATA : [];
const STORAGE_KEY = 'bwSupplierDirectoryGuidedAddEntries';
let localEntries = loadLocalEntries();
let selectedSupplier='', selectedProduct='', selectedSupplierForProduct='', selectedProductForSupplier='';
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm = s => String(s ?? '').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const words = s => norm(s).split(' ').filter(Boolean);
const canonicalKey = s => [...new Set(words(s))].sort().join('|');
const unique = arr => [...new Set((arr || []).filter(Boolean).map(x => String(x).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
function loadLocalEntries(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
function saveLocalEntries(){localStorage.setItem(STORAGE_KEY, JSON.stringify(localEntries));}
function splitList(v){return unique(String(v||'').split(/[,;|]/));}
function splitProducts(v){return unique(String(v||'').split(/[,;|]/));}
function splitStates(value){
  const valid=new Set(['ACT','NSW','NT','QLD','SA','TAS','VIC','WA']);
  return unique(String(value||'').toUpperCase().replace(/\bNS\b/g,'NSW').replace(/[.,;|/]+/g,' ').split(/\s+/).filter(x=>valid.has(x)));
}
function supplierKey(name){return norm(name)}
function clone(o){return JSON.parse(JSON.stringify(o || {}));}
function productListFromSupplier(s){return splitProducts(s.keyProducts || (s.products||[]).join(', '));}
function mergeProducts(existingText, newProducts){return unique([...productListFromSupplier({keyProducts:existingText}), ...(newProducts||[])]).join(', ');}
function buildSupplierList(){
  const map=new Map(); DATA.forEach(s=>map.set(supplierKey(s.supplier), clone(s)));
  localEntries.forEach(entry=>{
    const key=supplierKey(entry.supplier); const base=map.get(key)||{supplier:entry.supplier,category:'',preferred:false,account:'',notes:'',state:'',phone:'',email:'',categories:[],keyProducts:'',brands:[]};
    const merged={...base}; ['account','notes','state','phone','email'].forEach(f=>{if(entry[f]) merged[f]=entry[f];});
    merged.preferred=!!(base.preferred||entry.preferred);
    merged.categories=unique([...(base.categories||[]), ...(entry.categories||[])]); merged.category=merged.categories[0]||base.category||'';
    merged.brands=unique([...(base.brands||[]), ...(entry.brands||[])]);
    merged.keyProducts=mergeProducts(base.keyProducts||'', entry.products||splitProducts(entry.keyProducts||''));
    merged._local=true; map.set(key, merged);
  });
  return [...map.values()].sort((a,b)=>String(a.supplier).localeCompare(String(b.supplier)));
}
let suppliers = buildSupplierList();
function fillSelect(id, label, values){const el=$(id); if(!el)return; const prev=el.value; el.innerHTML=`<option value="">${label}</option>`; values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)}); if(values.includes(prev)) el.value=prev;}
function fillDatalist(id, values){const el=$(id); if(!el)return; el.innerHTML=''; values.forEach(v=>{const o=document.createElement('option');o.value=v;el.appendChild(o)});}
function refreshFilters(){
  const cats=unique(suppliers.flatMap(s=>s.categories||[])); const brands=unique(suppliers.flatMap(s=>s.brands||[])); const states=unique(suppliers.flatMap(s=>splitStates(s.state)));
  fillSelect('categoryFilter','All categories',cats); fillSelect('brandFilter','All brands',brands); fillSelect('stateFilter','All states',states); fillDatalist('categoryOptions',cats); fillDatalist('brandOptions',brands);
}
function searchText(s){return norm([s.supplier,s.account,s.notes,s.state,s.phone,s.email,s.category,...(s.categories||[]),s.keyProducts,...(s.brands||[])].join(' | '));}
function matches(s){
  const q=norm($('q')?.value||''); const tokens=words(q); const cat=$('categoryFilter')?.value||''; const brand=$('brandFilter')?.value||''; const state=$('stateFilter')?.value||''; const pref=!!$('preferredOnly')?.checked;
  const hay=searchText(s); if(tokens.length && !tokens.every(t=>hay.includes(t))) return false;
  if(cat && !(s.categories||[]).includes(cat)) return false; if(brand && !(s.brands||[]).includes(brand)) return false; if(state && !splitStates(s.state).includes(state)) return false; if(pref && !s.preferred) return false; return true;
}
function highlight(v, q){const safe=esc(v); const term=String(q||'').trim(); if(!term) return safe; return term.split(/\s+/).filter(Boolean).reduce((out,t)=>out.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'ig'),m=>`<mark>${m}</mark>`), safe);}
function supplierCard(s){const q=$('q')?.value||''; const cats=(s.categories||[]).slice(0,5).map(c=>`<span class="chip">${highlight(c,q)}</span>`).join(''); const brands=(s.brands||[]).slice(0,10).map(b=>`<span class="chip">${highlight(b,q)}</span>`).join(''); return `<article class="supplierCard"><div class="supplierMain"><div class="supplierName">${highlight(s.supplier,q)}</div><div>${s._local?'<span class="badge local">Edited</span>':''}${s.preferred?'<span class="badge pref">Preferred</span>':'<span class="badge">Supplier</span>'}</div></div><div class="metaLine">Acct ${highlight(s.account||'not listed',q)} • ${highlight(s.state||'state not listed',q)}</div><div class="contactGrid"><div class="miniField"><b>Phone</b>${s.phone?`<a href="tel:${esc(s.phone)}">${highlight(s.phone,q)}</a>`:'Not listed'}</div><div class="miniField"><b>Email</b>${s.email?`<a href="mailto:${esc(s.email)}">${highlight(s.email,q)}</a>`:'Not listed'}</div></div><div class="products"><b>Products:</b> ${highlight(s.keyProducts||'Not listed',q)}</div>${s.notes?`<div class="notes">${highlight(s.notes,q)}</div>`:''}<div class="chips">${cats}${brands}</div></article>`;}
function render(){
  const results=$('results'), stats=$('stats'); if(!results||!stats) return;
  const q=($('q')?.value||'').trim(); const filtered=suppliers.filter(matches); const shown=filtered.slice(0, q ? 80 : 24);
  stats.textContent = q ? `${shown.length} shown from ${filtered.length} matching supplier${filtered.length===1?'':'s'}` : `${shown.length} suppliers shown. Type to live-filter from ${suppliers.length} suppliers.`;
  results.innerHTML = shown.length ? `<div class="supplierResults">${shown.map(supplierCard).join('')}</div>` : `<div class="empty">No suppliers match "${esc(q)}".</div>`;
}
function allProducts(){return unique(suppliers.flatMap(productListFromSupplier));} function allSupplierNames(){return unique(suppliers.map(s=>s.supplier));}
function findMatchingNames(query, values){const q=norm(query); if(!q)return values.slice(0,8); const qs=words(q); const qk=canonicalKey(query); return values.map(value=>{const v=norm(value), k=canonicalKey(value); let score=0; if(v===q)score+=100; if(k===qk)score+=80; if(v.includes(q))score+=50; qs.forEach(w=>{if(v.includes(w))score+=10}); return {value,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.value.localeCompare(b.value)).slice(0,10).map(x=>x.value);}
function renderMatchList(containerId, query, values, onPick, noun){const box=$(containerId); if(!box)return; const matches=findMatchingNames(query, values); const exact=values.some(v=>canonicalKey(v)===canonicalKey(query)); let html=''; if(String(query||'').trim()&&!exact) html+=`<button type="button" class="matchItem create" data-value="${esc(query.trim())}">+ Create/use "${esc(query.trim())}"</button>`; html+=matches.map(v=>`<button type="button" class="matchItem" data-value="${esc(v)}">${esc(v)}</button>`).join(''); box.innerHTML=html||`<div class="matchEmpty">No ${noun} matches yet. Keep typing to create a new entry.</div>`; box.querySelectorAll('.matchItem').forEach(btn=>btn.addEventListener('click',()=>onPick(btn.dataset.value)));}
function refreshAddMatches(){renderMatchList('supplierMatches',$('supplierSearchAdd')?.value||'',allSupplierNames(),selectSupplier,'supplier');renderMatchList('productMatchesForSupplier',$('productSearchForSupplier')?.value||'',allProducts(),selectProductForSupplier,'product');renderMatchList('productMatches',$('productSearchAdd')?.value||'',allProducts(),selectProduct,'product');renderMatchList('supplierMatchesForProduct',$('supplierSearchForProduct')?.value||'',allSupplierNames(),selectSupplierForProduct,'supplier');}
function selectSupplier(n){selectedSupplier=n.trim();$('supplierSearchAdd').value=selectedSupplier;$('selectedSupplierText').textContent=selectedSupplier||'None selected yet';refreshAddMatches();}
function selectProductForSupplier(n){selectedProductForSupplier=n.trim();$('productSearchForSupplier').value=selectedProductForSupplier;$('selectedProductForSupplierText').textContent=selectedProductForSupplier||'None selected yet';refreshAddMatches();}
function selectProduct(n){selectedProduct=n.trim();$('productSearchAdd').value=selectedProduct;$('selectedProductText').textContent=selectedProduct||'None selected yet';refreshAddMatches();}
function selectSupplierForProduct(n){selectedSupplierForProduct=n.trim();$('supplierSearchForProduct').value=selectedSupplierForProduct;$('selectedSupplierForProductText').textContent=selectedSupplierForProduct||'None selected yet';refreshAddMatches();}
function entrySupplierFlow(name, product){return {supplier:name,account:$('newAccount').value.trim(),notes:$('newNotes').value.trim(),state:splitStates($('newState').value).join(', ')||$('newState').value.trim().toUpperCase(),phone:$('newPhone').value.trim(),email:$('newEmail').value.trim(),categories:splitList($('newCategory').value),brands:splitList($('newBrands').value),preferred:$('newPreferred').checked,products:product?[product]:[]};}
function entryProductFlow(name, product){return {supplier:name,account:$('pfNewAccount').value.trim(),notes:$('pfNewNotes').value.trim(),state:splitStates($('pfNewState').value).join(', ')||$('pfNewState').value.trim().toUpperCase(),phone:$('pfNewPhone').value.trim(),email:$('pfNewEmail').value.trim(),categories:splitList($('pfNewCategory').value),brands:splitList($('pfNewBrands').value),preferred:$('pfNewPreferred').checked,products:product?[product]:[]};}
function addOrUpdateLocal(entry){const key=supplierKey(entry.supplier); const existing=localEntries.find(x=>supplierKey(x.supplier)===key); if(existing){['account','notes','state','phone','email'].forEach(f=>{if(entry[f])existing[f]=entry[f]}); existing.preferred=existing.preferred||entry.preferred; existing.categories=unique([...(existing.categories||[]),...(entry.categories||[])]); existing.brands=unique([...(existing.brands||[]),...(entry.brands||[])]); existing.products=unique([...(existing.products||splitProducts(existing.keyProducts||'')),...(entry.products||[])]);} else localEntries.push(entry); saveLocalEntries(); suppliers=buildSupplierList(); refreshFilters(); render(); refreshAddMatches();}
function productAlreadyWithSupplier(sn,p){const s=suppliers.find(x=>supplierKey(x.supplier)===supplierKey(sn)); if(!s)return false; const pk=canonicalKey(p); return productListFromSupplier(s).some(x=>canonicalKey(x)===pk);}
function saveSupplierProduct(){const supplier=(selectedSupplier||$('supplierSearchAdd').value).trim(), product=(selectedProductForSupplier||$('productSearchForSupplier').value).trim(); if(!supplier||!product){$('supplierFlowStatus').textContent='Choose or type both a supplier and product first.';return;} if(productAlreadyWithSupplier(supplier,product)){$('supplierFlowStatus').textContent=`Duplicate blocked: ${supplier} already has a matching product entry.`;return;} addOrUpdateLocal(entrySupplierFlow(supplier,product)); $('supplierFlowStatus').textContent=`Saved: ${product} linked to ${supplier}.`;}
function saveProductSupplier(){const product=(selectedProduct||$('productSearchAdd').value).trim(), supplier=(selectedSupplierForProduct||$('supplierSearchForProduct').value).trim(); if(!supplier||!product){$('productFlowStatus').textContent='Choose or type both a product and supplier first.';return;} if(productAlreadyWithSupplier(supplier,product)){$('productFlowStatus').textContent=`Duplicate blocked: ${supplier} already has a matching product entry.`;return;} addOrUpdateLocal(entryProductFlow(supplier,product)); $('productFlowStatus').textContent=`Saved: ${supplier} linked to ${product}.`;}
function exportAdded(){if(!localEntries.length){$('addStatus').textContent='No local entries to export.';return;} const blob=new Blob(['window.SUPPLIER_DIRECTORY_LOCAL_ADDITIONS = '+JSON.stringify(localEntries,null,2)+';\n'],{type:'application/javascript'}); const url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download='supplier-directory-local-additions.js'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); $('addStatus').textContent='Export downloaded.';}
function clearAdded(){if(!localEntries.length){$('addStatus').textContent='No local entries to clear.';return;} if(!confirm('Clear all locally added supplier/product links from this browser?'))return; localEntries=[]; saveLocalEntries(); suppliers=buildSupplierList(); refreshFilters(); render(); refreshAddMatches(); $('addStatus').textContent='Local additions cleared.';}
function setMode(mode){const sm=mode==='supplier'; $('supplierFlow').classList.toggle('hidden',!sm); $('productFlow').classList.toggle('hidden',sm); $('modeSupplierBtn').classList.toggle('active',sm); $('modeProductBtn').classList.toggle('active',!sm);}
function bind(){
  ['q','categoryFilter','brandFilter','stateFilter','preferredOnly'].forEach(id=>{const el=$(id); if(el){el.addEventListener('input',render); el.addEventListener('change',render); el.addEventListener('keyup',render);}});
  $('clearBtn')?.addEventListener('click',()=>{$('q').value='';$('categoryFilter').value='';$('brandFilter').value='';$('stateFilter').value='';$('preferredOnly').checked=false;render();$('q').focus();});
  $('modeSupplierBtn')?.addEventListener('click',()=>setMode('supplier')); $('modeProductBtn')?.addEventListener('click',()=>setMode('product'));
  $('supplierSearchAdd')?.addEventListener('input',e=>{selectedSupplier='';$('selectedSupplierText').textContent='None selected yet';renderMatchList('supplierMatches',e.target.value,allSupplierNames(),selectSupplier,'supplier');});
  $('productSearchForSupplier')?.addEventListener('input',e=>{selectedProductForSupplier='';$('selectedProductForSupplierText').textContent='None selected yet';renderMatchList('productMatchesForSupplier',e.target.value,allProducts(),selectProductForSupplier,'product');});
  $('productSearchAdd')?.addEventListener('input',e=>{selectedProduct='';$('selectedProductText').textContent='None selected yet';renderMatchList('productMatches',e.target.value,allProducts(),selectProduct,'product');});
  $('supplierSearchForProduct')?.addEventListener('input',e=>{selectedSupplierForProduct='';$('selectedSupplierForProductText').textContent='None selected yet';renderMatchList('supplierMatchesForProduct',e.target.value,allSupplierNames(),selectSupplierForProduct,'supplier');});
  $('saveSupplierProductBtn')?.addEventListener('click',saveSupplierProduct); $('saveProductSupplierBtn')?.addEventListener('click',saveProductSupplier); $('exportAddedBtn')?.addEventListener('click',exportAdded); $('clearAddedBtn')?.addEventListener('click',clearAdded);
}
document.addEventListener('DOMContentLoaded',()=>{refreshFilters(); bind(); render(); refreshAddMatches();});
})();

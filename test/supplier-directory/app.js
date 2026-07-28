(function(){
'use strict';
const BASE_SUPPLIERS = Array.isArray(window.SUPPLIER_DIRECTORY_DATA) ? window.SUPPLIER_DIRECTORY_DATA : [];
const STORAGE_KEY = 'bwSupplierDirectoryGuidedAddEntries';
let localEntries = loadLocalEntries();
let suppliers = buildSupplierList();
let selectedSupplier = '';
let selectedProduct = '';
let selectedSupplierForProduct = '';
let selectedProductForSupplier = '';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm = s => String(s ?? '').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const words = s => norm(s).split(' ').filter(Boolean);
const canonicalKey = s => [...new Set(words(s))].sort().join('|');
const unique = arr => [...new Set((arr || []).filter(Boolean).map(x => String(x).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));

function loadLocalEntries(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function saveLocalEntries(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(localEntries)); }
function splitList(value){ return unique(String(value || '').split(/[,;|]/).map(x => x.trim()).filter(Boolean)); }
function splitProducts(value){ return splitList(value); }
function joinProducts(products){ return unique(products).join(', '); }
function escapeRegExp(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlight(value, q){ const safe=esc(value); q=String(q||'').trim(); if(!q) return safe; return safe.replace(new RegExp(escapeRegExp(q),'ig'), m => `<mark>${m}</mark>`); }
function splitStates(value){
  const valid = new Set(['ACT','NSW','NT','QLD','SA','TAS','VIC','WA']);
  const cleaned = String(value || '').toUpperCase().replace(/\bNS\b/g, 'NSW').replace(/[.;,|/]+/g, ' ').replace(/\s+/g, ' ').trim();
  return unique(cleaned.split(' ').filter(x => valid.has(x)));
}
function supplierKey(name){ return norm(name); }
function cloneSupplier(s){ return JSON.parse(JSON.stringify(s)); }
function productListFromSupplier(s){ return splitProducts(s.keyProducts || ''); }
function allProducts(){ return unique(suppliers.flatMap(productListFromSupplier)); }
function allSupplierNames(){ return unique(suppliers.map(s => s.supplier)); }
function mergeProducts(existingText, newProducts){
  const existing = productListFromSupplier({keyProducts: existingText});
  const seen = new Set(existing.map(canonicalKey));
  for(const p of newProducts || []){ const key = canonicalKey(p); if(key && !seen.has(key)){ existing.push(p.trim()); seen.add(key); } }
  return joinProducts(existing);
}
function buildSupplierList(){
  const map = new Map();
  BASE_SUPPLIERS.forEach(s => map.set(supplierKey(s.supplier), cloneSupplier(s)));
  localEntries.forEach(entry => {
    const key = supplierKey(entry.supplier);
    const base = map.get(key) || {category:'', supplier:entry.supplier, preferred:false, account:'', notes:'', state:'', phone:'', email:'', categories:[], keyProducts:'', brands:[]};
    const merged = {...base};
    ['account','notes','state','phone','email'].forEach(field => { if(entry[field]) merged[field] = entry[field]; });
    if(entry.preferred) merged.preferred = true;
    merged.categories = unique([...(base.categories || []), ...(entry.categories || [])]);
    merged.category = merged.categories[0] || base.category || '';
    merged.brands = unique([...(base.brands || []), ...(entry.brands || [])]);
    merged.keyProducts = mergeProducts(base.keyProducts || '', entry.products || splitProducts(entry.keyProducts || ''));
    merged._local = true;
    map.set(key, merged);
  });
  return [...map.values()].sort((a,b)=>a.supplier.localeCompare(b.supplier));
}
function resetOptions(id, label){ const el=$(id); const current = el.value; el.innerHTML = `<option value="">${label}</option>`; return current; }
function optionFill(id, values, previous){ const el=$(id); values.forEach(v=>{ const opt=document.createElement('option'); opt.value=v; opt.textContent=v; el.appendChild(opt); }); if(values.includes(previous)) el.value = previous; }
function fillDatalist(id, values){ const el=$(id); if(!el) return; el.innerHTML = values.map(v => `<option value="${esc(v)}"></option>`).join(''); }
function refreshFilters(){
  const cats = unique(suppliers.flatMap(s => s.categories || []));
  const brands = unique(suppliers.flatMap(s => s.brands || []));
  const states = unique(suppliers.flatMap(s => splitStates(s.state)));
  optionFill('categoryFilter', cats, resetOptions('categoryFilter', 'All categories'));
  optionFill('brandFilter', brands, resetOptions('brandFilter', 'All brands'));
  optionFill('stateFilter', states, resetOptions('stateFilter', 'All states'));
  fillDatalist('categoryOptions', cats);
  fillDatalist('brandOptions', brands);
}
function searchText(s){ return norm([s.supplier,s.account,s.notes,s.state,s.phone,s.email,s.category,...(s.categories||[]),s.keyProducts,...(s.brands||[])].join(' | ')); }
function matches(s){
  const q=norm($('q').value), cat=$('categoryFilter').value, brand=$('brandFilter').value, state=$('stateFilter').value, pref=$('preferredOnly').checked;
  if(q && !searchText(s).includes(q)) return false;
  if(cat && !(s.categories||[]).includes(cat)) return false;
  if(brand && !(s.brands||[]).includes(brand)) return false;
  if(state && !splitStates(s.state).includes(state)) return false;
  if(pref && !s.preferred) return false;
  return true;
}
function supplierCard(s){
  const q=$('q').value.trim();
  const cats=(s.categories||[]).slice(0,4).map(c=>`<span class="chip">${highlight(c,q)}</span>`).join('');
  const brands=(s.brands||[]).slice(0,8).map(b=>`<span class="chip">${highlight(b,q)}</span>`).join('');
  const email=s.email ? `<a href="mailto:${esc(s.email)}">${highlight(s.email,q)}</a>` : 'Not listed';
  const phone=s.phone ? `<a href="tel:${esc(s.phone)}">${highlight(s.phone,q)}</a>` : 'Not listed';
  const localBadge = s._local ? '<span class="badge local">Edited</span>' : '';
  return `<article class="supplierCard"><div class="supplierMain"><div class="supplierName">${highlight(s.supplier,q)}</div><div>${localBadge}${s.preferred?'<span class="badge pref">Preferred</span>':'<span class="badge">Supplier</span>'}</div></div><div class="metaLine">Acct ${highlight(s.account||'not listed',q)} • ${highlight(s.state||'state not listed',q)}</div><div class="contactGrid"><div class="miniField"><b>Phone</b>${phone}</div><div class="miniField"><b>Email</b>${email}</div></div><div class="products"><b>Products:</b> ${highlight(s.keyProducts||'Not listed',q)}</div>${s.notes?`<div class="notes">${highlight(s.notes,q)}</div>`:''}<div class="chips">${cats}${brands}</div></article>`;
}
function render(){
  const filtered = suppliers.filter(matches);
  const q = $('q').value.trim();
  const limit = q ? 60 : 18;
  const shown = filtered.slice(0, limit);
  const addedText = localEntries.length ? ` including ${localEntries.length} browser-added entr${localEntries.length===1?'y':'ies'}` : '';
  $('stats').textContent = `${shown.length} shown from ${filtered.length} matching supplier${filtered.length===1?'':'s'}${addedText}`;
  $('results').innerHTML = shown.length ? '<div class="supplierResults">'+shown.map(supplierCard).join('')+'</div>' : '<div class="empty">No suppliers match the current search.</div>';
}
function findMatchingNames(query, values){
  const q = norm(query); if(!q) return values.slice(0, 8);
  const qWords = words(query), qKey = canonicalKey(query);
  return values.map(value => { const v = norm(value), key = canonicalKey(value); let score = 0; if(v.includes(q)) score += 20; if(key === qKey) score += 30; for(const w of qWords){ if(v.includes(w)) score += 5; } return {value, score}; }).filter(x => x.score > 0).sort((a,b)=>b.score-a.score || a.value.localeCompare(b.value)).slice(0,10).map(x => x.value);
}
function renderMatchList(containerId, query, values, onPick, noun){
  const box = $(containerId); if(!box) return;
  const matches = findMatchingNames(query, values); const qKey = canonicalKey(query); const exact = qKey && values.some(v => canonicalKey(v) === qKey);
  let html = '';
  if(String(query).trim() && !exact) html += `<button type="button" class="matchItem create" data-value="${esc(query.trim())}">+ Create/use "${esc(query.trim())}"</button>`;
  html += matches.map(v => `<button type="button" class="matchItem" data-value="${esc(v)}">${esc(v)}${qKey && canonicalKey(v) === qKey ? '<small>word-order match</small>' : ''}</button>`).join('');
  if(!html) html = `<div class="matchEmpty">No ${noun} matches yet. Keep typing to create a new entry.</div>`;
  box.innerHTML = html;
  box.querySelectorAll('.matchItem').forEach(btn => btn.addEventListener('click', () => onPick(btn.dataset.value)));
}
function selectSupplier(name){ selectedSupplier = name.trim(); $('supplierSearchAdd').value = selectedSupplier; $('selectedSupplierText').textContent = selectedSupplier || 'None selected yet'; renderMatchList('supplierMatches', selectedSupplier, allSupplierNames(), selectSupplier, 'supplier'); }
function selectProductForSupplier(name){ selectedProductForSupplier = name.trim(); $('productSearchForSupplier').value = selectedProductForSupplier; $('selectedProductForSupplierText').textContent = selectedProductForSupplier || 'None selected yet'; renderMatchList('productMatchesForSupplier', selectedProductForSupplier, allProducts(), selectProductForSupplier, 'product'); }
function selectProduct(name){ selectedProduct = name.trim(); $('productSearchAdd').value = selectedProduct; $('selectedProductText').textContent = selectedProduct || 'None selected yet'; renderMatchList('productMatches', selectedProduct, allProducts(), selectProduct, 'product'); }
function selectSupplierForProduct(name){ selectedSupplierForProduct = name.trim(); $('supplierSearchForProduct').value = selectedSupplierForProduct; $('selectedSupplierForProductText').textContent = selectedSupplierForProduct || 'None selected yet'; renderMatchList('supplierMatchesForProduct', selectedSupplierForProduct, allSupplierNames(), selectSupplierForProduct, 'supplier'); }
function refreshAddMatches(){ renderMatchList('supplierMatches', $('supplierSearchAdd').value, allSupplierNames(), selectSupplier, 'supplier'); renderMatchList('productMatchesForSupplier', $('productSearchForSupplier').value, allProducts(), selectProductForSupplier, 'product'); renderMatchList('productMatches', $('productSearchAdd').value, allProducts(), selectProduct, 'product'); renderMatchList('supplierMatchesForProduct', $('supplierSearchForProduct').value, allSupplierNames(), selectSupplierForProduct, 'supplier'); }
function buildNewSupplierFromSupplierFlow(name, product){ return {supplier:name, account:$('newAccount').value.trim(), notes:$('newNotes').value.trim(), state:splitStates($('newState').value).join(', ') || $('newState').value.trim().toUpperCase(), phone:$('newPhone').value.trim(), email:$('newEmail').value.trim(), categories:splitList($('newCategory').value), brands:splitList($('newBrands').value), preferred:$('newPreferred').checked, products: product ? [product] : []}; }
function buildNewSupplierFromProductFlow(name, product){ return {supplier:name, account:$('pfNewAccount').value.trim(), notes:$('pfNewNotes').value.trim(), state:splitStates($('pfNewState').value).join(', ') || $('pfNewState').value.trim().toUpperCase(), phone:$('pfNewPhone').value.trim(), email:$('pfNewEmail').value.trim(), categories:splitList($('pfNewCategory').value), brands:splitList($('pfNewBrands').value), preferred:$('pfNewPreferred').checked, products: product ? [product] : []}; }
function addOrUpdateLocal(entry){
  const key = supplierKey(entry.supplier); const existing = localEntries.find(x => supplierKey(x.supplier) === key);
  if(existing){ ['account','notes','state','phone','email'].forEach(f => { if(entry[f]) existing[f] = entry[f]; }); existing.preferred = existing.preferred || entry.preferred; existing.categories = unique([...(existing.categories || []), ...(entry.categories || [])]); existing.brands = unique([...(existing.brands || []), ...(entry.brands || [])]); existing.products = unique([...(existing.products || splitProducts(existing.keyProducts || '')), ...(entry.products || [])]); }
  else localEntries.push(entry);
  saveLocalEntries(); suppliers = buildSupplierList(); refreshFilters(); render(); refreshAddMatches();
}
function productAlreadyWithSupplier(supplierName, product){ const s = suppliers.find(x => supplierKey(x.supplier) === supplierKey(supplierName)); if(!s) return false; const pKey = canonicalKey(product); return productListFromSupplier(s).some(p => canonicalKey(p) === pKey); }
function saveSupplierProduct(){ const supplier = (selectedSupplier || $('supplierSearchAdd').value).trim(); const product = (selectedProductForSupplier || $('productSearchForSupplier').value).trim(); if(!supplier){ $('supplierFlowStatus').textContent = 'Choose or type a supplier first.'; return; } if(!product){ $('supplierFlowStatus').textContent = 'Choose or type a product first.'; return; } if(productAlreadyWithSupplier(supplier, product)){ $('supplierFlowStatus').textContent = `Duplicate blocked: ${supplier} already has a matching product entry.`; return; } addOrUpdateLocal(buildNewSupplierFromSupplierFlow(supplier, product)); $('supplierFlowStatus').textContent = `Saved: ${product} linked to ${supplier}.`; }
function saveProductSupplier(){ const product = (selectedProduct || $('productSearchAdd').value).trim(); const supplier = (selectedSupplierForProduct || $('supplierSearchForProduct').value).trim(); if(!product){ $('productFlowStatus').textContent = 'Choose or type a product first.'; return; } if(!supplier){ $('productFlowStatus').textContent = 'Choose or type a supplier first.'; return; } if(productAlreadyWithSupplier(supplier, product)){ $('productFlowStatus').textContent = `Duplicate blocked: ${supplier} already has a matching product entry.`; return; } addOrUpdateLocal(buildNewSupplierFromProductFlow(supplier, product)); $('productFlowStatus').textContent = `Saved: ${supplier} linked to ${product}.`; }
function exportAdded(){ if(!localEntries.length){ $('addStatus').textContent = 'No local entries to export.'; return; } const blob = new Blob(['window.SUPPLIER_DIRECTORY_LOCAL_ADDITIONS = '+JSON.stringify(localEntries, null, 2)+';\n'], {type:'application/javascript'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'supplier-directory-local-additions.js'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); $('addStatus').textContent = 'Export downloaded.'; }
function clearAdded(){ if(!localEntries.length){ $('addStatus').textContent = 'No local entries to clear.'; return; } if(!confirm('Clear all locally added supplier/product links from this browser?')) return; localEntries = []; saveLocalEntries(); $('addStatus').textContent = 'Local additions cleared.'; suppliers = buildSupplierList(); refreshFilters(); render(); refreshAddMatches(); }
function setMode(mode){ const supplierMode = mode === 'supplier'; $('supplierFlow').classList.toggle('hidden', !supplierMode); $('productFlow').classList.toggle('hidden', supplierMode); $('modeSupplierBtn').classList.toggle('active', supplierMode); $('modeProductBtn').classList.toggle('active', !supplierMode); }
function bind(){
  ['q','categoryFilter','brandFilter','stateFilter','preferredOnly'].forEach(id => { const el=$(id); ['input','change','keyup'].forEach(evt => el.addEventListener(evt, render)); });
  $('clearBtn').addEventListener('click',()=>{ $('q').value=''; $('categoryFilter').value=''; $('brandFilter').value=''; $('stateFilter').value=''; $('preferredOnly').checked=false; render(); $('q').focus(); });
  $('modeSupplierBtn').addEventListener('click', () => setMode('supplier')); $('modeProductBtn').addEventListener('click', () => setMode('product'));
  $('supplierSearchAdd').addEventListener('input', e => { selectedSupplier = ''; $('selectedSupplierText').textContent = 'None selected yet'; renderMatchList('supplierMatches', e.target.value, allSupplierNames(), selectSupplier, 'supplier'); });
  $('productSearchForSupplier').addEventListener('input', e => { selectedProductForSupplier = ''; $('selectedProductForSupplierText').textContent = 'None selected yet'; renderMatchList('productMatchesForSupplier', e.target.value, allProducts(), selectProductForSupplier, 'product'); });
  $('productSearchAdd').addEventListener('input', e => { selectedProduct = ''; $('selectedProductText').textContent = 'None selected yet'; renderMatchList('productMatches', e.target.value, allProducts(), selectProduct, 'product'); });
  $('supplierSearchForProduct').addEventListener('input', e => { selectedSupplierForProduct = ''; $('selectedSupplierForProductText').textContent = 'None selected yet'; renderMatchList('supplierMatchesForProduct', e.target.value, allSupplierNames(), selectSupplierForProduct, 'supplier'); });
  $('saveSupplierProductBtn').addEventListener('click', saveSupplierProduct); $('saveProductSupplierBtn').addEventListener('click', saveProductSupplier); $('exportAddedBtn').addEventListener('click', exportAdded); $('clearAddedBtn').addEventListener('click', clearAdded);
}
bind(); refreshFilters(); render(); refreshAddMatches();
})();

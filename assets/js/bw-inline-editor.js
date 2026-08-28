(function(){
  const SAVE_DELAY = 550;
  const PRODUCT_SECTIONS = ['identification','application','brands','suppliers'];

  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function debounce(fn, ms){let t; return function(){clearTimeout(t); const args=arguments; t=setTimeout(()=>fn.apply(this,args),ms);};}
  function canEdit(){ return !!window.BWCanEdit || document.body.classList.contains('bw-can-edit'); }
  async function waitReady(){
    if(window.BWUser !== undefined) return;
    await new Promise(resolve=>{
      document.addEventListener('bw:user-ready', resolve, {once:true});
      setTimeout(resolve, 1500);
    });
  }
  async function saveKey(key, value){
    if(!window.BWContentStore) throw new Error('Content store unavailable');
    await window.BWContentStore.save(key, value);
  }
  async function loadFast(key, fallback, onUpdate){
    if(!window.BWContentStore) return fallback;
    return window.BWContentStore.getFast(key, fallback, onUpdate);
  }

  function injectStyles(){
    if(document.getElementById('bw-inline-editor-styles')) return;
    const st=document.createElement('style');
    st.id='bw-inline-editor-styles';
    st.textContent=`
      body.bw-can-edit .bw-inline-editable{outline:1px dashed rgba(198,40,40,.40);border-radius:10px;min-height:1.2em;padding:2px 4px;}
      body.bw-can-edit .bw-inline-editable:focus{outline:2px solid rgba(198,40,40,.80);background:rgba(198,40,40,.08);}
      .bw-inline-controls{display:none;gap:8px;flex-wrap:wrap;margin:12px 0 0;align-items:center;}
      body.bw-can-edit .bw-inline-controls{display:flex;}
      .bw-inline-add,.bw-inline-save,.bw-inline-reset,.bw-inline-delete{border:1px solid rgba(198,40,40,.48);background:rgba(198,40,40,.18);color:#fff;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;cursor:pointer;}
      .bw-inline-delete,.bw-x{border-color:rgba(248,113,113,.58);background:rgba(127,29,29,.55);}
      .bw-inline-status{font-size:12px;color:rgba(255,255,255,.62);font-weight:700;}
      .bw-edit-row{position:relative;}
      body.bw-can-edit .bw-edit-row{padding-right:34px;}
      .bw-x{display:none;position:absolute;right:4px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:999px;color:#fff;font-weight:900;line-height:20px;align-items:center;justify-content:center;cursor:pointer;z-index:5;}
      body.bw-can-edit .bw-edit-row:hover>.bw-x{display:flex;}
      .brandPill.bw-edit-row{display:inline-flex;align-items:center;margin:4px;}
      .brandPill.bw-edit-row .bw-x{right:-10px;top:-6px;transform:none;}
      .product-editor-panel{display:none;margin:0 0 16px;padding:12px 14px;border-radius:16px;border:1px solid rgba(198,40,40,.34);background:rgba(198,40,40,.10);color:#fff;}
      body.bw-can-edit .product-editor-panel{display:block;}
      .product-editor-panel strong{display:block;margin-bottom:4px;}
    `;
    document.head.appendChild(st);
  }

  function addDeleteButton(el, callback){
    if(el.querySelector(':scope > .bw-x')) return;
    el.classList.add('bw-edit-row');
    const x=document.createElement('button');
    x.type='button'; x.className='bw-x'; x.textContent='×'; x.title='Delete item';
    x.addEventListener('click', (e)=>{e.preventDefault();e.stopPropagation(); if(confirm('Delete this item?')){ el.remove(); callback && callback(); }});
    el.appendChild(x);
  }

  async function initProductPage(){
    const layout=document.querySelector('.product-layout[data-product-slug]');
    if(!layout) return;
    injectStyles();
    await waitReady();
    const slug=layout.dataset.productSlug;
    const key='product-page::'+slug+'::editable-sections-v1';
    let data={};
    function getSectionCard(id){ const sec=document.getElementById(id); return sec ? sec.querySelector('.product-info-card') : null; }
    PRODUCT_SECTIONS.forEach(id=>{
      const card=getSectionCard(id);
      if(card) data[id]=card.innerHTML;
    });
    function apply(remote){
      if(!remote || typeof remote!=='object') return;
      PRODUCT_SECTIONS.forEach(id=>{ if(remote[id]!==undefined){ const card=getSectionCard(id); if(card) card.innerHTML=remote[id]; }});
      data=Object.assign({}, data, remote);
      setupEditableCards();
    }
    const quick=await loadFast(key, data, apply); apply(quick);

    const panel=document.createElement('section');
    panel.className='product-editor-panel';
    panel.innerHTML='<strong>Editor mode</strong><span>Identification, Application, Brands and Suppliers are editable in place. Click text to change it. Use add/delete controls inside each section. Changes save to Azure draft storage.</span>';
    layout.parentNode.insertBefore(panel, layout);

    const status=document.createElement('span'); status.className='bw-inline-status';
    const saveNow=debounce(async()=>{
      PRODUCT_SECTIONS.forEach(id=>{ const card=getSectionCard(id); if(card) data[id]=card.innerHTML; });
      status.textContent='Saving…';
      try{ await saveKey(key, data); status.textContent='Saved'; }
      catch(e){ status.textContent='Save failed: '+e.message; }
    }, SAVE_DELAY);

    function setupEditableCards(){
      PRODUCT_SECTIONS.forEach(id=>{
        const card=getSectionCard(id); if(!card) return;
        card.querySelectorAll('li,p,.brandPill').forEach(el=>{
          el.classList.add('bw-inline-editable'); el.setAttribute('contenteditable','true');
          el.addEventListener('input', saveNow);
          if(el.matches('li,.brandPill')) addDeleteButton(el, saveNow);
        });
        if(card.querySelector(':scope > .bw-inline-controls')) return;
        const controls=document.createElement('div'); controls.className='bw-inline-controls';
        const add=document.createElement('button'); add.type='button'; add.className='bw-inline-add'; add.textContent='Add entry';
        add.addEventListener('click',()=>{
          const grid=card.querySelector('.brandGrid');
          if(grid){ const sp=document.createElement('span'); sp.className='brandPill bw-inline-editable'; sp.setAttribute('contenteditable','true'); sp.textContent='New brand'; grid.appendChild(sp); sp.addEventListener('input', saveNow); addDeleteButton(sp, saveNow); sp.focus(); saveNow(); return; }
          let ul=card.querySelector('ul');
          if(!ul){ ul=document.createElement('ul'); card.insertBefore(ul, controls); }
          const li=document.createElement('li'); li.className='bw-inline-editable'; li.setAttribute('contenteditable','true'); li.textContent='New entry'; ul.appendChild(li); li.addEventListener('input', saveNow); addDeleteButton(li, saveNow); li.focus(); saveNow();
        });
        controls.appendChild(add); controls.appendChild(status.cloneNode(false)); card.appendChild(controls);
      });
    }
    setupEditableCards();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initProductPage);
  else initProductPage();
})();

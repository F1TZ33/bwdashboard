(function(){
  'use strict';

  const BW_STORE_OPTIONS = ['Bayswater','Cairns','Dandenong','Sunshine','Thomastown','Admin'];
  const BW_STORE_KEY = 'activeStoreTemplate';

  function getActiveStore(){
    try {
      const stored = localStorage.getItem(BW_STORE_KEY);
      if (stored && BW_STORE_OPTIONS.includes(stored)) return stored;
    } catch(e) {}
    return 'Bayswater';
  }

  function setActiveStore(name){
    const clean = BW_STORE_OPTIONS.includes(name) ? name : 'Bayswater';
    try { localStorage.setItem(BW_STORE_KEY, clean); } catch(e) {}
    document.querySelectorAll('.bw-store-label, #storeNamePill').forEach(el => { el.textContent = clean; });
    window.dispatchEvent(new CustomEvent('bw:store-changed', { detail: { store: clean } }));
    return clean;
  }

  function ensureStoreModal(){
    if (document.getElementById('bwStoreModalBack')) return;
    const back = document.createElement('div');
    back.id = 'bwStoreModalBack';
    back.className = 'modalBack bw-store-modal-back';
    back.style.display = 'none';
    back.innerHTML = `
      <div class="modal bw-store-modal" role="dialog" aria-modal="true" aria-labelledby="bwStoreModalTitle">
        <h3 id="bwStoreModalTitle">Change Store</h3>
        <p class="subtitle" style="margin-top:6px;">Select the active store for this browser. This is saved locally until a live backend is connected.</p>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;">
          <label for="bwStoreSelector" style="min-width:120px;"><strong>Store</strong></label>
          <select id="bwStoreSelector" style="min-width:280px;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:#0f1f36;color:#fff;"></select>
          <span id="bwStoreSelectorStatus" style="opacity:.75;"></span>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button class="btn" id="bwStoreModalClose" type="button">Close</button>
        </div>
      </div>`;
    document.body.appendChild(back);

    const select = back.querySelector('#bwStoreSelector');
    BW_STORE_OPTIONS.forEach(store => {
      const opt = document.createElement('option');
      opt.value = store;
      opt.textContent = store;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      const saved = setActiveStore(select.value);
      const status = document.getElementById('bwStoreSelectorStatus');
      if (status) status.textContent = 'Saved: ' + saved;
    });
    back.addEventListener('click', e => { if (e.target === back) back.style.display = 'none'; });
    back.querySelector('#bwStoreModalClose').addEventListener('click', () => { back.style.display = 'none'; });
  }

  function openStoreModal(){
    ensureStoreModal();
    const back = document.getElementById('bwStoreModalBack');
    const select = document.getElementById('bwStoreSelector');
    const status = document.getElementById('bwStoreSelectorStatus');
    if (select) select.value = getActiveStore();
    if (status) status.textContent = 'Saved automatically.';
    if (back) back.style.display = 'flex';
  }


  const script = document.currentScript;
  const scriptSrc = script ? script.getAttribute('src') || '' : '';
  const rootPrefix = scriptSrc.replace(/assets\/js\/bw-header\.js(?:\?.*)?$/, '');
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  const folder = path.split('/').slice(-2, -1)[0] || '';
  const isHome = file === 'index.html' && !/\/products\/|\/product-taxonomy\//.test(path);

  function homeHref(){ return rootPrefix + 'index.html'; }

  function pageHasProductLayout(){
    return !!document.querySelector('.product-layout, .angular-layout, [data-product-slug]');
  }

  function pageLooksLikeProductGuideItem(){
    const title = (document.title || '').toLowerCase();
    return file !== 'product-guide.html' && title.includes('bw product guide');
  }

  function backHref(){
    if (isHome) return homeHref();

    const bodyBack = document.body && document.body.getAttribute('data-back');
    if (bodyBack) return rootPrefix + bodyBack.replace(/^\.\//, '');

    if (folder === 'products') return rootPrefix + 'product-guide.html';
    if (folder === 'product-taxonomy') return rootPrefix + 'product-taxonomy.html';

    // New product-page system: all product detail pages use the same shell and return to Product Guide.
    if (
  file !== 'product-guide.html' &&
  (pageHasProductLayout() || pageLooksLikeProductGuideItem())
){
  return rootPrefix + 'product-guide.html';
}

    const parentMap = {
      // Secondary pages
      'product-guide.html': 'index.html',
      'resources.html': 'index.html',
      'sops.html': 'index.html',
      'sales.html': 'index.html',
      'faqs.html': 'index.html',
      'photos.html': 'index.html',
      'admin.html': 'index.html',
      'settings.html': 'index.html',

      // Resources children
      'product-taxonomy.html': 'resources.html',
      'rack-builder.html': 'resources.html',
      'rack-builder-individual.html': 'rack-builder.html',
      'rack-builder-individual-cascade-test.html': 'rack-builder.html',
      'rack-builder-individual-cascade-test-pdf-portrait-bins.html': 'rack-builder.html',
      'rack-builder-individual-tray-bin-test.html': 'rack-builder.html',
      'rack-builder-individual-tray-bin-test-updated.html': 'rack-builder.html',
      'cabinet-builder.html': 'rack-builder.html',
      'cabinet-builder-section-designer.html': 'rack-builder.html',
      'cabinet-builder-section-designer-print.html': 'rack-builder.html',
      'warehouse-map.html': 'rack-builder.html',
      'rack-builder 2.html': 'resources.html',
      'order.html': 'resources.html',
      'crm1.html': 'resources.html',
      'account-applications.html': 'resources.html',
      'supplier-directory.html': 'resources.html',
      'resources-accounts.html': 'resources.html',
      'resources-calculators.html': 'resources.html',
      'resources-core.html': 'resources.html',
      'resources-templates.html': 'resources.html',
      'resources-tools.html': 'resources.html',
      's-punch-x-ref.html': 'resources-tools.html',

      // SOP children
      'sop-sales.html': 'sops.html',
      'sop-purchasing.html': 'sops.html',
      'sop-inventory.html': 'sops.html',
      'sop-reports.html': 'sops.html',
      'sop-safety.html': 'sops.html',
      'sop-accounts.html': 'sops.html',

      // Product taxonomy children
      'product-taxonomy-category.html': 'product-taxonomy.html'
    };
    return rootPrefix + (parentMap[file] || 'index.html');
  }

  function mailHref(){
    const subject = encodeURIComponent('Suggested edit');
    const body = encodeURIComponent(window.location.href + '\n\nSuggested edit:\n');
    return 'mailto:sales@bearingwholesalers.com.au?subject=' + subject + '&body=' + body;
  }

  function buildHeader(){
    const mount = document.getElementById('bw-global-header');
    if (!mount) return;

    mount.innerHTML = '';
    const header = document.createElement('header');
    header.className = 'bw-site-header';

    const navButtons = isHome ? '' : `
      <a class="btn bw-nav-btn" id="bwBackBtn" href="${backHref()}">← Back</a>
      <a class="btn bw-nav-btn" id="bwHomeBtn" href="${homeHref()}">⌂ Home</a>`;

    header.innerHTML = `
      <div class="bw-header-inner">
        <a class="bw-header-logo logoBanner" href="${homeHref()}" aria-label="Home">
          <img alt="Bearing Wholesalers" class="siteLogo" src="${rootPrefix}assets/img/logo-cropped-white.png" />
        </a>
        <nav class="bw-header-nav" aria-label="Page navigation">
          ${navButtons}
          <span class="bw-store-label">${getActiveStore()}</span>
          <button class="btn bw-extra-btn" id="bwChangeStoreBtn" type="button">Change Store</button>
          <a class="btn bw-extra-btn" id="bwSuggestEditBtn" href="${mailHref()}">Suggest Edit</a>
        </nav>
      </div>`;

    mount.appendChild(header);


    // Universal footer signature, injected by the shared header so it appears on every dashboard page.
    if (!document.getElementById('bwUniversalFooterSignatureStyle')) {
      const sigStyle = document.createElement('style');
      sigStyle.id = 'bwUniversalFooterSignatureStyle';
      sigStyle.textContent = `
        body{min-height:100vh;display:flex;flex-direction:column;}
        .container,.wrap{flex:1 0 auto;}
        .siteSignature{
          flex-shrink:0;
          width:100%;
          text-align:center;
          font-size:11px;
          letter-spacing:.08em;
          color:rgba(255,255,255,.22);
          padding:18px 10px 12px;
          margin-top:auto;
          user-select:none;
          pointer-events:none;
          text-transform:uppercase;
          font-weight:600;
        }
        .siteSignature::after{content:'Designed and built by H. Fitzgerald';}
        @media print{
          .siteSignature{
            position:fixed;
            bottom:4mm;
            right:6mm;
            width:auto;
            font-size:6px;
            color:rgba(0,0,0,.30) !important;
            padding:0;
            margin:0;
            text-align:right;
          }
        }
      `;
      document.head.appendChild(sigStyle);
    }
    if (!document.querySelector('.siteSignature')) {
      const sig = document.createElement('footer');
      sig.className = 'siteSignature';
      sig.setAttribute('aria-label', 'Designed and built by H. Fitzgerald');
      sig.dataset.buildCredit = 'H. Fitzgerald';
      document.body.appendChild(sig);
    }

    const extras = document.querySelector('.bw-page-actions');
    const right = header.querySelector('.bw-header-nav');
    if (extras && right) {
      Array.from(extras.children).forEach(node => {
        const label = (node.textContent || '').trim().toLowerCase();
        const action = (node.getAttribute('data-action') || '').toLowerCase();
        if (label === 'dev notes' || label === 'admin' || action === 'devnote' || action === 'admin') return;
        node.classList.add('bw-extra-btn');
        right.appendChild(node);
      });
      extras.remove();
    }

    setActiveStore(getActiveStore());
    ensureStoreModal();

    const change = document.getElementById('bwChangeStoreBtn');
    if (change) {
      change.addEventListener('click', function(){
        window.BW_CHANGE_STORE_HANDLED = true;
        window.dispatchEvent(new CustomEvent('bw:change-store'));
        openStoreModal();
      });
    }

    window.addEventListener('storage', function(event){
      if (event.key === BW_STORE_KEY) setActiveStore(getActiveStore());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }
})();

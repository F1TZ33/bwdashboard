(function(){
  'use strict';

  const script = document.currentScript;
  const scriptSrc = script ? script.getAttribute('src') || '' : '';
  const rootPrefix = scriptSrc.replace(/assets\/js\/bw-header\.js(?:\?.*)?$/, '');
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  const folder = path.split('/').slice(-2, -1)[0] || '';
  const isHome = file === 'index.html' && !/\/products\/|\/product-taxonomy\//.test(path);

  function homeHref(){ return rootPrefix + 'index.html'; }

  function backHref(){
    if (isHome) return homeHref();
    if (folder === 'products') return rootPrefix + 'product-guide.html';
    if (folder === 'product-taxonomy') return rootPrefix + 'product-taxonomy.html';

    const parentMap = {
      'product-guide.html': 'index.html',
      'product-taxonomy.html': 'index.html',
      'rack-builder.html': 'index.html',
      'order.html': 'index.html',
      'sops.html': 'index.html',
      'resources.html': 'index.html',
      'sales.html': 'index.html',
      'faqs.html': 'index.html',
      'photos.html': 'index.html',
      'admin.html': 'index.html',
      'settings.html': 'index.html',
      'crm1.html': 'resources.html',
      'account-applications.html': 'resources.html',
      'supplier-directory.html': 'resources.html',
      'resources-accounts.html': 'resources.html',
      'resources-calculators.html': 'resources.html',
      'resources-core.html': 'resources.html',
      'resources-templates.html': 'resources.html',
      'sop-sales.html': 'sops.html',
      'sop-purchasing.html': 'sops.html',
      'sop-inventory.html': 'sops.html',
      'sop-reports.html': 'sops.html',
      'sop-safety.html': 'sops.html',
      'sop-accounts.html': 'sops.html',
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
        <a class="bw-header-logo" href="${homeHref()}" aria-label="Home">
          <img alt="Bearing Wholesalers" class="siteLogo" src="${rootPrefix}assets/img/logo.png" />
        </a>
        <nav class="bw-header-nav" aria-label="Page navigation">
          ${navButtons}
          <span class="bw-store-label">Bayswater</span>
          <button class="btn bw-extra-btn" id="bwChangeStoreBtn" type="button">Change Store</button>
          <a class="btn bw-extra-btn" id="bwSuggestEditBtn" href="${mailHref()}">Suggest Edit</a>
        </nav>
      </div>`;

    mount.appendChild(header);

    const extras = document.querySelector('.bw-page-actions');
    const nav = header.querySelector('.bw-header-nav');
    if (extras && nav) {
      Array.from(extras.children).forEach(node => {
        const text = (node.textContent || '').trim().toLowerCase();
        if (text === 'dev notes' || text === 'admin') return;
        node.classList.add('bw-extra-btn');
        nav.appendChild(node);
      });
      extras.remove();
    }

    const change = document.getElementById('bwChangeStoreBtn');
    if (change) {
      change.addEventListener('click', function(){
        window.dispatchEvent(new CustomEvent('bw:change-store'));
        if (!window.BW_CHANGE_STORE_HANDLED) {
          alert('Store selection is not connected yet. Current store: Bayswater');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }
})();

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

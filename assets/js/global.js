(function(){
  const EDIT_ROLES = ['admin','editor'];
  const VIEW_ROLES = ['viewer','editor','admin','authenticated'];
  const AUTH_CACHE_KEY = 'bwAuthPrincipalCache';

  function injectGlobalStyles(){
    if(document.getElementById('bw-global-js-styles')) return;
    const style=document.createElement('style');
    style.id='bw-global-js-styles';
    style.textContent=`
      #userIndicator{ text-align:center;font-size:12px;opacity:.72;margin:6px auto 0;color:rgba(255,255,255,.72);font-weight:600;letter-spacing:.02em; }
      .bw-editor-panel{ display:none; margin:14px 0; padding:14px; border-radius:18px; border:1px solid rgba(198,40,40,.34); background:rgba(198,40,40,.10); box-shadow:0 12px 30px rgba(0,0,0,.18); }
      body.bw-can-edit .bw-editor-panel{ display:block; }
      .bw-editor-panel h3{ margin:0 0 10px; font-size:15px; }
      .bw-editor-actions{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
      .bw-edit-btn{ border:1px solid rgba(198,40,40,.48); background:rgba(198,40,40,.18); color:#fff; border-radius:999px; padding:8px 12px; font-size:12px; font-weight:900; cursor:pointer; }
      .bw-edit-btn:hover{ background:rgba(198,40,40,.28); }
      .bw-edit-btn.danger{ border-color:rgba(248,113,113,.58); background:rgba(127,29,29,.38); }
      .bw-edit-field{ width:100%; box-sizing:border-box; margin:6px 0 10px; padding:10px 12px; border-radius:12px; border:1px solid rgba(255,255,255,.15); background:rgba(0,0,0,.25); color:#fff; font:inherit; }
      textarea.bw-edit-field{ min-height:130px; resize:vertical; }
      .bw-edit-note{ color:rgba(255,255,255,.65); font-size:12px; margin:8px 0 0; line-height:1.45; }
    `;
    document.head.appendChild(style);
  }

  function applyPrincipal(principal, source){
    const indicator=document.getElementById('userIndicator');
    if(indicator){
      if(principal){ indicator.textContent='Logged in as: '+(principal.userDetails||principal.userId||'Unknown user'); }
      else{ indicator.textContent= source === 'cache' ? 'Checking login...' : 'Not logged in'; }
    }
    const roles=(principal && principal.userRoles) ? principal.userRoles : [];
    const canEdit=roles.some(r=>EDIT_ROLES.includes(String(r).toLowerCase()));
    const canView=roles.some(r=>VIEW_ROLES.includes(String(r).toLowerCase()));
    document.body.classList.toggle('bw-can-edit', !!canEdit);
    window.BWUser=principal;
    window.BWCanEdit=canEdit;
    window.BWCanView=canView;
    document.dispatchEvent(new CustomEvent('bw:user-ready',{detail:{user:principal,canEdit,canView,roles,source}}));
  }

  function readCachedPrincipal(){
    try{
      const raw=sessionStorage.getItem(AUTH_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }

  async function loadUser(){
    injectGlobalStyles();

    const cached=readCachedPrincipal();
    if(cached){ applyPrincipal(cached, 'cache'); }
    else{ applyPrincipal(null, 'initial'); }

    try{
      const res=await fetch('/.auth/me',{cache:'no-store'});
      const data=await res.json();
      const principal=data.clientPrincipal||null;
      try{
        if(principal) sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(principal));
        else sessionStorage.removeItem(AUTH_CACHE_KEY);
      }catch(e){}
      applyPrincipal(principal, 'remote');
    }catch(e){
      if(!cached) applyPrincipal(null, 'error');
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadUser);
  else loadUser();
})();

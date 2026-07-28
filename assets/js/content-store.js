(function(){
  const API = '/api/content';
  const WRITE_ROLES = ['editor','admin'];

  function localKey(key){ return 'bwRemoteCache::' + key; }
  function userRoles(){ return (window.BWUser && window.BWUser.userRoles ? window.BWUser.userRoles : []).map(r => String(r).toLowerCase()); }
  function canWrite(){ const roles=userRoles(); return roles.includes('admin') || roles.includes('editor'); }

  function readCached(key){
    try{
      const cached = localStorage.getItem(localKey(key));
      return cached ? JSON.parse(cached) : undefined;
    }catch(e){ return undefined; }
  }

  function writeCached(key, value){
    try{ localStorage.setItem(localKey(key), JSON.stringify(value)); }catch(e){}
  }

  async function refresh(key, fallbackValue){
    try{
      const res = await fetch(API + '?key=' + encodeURIComponent(key), { cache:'no-store' });
      if(res.ok){
        const data = await res.json();
        if(data && data.value !== null && data.value !== undefined){
          writeCached(key, data.value);
          document.dispatchEvent(new CustomEvent('bw:content-updated', { detail:{ key, value:data.value } }));
          return data.value;
        }
      }
    }catch(e){}
    const cached = readCached(key);
    return cached !== undefined ? cached : fallbackValue;
  }

  async function get(key, fallbackValue){
    const cached = readCached(key);
    if(cached !== undefined){
      // Return instantly from cache, then quietly refresh for next render.
      refresh(key, fallbackValue).catch(()=>{});
      return cached;
    }
    return await refresh(key, fallbackValue);
  }

  function getFast(key, fallbackValue, onUpdate){
    const cached = readCached(key);
    const immediate = cached !== undefined ? cached : fallbackValue;
    refresh(key, fallbackValue).then(remote => {
      if(remote !== undefined && typeof onUpdate === 'function'){
        try{
          if(JSON.stringify(remote) !== JSON.stringify(immediate)) onUpdate(remote);
        }catch(e){ onUpdate(remote); }
      }
    }).catch(()=>{});
    return immediate;
  }

  async function save(key, value){
    writeCached(key, value);
    const res = await fetch(API, {
      method:'POST',
      headers:{ 'content-type':'application/json' },
      body: JSON.stringify({ key, value })
    });
    if(!res.ok){
      let detail='';
      try{ const payload=await res.json(); detail=payload.detail || payload.error || ''; }catch(e){}
      throw new Error(detail || ('Save failed: ' + res.status));
    }
    return await res.json();
  }

  async function remove(key){
    try{ localStorage.removeItem(localKey(key)); }catch(e){}
    const res = await fetch(API + '?key=' + encodeURIComponent(key), { method:'DELETE' });
    if(!res.ok){
      let detail='';
      try{ const payload=await res.json(); detail=payload.detail || payload.error || ''; }catch(e){}
      throw new Error(detail || ('Delete failed: ' + res.status));
    }
    return await res.json();
  }

  async function waitForUser(){
    if(window.BWUser !== undefined) return { user: window.BWUser, canEdit: window.BWCanEdit };
    return new Promise(resolve => {
      document.addEventListener('bw:user-ready', e => resolve(e.detail || {}), { once:true });
      setTimeout(() => resolve({ user: window.BWUser || null, canEdit: !!window.BWCanEdit }), 1200);
    });
  }

  window.BWContentStore = { get, getFast, refresh, save, remove, waitForUser, canWrite, WRITE_ROLES };
})();

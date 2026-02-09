const BW_KEYS={settings:'bwproguide.settings',editorMode:'bwproguide.editorMode',adminAuthed:'bwproguide.adminAuthed'};
// ===== Repo-root helper (GitHub Pages safe) =====
(function(){
  if(window.__bwRepoBase) return;
  window.__bwRepoBase = function(){
    var parts = (location.pathname || "/").split("/").filter(Boolean);
    // remove filename if present
    if(parts.length && parts[parts.length-1].indexOf(".") !== -1) parts.pop();
    // first segment is repo name on GitHub Pages: /<repo>/...
    return "/" + (parts[0] || "") + "/";
  };
})();
function nowISO(){const d=new Date();const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;}
function loadSettings(){const defaults={toEmail:'sales@bearingwholesalers.com.au',subjectTag:'[bwproguide-edit]',version:'v3',lastUpdated:'',adminPassword:'Bearing1!'};
try{const raw=localStorage.getItem(BW_KEYS.settings);const parsed=raw?JSON.parse(raw):{};return {...defaults,...parsed};}catch(e){return defaults;}}
function saveSettings(s){localStorage.setItem(BW_KEYS.settings,JSON.stringify(s));}
function setEditorMode(on){localStorage.setItem(BW_KEYS.editorMode,on?'1':'0');document.documentElement.dataset.editorMode=on?'1':'0';
document.querySelectorAll('[data-editor-only="1"]').forEach(el=>{el.style.display=on?'':'none';});}
function getEditorMode(){return localStorage.getItem(BW_KEYS.editorMode)==='1';}
function isAdminAuthed(){return sessionStorage.getItem(BW_KEYS.adminAuthed)==='1';}
function setAdminAuthed(v){sessionStorage.setItem(BW_KEYS.adminAuthed,v?'1':'0');}
function openModal(id){const b=document.getElementById(id);if(b)b.style.display='flex';}
function closeModal(id){const b=document.getElementById(id);if(b)b.style.display='none';}
function pageMeta(){const s=loadSettings();return{href:window.location.pathname.split('/').slice(-2).join('/'),title:document.title||'',version:s.version,lastUpdated:s.lastUpdated||''};}
function buildMailto(subject,body,to){const e=encodeURIComponent;return `mailto:${e(to)}?subject=${e(subject)}&body=${e(body)}`;}
function openSuggestEdit(){const m=pageMeta();document.getElementById('se_page').value=m.title;document.getElementById('se_path').value=m.href;document.getElementById('se_time').value=nowISO();
const isEd=getEditorMode();document.querySelectorAll('[data-editor-field="1"]').forEach(el=>{el.style.display=isEd?'':'none';});openModal('suggestModal');}
function sendSuggestion(){const s=loadSettings();const name=(document.getElementById('se_name').value||'').trim();const sugg=(document.getElementById('se_suggestion').value||'').trim();
const urg=(document.getElementById('se_urgency').value||'').trim();const page=document.getElementById('se_page').value;const path=document.getElementById('se_path').value;const time=document.getElementById('se_time').value;
if(!name||!sugg){alert('Please enter your name and your suggestion.');return;}
const section=(document.getElementById('se_section')?.value||'').trim();const repl=(document.getElementById('se_replacement')?.value||'').trim();const reason=(document.getElementById('se_reason')?.value||'').trim();
const subject=`${s.subjectTag} [${s.version}] [${path}] [${time}]`;
let body='';body+=`Manual version: ${s.version}\n`;if(s.lastUpdated)body+=`Last updated: ${s.lastUpdated}\n`;body+=`Page: ${page}\n`;body+=`Path: ${path}\n`;body+=`Submitted: ${time}\n`;body+=`Contributor: ${name}\n`;if(urg)body+=`Urgency: ${urg}\n`;body+=`\nSuggestion:\n${sugg}\n`;
if(getEditorMode()){if(section)body+=`\nSection / location:\n${section}\n`;if(repl)body+=`\nProposed replacement:\n${repl}\n`;if(reason)body+=`\nReason / context:\n${reason}\n`;}
window.location.href=buildMailto(subject,body,s.toEmail);closeModal('suggestModal');}
function openDevNote(){const m=pageMeta();const key=`bwproguide.devnote.${m.href}`;const ex=localStorage.getItem(key)||'';document.getElementById('dn_path').value=m.href;document.getElementById('dn_note').value=ex;openModal('devNoteModal');}
function saveDevNote(){const path=document.getElementById('dn_path').value;const note=document.getElementById('dn_note').value||'';localStorage.setItem(`bwproguide.devnote.${path}`,note);closeModal('devNoteModal');}
function openAdmin(){if(isAdminAuthed()){window.location.href='admin.html';return;}const s=loadSettings();const pw=prompt('Admin password:');if(pw===null)return;
if(pw===s.adminPassword){setAdminAuthed(true);window.location.href='admin.html';}else alert('Incorrect password.');}
function adminInit(){const s=loadSettings();if(!isAdminAuthed()){const pw=prompt('Admin password:');if(pw===null){window.location.href='index.html';return;}
if(pw!==s.adminPassword){alert('Incorrect password.');window.location.href='index.html';return;}setAdminAuthed(true);}
document.getElementById('ad_to').value=s.toEmail;document.getElementById('ad_tag').value=s.subjectTag;document.getElementById('ad_version').value=s.version;document.getElementById('ad_last').value=s.lastUpdated;
document.getElementById('ad_pw').value=s.adminPassword;document.getElementById('ad_editor').checked=getEditorMode();
document.getElementById('ad_save').addEventListener('click',()=>{const next={toEmail:(document.getElementById('ad_to').value||'').trim()||s.toEmail,subjectTag:(document.getElementById('ad_tag').value||'').trim()||s.subjectTag,
version:(document.getElementById('ad_version').value||'').trim()||s.version,lastUpdated:(document.getElementById('ad_last').value||'').trim(),adminPassword:(document.getElementById('ad_pw').value||'').trim()||s.adminPassword};
saveSettings(next);setEditorMode(document.getElementById('ad_editor').checked);alert('Saved.');});
document.getElementById('ad_editor').addEventListener('change',e=>setEditorMode(e.target.checked));
document.getElementById('ad_logout').addEventListener('click',()=>{setAdminAuthed(false);alert('Logged out (this session).');});}
async function loadIndex(){const res=await fetch('assets/js/search_index.json');return await res.json();}
function norm(s){return (s||'').toLowerCase();}
function renderResults(results){const box=document.getElementById('searchResults');if(!box)return;box.innerHTML='';
if(results.length===0){box.innerHTML='<div class="subtitle">No matches.</div>';return;}
const wrap=document.createElement('div');wrap.className='cards';results.slice(0,24).forEach(r=>{const a=document.createElement('a');a.href=r.href;a.className='card';
a.innerHTML=`<div class="pill" style="display:inline-block;font-size:12px;padding:6px 10px;margin-bottom:10px">${r.section}</div><div style="font-weight:900;margin-bottom:6px">${r.title}</div><div class="subtitle" style="margin:0">${r.snippet}</div>`;wrap.appendChild(a);});box.appendChild(wrap);}
async function setupSearch(){const input=document.getElementById('q');if(!input)return;const idx=await loadIndex();input.addEventListener('input',()=>{const q=norm(input.value).trim();if(q.length<2){renderResults([]);return;}
const hits=idx.filter(p=>norm(p.text).includes(q)||norm(p.title).includes(q));const results=hits.map(h=>({...h,snippet:h.text.slice(0,140)+'…'}));renderResults(results);});}
function globalInit(){setEditorMode(getEditorMode());
document.querySelectorAll('[data-action="suggest"]').forEach(b=>b.addEventListener('click',openSuggestEdit));
document.querySelectorAll('[data-action="devnote"]').forEach(b=>b.addEventListener('click',openDevNote));
document.querySelectorAll('[data-action="admin"]').forEach(b=>b.addEventListener('click',openAdmin));
const sendBtn=document.getElementById('se_send');if(sendBtn)sendBtn.addEventListener('click',sendSuggestion);
const dnSave=document.getElementById('dn_save');if(dnSave)dnSave.addEventListener('click',saveDevNote);
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
}
document.addEventListener('DOMContentLoaded',()=>{globalInit();setupSearch();if(document.body.dataset.page==='admin')adminInit();});


/* ===== BW Product Guide v11: Admin session + Editor Mode + Local Overrides ===== */
(function(){
  const SETTINGS_KEY = 'bwproguide.settings';
  const OVERRIDES_KEY = 'bwproguide.overrides';
  const ADMIN_SESSION_KEY = 'bwproguide.adminSession';

  function safeParse(s, fallback){
    try{ return JSON.parse(s); }catch(e){ return fallback; }
  }
  function getSettings(){
    return safeParse(localStorage.getItem(SETTINGS_KEY)||'{}', {});
  }
  function setSettings(next){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }
  function getOverrides(){
    return safeParse(localStorage.getItem(OVERRIDES_KEY)||'{}', {});
  }
  function setOverrides(next){
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
  }
  function isAdmin(){
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  }
  function setAdmin(on){
    if(on) sessionStorage.setItem(ADMIN_SESSION_KEY,'1');
    else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }

  function pathKey(){
    // For local file use, pathname is stable enough
    return (location.pathname || '').replace(/\\/g,'/');
  }

  function editableElements(){
    // Only text-y elements inside the main container; exclude nav/buttons/modals
    const container = document.querySelector('.container');
    if(!container) return [];
    const selector = 'h1,h2,h3,p,li,.productTitle,.subtitle';
    const els = Array.from(container.querySelectorAll(selector));
    return els.filter(el => {
      if(el.closest('#suggestModal') || el.closest('#devNoteModal') || el.closest('.topbar')) return false;
      if(el.classList.contains('brand') || el.classList.contains('meta')) return false;
      // exclude link/button labels
      if(el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button')) return false;
      return true;
    });
  }

  function ensureEids(){
    // Deterministic ID assignment by DOM order on each page
    const pk = pathKey();
    const els = editableElements();
    els.forEach((el, idx) => {
      if(!el.dataset.eid){
        el.dataset.eid = `${pk}::${idx}`;
      }
    });
  }

  function applyOverrides(){
    ensureEids();
    const overrides = getOverrides();
    editableElements().forEach(el => {
      const key = el.dataset.eid;
      if(key && overrides[key] != null){
        // Preserve line breaks in paragraphs via innerText
        el.innerText = overrides[key];
      }
    });
  }

  function setEditorMode(on){
    ensureEids();
    const els = editableElements();
    els.forEach(el => {
      el.contentEditable = on ? 'true' : 'false';
      if(on){
        el.style.outline = '1px dashed rgba(124,58,237,.55)';
        el.style.outlineOffset = '3px';
      }else{
        el.style.outline = '';
        el.style.outlineOffset = '';
      }
    });

    if(on){
      // Save overrides on blur
      els.forEach(el => {
        el.addEventListener('blur', () => {
          const key = el.dataset.eid;
          if(!key) return;
          const overrides = getOverrides();
          overrides[key] = el.innerText;
          setOverrides(overrides);
          updateAdminCounts();
        });
      });
    }
  }

  function updateAdminCounts(){
    const el = document.querySelector('[data-admin="editCount"]');
    const el2 = document.querySelector('[data-admin="lastEdit"]');
    const overrides = getOverrides();
    const count = Object.keys(overrides).length;
    if(el) el.textContent = String(count);
    if(el2){
      // best-effort: store timestamp in settings on any change
      const s = getSettings();
      const t = s._lastEdit || '';
      el2.textContent = t || '—';
    }
  }

  function noteEditTimestamp(){
    const s = getSettings();
    s._lastEdit = new Date().toISOString();
    setSettings(s);
  }

  function exportOverrides(){
    const s = getSettings();
    const payload = {
      schema: "bwproguide-overrides-v1",
      exportedAt: new Date().toISOString(),
      baseVersion: s.version || "",
      lastUpdated: s.lastUpdated || "",
      overrides: getOverrides()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    const safeVer = (s.version || 'v').replace(/[^a-z0-9\-_\.]/gi,'');
    a.download = `bwproguide-overrides-${safeVer || 'v'}.json`;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function clearOverrides(){
    localStorage.removeItem(OVERRIDES_KEY);
    applyOverrides(); // resets to original DOM text
    updateAdminCounts();
  }

  function openModal(id){
    const m = document.getElementById(id);
    if(m) m.style.display = 'flex';
  }
  function closeModal(id){
    const m = document.getElementById(id);
    if(m) m.style.display = 'none';
  }

  // Wire buttons (suggest/admin/devnote) without breaking existing v5 handlers
  document.addEventListener('click', (e) => {
    const t = e.target;
    if(!(t instanceof Element)) return;

    // Generic modal open/close helpers
    const openId = t.getAttribute('data-open');
    if(openId){ openModal(openId); return; }
    const closeId = t.getAttribute('data-close');
    if(closeId){ closeModal(closeId); return; }

    // Admin button: go to admin page
    if(t.matches('[data-action="admin"]')){
      // keep relative navigation: always from current folder
      const up = location.pathname.includes('/products/') || location.pathname.includes('/sales/') ? '../admin.html' : 'admin.html';
      location.href = up;
      return;
    }
  });

  // Admin page logic
  function initAdminPage(){
    const isAdminPage = document.body && document.body.getAttribute('data-page') === 'admin';
    if(!isAdminPage) return;

    const s = getSettings();
    const to = document.getElementById('ad_to');
    const tag = document.getElementById('ad_tag');
    const ver = document.getElementById('ad_version');
    const last = document.getElementById('ad_last');
    const pw = document.getElementById('ad_pw');
    const editor = document.getElementById('ad_editor');
    const save = document.getElementById('ad_save');
    const logout = document.getElementById('ad_logout');
    const exportBtn = document.getElementById('ad_export');
    const clearBtn = document.getElementById('ad_clear');

    if(to) to.value = s.toEmail || 'sales@bearingwholesalers.com.au';
    if(tag) tag.value = s.subjectTag || '[bwproguide-edit]';
    if(ver) ver.value = s.version || 'v1';
    if(last) last.value = s.lastUpdated || '';
    if(editor) editor.checked = !!s.editorMode;

    function requireAdminOrShow(){
      const gate = document.getElementById('adminGate');
      const panel = document.getElementById('adminPanel');
      if(isAdmin()){
        if(gate) gate.style.display = 'none';
        if(panel) panel.style.display = 'block';
      }else{
        if(gate) gate.style.display = 'block';
        if(panel) panel.style.display = 'none';
      }
    }

    const loginBtn = document.getElementById('ad_login');
    if(loginBtn){
      loginBtn.addEventListener('click', () => {
        const entered = (pw && pw.value) ? pw.value : '';
        if(entered === 'Bearing1!'){
          setAdmin(true);
          requireAdminOrShow();
          // Clear password field
          if(pw) pw.value = '';
          updateAdminCounts();
        }else{
          alert('Incorrect password.');
        }
      });
    }

    if(save){
      save.addEventListener('click', () => {
        if(!isAdmin()){ alert('Please log in first.'); return; }
        const next = getSettings();
        if(to) next.toEmail = to.value.trim() || 'sales@bearingwholesalers.com.au';
        if(tag) next.subjectTag = tag.value.trim() || '[bwproguide-edit]';
        if(ver) next.version = ver.value.trim() || 'v1';
        if(last) next.lastUpdated = last.value.trim() || '';
        if(editor) next.editorMode = !!editor.checked;
        setSettings(next);
        noteEditTimestamp();
        alert('Saved.');
      });
    }

    if(logout){
      logout.addEventListener('click', () => {
        setAdmin(false);
        requireAdminOrShow();
      });
    }

    if(exportBtn){
      exportBtn.addEventListener('click', () => {
        if(!isAdmin()){ alert('Please log in first.'); return; }
        exportOverrides();
      });
    }
    if(clearBtn){
      clearBtn.addEventListener('click', () => {
        if(!isAdmin()){ alert('Please log in first.'); return; }
        if(confirm('Clear all local text edits on this computer/browser?')) clearOverrides();
      });
    }

    requireAdminOrShow();
    updateAdminCounts();
  }

  // Suggest edit: extend existing form by reading settings + current page info
  function initSuggestEdit(){
    const modal = document.getElementById('suggestModal');
    const send = document.getElementById('se_send');
    if(!modal || !send) return;

    function showEditorFields(on){
      document.querySelectorAll('[data-editor-field="1"]').forEach(el => {
        el.style.display = on ? 'block' : 'none';
      });
      document.querySelectorAll('[data-editor-only="1"]').forEach(el => {
        el.style.display = on ? 'inline-flex' : 'none';
      });
    }

    // Apply admin/editor mode visibility
    const s = getSettings();
    showEditorFields(!!s.editorMode && isAdmin());

    // When Suggest Edit button clicked, fill hidden fields
    document.addEventListener('click', (e) => {
      const t = e.target;
      if(!(t instanceof Element)) return;
      if(t.matches('[data-action="suggest"]')){
        const page = document.title || '';
        const path = pathKey();
        const time = new Date().toISOString();
        const se_page = document.getElementById('se_page');
        const se_path = document.getElementById('se_path');
        const se_time = document.getElementById('se_time');
        if(se_page) se_page.value = page;
        if(se_path) se_path.value = path;
        if(se_time) se_time.value = time;

        // Recompute editor field visibility on open
        const s2 = getSettings();
        showEditorFields(!!s2.editorMode && isAdmin());

        modal.style.display = 'flex';
      }
    });

    // Close modal if background clicked
    modal.addEventListener('click', (e) => {
      if(e.target === modal) modal.style.display = 'none';
    });

    send.addEventListener('click', () => {
      const s = getSettings();
      const to = s.toEmail || 'sales@bearingwholesalers.com.au';
      const tag = s.subjectTag || '[bwproguide-edit]';
      const version = s.version || 'v1';

      const name = (document.getElementById('se_name')||{}).value || '';
      const urgency = (document.getElementById('se_urgency')||{}).value || '';
      const suggestion = (document.getElementById('se_suggestion')||{}).value || '';
      const section = (document.getElementById('se_section')||{}).value || '';
      const replacement = (document.getElementById('se_replacement')||{}).value || '';
      const reason = (document.getElementById('se_reason')||{}).value || '';
      const page = (document.getElementById('se_page')||{}).value || '';
      const path = (document.getElementById('se_path')||{}).value || '';
      const time = (document.getElementById('se_time')||{}).value || '';

      if(!name.trim() || !suggestion.trim()){
        alert('Please enter your name and a suggestion.');
        return;
      }

      const subject = `${tag} ${version}`;
      const lines = [
        `Name: ${name}`,
        urgency ? `Urgency: ${urgency}` : ``,
        `Page: ${page}`,
        `Path: ${path}`,
        `Time: ${time}`,
        ``,
        `Suggestion:`,
        suggestion,
      ].filter(Boolean);

      if(section.trim()) lines.push('', `Section/location:`, section);
      if(replacement.trim()) lines.push('', `Proposed replacement wording:`, replacement);
      if(reason.trim()) lines.push('', `Reason/context:`, reason);

      const body = encodeURIComponent(lines.join('\n'));
      const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = href;
      modal.style.display = 'none';
    });
  }

  function initEditorMode(){
    // Only enable on non-admin pages when admin session is active and editorMode is on
    const s = getSettings();
    if(isAdmin() && s.editorMode){
      applyOverrides();
      setEditorMode(true);
      // Show devnote buttons
      document.querySelectorAll('[data-editor-only="1"]').forEach(el=>el.style.display='inline-flex');
      // Update timestamp whenever blur saves (noteEditTimestamp)
      document.addEventListener('blur', (e) => {
        const t = e.target;
        if(t && t.dataset && t.dataset.eid){
          noteEditTimestamp();
        }
      }, true);
    }else{
      applyOverrides();
      setEditorMode(false);
    }
  }

  // Dev notes modal (already present) - keep v5 behavior if exists, otherwise basic localStorage
  function initDevNotes(){
    const btns = document.querySelectorAll('[data-action="devnote"]');
    const modal = document.getElementById('devNoteModal');
    if(!btns.length || !modal) return;
    const dnPath = document.getElementById('dn_path');
    const dnNote = document.getElementById('dn_note');
    const save = document.getElementById('dn_save');

    function key(){ return 'bwproguide.devnotes::' + pathKey(); }

    btns.forEach(b => b.addEventListener('click', () => {
      if(dnPath) dnPath.value = pathKey();
      if(dnNote) dnNote.value = localStorage.getItem(key()) || '';
      modal.style.display = 'flex';
    }));

    modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display='none'; });

    if(save){
      save.addEventListener('click', () => {
        if(dnNote) localStorage.setItem(key(), dnNote.value || '');
        modal.style.display='none';
      });
    }
  }

  // Context modal close on click outside
  document.addEventListener('click', (e) => {
    const t = e.target;
    if(!(t instanceof Element)) return;
    if(t.classList.contains('modalBack')){
      t.style.display = 'none';
    }
  });

  // Init
  applyOverrides();
  initAdminPage();
  initSuggestEdit();
  initEditorMode();
  initDevNotes();

})();



/* ===== BW Product Guide v12: file:// safe admin session (window.name) + change password ===== */
(function(){
  const SETTINGS_KEY = 'bwproguide.settings';
  const ADMIN_NAME_KEY = 'bwproguide.admin'; // stored in window.name JSON
  const ADMIN_LS_KEY = 'bwproguide.adminSessionPersistent';

  function safeParse(s, fallback){ try{ return JSON.parse(s); }catch(e){ return fallback; } }

  function getNameObj(){
    const obj = safeParse(window.name || "{}", {});
    return (obj && typeof obj === 'object') ? obj : {};
  }
  function setNameObj(next){
    window.name = JSON.stringify(next);
  }

  function getSettings(){ return safeParse(localStorage.getItem(SETTINGS_KEY)||'{}', {}); }
  function setSettings(next){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); }

  function getAdminPassword(){
    const s = getSettings();
    return s.adminPassword || 'Bearing1!';
  }

  function isAdmin(){
    // Prefer window.name (survives navigation even on file://)
    const n = getNameObj();
    if(n[ADMIN_NAME_KEY] && n[ADMIN_NAME_KEY].loggedIn === true) return true;
    // fallback: localStorage persistent session (best-effort)
    return localStorage.getItem(ADMIN_LS_KEY) === '1';
  }

  function setAdmin(on){
    const n = getNameObj();
    n[ADMIN_NAME_KEY] = n[ADMIN_NAME_KEY] || {};
    n[ADMIN_NAME_KEY].loggedIn = !!on;
    setNameObj(n);
    if(on) localStorage.setItem(ADMIN_LS_KEY,'1');
    else localStorage.removeItem(ADMIN_LS_KEY);
  }

  // Expose for other modules
  window.__bwAdmin = { isAdmin, setAdmin, getAdminPassword, setSettings, getSettings };

  // Add password change on admin page if fields exist
  function initAdminPasswordTools(){
    const isAdminPage = document.body && document.body.getAttribute('data-page') === 'admin';
    if(!isAdminPage) return;

    const cur = document.getElementById('ad_pw_current');
    const next = document.getElementById('ad_pw_new');
    const conf = document.getElementById('ad_pw_confirm');
    const btn = document.getElementById('ad_pw_save');

    if(!btn) return;

    btn.addEventListener('click', () => {
      if(!isAdmin()){
        alert('Please log in first.');
        return;
      }
      const current = (cur && cur.value) ? cur.value : '';
      const newpw = (next && next.value) ? next.value : '';
      const c = (conf && conf.value) ? conf.value : '';
      if(current !== getAdminPassword()){
        alert('Current password is incorrect.');
        return;
      }
      if(!newpw || newpw.length < 6){
        alert('New password must be at least 6 characters.');
        return;
      }
      if(newpw !== c){
        alert('New passwords do not match.');
        return;
      }
      const s = getSettings();
      s.adminPassword = newpw;
      setSettings(s);
      if(cur) cur.value='';
      if(next) next.value='';
      if(conf) conf.value='';
      alert('Password updated.');
    });
  }

  // Patch v11 behavior by hooking into existing login button to use the stored password
  function patchLogin(){
    const isAdminPage = document.body && document.body.getAttribute('data-page') === 'admin';
    if(!isAdminPage) return;

    const loginBtn = document.getElementById('ad_login');
    const pw = document.getElementById('ad_pw');
    if(!loginBtn || !pw) return;

    // Replace any existing click handlers by cloning button
    const clone = loginBtn.cloneNode(true);
    loginBtn.parentNode.replaceChild(clone, loginBtn);

    clone.addEventListener('click', () => {
      const entered = pw.value || '';
      if(entered === getAdminPassword()){
        setAdmin(true);
        pw.value = '';
        // show panel / hide gate if present
        const gate = document.getElementById('adminGate');
        const panel = document.getElementById('adminPanel');
        if(gate) gate.style.display = 'none';
        if(panel) panel.style.display = 'block';
        alert('Logged in.');
      }else{
        alert('Incorrect password.');
      }
    });

    // Logout button patch to clear session
    const logout = document.getElementById('ad_logout');
    if(logout){
      const logoutClone = logout.cloneNode(true);
      logout.parentNode.replaceChild(logoutClone, logout);
      logoutClone.addEventListener('click', () => {
        setAdmin(false);
        const gate = document.getElementById('adminGate');
        const panel = document.getElementById('adminPanel');
        if(gate) gate.style.display = 'block';
        if(panel) panel.style.display = 'none';
      });
    }
  }

  // Ensure editor mode activates on pages if admin session + editorMode setting is true.
  function ensureEditorModeWorks(){
    const s = getSettings();
    if(isAdmin() && s.editorMode){
      // v11 module uses its own isAdmin; we can't overwrite its closure,
      // but we CAN force-enable editor by toggling contenteditable here too.
      const container = document.querySelector('.container');
      if(!container) return;
      const selector = 'h1,h2,h3,p,li,.productTitle,.subtitle';
      const els = Array.from(container.querySelectorAll(selector)).filter(el=>{
        if(el.closest('#suggestModal') || el.closest('#devNoteModal') || el.closest('.topbar')) return false;
        if(el.classList.contains('brand') || el.classList.contains('meta')) return false;
        if(el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button')) return false;
        return true;
      });
      els.forEach(el=>{
        el.contentEditable = 'true';
        el.style.outline = '1px dashed rgba(124,58,237,.55)';
        el.style.outlineOffset = '3px';
      });
      // Save on blur into overrides key the v11 module already uses
      const OVERRIDES_KEY = 'bwproguide.overrides';
      const pk = (location.pathname || '').replace(/\\/g,'/');
      els.forEach((el, idx)=>{
        if(!el.dataset.eid) el.dataset.eid = `${pk}::${idx}`;
        el.addEventListener('blur', ()=>{
          const key = el.dataset.eid;
          const raw = localStorage.getItem(OVERRIDES_KEY) || '{}';
          const o = safeParse(raw, {});
          o[key] = el.innerText;
          localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
          const s2 = getSettings();
          s2._lastEdit = new Date().toISOString();
          setSettings(s2);
        });
      });
      // Show devnote buttons if present
      document.querySelectorAll('[data-editor-only="1"]').forEach(el=>el.style.display='inline-flex');
    }
  }

  patchLogin();
  initAdminPasswordTools();
  ensureEditorModeWorks();
})();


/* product-tile-images */
(function() {
  function repoRoot() {
    // Supports GitHub Pages project sites: /<repo>/...
    var parts = (location.pathname || "/").split("/").filter(Boolean);
    if (parts.length === 0) return "";
    // If hosted at domain root, repoRoot should be "".
    // If hosted at /bwdashboard/..., repoRoot = "/bwdashboard"
    return "/" + parts[0];
  }

  function isProductGuidePage() {
    return /product-guide\.html($|\?)/.test(location.href) || document.querySelectorAll(".productCard .productThumb").length > 0;
  }

  function wireProductTileImages() {
    var root = repoRoot();
    var fallback = root + "/assets/img/products/_generic.png";
    var imgs = document.querySelectorAll("img.productThumb[data-product-slug]");
    if (!imgs || !imgs.length) return;

    imgs.forEach(function(img) {
      var slug = img.getAttribute("data-product-slug");
      if (!slug) return;

      var expected = root + "/assets/img/products/" + slug + ".png";

      img.onerror = function() {
        if (img.getAttribute("data-fellback") === "1") return;

        img.setAttribute("data-fellback","1");
        img.classList.add("is-missing");

        // Try the shared generic file first (correct for GitHub project sites)
        img.src = fallback;

        // If even the generic fails, use an inline SVG so we never show broken icons.
        img.onerror = function() {
          if (img.getAttribute("data-fellback2") === "1") return;
          img.setAttribute("data-fellback2","1");
          var svg = encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'>"+
            "<defs><radialGradient id='g' cx='50%' cy='50%' r='60%'>"+
            "<stop offset='0%' stop-color='#5b7cff' stop-opacity='.35'/>"+
            "<stop offset='100%' stop-color='#0b1220' stop-opacity='1'/>"+
            "</radialGradient></defs>"+
            "<rect width='512' height='512' rx='64' fill='url(#g)'/>"+
            "<circle cx='256' cy='256' r='150' fill='none' stroke='#ffffff' stroke-opacity='.55' stroke-width='28'/>"+
            "<circle cx='256' cy='256' r='92' fill='none' stroke='#ffffff' stroke-opacity='.35' stroke-width='24'/>"+
            "<circle cx='256' cy='128' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='352' cy='176' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='384' cy='272' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='336' cy='368' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='240' cy='392' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='144' cy='352' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='112' cy='256' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "<circle cx='160' cy='160' r='18' fill='#ffffff' fill-opacity='.65'/>"+
            "</svg>"
          );
          img.src = "data:image/svg+xml;charset=utf-8," + svg;
        };
      };

      // Force correct src (overrides any inline onerror paths baked into HTML)
      if (img.getAttribute("src") !== expected) img.setAttribute("src", expected);
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    if (!isProductGuidePage()) return;
    wireProductTileImages();
  });
})();


/* product-tile-normalize */
(function(){
  // Client-side image normalisation: renders each product tile image into a square canvas with transparent padding.
  // This makes all tiles look visually uniform without cropping or distortion.
  function isProductGuidePage(){
    return /product-guide\.html($|\?)/.test(location.href) || document.querySelectorAll(".productCard .productThumb").length > 0;
  }

  function normaliseImgElement(img, size) {
    if (!img || img.dataset.normalised === "1") return;
    // Avoid normalising the generic placeholder
    var src = img.currentSrc || img.src || "";
    if (src.indexOf("/assets/img/products/_generic.png") !== -1 || src.endsWith("assets/img/products/_generic.png")) return;
    // If the image hasn't loaded dimensions yet, skip
    if (!img.naturalWidth || !img.naturalHeight) return;

    try {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      // transparent background by default

      var iw = img.naturalWidth;
      var ih = img.naturalHeight;

      // Scale image to fit within 90% of the square to allow consistent breathing room.
      var pad = 0.90;
      var maxW = size * pad;
      var maxH = size * pad;
      var scale = Math.min(maxW / iw, maxH / ih);

      var dw = iw * scale;
      var dh = ih * scale;
      var dx = (size - dw) / 2;
      var dy = (size - dh) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);

      // Convert to blob URL to keep memory reasonable vs data URLs
      canvas.toBlob(function(blob){
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        img.dataset.normalised = "1";
        img.dataset.srcOriginal = img.getAttribute("src") || "";
        img.src = url;
      }, "image/png");
    } catch (e) {
      // If anything fails, leave the original image as-is
    }
  }

  function wireNormalisation(){
    var imgs = document.querySelectorAll("img.productThumb[data-product-slug]");
    if (!imgs.length) return;

    imgs.forEach(function(img){
      // If already loaded, normalise immediately
      if (img.complete && img.naturalWidth) {
        normaliseImgElement(img, 512);
      } else {
        img.addEventListener("load", function(){
          normaliseImgElement(img, 512);
        }, { once: true });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    if (!isProductGuidePage()) return;
    wireNormalisation();
  });
})();






/* suggest-edit-dynamic */
(function(){
  function getSlugAndType(){
    var p = (location.pathname || "").split("/").pop() || "";
    var m = p.match(/^(.+)-(brief|detailed)\.html$/);
    if(!m) return null;
    return { slug: m[1], type: m[2] };
  }

  function stampNow(){
    var now = new Date();
    return now.getFullYear() + "-" +
      String(now.getMonth()+1).padStart(2,'0') + "-" +
      String(now.getDate()).padStart(2,'0') + "_" +
      String(now.getHours()).padStart(2,'0') + "-" +
      String(now.getMinutes()).padStart(2,'0');
  }

  document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("suggestEditBtn");
    if(!btn) return;
    var info = getSlugAndType();
    btn.addEventListener("click", function(e){
      e.preventDefault();
      var email = localStorage.getItem("supportEmail") || "support@yourcompany.com";
      var subj = "[edit]-[" + (info?info.slug:"unknown") + "]-[" + (info?info.type:"page") + "]-[" + stampNow() + "]";
      location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subj);
    });
  });
})();



/* dynamic-content-auto-source */
(function(){
  async function fetchJson(url){
    const res = await fetch(url, {cache:"no-store"});
    if(!res.ok) throw new Error("Fetch JSON failed: " + res.status);
    return await res.json();
  }

  async function fetchArrayBuffer(url){
    const res = await fetch(url, {cache:"no-store"});
    if(!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.arrayBuffer();
  }

  function pageInfo(){
    var p = (location.pathname || "").split("/").pop() || "";
    var m = p.match(/^(.+)-(brief|detailed)\.html$/);
    if(!m) return null;
    return {slug:m[1], type:m[2]};
  }

  function escapeHtml(s){
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function renderDocxTo(container, arrayBuffer){
    if(!window.mammoth) throw new Error("mammoth not loaded");
    return window.mammoth.convertToHtml({arrayBuffer}).then(function(result){
      container.innerHTML = result.value || "";
    });
  }

  function renderXlsxTo(container, arrayBuffer){
    if(!window.XLSX) throw new Error("XLSX not loaded");
    const wb = window.XLSX.read(arrayBuffer, {type:"array"});
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const rows = window.XLSX.utils.sheet_to_json(ws, {header:1, raw:false});
    let html = "";
    rows.forEach(function(r){
      const cell = (r && r.length) ? String(r[0] ?? "").trim() : "";
      if(!cell) return;
      if(/^\d+\./.test(cell) || cell.endsWith(":")) html += "<h2>" + escapeHtml(cell) + "</h2>";
      else html += "<p>" + escapeHtml(cell) + "</p>";
    });
    container.innerHTML = html || "<p>No content found in workbook.</p>";
  }

  async function init(){
    const info = pageInfo();
    const el = document.getElementById("dynamicContent");
    if(!info || !el) return;
    if(window.__PG_IS_FILE__){
      try{ window.__PG_FILE_HINT__ && window.__PG_FILE_HINT__(el); }catch(e){}
      return;
    }

    try{
      const reg = await fetchJson(new URL("../docs/content-sources.json", document.baseURI).href);
      const item = reg.products && reg.products[info.slug];
      if(!item) throw new Error("No registry entry for " + info.slug);

      const path = (info.type === "brief") ? item.brief_docx : item.detailed_xlsx;
      if(!path) throw new Error("No source path for " + info.slug + " " + info.type);

      el.setAttribute("data-source-path", "../" + path);

      el.innerHTML = "<p>Loading content…</p>";
      const buf = await fetchArrayBuffer("../" + path);

      if(info.type === "brief") await renderDocxTo(el, buf);
      else renderXlsxTo(el, buf);

    } catch(err){
      el.innerHTML = "<p><strong>Unable to load content.</strong> Please use the Download button above.</p>";
      console.error(err);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();



/* brief-gallery-auto-load */
(function(){
  function pageInfo(){
    var p = (location.pathname || "").split("/").pop() || "";
    var m = p.match(/^(.+)-(brief)\.html$/);
    if(!m) return null;
    return {slug:m[1]};
  }

  function buildCandidates(slug, i){
    var n = String(i).padStart(2,'0');
    var base = "/assets/img/galleries/" + slug + "/" + n;
    return [base + ".jpg", base + ".png", base + ".webp", base + ".jpeg"];
  }

  function addThumb(grid, src){
    var a = document.createElement("a");
    a.href = src;
    a.target = "_blank";
    a.rel = "noopener";
    var img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.className = "galleryImg";
    a.appendChild(img);
    grid.appendChild(a);
  }

  document.addEventListener("DOMContentLoaded", function(){
    var info = pageInfo();
    var card = document.getElementById("imageGallery");
    var grid = document.getElementById("galleryGrid");
    if(!info || !card || !grid) return;

    var max = 30;
    var consecutiveMiss = 0;
    var maxConsecutiveMiss = 6; // stop after 6 in a row missing

    function tryIndex(i){
      if(i>max || consecutiveMiss >= maxConsecutiveMiss){
        if(grid.children.length === 0){
          // hide card if no images exist
          card.style.display = "none";
        }
        return;
      }
      var candidates = buildCandidates(info.slug, i);
      (function tryCandidate(ci){
        if(ci >= candidates.length){
          consecutiveMiss += 1;
          tryIndex(i+1);
          return;
        }
        var test = new Image();
        test.onload = function(){
          consecutiveMiss = 0;
          addThumb(grid, candidates[ci]);
          tryIndex(i+1);
        };
        test.onerror = function(){
          tryCandidate(ci+1);
        };
        test.src = candidates[ci] + "?v=" + Date.now();
      })(0);
    }

    tryIndex(1);
  });
})();



/* file-protocol-warning */
(function(){
  function isFileProtocol(){ return (location.protocol === "file:"); }
  function showFileProtocolHint(container){
    container.innerHTML = "<p><strong>Content can’t load while opened as a local file.</strong></p>" +
      "<p>This build uses <code>fetch()</code> to load DOCX/XLSX sources, and browsers block that on <code>file://</code>.</p>" +
      "<p><strong>Fix:</strong> run a simple local server, then open <code>http://localhost:8000</code></p>" +
      "<p style='opacity:.85;margin-top:10px;'><code>Windows:</code> double‑click <strong>start-local.bat</strong><br>" +
      "<code>Mac/Linux:</code> run <code>python3 -m http.server 8000</code> in this folder</p>";
  }
  window.__PG_IS_FILE__ = isFileProtocol();
  window.__PG_FILE_HINT__ = showFileProtocolHint;
})();




/* shared-suppliers-json */
(function(){
  const SUPPLIERS_URL = new URL(window.__bwRepoBase() + "docs/suppliers.json", location.origin).href;

  const KEY_ACTIVE_STORE = "activeStoreTemplate";
  const KEY_LOCAL_DRAFT = "supplierEditsDraftV1"; // optional local cache of edits until published

  async function fetchJson(url){
    const res = await fetch(url, {cache:"no-store"});
    if(!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.json();
  }

  function loadDraft(){
    try{ return JSON.parse(localStorage.getItem(KEY_LOCAL_DRAFT) || "null"); }catch(e){}
    return null;
  }
  function saveDraft(d){ localStorage.setItem(KEY_LOCAL_DRAFT, JSON.stringify(d)); }

  function getActiveStore(shared){
    const stored = localStorage.getItem(KEY_ACTIVE_STORE);
    if(stored && shared.stores && shared.stores.includes(stored)) return stored;
    // default to first store
    if(shared.stores && shared.stores.length) {
      localStorage.setItem(KEY_ACTIVE_STORE, shared.stores[0]);
      return shared.stores[0];
    }
    localStorage.setItem(KEY_ACTIVE_STORE, "Default");
    return "Default";
  }

  function setActiveStore(name){
    localStorage.setItem(KEY_ACTIVE_STORE, name);
  }

  function pageSlugAndType(){
    const p = (location.pathname || "").split("/").pop() || "";
    let m = p.match(/^(.+)-(brief|detailed)\.html$/);
    if(!m) return null;
    return {slug:m[1], type:m[2]};
  }

  function escapeHtml(str){
    return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function ensureData(shared, store, slug){
    if(!shared.data) shared.data = {};
    if(!shared.data[store]) shared.data[store] = {};
    if(!Array.isArray(shared.data[store][slug])) shared.data[store][slug] = [];
    return shared.data[store][slug];
  }

  // ---------- Product Guide store selector (auto-save) ----------
  async function initStoreSelectorOnProductGuide(){
    const sel = document.getElementById("storeSelector");
    const status = document.getElementById("storeSelectorStatus");
    if(!sel) return;

    try{
      if(location.protocol === "file:"){
        if(status) status.textContent = "Open via local server to load stores.";
        return;
      }
      const shared = await fetchJson(SUPPLIERS_URL);
      const active = getActiveStore(shared);

      sel.innerHTML = "";
      (shared.stores || ["Default"]).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
      });
      sel.value = active;
      if(status) status.textContent = "Saved automatically.";

      sel.addEventListener("change", function(){
        setActiveStore(sel.value);
        if(status) status.textContent = "Store set to: " + sel.value;
        // silent switch (A)
      });
    } catch(err){
      if(status) status.textContent = "Unable to load store list.";
      console.error(err);
    }
  }

  // ---------- Suppliers card on brief pages ----------
  function renderSuppliers(card, shared, store, slug){
    const list = ensureData(shared, store, slug);

    // overlay local draft edits if present for this store+slug
    const draft = loadDraft();
    if(draft && draft.data && draft.data[store] && Array.isArray(draft.data[store][slug])){
      shared.data[store][slug] = draft.data[store][slug];
    }

    const body = card.querySelector(".suppliersBody");
    if(!body) return;

    let html = "";
    html += "<div style='display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;margin:6px 0 12px 0;'>";
    html += "<div style='opacity:.85;'><strong>Store:</strong> " + escapeHtml(store) + " <span style='opacity:.75;'>(change from Product Guide)</span></div>";
    html += "<div style='display:flex;gap:10px;align-items:center;flex-wrap:wrap;'>";
    html += "<button class='btn' id='addSupplierBtn' type='button'>+ Add</button>";
    html += "<button class='btn' id='downloadUpdatedJson' type='button'>Save Shared File</button>";
    html += "</div></div>";

    if(list.length === 0){
      html += "<p style='opacity:.8;'>No suppliers saved for this product yet.</p>";
      body.innerHTML = html;
      return wireSuppliers(card, shared, store, slug);
    }

    html += "<ol class='supplierList'>";
    list.forEach((it, idx) => {
      const name = escapeHtml(it.name);
      const note = escapeHtml(it.note || "");
      const url = escapeHtml(it.url || "");
      html += "<li class='supplierItem'>";
      html += "<div class='supplierMain'>";
      if(url){
        html += "<div class='supplierName'><a href='" + url + "' target='_blank' rel='noopener'>" + name + "</a></div>";
      } else {
        html += "<div class='supplierName'>" + name + "</div>";
      }
      if(note) html += "<div class='supplierNote'>" + note + "</div>";
      html += "</div>";
      html += "<div class='supplierActions'>";
      html += "<button class='btn mini' data-act='up' data-idx='" + idx + "' title='Move up'>↑</button>";
      html += "<button class='btn mini' data-act='down' data-idx='" + idx + "' title='Move down'>↓</button>";
      html += "<button class='btn mini' data-act='edit' data-idx='" + idx + "' title='Edit'>✎</button>";
      html += "<button class='btn mini' data-act='del' data-idx='" + idx + "' title='Remove'>✕</button>";
      html += "</div>";
      html += "</li>";
    });
    html += "</ol>";

    body.innerHTML = html;
    wireSuppliers(card, shared, store, slug);
  }

  function downloadJson(filename, obj){
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function wireSuppliers(card, shared, store, slug){
    const addBtn = card.querySelector("#addSupplierBtn");
    const dlBtn = card.querySelector("#downloadUpdatedJson");

    function persistDraft(){
      // store only the data section as a draft overlay
      const draft = { data: shared.data };
      saveDraft(draft);
      renderSuppliers(card, shared, store, slug);
    }

    if(addBtn){
      addBtn.addEventListener("click", function(){
        const name = prompt("Supplier name:");
        if(!name) return;
        const url = prompt("Website/Teams link (optional):") || "";
        const note = prompt("Notes (optional):") || "";
        const list = ensureData(shared, store, slug);
        list.push({name:name.trim(), url:url.trim(), note:note.trim()});
        persistDraft();
      });
    }

    if(dlBtn){
      dlBtn.addEventListener("click", function(){
        // Download updated suppliers.json for GitHub upload
        downloadJson("suppliers.json", shared);
        alert("Downloaded suppliers.json. Upload it to docs/suppliers.json in GitHub to share changes.");
      });
    }

    card.querySelectorAll(".supplierActions .btn.mini").forEach(btn => {
      btn.addEventListener("click", function(){
        const act = btn.getAttribute("data-act");
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        const list = ensureData(shared, store, slug);
        if(Number.isNaN(idx) || idx < 0 || idx >= list.length) return;

        if(act === "up" && idx > 0){
          [list[idx-1], list[idx]] = [list[idx], list[idx-1]];
          persistDraft();
        } else if(act === "down" && idx < list.length-1){
          [list[idx+1], list[idx]] = [list[idx], list[idx+1]];
          persistDraft();
        } else if(act === "del"){
          if(confirm("Remove supplier: " + list[idx].name + " ?")){
            list.splice(idx, 1);
            persistDraft();
          }
        } else if(act === "edit"){
          const cur = list[idx];
          const name = prompt("Supplier name:", cur.name) || cur.name;
          const url  = prompt("Website/Teams link (optional):", cur.url || "") || "";
          const note = prompt("Notes (optional):", cur.note || "") || "";
          list[idx] = {name:name.trim(), url:url.trim(), note:note.trim()};
          persistDraft();
        }
      });
    });
  }

  async function initSuppliersOnBriefPages(){
    const card = document.getElementById("suppliersCard");
    if(!card) return;
    const info = pageSlugAndType();
    if(!info || info.type !== "brief") return;

    try{
      if(location.protocol === "file:"){
        const body = card.querySelector(".suppliersBody");
        if(body) body.innerHTML = "<p><strong>Suppliers can’t load on file://</strong> — open via local server.</p>";
        return;
      }
      const shared = await fetchJson(SUPPLIERS_URL);
      const store = getActiveStore(shared);
      renderSuppliers(card, shared, store, info.slug);
    } catch(err){
      const body = card.querySelector(".suppliersBody");
      if(body) body.innerHTML = "<p><strong>Unable to load suppliers.</strong> Check docs/suppliers.json exists.</p>";
      console.error(err);
    }
  }

  // ---------- Admin: template existence control ----------
  async function initAdminTemplates(){
    const card = document.getElementById("storeTemplatesCard");
    if(!card) return;

    try{
      if(location.protocol === "file:"){
        return;
      }
      const shared = await fetchJson(SUPPLIERS_URL);

      const selList = document.getElementById("adminStoreList");
      const selRenameFrom = document.getElementById("renameStoreFrom");
      const selDelete = document.getElementById("deleteStoreName");

      function fill(sel){
        if(!sel) return;
        sel.innerHTML = "";
        (shared.stores || ["Default"]).forEach(n=>{
          const opt=document.createElement("option");
          opt.value=n; opt.textContent=n;
          sel.appendChild(opt);
        });
      }
      fill(selList); fill(selRenameFrom); fill(selDelete);

      document.getElementById("addStore").addEventListener("click", function(){
        const name = (document.getElementById("newStoreName").value || "").trim();
        if(!name) return alert("Enter a store name.");
        if(shared.stores.includes(name)) return alert("Store already exists.");
        shared.stores.push(name);
        if(!shared.data[name]){
          shared.data[name] = {};
        }
        // ensure each product has an array (optional, but helps avoid missing keys)
        // leave lazy creation for smaller file
        fill(selList); fill(selRenameFrom); fill(selDelete);
        document.getElementById("newStoreName").value="";
        alert("Added store. Download updated suppliers.json to publish.");
      });

      document.getElementById("renameStore").addEventListener("click", function(){
        const from = selRenameFrom.value;
        const to = (document.getElementById("renameStoreTo").value || "").trim();
        if(!to) return alert("Enter a new name.");
        if(shared.stores.includes(to)) return alert("That name already exists.");
        shared.stores = shared.stores.map(s=> s===from ? to : s);
        if(shared.data[from]){
          shared.data[to]=shared.data[from];
          delete shared.data[from];
        }
        // update active store if needed
        if(localStorage.getItem(KEY_ACTIVE_STORE) === from){
          setActiveStore(to);
        }
        fill(selList); fill(selRenameFrom); fill(selDelete);
        document.getElementById("renameStoreTo").value="";
        alert("Renamed store. Download updated suppliers.json to publish.");
      });

      document.getElementById("deleteStore").addEventListener("click", function(){
        const name = selDelete.value;
        if(!confirm("Delete store '" + name + "'?")) return;
        shared.stores = shared.stores.filter(s=>s!==name);
        delete shared.data[name];
        if(shared.stores.length===0){
          shared.stores=["Default"];
          if(!shared.data["Default"]) shared.data["Default"] = {};
        }
        if(localStorage.getItem(KEY_ACTIVE_STORE) === name){
          setActiveStore(shared.stores[0]);
        }
        fill(selList); fill(selRenameFrom); fill(selDelete);
        alert("Deleted store. Download updated suppliers.json to publish.");
      });

      document.getElementById("downloadSuppliersJson").addEventListener("click", function(){
        downloadJson("suppliers.json", shared);
        alert("Downloaded suppliers.json. Upload it to docs/suppliers.json in GitHub to share changes.");
      });

    } catch(err){
      console.error(err);
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    initStoreSelectorOnProductGuide();
    initSuppliersOnBriefPages();
    initAdminTemplates();
  });
})();



/* nav-enforcer-v1 */
(function(){
  function pageName(){
    var p = (location.pathname || "").split("/").pop() || "index.html";
    return p;
  }
  function isDashboard(p){ return p === "index.html" || p === ""; }

  function isSecondary(p){
    return ["product-guide.html","resources.html","sops.html","sales.html","admin.html"].includes(p);
  }

  function isProductPage(p){
    return /^.+-(brief|detailed)\.html$/.test(p) && (location.pathname || "").includes("/products/");
  }

  function backTarget(p){
    if(isProductPage(p)) return "../product-guide.html";
    if(p.startsWith("sales-")) return "sales.html";
    if(p.startsWith("resources-")) return "resources.html";
    if(p.startsWith("sop-")) return "sops.html";
    if(p === "photos.html") return "product-guide.html";
    if(p === "supplier-directory.html") return "resources.html";
    if(p === "account-applications.html") return "resources.html";
    return "index.html";
  }

  function ensureTopbar(){
    var topbar = document.querySelector(".topbar");
    if(!topbar) return null;

    // remove ALL buttons inside topbar (this strips Dev Notes / Admin / etc)
    topbar.querySelectorAll("a.btn, button.btn").forEach(function(el){ el.remove(); });

    // Ensure containers
    var left = topbar.querySelector(".leftBtns");
    if(!left){
      left = document.createElement("div");
      left.className = "leftBtns";
      topbar.appendChild(left);
    }
    var right = topbar.querySelector(".rightBtns");
    if(!right){
      right = document.createElement("div");
      right.className = "rightBtns";
      topbar.appendChild(right);
    }
    left.innerHTML = "";
    right.innerHTML = "";
    return {topbar:topbar,left:left,right:right};
  }

  function makeBtn(text, href, id){
    var a = document.createElement("a");
    a.className = "btn";
    if(id) a.id = id;
    a.href = href;
    a.textContent = text;
    return a;
  }

  function keepExistingDownload(right){
    // If a download button exists elsewhere in DOM (from product templates), keep its href.
    var existing = document.querySelector('a.btn[href*="downloads/"]');
    if(existing){
      right.appendChild(makeBtn("⬇ Download", existing.getAttribute("href")));
      return true;
    }
    return false;
  }

  function init(){
    var p = pageName();
    var bars = ensureTopbar();
    if(!bars) return;

    if(isDashboard(p)){
      bars.topbar.style.display = "none";
      return;
    } else {
      bars.topbar.style.display = "";
    }

    if(isSecondary(p)){
      bars.right.appendChild(makeBtn("⌂ Dashboard", "index.html"));
      return;
    }

    // Tertiary
    bars.left.appendChild(makeBtn("← Back", backTarget(p)));
    bars.right.appendChild(makeBtn("⌂ Dashboard", "index.html"));

    if(isProductPage(p)){
      keepExistingDownload(bars.right);
      bars.right.appendChild(makeBtn("✎ Suggest Edit", "#", "suggestEditBtn"));
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();



/* pwa-register */
(function(){
  if(!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function(){
    // Use a stable root-relative path for GitHub Pages
    navigator.serviceWorker.register("./service-worker.js").catch(function(e){
      console.warn("SW register failed", e);
    });
  });
})();


/* product-guide-store-modal */
(function(){
  const SUPPLIERS_URL = new URL(window.__bwRepoBase() + "docs/suppliers.json", location.origin).href;
  const KEY_ACTIVE_STORE = "activeStoreTemplate";

  function isProductGuide(){
    return /product-guide\.html($|\?)/.test(location.href);
  }

  async function fetchJson(url){
    const res = await fetch(url, {cache:"no-store"});
    if(!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.json();
  }

  function repoRoot(){
    var parts = (location.pathname || "/").split("/").filter(Boolean);
    if(parts.length===0) return "";
    return "/" + parts[0];
  }

  function getActiveStore(shared){
    const stored = localStorage.getItem(KEY_ACTIVE_STORE);
    if(stored && shared.stores && shared.stores.includes(stored)) return stored;
    if(shared.stores && shared.stores.length){
      localStorage.setItem(KEY_ACTIVE_STORE, shared.stores[0]);
      return shared.stores[0];
    }
    localStorage.setItem(KEY_ACTIVE_STORE, "Default");
    return "Default";
  }

  function setActiveStore(name){
    localStorage.setItem(KEY_ACTIVE_STORE, name);
  }

  function ensureModal(){
    if(document.getElementById("storeModalBack")) return;

    const back = document.createElement("div");
    back.id = "storeModalBack";
    back.className = "modalBack";
    back.innerHTML = `
      <div class="modal">
        <h3>Change Store</h3>
        <p class="subtitle" style="margin-top:6px;">Supplier preferences will default to the selected store across all product brief pages.</p>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;">
          <label for="storeSelectorModal" style="min-width:120px;"><strong>Store</strong></label>
          <select id="storeSelectorModal" style="min-width:280px;"></select>
          <span id="storeSelectorModalStatus" style="opacity:.75;"></span>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button class="btn" id="storeModalClose" type="button">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(back);

    back.addEventListener("click", (e)=>{ if(e.target===back) back.style.display="none"; });
    document.getElementById("storeModalClose").addEventListener("click", ()=>{ back.style.display="none"; });
  }

  function setNavStorePill(name){
    const pill = document.getElementById("storeNamePill");
    if(pill) pill.textContent = name;
  }

  async function init(){
    if(!isProductGuide()) return;

    // Hide the old top-right store card if it exists
    const old = document.getElementById("storeSelectorCard");
    if(old) old.style.display = "none";

    ensureModal();

    // Ensure button + pill exist in the topbar (in case HTML is older/newer)
    const topbar = document.querySelector(".topbar");
    if(topbar){
      const left = topbar.querySelector(".leftBtns") || topbar;
      const right = topbar.querySelector(".rightBtns") || topbar;

      if(!document.querySelector('a.btn[href="index.html"][data-role="dash"]')){
        const dash = document.createElement("a");
        dash.className="btn";
        dash.href="index.html";
        dash.dataset.role="dash";
        dash.textContent="⌂ Dashboard";
        // put dashboard on left side
        left.prepend(dash);
      }

      if(!document.getElementById("changeStoreBtn")){
        const btn = document.createElement("button");
        btn.className="btn";
        btn.id="changeStoreBtn";
        btn.type="button";
        btn.textContent="⇄ Change Store";
        right.prepend(btn);
      }

      if(!document.getElementById("storeNamePill")){
        const pill = document.createElement("span");
        pill.className="btn";
        pill.id="storeNamePill";
        pill.style.pointerEvents="none";
        pill.style.opacity="0.95";
        // attempt center by inserting between groups if possible
        // If left/right containers exist, place at end of left group (looks centered enough with your layout)
        left.appendChild(pill);
      }
    }

    // Load stores
    if(location.protocol === "file:"){
      setNavStorePill("Store: (server required)");
      return;
    }

    try{
      const shared = await fetchJson(SUPPLIERS_URL);
      const active = getActiveStore(shared);
      setNavStorePill(active);

      const sel = document.getElementById("storeSelectorModal");
      const status = document.getElementById("storeSelectorModalStatus");
      sel.innerHTML = "";
      (shared.stores || ["Default"]).forEach(n=>{
        const opt=document.createElement("option");
        opt.value=n; opt.textContent=n;
        sel.appendChild(opt);
      });
      sel.value = active;
      if(status) status.textContent = "Saved automatically.";

      sel.addEventListener("change", ()=>{
        setActiveStore(sel.value);
        setNavStorePill(sel.value);
        if(status) status.textContent = "Saved: " + sel.value;
      });

      const openBtn = document.getElementById("changeStoreBtn");
      if(openBtn){
        openBtn.addEventListener("click", ()=>{
          document.getElementById("storeModalBack").style.display="flex";
          // sync current
          sel.value = localStorage.getItem(KEY_ACTIVE_STORE) || active;
        });
      }
    }catch(e){
      setNavStorePill("Store: unavailable");
      console.error(e);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();


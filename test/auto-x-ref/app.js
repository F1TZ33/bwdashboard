const DATA = window.AUTO_X_REF_DATA;
const $ = id => document.getElementById(id);

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function norm(s) { return String(s ?? '').toLowerCase().trim(); }
function escapeRegExp(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlightValue(value, q) {
  const safe = esc(value);
  q = String(q || '').trim();
  if (!q) return safe;
  return safe.replace(new RegExp(escapeRegExp(q), 'ig'), m => `<mark>${m}</mark>`);
}

// Dedicated dimensional search from the SIZE sheet only.
const sizeSheet = DATA.sheets.find(s => String(s.name).trim().toUpperCase() === 'SIZE') || DATA.sheets[0];

function cleanDimText(v) {
  return String(v || '').replace(/[×*]/g, 'x').replace(/\s+/g, '').replace(/^\+/, '');
}
function nval(v) {
  v = String(v || '').trim().replace(/^\+/, '');
  if (!v) return null;
  if (/^\d+\/\d+$/.test(v)) {
    const [a, b] = v.split('/').map(Number);
    return b ? a / b : null;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function parseDim(code) {
  const cleaned = cleanDimText(code);
  const parts = cleaned.split('x');
  if (parts.length < 3) return null;
  const id = nval(parts[0]);
  const od = nval(parts[1]);
  if (id === null || od === null) return null;
  const widthText = parts.slice(2).join('x');
  const wParts = widthText.split('/');
  const w1 = nval(wParts[0]);
  const w2 = wParts.length > 1 ? nval(wParts[1]) : null;
  if (w1 === null) return null;
  return { raw: String(code || ''), display: cleaned, id, od, w1, w2 };
}

const dimRecords = (sizeSheet?.rows || []).map((row, idx) => {
  const dim = parseDim(row[0]);
  if (!dim) return null;
  const parts = row.slice(1).filter(v => String(v || '').trim());
  const searchable = parts.join(' ').toLowerCase();
  return { dim, row, ri: idx + 2 + (sizeSheet.preamble?.length || 0), parts, searchable };
}).filter(Boolean);

function closeEnough(a, b, tol) {
  return a !== null && b !== null && Math.abs(a - b) <= tol + 1e-9;
}
function widthMatch(dim, w1, w2, tol) {
  if (w1 === null) return true;
  const dw = [dim.w1, dim.w2].filter(v => v !== null);
  if (w2 === null) return dw.some(v => closeEnough(v, w1, tol));
  if (dw.length < 2) return false;
  return (closeEnough(dw[0], w1, tol) && closeEnough(dw[1], w2, tol)) ||
         (closeEnough(dw[0], w2, tol) && closeEnough(dw[1], w1, tol));
}
function getCriteria() {
  return {
    part: norm($('partQuery').value),
    id: nval($('dimId').value),
    od: nval($('dimOd').value),
    w1: nval($('dimW1').value),
    w2: nval($('dimW2').value),
    tol: Math.max(0, nval($('dimTol').value) || 0)
  };
}
function findMatches() {
  const c = getCriteria();
  const hasDims = [c.id, c.od, c.w1, c.w2].some(v => v !== null);
  const hasPart = !!c.part;
  const base = dimRecords.filter(r =>
    (!hasPart || r.searchable.includes(c.part)) &&
    (!hasDims || (
      (c.id === null || closeEnough(r.dim.id, c.id, c.tol)) &&
      (c.od === null || closeEnough(r.dim.od, c.od, c.tol)) &&
      widthMatch(r.dim, c.w1, c.w2, c.tol)
    ))
  );
  return (hasDims || hasPart) ? base.slice(0, 12) : base.slice(0, 12);
}
function fmtNum(n) {
  return Number.isInteger(n) ? String(n) : String(n).replace(/0+$/, '').replace(/\.$/, '');
}
function renderDim() {
  const c = getCriteria();
  const matches = findMatches();
  const searching = !!c.part || [c.id, c.od, c.w1, c.w2].some(v => v !== null);
  $('dimStats').textContent = `${matches.length.toLocaleString()} card${matches.length === 1 ? '' : 's'} shown — refine search for more specific results`;

  if (!matches.length) {
    $('dimResults').innerHTML = '<div class="empty">No matching dimensional cards found.</div>';
    return;
  }

  let html = '<div class="dim-results">';
  for (const r of matches) {
    const d = r.dim;
    const w = d.w2 === null ? fmtNum(d.w1) : `${fmtNum(d.w1)}/${fmtNum(d.w2)}`;
    html += `<article class="dim-card"><div class="dim-main"><div><div class="dim-code">${fmtNum(d.id)} x ${fmtNum(d.od)} x ${w}</div><div class="dim-note">ID ${fmtNum(d.id)} mm • OD ${fmtNum(d.od)} mm • ${d.w2 === null ? `Width ${fmtNum(d.w1)} mm` : `Widths ${fmtNum(d.w1)} mm / ${fmtNum(d.w2)} mm`}</div></div><div class="dim-badges"><span class="dim-badge">SIZE row ${r.ri}</span></div></div>`;
    if (r.parts.length) {
      html += '<div class="dim-parts">' + r.parts.slice(0, 36).map(p => `<span class="part-chip">${highlightValue(p, c.part)}</span>`).join('') + '</div>';
    }
    html += '</article>';
  }
  html += '</div>';
  $('dimResults').innerHTML = html;
}

let debounce;
['partQuery', 'dimId', 'dimOd', 'dimW1', 'dimW2', 'dimTol'].forEach(id => {
  $(id).addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(renderDim, 80);
  });
});
$('clearDimBtn').onclick = () => {
  ['partQuery', 'dimId', 'dimOd', 'dimW1', 'dimW2'].forEach(id => $(id).value = '');
  $('dimTol').value = '0';
  renderDim();
};
renderDim();

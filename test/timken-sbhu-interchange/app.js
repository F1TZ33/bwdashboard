const els = {
  search: document.getElementById("searchInput"),
  brand: document.getElementById("brandFilter"),
  style: document.getElementById("styleFilter"),
  clear: document.getElementById("clearBtn"),
  results: document.getElementById("results"),
  status: document.getElementById("status")
};

function normalise(value){
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function isUsable(value){
  return value && String(value).toLowerCase() !== "n/a";
}

function allSearchableValues(row){
  const values = [row.sourceBrand, row.sourcePart, row.sourceAltNumber || ""];
  LOCKING_STYLES.forEach(style => values.push(row.timken[style] || ""));
  return values;
}

function populateFilters(){
  [...new Set(SBHU_DATA.map(row => row.sourceBrand))]
    .sort()
    .forEach(brand => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      els.brand.appendChild(option);
    });

  LOCKING_STYLES.forEach(style => {
    const option = document.createElement("option");
    option.value = style;
    option.textContent = style;
    els.style.appendChild(option);
  });
}

function rowMatches(row, term){
  if(els.brand.value && row.sourceBrand !== els.brand.value) return false;

  const style = els.style.value;
  if(style && !isUsable(row.timken[style])) return false;

  if(!term) return false;

  return allSearchableValues(row).some(value => normalise(value).includes(term));
}

function matchBadges(row, term){
  const badges = [];

  if(normalise(row.sourcePart).includes(term)){
    badges.push(`Matched ${row.sourceBrand}: ${row.sourcePart}`);
  }

  if(row.sourceAltNumber && normalise(row.sourceAltNumber).includes(term)){
    badges.push(`Matched Dodge number: ${row.sourceAltNumber}`);
  }

  LOCKING_STYLES.forEach(style => {
    const part = row.timken[style];
    if(isUsable(part) && normalise(part).includes(term)){
      badges.push(`Matched Timken ${style}: ${part}`);
    }
  });

  return badges;
}

function findAlternativesForTimken(timkenPart, currentRow){
  if(!isUsable(timkenPart)) return [];

  const n = normalise(timkenPart);
  const alternatives = [];

  SBHU_DATA.forEach(row => {
    if(row === currentRow) return;

    const hasSameTimken = LOCKING_STYLES.some(style => normalise(row.timken[style]) === n);

    if(hasSameTimken){
      alternatives.push({
        brand: row.sourceBrand,
        part: row.sourcePart,
        alt: row.sourceAltNumber || "",
        page: row.sourcePage
      });
    }
  });

  const seen = new Set();

  return alternatives
    .filter(item => {
      const key = `${item.brand}|${item.part}|${item.alt}`;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 30);
}

function renderTimkenOptions(row){
  return LOCKING_STYLES.map(style => {
    const part = row.timken[style];
    const usable = isUsable(part);

    return `
      <div class="timken-option ${usable ? "" : "na"}">
        <small>${escapeHtml(style)}</small>
        <strong>${usable ? escapeHtml(part) : "n/a"}</strong>
      </div>
    `;
  }).join("");
}

function renderAlternatives(row){
  const sections = [];

  LOCKING_STYLES.forEach(style => {
    const timkenPart = row.timken[style];

    if(!isUsable(timkenPart)) return;

    const alternatives = findAlternativesForTimken(timkenPart, row);

    if(!alternatives.length) return;

    sections.push(`
      <div class="alt-section">
        <h4>${escapeHtml(style)} → ${escapeHtml(timkenPart)}</h4>
        <div class="alt-list">
          ${alternatives.map(item => `
            <span class="alt-pill">
              <strong>${escapeHtml(item.brand)}</strong>
              <em>${escapeHtml(item.part)}${item.alt ? " / " + escapeHtml(item.alt) : ""}</em>
            </span>
          `).join("")}
        </div>
      </div>
    `);
  });

  if(!sections.length){
    return `<p class="note">No other brand equivalents were found against the displayed Timken options in the current backend table.</p>`;
  }

  return sections.join("");
}

function render(){
  const term = normalise(els.search.value);
  const minChars = 2;

  if(!term || term.length < minChars){
    els.status.textContent = `Backend loaded: ${SBHU_DATA.length.toLocaleString()} interchange rows.`;
    els.results.innerHTML = `<div class="empty">Start typing at least ${minChars} characters to see live results.</div>`;
    return;
  }

  const matches = SBHU_DATA
    .filter(row => rowMatches(row, term))
    .slice(0, 50);

  els.status.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} shown. Search is live; narrow the part number for better precision.`;

  if(!matches.length){
    els.results.innerHTML = `<div class="empty">No matches found. Try removing dashes/spaces, searching by Timken number, or clearing filters.</div>`;
    return;
  }

  els.results.innerHTML = matches.map(row => {
    const badges = matchBadges(row, term);

    return `
      <article class="result-card">
        <div class="card-head">
          <div>
            <div class="badges">
              <span class="badge direct">Guide interchange</span>
              <span class="badge">${escapeHtml(row.sourceBrand)}</span>
              <span class="badge">PDF p.${escapeHtml(row.sourcePage)}</span>
              ${badges.map(b => `<span class="badge match">${escapeHtml(b)}</span>`).join("")}
            </div>
            <h2>${escapeHtml(row.sourceBrand)} ${escapeHtml(row.sourcePart)}</h2>
          </div>
        </div>

        <div class="columns">
          <section class="panel">
            <h3>Source Part</h3>
            <div class="source-lines">
              <strong>Brand</strong><span>${escapeHtml(row.sourceBrand)}</span>
              <strong>Part</strong><span>${escapeHtml(row.sourcePart)}</span>
              ${row.sourceAltNumber ? `<strong>Part Number</strong><span>${escapeHtml(row.sourceAltNumber)}</span>` : ""}
              <strong>Source</strong><span>Timken SBHU Interchange Guide, PDF page ${escapeHtml(row.sourcePage)}</span>
            </div>
          </section>

          <section class="panel">
            <h3>Timken Options by Locking Style</h3>
            <div class="timken-grid">
              ${renderTimkenOptions(row)}
            </div>
          </section>
        </div>

        <section class="panel alt-section">
          <h3>Other Brand Equivalents Found From Same Timken Options</h3>
          ${renderAlternatives(row)}
        </section>

        <p class="note">
          Reference only. Confirm dimensions, mounting envelope, locking style, seals and application before substitution.
        </p>
      </article>
    `;
  }).join("");
}

function clearAll(){
  els.search.value = "";
  els.brand.value = "";
  els.style.value = "";
  render();
}

populateFilters();
render();

els.search.addEventListener("input", render);
els.brand.addEventListener("change", render);
els.style.addEventListener("change", render);
els.clear.addEventListener("click", clearAll);

const els = {
  search: document.getElementById("search"),
  brand: document.getElementById("brand"),
  section: document.getElementById("section"),
  results: document.getElementById("results"),
  resultCount: document.getElementById("resultCount"),
  clearBtn: document.getElementById("clearBtn")
};

function normalise(value){
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function niceList(values){
  return values.filter(Boolean).join(", ");
}

function populateFilters(){
  brandColumns.forEach(brand => {
    const opt = document.createElement("option");
    opt.value = brand;
    opt.textContent = brand;
    els.brand.appendChild(opt);
  });

  [...new Set(interchangeRows.map(row => row.section))]
    .sort()
    .forEach(section => {
      const opt = document.createElement("option");
      opt.value = section;
      opt.textContent = section;
      els.section.appendChild(opt);
    });
}

function rowMatches(row){
  const term = normalise(els.search.value);
  const selectedBrand = els.brand.value;
  const selectedSection = els.section.value;

  if(selectedSection && row.section !== selectedSection) return false;

  if(selectedBrand && !row.brands[selectedBrand]) return false;

  if(!term) return true;

  return Object.values(row.brands).some(part => normalise(part).includes(term));
}

function render(){
  const rows = interchangeRows.filter(rowMatches);

  els.resultCount.textContent = `${rows.length} match${rows.length === 1 ? "" : "es"}`;
  els.results.innerHTML = "";

  if(!rows.length){
    els.results.innerHTML = `
      <div class="empty">
        No matches found. Try searching by another brand part number, partial part number, or clearing the section filter.
      </div>
    `;
    return;
  }

  rows.forEach(row => {
    const card = document.createElement("section");
    card.className = "result-card";

    const presentBrands = Object.entries(row.brands)
      .map(([brand, part]) => `<tr><th>${brand}</th><td>${part}</td></tr>`)
      .join("");

    const inputTerm = els.search.value.trim();
    const matchedBrandEntries = Object.entries(row.brands)
      .filter(([brand, part]) => inputTerm && normalise(part).includes(normalise(inputTerm)))
      .map(([brand, part]) => `${brand}: ${part}`);

    card.innerHTML = `
      <div class="card-head">
        <div>
          <span class="badge">${row.section}</span>
          <h2>${row.brands["Dodge"] ? "Dodge " + row.brands["Dodge"] : row.brands["AMI"] || "Mounted Unit Interchange"}</h2>
        </div>
        <span class="confidence">${row.confidence}</span>
      </div>

      ${matchedBrandEntries.length ? `<p class="matched">Matched: ${niceList(matchedBrandEntries)}</p>` : ""}

      <div class="table-wrap">
        <table>
          <tbody>
            ${presentBrands}
          </tbody>
        </table>
      </div>

      <p class="note">${row.notes}</p>
    `;

    els.results.appendChild(card);
  });
}

function clearFilters(){
  els.search.value = "";
  els.brand.value = "";
  els.section.value = "";
  render();
}

populateFilters();
render();

els.search.addEventListener("input", render);
els.brand.addEventListener("change", render);
els.section.addEventListener("change", render);
els.clearBtn.addEventListener("click", clearFilters);

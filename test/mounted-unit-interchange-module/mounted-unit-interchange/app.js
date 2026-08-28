const brandColumns = Object.keys(INTERCHANGE_ROWS[0] || {}).filter(k => !["category","page"].includes(k));
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const categoryFilter = document.getElementById("categoryFilter");
const results = document.getElementById("results");
const countInfo = document.getElementById("countInfo");

function normalise(value){
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function splitCell(value){
  if(!value) return [];
  return String(value).split(/\s{2,}|\n|\s\/\s/).map(v => v.trim()).filter(Boolean);
}

function allParts(row){
  const parts = [];
  brandColumns.forEach(brand => {
    splitCell(row[brand]).forEach(part => parts.push({brand, part}));
  });
  return parts;
}

function rowMatches(row, term, selectedBrand, category){
  if(category && row.category !== category) return false;
  const parts = allParts(row);
  if(!term && !selectedBrand) return true;
  return parts.some(item => {
    const brandOk = !selectedBrand || item.brand === selectedBrand;
    const termOk = !term || normalise(item.part).includes(term) || term.includes(normalise(item.part));
    return brandOk && termOk;
  });
}

function populateFilters(){
  brandColumns.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });

  [...new Set(INTERCHANGE_ROWS.map(r => r.category).filter(Boolean))].sort().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function render(){
  const term = normalise(searchInput.value);
  const selectedBrand = brandFilter.value;
  const category = categoryFilter.value;

  const rows = INTERCHANGE_ROWS.filter(row => rowMatches(row, term, selectedBrand, category));
  countInfo.textContent = `${rows.length} interchange group(s) shown from ${INTERCHANGE_ROWS.length} source rows.`;
  results.innerHTML = "";

  if(!rows.length){
    results.innerHTML = `<div class="empty">No interchange group found. Try removing punctuation, searching a partial part number, or clearing filters.</div>`;
    return;
  }

  rows.slice(0, 100).forEach(row => {
    const parts = allParts(row);
    const matched = parts.filter(item => {
      const brandOk = !selectedBrand || item.brand === selectedBrand;
      const termOk = !term || normalise(item.part).includes(term) || term.includes(normalise(item.part));
      return brandOk && termOk;
    });

    const card = document.createElement("section");
    card.className = "card";

    const rowsHtml = brandColumns.map(brand => {
      const value = row[brand] || "";
      const isMatch = splitCell(value).some(part => matched.some(m => m.brand === brand && m.part === part));
      return `<tr><td>${brand}</td><td class="part ${isMatch ? "matchText" : ""}">${value || "—"}</td></tr>`;
    }).join("");

    const matchedText = matched.length ? matched.map(m => `${m.brand}: ${m.part}`).join(" | ") : "Filtered result";

    card.innerHTML = `
      <h2>${row.category || "Interchange Group"}</h2>
      <div class="meta">
        <span class="badge matched">Source row: page ${row.page}</span>
        <span class="badge matched">Matched: ${matchedText}</span>
        <span class="badge warning">Verify shaft size, locking style, seals and application before substitution.</span>
      </div>
      <table>
        <thead><tr><th>Brand</th><th>Available Alternative</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;

    results.appendChild(card);
  });

  if(rows.length > 100){
    const note = document.createElement("div");
    note.className = "empty";
    note.textContent = "Showing first 100 results. Refine search for a shorter list.";
    results.appendChild(note);
  }
}

populateFilters();
searchInput.addEventListener("input", render);
brandFilter.addEventListener("change", render);
categoryFilter.addEventListener("change", render);
document.getElementById("clearBtn").addEventListener("click", () => { searchInput.value=""; brandFilter.value=""; categoryFilter.value=""; render(); });
render();

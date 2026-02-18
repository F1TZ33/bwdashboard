// Minimal taxonomy data and rendering
const TAXONOMY = [
  { id: "bearings", title: "Bearings", items: [
    "Deep Groove Ball Bearings","Angular Contact Ball Bearings","Self-Aligning Ball Bearings",
    "Cylindrical Roller Bearings","Spherical Roller Bearings","Needle Roller Bearings",
    "Tapered Roller Bearings","Thrust Bearings (Ball & Roller)","Plain / Bush Bearings",
    "Super Precision Bearings","Thin Section Bearings","Slewing Rings / Turntable Bearings",
    "Mounted Bearings / Insert Bearings","Bearing Units (Plummer Blocks / Pillow Blocks)",
    "Linear Bearings","Cam Followers / Track Rollers"
  ]},
  { id: "seals", title: "Seals & Sealing Systems", items: [
    "Oil Seals / Rotary Shaft Seals","Hydraulic & Pneumatic Seals","Mechanical Seals",
    "O-Rings","Gaskets","Packing Seals","V-Ring / Labyrinth Seals","Bearing Isolator Seals"
  ]},
  { id: "power-transmission", title: "Power Transmission", items: [
    "V-Belts","Timing Belts","Chain","Sprockets","Pulleys","Couplings",
    "Gearboxes / Speed Reducers","Electric Motors","Drives & Inverters"
  ]}
];

function qs(name){ return new URLSearchParams(window.location.search).get(name); }
function getCategoryById(id){ return TAXONOMY.find(c => c.id === id); }

function renderTiles(){
  const grid = document.getElementById("categoryGrid");
  if(!grid) return;
  grid.innerHTML = TAXONOMY.map(cat => `
    <a class="tile" href="product-taxonomy-category.html?cat=${cat.id}">
      <div class="tile__icon">⚙️</div>
      <div class="tile__label">${cat.title}</div>
      <div class="tile__meta">${cat.items.length} items</div>
    </a>`).join("");
}

function renderCategoryTree(){
  const wrap = document.getElementById("treeWrap");
  const titleEl = document.getElementById("categoryTitle");
  if(!wrap || !titleEl) return;
  const cat = getCategoryById(qs("cat"));
  if(!cat){ wrap.innerHTML = "Category not found"; return; }
  titleEl.textContent = cat.title;
  wrap.innerHTML = `<ul>${cat.items.map(i=>`<li>${i}</li>`).join("")}</ul>`;
}

renderTiles();
renderCategoryTree();

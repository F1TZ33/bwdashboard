/* taxonomy.js
   Pages:
   - product-taxonomy.html (tiles)
   - product-taxonomy-category.html (static product list)
*/

const TAXONOMY = [
  {
    id: "bearings",
    title: "Bearings",
    items: [
      "Deep Groove Ball Bearings",
      "Angular Contact Ball Bearings",
      "Self-Aligning Ball Bearings",
      "Cylindrical Roller Bearings",
      "Spherical Roller Bearings",
      "Needle Roller Bearings",
      "Tapered Roller Bearings",
      "Thrust Bearings (Ball & Roller)",
      "Plain / Bush Bearings",
      "Super Precision Bearings",
      "Thin Section Bearings",
      "Slewing Rings / Turntable Bearings",
      "Mounted Bearings / Insert Bearings",
      "Bearing Units (Plummer Blocks / Pillow Blocks)",
      "Linear Bearings",
      "Cam Followers / Track Rollers"
    ]
  },
  {
    id: "bearing-components",
    title: "Bearing Components & Accessories",
    items: [
      "Bearing Housings",
      "Sleeves (Adapter / Withdrawal)",
      "Locknuts & Lockwashers",
      "Shaft Collars",
      "Retaining Rings / Circlips",
      "Precision Locking Devices",
      "Bearing Isolators",
      "Spacer Rings",
      "Sealing Rings",
      "Bearing Kits / Repair Kits"
    ]
  },
  {
    id: "seals",
    title: "Seals & Sealing Systems",
    items: [
      "Oil Seals / Rotary Shaft Seals",
      "Hydraulic & Pneumatic Seals",
      "Mechanical Seals",
      "O-Rings",
      "Gaskets",
      "Packing Seals",
      "V-Ring / Labyrinth Seals",
      "Bearing Isolator Seals",
      "Custom Machined Seals"
    ]
  },
  {
    id: "power-transmission",
    title: "Power Transmission",
    items: [
      "V-Belts (Classical / Wedge / Banded)",
      "Timing Belts",
      "Conveyor Belts",
      "Chain (Drive / Conveyor / Engineered)",
      "Sprockets",
      "Pulleys / Sheaves",
      "Couplings (Jaw / Gear / Grid / Tyre / Chain)",
      "Gearboxes / Speed Reducers",
      "Electric Motors",
      "Drives & Inverters",
      "Keyless Locking Devices / Shrink Discs"
    ]
  },
  {
    id: "linear-motion",
    title: "Linear Motion & Precision Motion",
    items: [
      "Linear Guides & Rails",
      "Ball Screws",
      "Linear Actuators",
      "Linear Bushings",
      "Precision Motion Components"
    ]
  },
  {
    id: "lubrication",
    title: "Lubrication & Reliability",
    items: [
      "Grease",
      "Industrial Oils",
      "Automatic Lubrication Systems",
      "Lubrication Equipment",
      "Bearing Heaters",
      "Condition Monitoring",
      "Predictive Maintenance"
    ]
  },
  {
    id: "fluid-power",
    title: "Fluid Power & Pneumatics",
    items: [
      "Hydraulic Cylinders",
      "Hydraulic Valves & Controls",
      "Hydraulic Hose & Fittings",
      "Pneumatic Cylinders",
      "Pneumatic Valves",
      "Regulators & Filters",
      "Quick Couplers / Industrial Fittings"
    ]
  },
  {
    id: "pumps",
    title: "Pumps & Rotating Equipment",
    items: [
      "Industrial Pumps",
      "Pump Seals & Components",
      "Pump Repair / Refurbishment"
    ]
  },
  {
    id: "engineering-hardware",
    title: "Engineering Hardware & Mechanical Components",
    items: [
      "Fasteners",
      "Springs & Washers",
      "Engineering Plastics",
      "Shafting & Key Steel",
      "Bushes & Bronze Components",
      "Vibration Mounts",
      "Shims & Spacers"
    ]
  },
  {
    id: "mechanical-systems",
    title: "Industrial Motion & Mechanical Systems",
    items: [
      "Brakes (Industrial)",
      "Clutches",
      "Universal Joints",
      "Drive Shafts",
      "Friction Locking Devices",
      "Gearing Components"
    ]
  },
  {
    id: "tools-maintenance",
    title: "Tools, Maintenance & Workshop",
    items: [
      "Bearing Pullers & Installation Tools",
      "Adhesives & Sealants",
      "Measuring Equipment",
      "Workshop Consumables"
    ]
  },
  {
    id: "lifting-safety",
    title: "Lifting, Safety & Handling",
    items: [
      "Lifting Chains & Gear",
      "Slings & Rigging",
      "Hoists",
      "PPE & Safety Equipment",
      "Wheels & Castors",
      "Material Handling"
    ]
  },
  {
    id: "specialty",
    title: "Specialty / Advanced Systems",
    items: [
      "Mechatronics Systems",
      "Composite Bearings",
      "Custom Engineered Solutions"
    ]
  }
];

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function renderTiles() {
  const grid = document.getElementById("taxGrid");
  if (!grid) return;

  grid.innerHTML = TAXONOMY.map(cat => `
    <a class="tax-tile" href="product-taxonomy-category.html?cat=${encodeURIComponent(cat.id)}" aria-label="${esc(cat.title)}">
      <div class="tax-tile__img" aria-hidden="true">📁</div>
      <div class="tax-tile__label">${esc(cat.title)}</div>
      <div class="tax-tile__meta">${cat.items.length} items</div>
    </a>
  `).join("");
}

function renderCategoryList() {
  const wrap = document.getElementById("taxListWrap");
  const title = document.getElementById("taxCategoryTitle");
  if (!wrap || !title) return;

  const catId = getParam("cat");
  const cat = TAXONOMY.find(c => c.id === catId);

  const headerTitle = document.getElementById("taxHeaderTitle");
  const crumb = document.getElementById("taxCrumb");

  if (!cat) {
    title.textContent = "Category not found";
    if (headerTitle) headerTitle.textContent = "Category not found";
    if (crumb) crumb.textContent = "Not found";
    wrap.innerHTML = `<p class="tax-muted">Go back and choose a category.</p>`;
    return;
  }

  title.textContent = cat.title;
  if (headerTitle) headerTitle.textContent = cat.title;
  if (crumb) crumb.textContent = cat.title;

  // Static list (no links)
  wrap.innerHTML = `
    <ul class="tax-ul">
      ${cat.items.map(i => `<li class="tax-li">${esc(i)}</li>`).join("")}
    </ul>
  `;

  const backBtn = document.getElementById("taxBackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "product-taxonomy.html";
    });
  }
}

renderTiles();
renderCategoryList();

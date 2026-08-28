// BW Playbook Bearing Size Search data file.
// Add real catalogue records to BEARING_SIZE_DATA using this structure:
// { bwPart:"", part:"6205", brand:"NTN", type:"Ball Bearings", id:25, od:52, width:15, description:"6205 25x52x15", refs:["6205ZZ","6205LLU"], notes:"" }
// Optional second OD/width for flanged or double-width references: od2, width2.

window.BEARING_CATEGORY_REFERENCES = [
  { title:"Ball Bearings", source:"NTN Bearing Finder category" },
  { title:"Tapered Roller Bearings", source:"NTN Bearing Finder category" },
  { title:"Cylindrical Roller Bearings", source:"NTN Bearing Finder category" },
  { title:"Needle Roller Bearings", source:"NTN Bearing Finder category" },
  { title:"Spherical Roller Bearings", source:"NTN Bearing Finder category" },
  { title:"Mounted Ball Units", source:"NTN Bearing Finder category" },
  { title:"Mounted Roller Units", source:"NTN Bearing Finder category" },
  { title:"Parts & Accessories", source:"NTN Bearing Finder category" },
  { title:"Lubricators & Tools", source:"NTN Bearing Finder category" }
];

window.BEARING_SIZE_DATA = [
  {
    bwPart:"",
    part:"6205",
    brand:"NTN",
    type:"Ball Bearings",
    id:25,
    od:52,
    width:15,
    description:"Starter example only - replace/expand with BW catalogue data",
    refs:["6205ZZ", "6205LLU"],
    notes:"Example record included to prove search behaviour. Verify before production use."
  },
  {
    bwPart:"",
    part:"6005",
    brand:"NTN",
    type:"Ball Bearings",
    id:25,
    od:47,
    width:12,
    description:"Starter example only - replace/expand with BW catalogue data",
    refs:["6005ZZ", "6005LLU"],
    notes:"Example record included to prove search behaviour. Verify before production use."
  },
  {
    bwPart:"",
    part:"30205",
    brand:"NTN",
    type:"Tapered Roller Bearings",
    id:25,
    od:52,
    width:16.25,
    description:"Starter example only - replace/expand with BW catalogue data",
    refs:["30205J"],
    notes:"Example record included to prove search behaviour. Verify before production use."
  }
];

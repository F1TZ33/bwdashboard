// Mounted Unit Interchange data
// Built from the supplied AMI interchange table.
// Columns: AMI, Browning, Dodge, FYH, Hub City, INA, IPTCI, Link-Belt, MB, MRC/SKF, NTN, Sealmaster, Timken

const interchangeRows = [
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "BLP5-16",
      "Browning": "VSPL-116",
      "Dodge": "P2B-VSCB-100",
      "FYH": "SBP205-16",
      "Hub City": "PB100Lx1",
      "INA": "PAKY1",
      "IPTCI": "SBP205-16",
      "Link-Belt": "PL3-S216N",
      "Sealmaster": "VPL-16",
      "Timken": "SAK1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "BP5-16",
      "Browning": "VPS-116",
      "Dodge": "P2B-VSC-100",
      "INA": "PASEY1",
      "IPTCI": "SBP205-16",
      "Sealmaster": "VP-16",
      "Timken": "SAS1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "KHLP205-16",
      "Browning": "VPLE-116",
      "Dodge": "P2B-SXVB-100",
      "Hub City": "PB220x1",
      "INA": "PAK1",
      "Link-Belt": "PL3-W216U",
      "MRC/SKF": "SYH1FM",
      "NTN": "AELPL205-100",
      "Sealmaster": "VPL-16",
      "Timken": "VAK1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "KHP205-16",
      "Browning": "VPE-116",
      "Dodge": "P2B-SXV-200",
      "Hub City": "PB221x1",
      "INA": "PASE1",
      "Link-Belt": "P3-W216U",
      "MRC/SKF": "SY1FM",
      "NTN": "AELP205-100",
      "Sealmaster": "VP-16E",
      "Timken": "VAS1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "KHPP205-16",
      "Browning": "SSPE-116",
      "Dodge": "P2B-SLX-100",
      "FYH": "SAPP205-16F",
      "Hub City": "PB1",
      "INA": "S1FM",
      "NTN": "AELPP205-100",
      "Sealmaster": "SSP16E",
      "Timken": "PB1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "UCLP205-16",
      "Browning": "VPLS-216",
      "Dodge": "P2B-SCB-100",
      "FYH": "SL205-16",
      "Hub City": "PB250Wx1",
      "INA": "RAKY1",
      "IPTCI": "UCPL205-16",
      "Link-Belt": "PL3-U216N",
      "MB": "CL251",
      "MRC/SKF": "SYH1TF",
      "NTN": "UCPL205-100D1",
      "Sealmaster": "NPL-16",
      "Timken": "YAK1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "UCP205-16",
      "Browning": "VPS-216",
      "Dodge": "P2B-SC-100",
      "FYH": "UCP205-16",
      "Hub City": "PB251Wx1",
      "INA": "RASEY1",
      "IPTCI": "UCP205-16",
      "Link-Belt": "P3-U216N",
      "MB": "C251",
      "MRC/SKF": "SY1TF",
      "NTN": "UCP205-100D1",
      "Sealmaster": "NP-16",
      "Timken": "YAS1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "UCPX05-16",
      "Browning": "VPS-316",
      "Dodge": "P2B-SCM-100",
      "FYH": "UCPX05-16",
      "Hub City": "PB350x1",
      "IPTCI": "UCPX05-16",
      "MB": "C-35-1",
      "MRC/SKF": "SYM1TF",
      "NTN": "UCPX05-100D1",
      "Sealmaster": "MP-16",
      "Timken": "YASM1"
    }
  },
  {
    section: "Pillow Blocks",
    confidence: "Direct table interchange",
    notes: "Verify shaft size, locking style, seal arrangement and expansion/fixed requirement before substitution.",
    brands: {
      "AMI": "UGP205-16",
      "Browning": "VPE-216",
      "Dodge": "P2B-SXR-100",
      "FYH": "NAP205-16",
      "Hub City": "PB221Wx1",
      "INA": "RASE1",
      "IPTCI": "NAP205-16",
      "Link-Belt": "P3-Y216N",
      "MRC/SKF": "SY1WF",
      "NTN": "UELP205-100D1",
      "Sealmaster": "RP-16E",
      "Timken": "RAS1"
    }
  },
  {
    section: "Tapped Base",
    confidence: "Direct table interchange",
    notes: "Verify mounting footprint and base style before substitution.",
    brands: {
      "AMI": "UCTB205-16",
      "Browning": "VTBS-216",
      "Dodge": "TB-SC-100",
      "FYH": "UCPAN205-16",
      "Hub City": "TPB250Wx1",
      "INA": "RSHEY1",
      "IPTCI": "UCPA205-16",
      "Link-Belt": "PT3-U216N",
      "MB": "TBC-25-1",
      "Sealmaster": "TB-16",
      "Timken": "STB1"
    }
  },
  {
    section: "Take Up",
    confidence: "Direct table interchange",
    notes: "Verify take-up frame compatibility and adjustment range.",
    brands: {
      "AMI": "UCST205-16",
      "Browning": "VTWS-216",
      "Dodge": "WSTU-SC-100",
      "FYH": "UCT205-16E",
      "Hub City": "WSTU250Wx1",
      "INA": "RTUEY1",
      "IPTCI": "UCT205-16",
      "Link-Belt": "TH3-U216N",
      "MB": "TC-25-1",
      "MRC/SKF": "TYB1TF",
      "Sealmaster": "ST-16",
      "Timken": "YTU1"
    }
  },
  {
    section: "Bearing Insert",
    confidence: "Direct table interchange",
    notes: "Insert-only interchange. Confirm OD profile, locking style and seal type.",
    brands: {
      "AMI": "B5-16",
      "Browning": "VS-116",
      "Dodge": "INS-VSC-100",
      "FYH": "SB205-16",
      "Hub City": "B250x1",
      "INA": "GAY100-NPP-B-AS2/V",
      "IPTCI": "SB205-16G",
      "Link-Belt": "SG216EL",
      "NTN": "AS205-100",
      "Sealmaster": "L-16",
      "Timken": "YA100RRB"
    }
  },
  {
    section: "Bearing Insert",
    confidence: "Direct table interchange",
    notes: "Insert-only interchange. Confirm OD profile, locking style and seal type.",
    brands: {
      "AMI": "KH205-16",
      "Browning": "VE-116",
      "Dodge": "INS-SXV-100",
      "FYH": "SA205-16F",
      "Hub City": "B220x1",
      "INA": "GRA100-NPP-B-AS2/V",
      "IPTCI": "SA205-16G",
      "Link-Belt": "W216UL",
      "MRC/SKF": "YET205-100",
      "NTN": "AEL205-100",
      "Sealmaster": "V-16E",
      "Timken": "RA100RRB"
    }
  },
  {
    section: "Bearing Insert",
    confidence: "Direct table interchange",
    notes: "Insert-only interchange. Confirm OD profile, locking style and seal type.",
    brands: {
      "AMI": "UC205-16",
      "Browning": "VS-216",
      "Dodge": "INS-SC-100",
      "FYH": "UC205-16",
      "Hub City": "YW250x1",
      "INA": "GY1100-KRR-B-AS2/V",
      "IPTCI": "UC205-16",
      "Link-Belt": "UG216NL",
      "MB": "MB-25-1-PA",
      "MRC/SKF": "YAR205-100-2F",
      "NTN": "UC205-100D1",
      "Sealmaster": "2-1",
      "Timken": "GY1100KRB"
    }
  },
  {
    section: "Bearing Insert",
    confidence: "Direct table interchange",
    notes: "Insert-only interchange. Confirm OD profile, locking style and seal type.",
    brands: {
      "AMI": "UG205-16",
      "Browning": "VE-216",
      "Dodge": "INS-SXR-100",
      "FYH": "NA205-16",
      "Hub City": "YW220x1",
      "INA": "G1100-KRR-B-AS2/V",
      "IPTCI": "NA205-16",
      "Link-Belt": "YG216NL",
      "MRC/SKF": "YEL205-100-2F",
      "NTN": "UEL205-100D1",
      "Sealmaster": "R-16E",
      "Timken": "G1100KRRB"
    }
  },
  {
    section: "2 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify flange shape, bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "BFX205-16",
      "Browning": "V2S-116M",
      "Dodge": "LFT-SC-100",
      "Hub City": "FB160x1",
      "Link-Belt": "FX-W216U",
      "Sealmaster": "LFT-16",
      "Timken": "VFTD1"
    }
  },
  {
    section: "2 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify flange shape, bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "KHFT205-16",
      "Browning": "VF2E-116",
      "Dodge": "F2B-SXV-100",
      "FYH": "SAFL205-16",
      "Hub City": "FB230x1",
      "INA": "PCJT1",
      "IPTCI": "SAFL205-16",
      "Link-Belt": "FX3-W216U",
      "MRC/SKF": "FYT1FM",
      "NTN": "AELFL205-100",
      "Sealmaster": "VFT-16E",
      "Timken": "VCJT1"
    }
  },
  {
    section: "2 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify flange shape, bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "UCFT205-16",
      "Browning": "VF2S-216",
      "Dodge": "F2B-SC-100",
      "FYH": "UCFL205-16",
      "Hub City": "FB260Wx1",
      "INA": "RCJTY1",
      "IPTCI": "UCFL205-16",
      "Link-Belt": "FX3-U216N",
      "MB": "FC2-25-1",
      "MRC/SKF": "FYTB1TR",
      "NTN": "UCFL205-100D1",
      "Sealmaster": "SFT-16",
      "Timken": "YCJT1"
    }
  },
  {
    section: "2 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify flange shape, bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "UGFJT205-16",
      "Browning": "VF2E-216",
      "Dodge": "F2B-SXR-100",
      "FYH": "NANFL205-16",
      "Hub City": "FB230Wx1",
      "INA": "RCJT1",
      "IPTCI": "NANFL205-16",
      "MRC/SKF": "FYT1WM",
      "NTN": "UELFLU205-100D1",
      "Sealmaster": "RFT-16E",
      "Timken": "RCJT1"
    }
  },
  {
    section: "3 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify flange pattern and bolt spacing before substitution.",
    brands: {
      "AMI": "UCFB205-16",
      "Browning": "VFB-216",
      "Dodge": "FB-SC-100",
      "FYH": "UCFB205-16",
      "IPTCI": "UCFB205-16",
      "Link-Belt": "FB3-U216N",
      "MB": "MFB-25-1",
      "Sealmaster": "FB-16"
    }
  },
  {
    section: "4 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify square flange bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "BF205-16",
      "Browning": "VF4S-116",
      "Dodge": "F4B-VSC-100",
      "FYH": "SBF205-16",
      "Hub City": "FB250x1",
      "INA": "PCJY1",
      "IPTCI": "SBF205-16",
      "Link-Belt": "F3-S216N",
      "Sealmaster": "VF-16",
      "Timken": "SCJ1"
    }
  },
  {
    section: "4 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify square flange bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "UCF205-16",
      "Browning": "VF4S-216",
      "Dodge": "F4B-SC-100",
      "FYH": "UCF205-16E",
      "Hub City": "FB250Wx1",
      "INA": "RCJY1",
      "Link-Belt": "F3-U216N",
      "MB": "FC4-25-1",
      "MRC/SKF": "FY1TF",
      "NTN": "UCF205-100D1",
      "Sealmaster": "SF-16",
      "Timken": "YCJ1"
    }
  },
  {
    section: "4 Bolt Flange",
    confidence: "Direct table interchange",
    notes: "Verify square flange bolt spacing and pilot/register before substitution.",
    brands: {
      "AMI": "UGSLF205-16",
      "Browning": "VF4E-216",
      "Dodge": "F4B-SXR-100",
      "FYH": "NANF205-16",
      "Hub City": "FB220Wx1",
      "INA": "RCJ1",
      "Link-Belt": "F3-Y216N",
      "MRC/SKF": "FY1WF",
      "NTN": "UELF205-100D1",
      "Sealmaster": "RF-16E",
      "Timken": "RCJ1"
    }
  },
  {
    section: "Flange Cartridge",
    confidence: "Direct table interchange",
    notes: "Verify cartridge pilot/register and mounting arrangement.",
    brands: {
      "AMI": "UCFCS208-24",
      "Browning": "VFCS-224",
      "Dodge": "FC-SC-108",
      "MB": "PFC4-25-1",
      "Sealmaster": "SFC-24"
    }
  },
  {
    section: "Hanger",
    confidence: "Direct table interchange",
    notes: "Verify hanger style, bore and mounting envelope.",
    brands: {
      "AMI": "UCECH205-16",
      "FYH": "UCHA205-16E2",
      "MB": "MEHB-1",
      "NTN": "UCHB205-100D1",
      "Sealmaster": "SEHB-16",
      "Timken": "RHC1 (Accu-loc Style)"
    }
  }
];

const brandColumns = ["AMI","Browning","Dodge","FYH","Hub City","INA","IPTCI","Link-Belt","MB","MRC/SKF","NTN","Sealmaster","Timken"];

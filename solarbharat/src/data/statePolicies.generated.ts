/** AUTO-GENERATED — run scripts/generate-state-policies.mjs */
export interface StatePolicy {
  stateId: string
  stateName: string
  nodalAgency: string
  discomNote: string
  subsidyPctMid: number
  loanRatePct: number
  tariffMidRs: number
  tariffBandRs: [number, number]
  climateNote: string
  monsoonNote: string
  gridQuality: string
  /** True when using India-wide placeholders — verify tariff/subsidy locally */
  isFallbackPolicy?: boolean
}

export const STATE_POLICIES: Record<string, StatePolicy> = {
  "andaman-and-nicobar": {
    "stateId": "andaman-and-nicobar",
    "stateName": "Andaman and Nicobar",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "andhra-pradesh": {
    "stateId": "andhra-pradesh",
    "stateName": "Andhra Pradesh",
    "nodalAgency": "NREDCAP (Andhra Pradesh)",
    "discomNote": "APTRANSCO / APDISCOMs — confirm applicable DISCOM for your substation.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.7,
      3.35
    ],
    "climateNote": "Good coastal-to-inland variation; cyclone + humidity influence O&M.",
    "monsoonNote": "Jun–Sep monsoon can trim PR; verify soiling and vegetation.",
    "gridQuality": "Industrial corridors generally stronger; rural feeders may need upgrades.",
    "isFallbackPolicy": false
  },
  "arunachal-pradesh": {
    "stateId": "arunachal-pradesh",
    "stateName": "Arunachal Pradesh",
    "nodalAgency": "State nodal renewable agency (verify current portal)",
    "discomNote": "Arunachal Pradesh power utility — verify circle / voltage plan.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.2,
    "tariffBandRs": [
      2.9,
      3.6
    ],
    "climateNote": "Terrain + cloud cover varies sharply by valley; site survey essential.",
    "monsoonNote": "Heavy monsoon months — civil and access constraints dominate.",
    "gridQuality": "Remote grid extensions can dominate feasibility.",
    "isFallbackPolicy": false
  },
  "assam": {
    "stateId": "assam",
    "stateName": "Assam",
    "nodalAgency": "Assam Energy Development Agency (AEDA)",
    "discomNote": "APDCL — verify rural feeder capacity.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Humidity + flood risk — structural design and drainage matter.",
    "monsoonNote": "Monsoon downtime risk — budget availability + vegetation.",
    "gridQuality": "Mixed; flood-prone pockets may delay construction.",
    "isFallbackPolicy": false
  },
  "bihar": {
    "stateId": "bihar",
    "stateName": "Bihar",
    "nodalAgency": "BREDA / state nodal (verify)",
    "discomNote": "North Bihar Power / South Bihar Power / related DISCOM per area.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.1,
    "tariffBandRs": [
      2.8,
      3.45
    ],
    "climateNote": "Strong seasonal haze/fog can trim winter yield.",
    "monsoonNote": "Flood risk near rivers — civil planning critical.",
    "gridQuality": "Feasibility-sensitive to nearest 33/132 kV availability.",
    "isFallbackPolicy": false
  },
  "chandigarh": {
    "stateId": "chandigarh",
    "stateName": "Chandigarh",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "chhattisgarh": {
    "stateId": "chhattisgarh",
    "stateName": "Chhattisgarh",
    "nodalAgency": "CREDA",
    "discomNote": "CSPDCL / CSPDCL divisions — confirm billing category.",
    "subsidyPctMid": 60,
    "loanRatePct": 7.9,
    "tariffMidRs": 2.95,
    "tariffBandRs": [
      2.65,
      3.25
    ],
    "climateNote": "Good solar resource band; inland dust + heat.",
    "monsoonNote": "Monsoon dip + vegetation growth — cleaning discipline matters.",
    "gridQuality": "Mining/industrial pockets often better infrastructure.",
    "isFallbackPolicy": false
  },
  "dadra-and-nagar-haveli-and-daman-and-diu": {
    "stateId": "dadra-and-nagar-haveli-and-daman-and-diu",
    "stateName": "Dadra and Nagar Haveli and Daman and Diu",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "goa": {
    "stateId": "goa",
    "stateName": "Goa",
    "nodalAgency": "GEDA / Goa nodal (verify rooftop vs ground rules)",
    "discomNote": "Goa Electricity Department — confirm agricultural categorisation.",
    "subsidyPctMid": 40,
    "loanRatePct": 8,
    "tariffMidRs": 3.25,
    "tariffBandRs": [
      2.95,
      3.55
    ],
    "climateNote": "Coastal humidity + salt aerosols — module cleaning and corrosion.",
    "monsoonNote": "Heavy monsoon — torque/civil checks for mounting.",
    "gridQuality": "Urban feeders stronger; hinterland varies.",
    "isFallbackPolicy": false
  },
  "gujarat": {
    "stateId": "gujarat",
    "stateName": "Gujarat",
    "nodalAgency": "GEDA",
    "discomNote": "PGVCL / MGVCL / UGVCL / DGVCL — zone-specific.",
    "subsidyPctMid": 60,
    "loanRatePct": 7.5,
    "tariffMidRs": 2.85,
    "tariffBandRs": [
      2.65,
      3.05
    ],
    "climateNote": "Excellent annual irradiance; dust inland.",
    "monsoonNote": "Monsoon dip + dust storms — cleaning robot ROI often strong.",
    "gridQuality": "Generally strong near industrial corridors.",
    "isFallbackPolicy": false
  },
  "haryana": {
    "stateId": "haryana",
    "stateName": "Haryana",
    "nodalAgency": "HAREDA",
    "discomNote": "DHBVN / UHBVN — confirm district.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Fog/haze winters; strong summer yield.",
    "monsoonNote": "Monsoon humidity + dust cycles.",
    "gridQuality": "NCR pockets constrained — confirm bay availability early.",
    "isFallbackPolicy": false
  },
  "himachal-pradesh": {
    "stateId": "himachal-pradesh",
    "stateName": "Himachal Pradesh",
    "nodalAgency": "HIMURJA",
    "discomNote": "HPSEBL — valley-specific voltage constraints.",
    "subsidyPctMid": 45,
    "loanRatePct": 8.1,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "Terrain shading + snow pockets — ground mount needs careful siting.",
    "monsoonNote": "Monsoon landslide risk on hill roads — logistics matter.",
    "gridQuality": "Remote areas may require long LT/HT extensions.",
    "isFallbackPolicy": false
  },
  "jammu-and-kashmir": {
    "stateId": "jammu-and-kashmir",
    "stateName": "Jammu and Kashmir",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "jharkhand": {
    "stateId": "jharkhand",
    "stateName": "Jharkhand",
    "nodalAgency": "JREDA",
    "discomNote": "JBVNL — feeder-specific.",
    "subsidyPctMid": 55,
    "loanRatePct": 8,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Humidity + aerosols — cleaning discipline.",
    "monsoonNote": "Heavy rain months — availability dips.",
    "gridQuality": "Mining/industrial hubs vary widely.",
    "isFallbackPolicy": false
  },
  "karnataka": {
    "stateId": "karnataka",
    "stateName": "Karnataka",
    "nodalAgency": "KREDL",
    "discomNote": "ESCOMs — BESCOM / HESCOM / etc.",
    "subsidyPctMid": 50,
    "loanRatePct": 7.85,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "Strong interior irradiance; coastal humidity differs.",
    "monsoonNote": "Monsoon cloud cover — inverter clipping checks.",
    "gridQuality": "Mixed; confirm substation capacity.",
    "isFallbackPolicy": false
  },
  "kerala": {
    "stateId": "kerala",
    "stateName": "Kerala",
    "nodalAgency": "ANERT",
    "discomNote": "KSEB — agricultural tariff category verification.",
    "subsidyPctMid": 40,
    "loanRatePct": 8,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "High humidity + frequent cloud — yield modelling needs conservative PR.",
    "monsoonNote": "Extended monsoon — civil drainage + vegetation.",
    "gridQuality": "Backwater/coastal constraints common.",
    "isFallbackPolicy": false
  },
  "ladakh": {
    "stateId": "ladakh",
    "stateName": "Ladakh",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "lakshadweep": {
    "stateId": "lakshadweep",
    "stateName": "Lakshadweep",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "madhya-pradesh": {
    "stateId": "madhya-pradesh",
    "stateName": "Madhya Pradesh",
    "nodalAgency": "MPUVNL",
    "discomNote": "DISCOM zone-specific — CSPDCL / MPPKVVCL / etc.",
    "subsidyPctMid": 60,
    "loanRatePct": 7.65,
    "tariffMidRs": 2.95,
    "tariffBandRs": [
      2.7,
      3.15
    ],
    "climateNote": "Strong central plains irradiance.",
    "monsoonNote": "Monsoon dip — inland dust in dry months.",
    "gridQuality": "Bay availability varies — confirm early.",
    "isFallbackPolicy": false
  },
  "maharashtra": {
    "stateId": "maharashtra",
    "stateName": "Maharashtra",
    "nodalAgency": "MEDA",
    "discomNote": "MSEDCL — circle-specific.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3.1,
    "tariffBandRs": [
      2.85,
      3.35
    ],
    "climateNote": "Coastal vs Deccan differs materially.",
    "monsoonNote": "Heavy monsoon — drainage + vegetation.",
    "gridQuality": "Queue hotspots exist — confirm substation planning.",
    "isFallbackPolicy": false
  },
  "manipur": {
    "stateId": "manipur",
    "stateName": "Manipur",
    "nodalAgency": "MANIREDA",
    "discomNote": "MSPCL / MSPDCL — verify classification.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "Cloud + terrain variability — conservative PR.",
    "monsoonNote": "Extended rain season — access logistics.",
    "gridQuality": "Remote feeders — extension costs can dominate.",
    "isFallbackPolicy": false
  },
  "meghalaya": {
    "stateId": "meghalaya",
    "stateName": "Meghalaya",
    "nodalAgency": "Meghalaya nodal renewable agency (verify)",
    "discomNote": "MePDCL — terrain-sensitive planning.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "High rainfall regions — conservative yield assumptions.",
    "monsoonNote": "Monsoon-heavy — civil works scheduling.",
    "gridQuality": "Terrain constrains grid routing.",
    "isFallbackPolicy": false
  },
  "mizoram": {
    "stateId": "mizoram",
    "stateName": "Mizoram",
    "nodalAgency": "Mizoram nodal renewable agency (verify)",
    "discomNote": "Power & Electricity Dept — confirm.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "Cloud-heavy seasons — conservative PR.",
    "monsoonNote": "Heavy rainfall — landslide risk on access roads.",
    "gridQuality": "Remote areas — extension costs.",
    "isFallbackPolicy": false
  },
  "nagaland": {
    "stateId": "nagaland",
    "stateName": "Nagaland",
    "nodalAgency": "Nagaland nodal renewable agency (verify)",
    "discomNote": "Department of Power — confirm.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "Terrain + cloud variability.",
    "monsoonNote": "Monsoon access constraints.",
    "gridQuality": "Remote pockets — budget extension quotes.",
    "isFallbackPolicy": false
  },
  "national-capital-territory-of-delhi": {
    "stateId": "national-capital-territory-of-delhi",
    "stateName": "National Capital Territory of Delhi",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "odisha": {
    "stateId": "odisha",
    "stateName": "Odisha",
    "nodalAgency": "OREDA",
    "discomNote": "TPCODL / NESCO / etc. — confirm DISCOM.",
    "subsidyPctMid": 55,
    "loanRatePct": 8,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Coastal cyclone exposure — structural design.",
    "monsoonNote": "Heavy monsoon — availability dips.",
    "gridQuality": "Industrial corridors vary.",
    "isFallbackPolicy": false
  },
  "puducherry": {
    "stateId": "puducherry",
    "stateName": "Puducherry",
    "nodalAgency": "MNRE / State nodal agency (verify on portal)",
    "discomNote": "Confirm your DISCOM and feeder voltage class with the utility.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "India spans multiple climate zones — use satellite-derived irradiance for your district centroid.",
    "monsoonNote": "Monsoon months reduce PR — budget cleaning and vegetation control.",
    "gridQuality": "Grid capacity and bay availability are site-specific — budget extension quotes early.",
    "isFallbackPolicy": true
  },
  "punjab": {
    "stateId": "punjab",
    "stateName": "Punjab",
    "nodalAgency": "PEDA",
    "discomNote": "PSPCL — feeder classification.",
    "subsidyPctMid": 50,
    "loanRatePct": 7.9,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Good plains irradiance; smog episodes can trim winter PR.",
    "monsoonNote": "Monsoon humidity — vegetation.",
    "gridQuality": "Generally decent near Highway corridors.",
    "isFallbackPolicy": false
  },
  "rajasthan": {
    "stateId": "rajasthan",
    "stateName": "Rajasthan",
    "nodalAgency": "RREC",
    "discomNote": "JdVVNL / AVVNL / RUVNL — zone-specific.",
    "subsidyPctMid": 60,
    "loanRatePct": 7.75,
    "tariffMidRs": 2.75,
    "tariffBandRs": [
      2.55,
      2.95
    ],
    "climateNote": "Excellent insolation; extreme dust.",
    "monsoonNote": "Short monsoon vs west coast — heat stress on equipment.",
    "gridQuality": "EHV corridors strong; remote sites may need long lines.",
    "isFallbackPolicy": false
  },
  "sikkim": {
    "stateId": "sikkim",
    "stateName": "Sikkim",
    "nodalAgency": "SREDA",
    "discomNote": "Energy & Power Dept — terrain constraints.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.2,
    "tariffBandRs": [
      2.9,
      3.5
    ],
    "climateNote": "Mountain shading + cloud — conservative yields.",
    "monsoonNote": "Landslide risk — logistics.",
    "gridQuality": "Often constrained — extension quotes critical.",
    "isFallbackPolicy": false
  },
  "tamil-nadu": {
    "stateId": "tamil-nadu",
    "stateName": "Tamil Nadu",
    "nodalAgency": "TEDA",
    "discomNote": "TANGEDCO — tariff schedule verification mandatory.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Wind + coastal aerosols — module clamp checks.",
    "monsoonNote": "Monsoon + cyclone exposure by coast.",
    "gridQuality": "Industrial zones vary widely.",
    "isFallbackPolicy": false
  },
  "telangana": {
    "stateId": "telangana",
    "stateName": "Telangana",
    "nodalAgency": "TSREDCO",
    "discomNote": "TSSPDCL / TSNPDCL — confirm.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3,
    "tariffBandRs": [
      2.75,
      3.25
    ],
    "climateNote": "Strong interior irradiance.",
    "monsoonNote": "Monsoon humidity — vegetation.",
    "gridQuality": "Generally decent near highways.",
    "isFallbackPolicy": false
  },
  "tripura": {
    "stateId": "tripura",
    "stateName": "Tripura",
    "nodalAgency": "Tripura nodal renewable agency (verify)",
    "discomNote": "TSECL — confirm.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.2,
    "tariffMidRs": 3.1,
    "tariffBandRs": [
      2.8,
      3.4
    ],
    "climateNote": "Cloud-heavy periods — conservative PR.",
    "monsoonNote": "Heavy rainfall — civil logistics.",
    "gridQuality": "Small grid — confirm bay availability.",
    "isFallbackPolicy": false
  },
  "uttar-pradesh": {
    "stateId": "uttar-pradesh",
    "stateName": "Uttar Pradesh",
    "nodalAgency": "UPNEDA",
    "discomNote": "PVVNL / MVVNL / etc. — zone-specific.",
    "subsidyPctMid": 55,
    "loanRatePct": 8.1,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.8,
      3.3
    ],
    "climateNote": "Fog/haze winters in pockets.",
    "monsoonNote": "Monsoon flooding risk in low-lying belts.",
    "gridQuality": "Mixed — confirm protection settings early.",
    "isFallbackPolicy": false
  },
  "uttarakhand": {
    "stateId": "uttarakhand",
    "stateName": "Uttarakhand",
    "nodalAgency": "UREDA",
    "discomNote": "UPCL — valley-specific constraints.",
    "subsidyPctMid": 50,
    "loanRatePct": 8.1,
    "tariffMidRs": 3.15,
    "tariffBandRs": [
      2.85,
      3.45
    ],
    "climateNote": "Mountain shading + snow — conservative yield.",
    "monsoonNote": "Monsoon landslide risk — logistics.",
    "gridQuality": "Terrain-heavy regions — extension costs.",
    "isFallbackPolicy": false
  },
  "west-bengal": {
    "stateId": "west-bengal",
    "stateName": "West Bengal",
    "nodalAgency": "WBREDA",
    "discomNote": "WBSEDCL / CESC areas — verify.",
    "subsidyPctMid": 50,
    "loanRatePct": 8,
    "tariffMidRs": 3.05,
    "tariffBandRs": [
      2.75,
      3.35
    ],
    "climateNote": "Humidity + haze; coastal cyclone exposure.",
    "monsoonNote": "Heavy monsoon — drainage.",
    "gridQuality": "Industrial belts vary.",
    "isFallbackPolicy": false
  }
}

export function getStatePolicy(stateId: string): StatePolicy | undefined {
  return STATE_POLICIES[stateId]
}

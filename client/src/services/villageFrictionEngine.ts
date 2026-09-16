export interface VillageData {
  id: string;
  villageName: string;
  block: string;
  district: string;
  state: string;
  totalPopulation: number;
  bplPopulationPercent: number;
  pfiScore: number; // 0 - 100
  frictionCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  barriers: {
    travelKm: number;
    travelTimeMins: number;
    transitAvailability: 'Severe Desert' | 'Poor' | 'Moderate' | 'Good';
    travelScore: number;

    primaryLanguage: string;
    dialectMatchPercent: number;
    digitalLiteracy: 'Low' | 'Basic' | 'Moderate' | 'High';
    languageScore: number;

    nearestHospital: string;
    bedOccupancyPercent: number;
    specialistAvailability: 'Deficit' | 'Moderate' | 'Adequate';
    resourceScore: number;

    avgOpdWaitTimeMins: number;
    abhaLinkagePercent: number;
    queueDocsScore: number;
  };
  dominantBarrierSummary: string;
  geoCoords: { lat: number; lng: number };
}

export interface AvailableInterventionOption {
  code: string;
  name: string;
  category: 'transit' | 'language' | 'resource' | 'digital_queue' | 'diagnostics' | 'infrastructure' | 'camp';
  unitCostINR: number;
  reachVillagersPerUnit: number;
  frictionReductionPoints: number; // PFI reduction points
  description: string;
  bestSuitedFor: string;
}

export interface VillageBudgetOptimizationResult {
  village: VillageData;
  allocatedBudgetINR: number;
  unspentBudgetINR: number;
  budgetTierLabel: 'Micro Campaign' | 'Moderate Operational Upgrade' | 'Capital Mobile Fleet' | 'Major Hospital Infrastructure Construction';
  selectedInterventions: {
    intervention: AvailableInterventionOption;
    quantity: number;
    totalCostINR: number;
    totalReductionPoints: number;
  }[];
  baselinePfiScore: number;
  projectedPfiScore: number;
  frictionReductionPercent: number;
  projectedCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  estimatedVillagersHelped: number;
  costPerVillagerHelpedINR: number;
  governmentRationale: string;
}

export const INTERVENTION_CATALOG: AvailableInterventionOption[] = [
  // ── INFRASTRUCTURE (FOR LARGE BUDGETS > ₹50 LAKHS) ──
  {
    code: 'INT-CONSTRUCT-PHC',
    name: 'Construct New Primary Health Centre (PHC) Hospital in Village',
    category: 'infrastructure',
    unitCostINR: 5000000, // ₹50 Lakhs
    reachVillagersPerUnit: 10000,
    frictionReductionPoints: 55,
    description: 'Construct a 10-bed Primary Health Centre (PHC) with 24/7 doctor, maternity bay, and emergency ward right in the village.',
    bestSuitedFor: 'High budget (> ₹50 Lakhs) for critical remote villages with travel distance > 20 km.',
  },
  {
    code: 'INT-SUB-CENTER-UPGRADE',
    name: 'Establish Health & Wellness Sub-Center Node',
    category: 'infrastructure',
    unitCostINR: 1500000, // ₹15 Lakhs
    reachVillagersPerUnit: 5000,
    frictionReductionPoints: 38,
    description: 'Upgrade village sub-center with 24/7 Community Health Officer (CHO), diagnostic lab point, and solar power.',
    bestSuitedFor: 'Capital budget (₹15 Lakhs - ₹30 Lakhs) for villages with high resource scarcity.',
  },

  // ── CAPITAL MOBILE FLEET (₹5 LAKHS - ₹15 LAKHS) ──
  {
    code: 'INT-MOBILE-CLINIC',
    name: 'Mobile Tele-Medicine & Diagnostic Van Fleet',
    category: 'diagnostics',
    unitCostINR: 600000, // ₹6 Lakhs
    reachVillagersPerUnit: 4500,
    frictionReductionPoints: 34,
    description: 'Equipped 4x4 van with ECG, rapid blood analyzer, solar power, and satellite tele-consultation screen.',
    bestSuitedFor: 'Villages with high specialist deficit or riverine/mountain transit barriers.',
  },

  // ── MODERATE OPERATIONAL UPGRADES (₹1 LAKH - ₹5 LAKHS) ──
  {
    code: 'INT-TRANSIT-SHUTTLE',
    name: 'Subsidized ASHA Village Bus Shuttle Service',
    category: 'transit',
    unitCostINR: 150000, // ₹1.5 Lakhs
    reachVillagersPerUnit: 1500,
    frictionReductionPoints: 24,
    description: 'Scheduled daily minibus connecting village cluster directly to District Hospital & Sub-Divisional OPD.',
    bestSuitedFor: 'Villages with transit deserts or travel time > 45 mins.',
  },
  {
    code: 'INT-VOICE-KIOSK',
    name: 'Vernacular Dialect Voice AI Token Kiosk',
    category: 'language',
    unitCostINR: 75000, // ₹75,000
    reachVillagersPerUnit: 2500,
    frictionReductionPoints: 18,
    description: 'Touchscreen + audio kiosk speaking local dialect (Bhojpuri, Magahi, Maithili, Mundari) for pre-booking OPD tokens.',
    bestSuitedFor: 'Villages with low digital literacy or dialect mismatch.',
  },
  {
    code: 'INT-OPD-FASTTRACK',
    name: 'Hospital OPD Digital Queue Fast-Track Scanner',
    category: 'digital_queue',
    unitCostINR: 50000, // ₹50,000
    reachVillagersPerUnit: 3000,
    frictionReductionPoints: 14,
    description: 'ABHA QR code priority scanner at hospital triage desk to bypass 2-hour registration lines.',
    bestSuitedFor: 'Villages experiencing OPD wait times > 60 mins.',
  },

  // ── MICRO CAMPAIGNS (< ₹1 LAKH) ──
  {
    code: 'INT-HEALTH-CAMP',
    name: 'Village Healthcare & Screening Camp',
    category: 'camp',
    unitCostINR: 40000, // ₹40,000
    reachVillagersPerUnit: 1000,
    frictionReductionPoints: 12,
    description: '1-day mobile medical camp with doctors, eye specialists, maternal checkups, and free medicine distribution.',
    bestSuitedFor: 'Low budget (< ₹1 Lakh) to provide immediate community health coverage.',
  },
  {
    code: 'INT-ESSENTIAL-DRUG-DEPOT',
    name: 'ASHA Emergency Essential Medicine Buffer',
    category: 'resource',
    unitCostINR: 35000, // ₹35,000
    reachVillagersPerUnit: 1200,
    frictionReductionPoints: 10,
    description: 'Restocking village ASHA kits with NCD medications, antibiotics, and maternal iron supplements.',
    bestSuitedFor: 'Low budget villages facing essential medicine stockouts.',
  },
];

export const REAL_INDIAN_VILLAGES_DATABASE: VillageData[] = [
  // ── BIHAR VILLAGES ──
  {
    id: 'v-diara-br',
    villageName: 'Diara Riverine Panchayat',
    block: 'Danapur',
    district: 'Patna',
    state: 'Bihar',
    totalPopulation: 9500,
    bplPopulationPercent: 71,
    pfiScore: 86,
    frictionCategory: 'CRITICAL',
    barriers: {
      travelKm: 22.0,
      travelTimeMins: 110,
      transitAvailability: 'Severe Desert',
      travelScore: 94,
      primaryLanguage: 'Bhojpuri / Maithili',
      dialectMatchPercent: 70,
      digitalLiteracy: 'Low',
      languageScore: 72,
      nearestHospital: 'PMCH Patna (Tertiary Medical College)',
      bedOccupancyPercent: 140,
      specialistAvailability: 'Deficit',
      resourceScore: 88,
      avgOpdWaitTimeMins: 160,
      abhaLinkagePercent: 39,
      queueDocsScore: 90,
    },
    dominantBarrierSummary: 'Ganges river transit obstacle, PMCH hospital overcrowding, and low ABHA registration.',
    geoCoords: { lat: 25.632, lng: 85.042 },
  },
  {
    id: 'v-janipur-br',
    villageName: 'Janipur Rural Village',
    block: 'Phulwari Sharif',
    district: 'Patna',
    state: 'Bihar',
    totalPopulation: 5800,
    bplPopulationPercent: 45,
    pfiScore: 58,
    frictionCategory: 'MODERATE',
    barriers: {
      travelKm: 8.5,
      travelTimeMins: 32,
      transitAvailability: 'Moderate',
      travelScore: 48,
      primaryLanguage: 'Bhojpuri / Magahi',
      dialectMatchPercent: 88,
      digitalLiteracy: 'Basic',
      languageScore: 42,
      nearestHospital: 'AIIMS Patna / Danapur Sub-Divisional Hospital',
      bedOccupancyPercent: 95,
      specialistAvailability: 'Moderate',
      resourceScore: 65,
      avgOpdWaitTimeMins: 70,
      abhaLinkagePercent: 68,
      queueDocsScore: 56,
    },
    dominantBarrierSummary: 'Suburban traffic choke points and peak registration queues.',
    geoCoords: { lat: 25.568, lng: 85.078 },
  },
  {
    id: 'v-bakraur-br',
    villageName: 'Bakraur Rural Panchayat',
    block: 'Bodh Gaya',
    district: 'Gaya',
    state: 'Bihar',
    totalPopulation: 6200,
    bplPopulationPercent: 62,
    pfiScore: 79,
    frictionCategory: 'HIGH',
    barriers: {
      travelKm: 16.5,
      travelTimeMins: 48,
      transitAvailability: 'Poor',
      travelScore: 74,
      primaryLanguage: 'Magahi',
      dialectMatchPercent: 78,
      digitalLiteracy: 'Low',
      languageScore: 68,
      nearestHospital: 'ANMMCH Gaya (District Hospital)',
      bedOccupancyPercent: 92,
      specialistAvailability: 'Deficit',
      resourceScore: 82,
      avgOpdWaitTimeMins: 85,
      abhaLinkagePercent: 46,
      queueDocsScore: 78,
    },
    dominantBarrierSummary: 'Seasonal river flooding, high out-of-pocket medicine expense, and low digital literacy.',
    geoCoords: { lat: 24.696, lng: 84.991 },
  },
  {
    id: 'v-sobh-br',
    villageName: 'Sobh Tribal Forest Village',
    block: 'Barachatti',
    district: 'Gaya',
    state: 'Bihar',
    totalPopulation: 4300,
    bplPopulationPercent: 78,
    pfiScore: 88,
    frictionCategory: 'CRITICAL',
    barriers: {
      travelKm: 38.0,
      travelTimeMins: 115,
      transitAvailability: 'Severe Desert',
      travelScore: 95,
      primaryLanguage: 'Magahi / Local Dialect',
      dialectMatchPercent: 62,
      digitalLiteracy: 'Low',
      languageScore: 84,
      nearestHospital: 'Barachatti CHC / ANMMCH Gaya',
      bedOccupancyPercent: 98,
      specialistAvailability: 'Deficit',
      resourceScore: 92,
      avgOpdWaitTimeMins: 120,
      abhaLinkagePercent: 28,
      queueDocsScore: 88,
    },
    dominantBarrierSummary: 'Forest terrain transit desert, zero public bus connectivity, and maternal specialist deficit.',
    geoCoords: { lat: 24.512, lng: 85.014 },
  },
  {
    id: 'v-kanti-br',
    villageName: 'Kanti Thermal Settlement',
    block: 'Kanti',
    district: 'Muzaffarpur',
    state: 'Bihar',
    totalPopulation: 7100,
    bplPopulationPercent: 58,
    pfiScore: 72,
    frictionCategory: 'HIGH',
    barriers: {
      travelKm: 14.8,
      travelTimeMins: 45,
      transitAvailability: 'Moderate',
      travelScore: 66,
      primaryLanguage: 'Vajjika / Hindi',
      dialectMatchPercent: 82,
      digitalLiteracy: 'Basic',
      languageScore: 54,
      nearestHospital: 'SKMCH Muzaffarpur Medical College',
      bedOccupancyPercent: 115,
      specialistAvailability: 'Moderate',
      resourceScore: 78,
      avgOpdWaitTimeMins: 90,
      abhaLinkagePercent: 54,
      queueDocsScore: 70,
    },
    dominantBarrierSummary: 'SKMCH hospital overcrowding and long OPD registration queues.',
    geoCoords: { lat: 26.185, lng: 85.289 },
  },

  // ── PUNJAB VILLAGES ──
  {
    id: 'v-chaheru-pb',
    villageName: 'Chaheru Village & LPU Outskirts',
    block: 'Phagwara',
    district: 'Kapurthala',
    state: 'Punjab',
    totalPopulation: 6400,
    bplPopulationPercent: 24,
    pfiScore: 48,
    frictionCategory: 'MODERATE',
    barriers: {
      travelKm: 4.5,
      travelTimeMins: 20,
      transitAvailability: 'Moderate',
      travelScore: 42,
      primaryLanguage: 'Punjabi / Hindi',
      dialectMatchPercent: 92,
      digitalLiteracy: 'Moderate',
      languageScore: 30,
      nearestHospital: 'Civil Hospital Phagwara (Sub-Divisional)',
      bedOccupancyPercent: 78,
      specialistAvailability: 'Moderate',
      resourceScore: 54,
      avgOpdWaitTimeMins: 45,
      abhaLinkagePercent: 84,
      queueDocsScore: 40,
    },
    dominantBarrierSummary: 'Morning peak OPD wait times and specialist availability during off-hours.',
    geoCoords: { lat: 31.2533, lng: 75.7042 },
  },
  {
    id: 'v-bholath-pb',
    villageName: 'Bholath Rural Cluster',
    block: 'Bholath',
    district: 'Kapurthala',
    state: 'Punjab',
    totalPopulation: 8900,
    bplPopulationPercent: 38,
    pfiScore: 74,
    frictionCategory: 'HIGH',
    barriers: {
      travelKm: 19.2,
      travelTimeMins: 55,
      transitAvailability: 'Poor',
      travelScore: 78,
      primaryLanguage: 'Rural Punjabi',
      dialectMatchPercent: 78,
      digitalLiteracy: 'Low',
      languageScore: 68,
      nearestHospital: 'CHC Bholath / District Hospital Kapurthala',
      bedOccupancyPercent: 94,
      specialistAvailability: 'Deficit',
      resourceScore: 84,
      avgOpdWaitTimeMins: 80,
      abhaLinkagePercent: 52,
      queueDocsScore: 68,
    },
    dominantBarrierSummary: 'Infrequent rural shuttle buses and maternal specialist shortage.',
    geoCoords: { lat: 31.527, lng: 75.521 },
  },

  // ── JHARKHAND VILLAGES ──
  {
    id: 'v-boreya-jh',
    villageName: 'Boreya Tribal Settlement',
    block: 'Kanke',
    district: 'Ranchi',
    state: 'Jharkhand',
    totalPopulation: 5200,
    bplPopulationPercent: 64,
    pfiScore: 88,
    frictionCategory: 'CRITICAL',
    barriers: {
      travelKm: 27.5,
      travelTimeMins: 90,
      transitAvailability: 'Severe Desert',
      travelScore: 94,
      primaryLanguage: 'Mundari / Nagpuri',
      dialectMatchPercent: 54,
      digitalLiteracy: 'Low',
      languageScore: 86,
      nearestHospital: 'RIMS Medical College Ranchi',
      bedOccupancyPercent: 128,
      specialistAvailability: 'Deficit',
      resourceScore: 92,
      avgOpdWaitTimeMins: 135,
      abhaLinkagePercent: 34,
      queueDocsScore: 88,
    },
    dominantBarrierSummary: 'Language mismatch (Mundari to Hindi), severe transit desert, and extreme RIMS hospital queue.',
    geoCoords: { lat: 23.432, lng: 85.321 },
  },

  // ── MAHARASHTRA VILLAGES ──
  {
    id: 'v-dabhosa-mh',
    villageName: 'Dabhosa Warli Tribal Hamlet',
    block: 'Jawhar',
    district: 'Palghar',
    state: 'Maharashtra',
    totalPopulation: 4100,
    bplPopulationPercent: 68,
    pfiScore: 86,
    frictionCategory: 'CRITICAL',
    barriers: {
      travelKm: 33.0,
      travelTimeMins: 100,
      transitAvailability: 'Poor',
      travelScore: 92,
      primaryLanguage: 'Warli / Marathi',
      dialectMatchPercent: 58,
      digitalLiteracy: 'Low',
      languageScore: 84,
      nearestHospital: 'Jawhar Sub-District Hospital',
      bedOccupancyPercent: 88,
      specialistAvailability: 'Deficit',
      resourceScore: 86,
      avgOpdWaitTimeMins: 95,
      abhaLinkagePercent: 42,
      queueDocsScore: 82,
    },
    dominantBarrierSummary: 'Sahyadri mountain travel obstacle, Warli dialect gap, and maternal specialist deficit.',
    geoCoords: { lat: 19.904, lng: 73.232 },
  },

  // ── RAJASTHAN VILLAGES ──
  {
    id: 'v-dhorimanna-rj',
    villageName: 'Dhorimanna Desert Outpost',
    block: 'Chohtan',
    district: 'Barmer',
    state: 'Rajasthan',
    totalPopulation: 4800,
    bplPopulationPercent: 74,
    pfiScore: 91,
    frictionCategory: 'CRITICAL',
    barriers: {
      travelKm: 44.0,
      travelTimeMins: 135,
      transitAvailability: 'Severe Desert',
      travelScore: 98,
      primaryLanguage: 'Marwari',
      dialectMatchPercent: 66,
      digitalLiteracy: 'Low',
      languageScore: 80,
      nearestHospital: 'Barmer District Hospital',
      bedOccupancyPercent: 84,
      specialistAvailability: 'Deficit',
      resourceScore: 90,
      avgOpdWaitTimeMins: 120,
      abhaLinkagePercent: 32,
      queueDocsScore: 88,
    },
    dominantBarrierSummary: 'Thar Desert extreme transit desert, dune road blockade, and zero public bus frequency.',
    geoCoords: { lat: 25.405, lng: 71.054 },
  },
];

export const villageFrictionEngine = {
  /**
   * Search villages by State, District, or Name query
   */
  searchVillages(query: string, stateFilter?: string, districtFilter?: string): VillageData[] {
    const q = (query || '').toLowerCase().trim();
    const sFilter = (stateFilter || '').toLowerCase().trim();
    const dFilter = (districtFilter || '').toLowerCase().trim();

    return REAL_INDIAN_VILLAGES_DATABASE.filter((v) => {
      const matchState = !sFilter || v.state.toLowerCase() === sFilter;
      const matchDistrict = !dFilter || v.district.toLowerCase() === dFilter;
      if (!matchState || !matchDistrict) return false;

      if (!q) return true;

      return (
        v.villageName.toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q) ||
        v.block.toLowerCase().includes(q) ||
        v.state.toLowerCase().includes(q) ||
        v.barriers.nearestHospital.toLowerCase().includes(q)
      );
    });
  },

  /**
   * Calculate Multi-Tier Government Budget Intervention Allocation for a given Village
   */
  optimizeGovernmentBudgetForVillage(
    villageId: string,
    allocatedBudgetINR: number
  ): VillageBudgetOptimizationResult {
    const village =
      REAL_INDIAN_VILLAGES_DATABASE.find((v) => v.id === villageId) || REAL_INDIAN_VILLAGES_DATABASE[0];

    let remainingBudget = allocatedBudgetINR;
    const selectedInterventions: VillageBudgetOptimizationResult['selectedInterventions'] = [];
    let totalPfiReductionPoints = 0;
    let totalVillagersHelped = 0;

    let budgetTierLabel: VillageBudgetOptimizationResult['budgetTierLabel'] = 'Micro Campaign';
    if (allocatedBudgetINR >= 5000000) {
      budgetTierLabel = 'Major Hospital Infrastructure Construction';
    } else if (allocatedBudgetINR >= 1500000) {
      budgetTierLabel = 'Capital Mobile Fleet';
    } else if (allocatedBudgetINR >= 200000) {
      budgetTierLabel = 'Moderate Operational Upgrade';
    } else {
      budgetTierLabel = 'Micro Campaign';
    }

    // Sort interventions according to budget tier and village barrier needs
    const sortedCatalog = [...INTERVENTION_CATALOG].sort((a, b) => {
      // If budget is large enough (> ₹50L), prioritize infrastructure
      if (allocatedBudgetINR >= 5000000) {
        if (a.category === 'infrastructure') return -1;
        if (b.category === 'infrastructure') return 1;
      }
      // If budget is low (< ₹2L), prioritize health camps and ASHA drug kits
      if (allocatedBudgetINR < 200000) {
        if (a.category === 'camp' || a.code === 'INT-ESSENTIAL-DRUG-DEPOT') return -1;
        if (b.category === 'camp' || b.code === 'INT-ESSENTIAL-DRUG-DEPOT') return 1;
      }

      let scoreA = a.frictionReductionPoints / a.unitCostINR;
      let scoreB = b.frictionReductionPoints / b.unitCostINR;

      if (village.barriers.travelScore > 70 && a.category === 'transit') scoreA *= 2.0;
      if (village.barriers.travelScore > 70 && b.category === 'transit') scoreB *= 2.0;

      if (village.barriers.languageScore > 70 && a.category === 'language') scoreA *= 1.8;
      if (village.barriers.languageScore > 70 && b.category === 'language') scoreB *= 1.8;

      return scoreB - scoreA;
    });

    for (const item of sortedCatalog) {
      if (remainingBudget >= item.unitCostINR) {
        const qty = Math.floor(remainingBudget / item.unitCostINR);
        if (qty > 0) {
          const totalCost = qty * item.unitCostINR;
          const totalReduction = qty * item.frictionReductionPoints;

          remainingBudget -= totalCost;
          totalPfiReductionPoints += totalReduction;
          totalVillagersHelped += Math.min(village.totalPopulation, qty * item.reachVillagersPerUnit);

          selectedInterventions.push({
            intervention: item,
            quantity: qty,
            totalCostINR: totalCost,
            totalReductionPoints: totalReduction,
          });
        }
      }
    }

    const baselinePfiScore = village.pfiScore;
    const projectedPfiScore = Math.max(10, baselinePfiScore - Math.min(75, totalPfiReductionPoints));
    const frictionReductionPercent = Math.round(
      ((baselinePfiScore - projectedPfiScore) / baselinePfiScore) * 100
    );

    let projectedCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (projectedPfiScore >= 80) projectedCategory = 'CRITICAL';
    else if (projectedPfiScore >= 65) projectedCategory = 'HIGH';
    else if (projectedPfiScore >= 45) projectedCategory = 'MODERATE';

    const spentBudget = allocatedBudgetINR - remainingBudget;
    const costPerVillagerHelpedINR =
      totalVillagersHelped > 0 ? Math.round(spentBudget / totalVillagersHelped) : 0;

    let actionSummaryText = '';
    if (allocatedBudgetINR >= 5000000) {
      actionSummaryText = `Constructing a New Primary Health Centre (PHC) in ${village.villageName} with 24/7 doctors and emergency beds`;
    } else if (allocatedBudgetINR >= 1500000) {
      actionSummaryText = `Establishing a Health & Wellness Sub-Center and Mobile Tele-Medicine Fleet for ${village.villageName}`;
    } else if (allocatedBudgetINR >= 200000) {
      actionSummaryText = `Deploying Subsidized ASHA Transit Bus Shuttle & Vernacular Voice Tokens for ${village.villageName}`;
    } else {
      actionSummaryText = `Conducting Village Health & Screening Camps and Restocking Emergency ASHA Medicine Depot for ${village.villageName}`;
    }

    const governmentRationale = `Allocating ₹${(spentBudget / 100000).toFixed(1)} Lakhs (${budgetTierLabel}) for ${
      village.villageName
    } (${village.district}, ${village.state}): ${actionSummaryText}. This resolves key village barriers (${village.dominantBarrierSummary}), reducing village PFI from ${baselinePfiScore} (${village.frictionCategory}) to ${projectedPfiScore} (${projectedCategory}) with a ${frictionReductionPercent}% overall access friction reduction.`;

    return {
      village,
      allocatedBudgetINR,
      unspentBudgetINR: remainingBudget,
      budgetTierLabel,
      selectedInterventions,
      baselinePfiScore,
      projectedPfiScore,
      frictionReductionPercent,
      projectedCategory,
      estimatedVillagersHelped: totalVillagersHelped,
      costPerVillagerHelpedINR,
      governmentRationale,
    };
  },
};

export const INDIA_STATES: string[] = [
  'Bihar',
  'Punjab',
  'Jharkhand',
  'Maharashtra',
  'Uttar Pradesh',
];

export const getStates = (): string[] => INDIA_STATES;

export const getDistrictsByState = (stateName: string): string[] => {
  const dists = REAL_INDIAN_VILLAGES_DATABASE.filter(
    (v) => v.state.toLowerCase() === stateName.toLowerCase()
  ).map((v) => v.district);
  return Array.from(new Set(dists));
};

export const getVillagesByDistrict = (districtName: string, stateName?: string): VillageData[] => {
  return REAL_INDIAN_VILLAGES_DATABASE.filter((v) => {
    const matchDist = v.district.toLowerCase() === districtName.toLowerCase();
    if (stateName) {
      return matchDist && v.state.toLowerCase() === stateName.toLowerCase();
    }
    return matchDist;
  });
};


export const INDIA_STATES = [
  'Punjab',
  'Jharkhand',
  'Bihar',
  'Uttar Pradesh',
  'Maharashtra',
  'Rajasthan',
  'Tamil Nadu',
  'West Bengal',
  'Karnataka',
  'Gujarat',
  'Madhya Pradesh',
  'Odisha',
  'Assam',
  'Haryana',
  'Kerala',
];

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
  category: 'transit' | 'language' | 'resource' | 'digital_queue' | 'diagnostics';
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
  {
    code: 'INT-TRANSIT-SHUTTLE',
    name: 'Subsidized ASHA Transit Bus Shuttle',
    category: 'transit',
    unitCostINR: 150000,
    reachVillagersPerUnit: 1200,
    frictionReductionPoints: 22,
    description: 'Scheduled daily minibus connect village cluster directly to District Sub-Divisional Hospital.',
    bestSuitedFor: 'Villages with travel distance > 15 km or transit deserts.',
  },
  {
    code: 'INT-VOICE-KIOSK',
    name: 'Vernacular Dialect Voice AI Token Kiosk',
    category: 'language',
    unitCostINR: 75000,
    reachVillagersPerUnit: 2500,
    frictionReductionPoints: 18,
    description: 'Touchscreen + audio kiosk speaking local dialect for pre-booking OPD tokens and voice consent.',
    bestSuitedFor: 'Villages with low digital literacy or dialect mismatch.',
  },
  {
    code: 'INT-MOBILE-CLINIC',
    name: 'Mobile Tele-Medicine & Diagnostic Van',
    category: 'diagnostics',
    unitCostINR: 500000,
    reachVillagersPerUnit: 4500,
    frictionReductionPoints: 34,
    description: 'Equipped 4x4 van with ECG, rapid blood analyzer, and satellite tele-consultation screen.',
    bestSuitedFor: 'Critical remote villages with high specialist deficit.',
  },
  {
    code: 'INT-OPD-FASTTRACK',
    name: 'Hospital OPD Digital Queue Fast-Track',
    category: 'digital_queue',
    unitCostINR: 50000,
    reachVillagersPerUnit: 3000,
    frictionReductionPoints: 14,
    description: 'ABHA QR code priority scanner at hospital triage desk to bypass 2-hour registration lines.',
    bestSuitedFor: 'Villages experiencing OPD wait times > 60 mins.',
  },
  {
    code: 'INT-ESSENTIAL-DRUG-DEPOT',
    name: 'Village Emergency Essential Medicine Buffer',
    category: 'resource',
    unitCostINR: 60000,
    reachVillagersPerUnit: 1800,
    frictionReductionPoints: 15,
    description: 'Restocking ASHA kit with NCD medications, antibiotics, and maternal iron supplements.',
    bestSuitedFor: 'High BPL population villages facing stockout risks.',
  },
];

export const REAL_INDIAN_VILLAGES_DATABASE: VillageData[] = [
  // Punjab Villages
  {
    id: 'v-chaheru-pb',
    villageName: 'Chaheru Village & LPU Outskirts',
    block: 'Phagwara',
    district: 'Kapurthala',
    state: 'Punjab',
    totalPopulation: 6400,
    bplPopulationPercent: 24,
    pfiScore: 52,
    frictionCategory: 'MODERATE',
    barriers: {
      travelKm: 4.5,
      travelTimeMins: 20,
      transitAvailability: 'Moderate',
      travelScore: 45,
      primaryLanguage: 'Punjabi / Hindi',
      dialectMatchPercent: 90,
      digitalLiteracy: 'Moderate',
      languageScore: 32,
      nearestHospital: 'Civil Hospital Phagwara (Sub-Divisional)',
      bedOccupancyPercent: 82,
      specialistAvailability: 'Moderate',
      resourceScore: 58,
      avgOpdWaitTimeMins: 50,
      abhaLinkagePercent: 80,
      queueDocsScore: 46,
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
    pfiScore: 76,
    frictionCategory: 'HIGH',
    barriers: {
      travelKm: 19.2,
      travelTimeMins: 55,
      transitAvailability: 'Poor',
      travelScore: 80,
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
    dominantBarrierSummary: 'Infrequent rural transport and shortage of maternal healthcare specialists.',
    geoCoords: { lat: 31.527, lng: 75.521 },
  },

  // Jharkhand Villages
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
    dominantBarrierSummary: 'Dialect communication gap, severe transit desert, and extreme RIMS hospital queue.',
    geoCoords: { lat: 23.432, lng: 85.321 },
  },
  {
    id: 'v-bhaga-jh',
    villageName: 'Bhaga Colliery Village',
    block: 'Jharia',
    district: 'Dhanbad',
    state: 'Jharkhand',
    totalPopulation: 7800,
    bplPopulationPercent: 52,
    pfiScore: 71,
    frictionCategory: 'HIGH',
    barriers: {
      travelKm: 13.4,
      travelTimeMins: 42,
      transitAvailability: 'Moderate',
      travelScore: 65,
      primaryLanguage: 'Khortha / Hindi',
      dialectMatchPercent: 82,
      digitalLiteracy: 'Basic',
      languageScore: 54,
      nearestHospital: 'Dhanbad District Hospital',
      bedOccupancyPercent: 98,
      specialistAvailability: 'Moderate',
      resourceScore: 78,
      avgOpdWaitTimeMins: 75,
      abhaLinkagePercent: 60,
      queueDocsScore: 66,
    },
    dominantBarrierSummary: 'High respiratory disease burden and long OPD registration queues.',
    geoCoords: { lat: 23.742, lng: 86.415 },
  },

  // Bihar Villages
  {
    id: 'v-diara-br',
    villageName: 'Diara Riverine Panchayat',
    block: 'Danapur',
    district: 'Patna',
    state: 'Bihar',
    totalPopulation: 9500,
    bplPopulationPercent: 71,
    pfiScore: 85,
    frictionCategory: 'CRITICAL',
    barriers: {
      travelKm: 21.0,
      travelTimeMins: 105,
      transitAvailability: 'Severe Desert',
      travelScore: 96,
      primaryLanguage: 'Bhojpuri / Maithili',
      dialectMatchPercent: 72,
      digitalLiteracy: 'Low',
      languageScore: 74,
      nearestHospital: 'PMCH Patna',
      bedOccupancyPercent: 138,
      specialistAvailability: 'Deficit',
      resourceScore: 90,
      avgOpdWaitTimeMins: 150,
      abhaLinkagePercent: 38,
      queueDocsScore: 92,
    },
    dominantBarrierSummary: 'Ganges river transit barrier, PMCH hospital overcrowding, and low ABHA registration.',
    geoCoords: { lat: 25.632, lng: 85.042 },
  },

  // Maharashtra Villages
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

  // Rajasthan Villages
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
  searchVillages(query: string, stateFilter?: string): VillageData[] {
    const q = (query || '').toLowerCase().trim();
    const sFilter = (stateFilter || '').toLowerCase().trim();

    return REAL_INDIAN_VILLAGES_DATABASE.filter((v) => {
      const matchState = !sFilter || v.state.toLowerCase() === sFilter;
      if (!matchState) return false;

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
   * Calculate Optimal Government Budget Intervention Allocation for a given Village
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

    // Prioritize interventions based on the village's dominant barriers
    const sortedCatalog = [...INTERVENTION_CATALOG].sort((a, b) => {
      let scoreA = a.frictionReductionPoints / a.unitCostINR;
      let scoreB = b.frictionReductionPoints / b.unitCostINR;

      // Boost score if intervention matches dominant village barrier
      if (village.barriers.travelScore > 70 && a.category === 'transit') scoreA *= 2.0;
      if (village.barriers.travelScore > 70 && b.category === 'transit') scoreB *= 2.0;

      if (village.barriers.languageScore > 70 && a.category === 'language') scoreA *= 1.8;
      if (village.barriers.languageScore > 70 && b.category === 'language') scoreB *= 1.8;

      if (village.barriers.resourceScore > 70 && a.category === 'diagnostics') scoreA *= 1.9;
      if (village.barriers.resourceScore > 70 && b.category === 'diagnostics') scoreB *= 1.9;

      if (village.barriers.queueDocsScore > 70 && a.category === 'digital_queue') scoreA *= 1.7;
      if (village.barriers.queueDocsScore > 70 && b.category === 'digital_queue') scoreB *= 1.7;

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
    const projectedPfiScore = Math.max(12, baselinePfiScore - Math.min(65, totalPfiReductionPoints));
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

    const governmentRationale = `Allocating ₹${(spentBudget / 100000).toFixed(1)} Lakhs for ${
      village.villageName
    } (${village.district}, ${village.state}) resolves its primary barriers (${village.dominantBarrierSummary}). This reduces village PFI from ${baselinePfiScore} (${village.frictionCategory}) to ${projectedPfiScore} (${projectedCategory}) with a ${frictionReductionPercent}% overall access friction reduction.`;

    return {
      village,
      allocatedBudgetINR,
      unspentBudgetINR: remainingBudget,
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

export interface LocationFrictionData {
  id: string;
  state: string;
  district: string;
  block: string;
  villageOrLocality: string;
  pfiScore: number; // 0 - 100
  frictionCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  metrics: {
    travelDistanceKm: number;
    travelTimeMins: number;
    transitAvailability: 'Poor' | 'Moderate' | 'Good' | 'Severe Desert';
    travelFrictionScore: number; // 0 - 100

    primaryLanguage: string;
    languageMatchPercent: number;
    digitalLiteracyLevel: 'Low' | 'Basic' | 'Moderate' | 'High';
    languageFrictionScore: number; // 0 - 100

    nearestHospitalType: string;
    bedOccupancyPercent: number;
    specialistAvailability: 'Deficit' | 'Moderate' | 'Adequate';
    bplPercentage: number;
    resourceFrictionScore: number; // 0 - 100

    avgOpdWaitTimeMins: number;
    abhaLinkedPercent: number;
    documentationBarrier: 'High' | 'Moderate' | 'Low';
    queueDocsFrictionScore: number; // 0 - 100
  };
  keyBarriers: string[];
  recommendedIntervention: string;
  geoCoords: { lat: number; lng: number };
}

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

export const INDIA_LOCATIONS_DATABASE: LocationFrictionData[] = [
  // Punjab Locations
  {
    id: 'pb-phagwara-uni',
    state: 'Punjab',
    district: 'Kapurthala',
    block: 'Phagwara',
    villageOrLocality: 'Chaheru / LPU University Enclave',
    pfiScore: 48,
    frictionCategory: 'MODERATE',
    metrics: {
      travelDistanceKm: 4.2,
      travelTimeMins: 18,
      transitAvailability: 'Moderate',
      travelFrictionScore: 42,
      primaryLanguage: 'Punjabi / Hindi',
      languageMatchPercent: 92,
      digitalLiteracyLevel: 'Moderate',
      languageFrictionScore: 30,
      nearestHospitalType: 'Civil Sub-Divisional Hospital Phagwara',
      bedOccupancyPercent: 78,
      specialistAvailability: 'Moderate',
      bplPercentage: 22,
      resourceFrictionScore: 54,
      avgOpdWaitTimeMins: 45,
      abhaLinkedPercent: 84,
      documentationBarrier: 'Low',
      queueDocsFrictionScore: 40,
    },
    keyBarriers: ['Peak OPD morning queue', 'Limited evening specialist OPD'],
    recommendedIntervention: 'Deploy OPD Fast-Track Digital Token Kiosk at Civil Hospital Phagwara',
    geoCoords: { lat: 31.2533, lng: 75.7042 },
  },
  {
    id: 'pb-kapurthala-rural',
    state: 'Punjab',
    district: 'Kapurthala',
    block: 'Sultanpur Lodhi',
    villageOrLocality: 'Bholath Rural Cluster',
    pfiScore: 74,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 18.5,
      travelTimeMins: 52,
      transitAvailability: 'Poor',
      travelFrictionScore: 78,
      primaryLanguage: 'Punjabi (Rural Dialect)',
      languageMatchPercent: 75,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 65,
      nearestHospitalType: 'CHC Sultanpur Lodhi',
      bedOccupancyPercent: 92,
      specialistAvailability: 'Deficit',
      bplPercentage: 41,
      resourceFrictionScore: 82,
      avgOpdWaitTimeMins: 85,
      abhaLinkedPercent: 48,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 70,
    },
    keyBarriers: ['Infrequent rural shuttle buses', 'Maternal specialist shortage', 'Low digital literacy'],
    recommendedIntervention: 'Establish Subsidized ASHA Shuttle & Telemedicine Node',
    geoCoords: { lat: 31.216, lng: 75.198 },
  },

  // Jharkhand Locations
  {
    id: 'jh-ranchi-khunti',
    state: 'Jharkhand',
    district: 'Ranchi',
    block: 'Kanke',
    villageOrLocality: 'Boreya Tribal Hamlet',
    pfiScore: 86,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 28.4,
      travelTimeMins: 95,
      transitAvailability: 'Severe Desert',
      travelFrictionScore: 92,
      primaryLanguage: 'Nagpuri / Mundari',
      languageMatchPercent: 55,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 85,
      nearestHospitalType: 'RIMS Regional Medical College',
      bedOccupancyPercent: 125,
      specialistAvailability: 'Deficit',
      bplPercentage: 68,
      resourceFrictionScore: 90,
      avgOpdWaitTimeMins: 140,
      abhaLinkedPercent: 32,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 88,
    },
    keyBarriers: ['Language mismatch (Mundari to Hindi)', 'Tertiary hospital severe bed overcrowding', 'High travel cost'],
    recommendedIntervention: 'Deploy Vernacular Voice AI Booking & Mobile Tribal Ambulance',
    geoCoords: { lat: 23.432, lng: 85.321 },
  },
  {
    id: 'jh-dhanbad-jharia',
    state: 'Jharkhand',
    district: 'Dhanbad',
    block: 'Jharia',
    villageOrLocality: 'Bhaga Colliery Enclave',
    pfiScore: 68,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 12.1,
      travelTimeMins: 40,
      transitAvailability: 'Moderate',
      travelFrictionScore: 62,
      primaryLanguage: 'Khortha / Hindi',
      languageMatchPercent: 80,
      digitalLiteracyLevel: 'Basic',
      languageFrictionScore: 58,
      nearestHospitalType: 'Dhanbad District Hospital',
      bedOccupancyPercent: 96,
      specialistAvailability: 'Moderate',
      bplPercentage: 54,
      resourceFrictionScore: 76,
      avgOpdWaitTimeMins: 75,
      abhaLinkedPercent: 58,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 65,
    },
    keyBarriers: ['High respiratory care demand', 'Long OPD registration wait times'],
    recommendedIntervention: 'Expand Essential Medicine Pharmacy Buffer & Fast-Track Respiratory Desk',
    geoCoords: { lat: 23.742, lng: 86.415 },
  },

  // Bihar Locations
  {
    id: 'br-patna-danapur',
    state: 'Bihar',
    district: 'Patna',
    block: 'Danapur',
    villageOrLocality: 'Diara Riverine Cluster',
    pfiScore: 82,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 22.0,
      travelTimeMins: 110,
      transitAvailability: 'Severe Desert',
      travelFrictionScore: 94,
      primaryLanguage: 'Bhojpuri / Maithili',
      languageMatchPercent: 70,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 72,
      nearestHospitalType: 'PMCH Medical College Patna',
      bedOccupancyPercent: 140,
      specialistAvailability: 'Deficit',
      bplPercentage: 72,
      resourceFrictionScore: 88,
      avgOpdWaitTimeMins: 160,
      abhaLinkedPercent: 39,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 90,
    },
    keyBarriers: ['Riverine boat transit obstacle', 'Massive OPD queue at PMCH', 'Lack of digital tokens'],
    recommendedIntervention: 'Water Ambulance Connectivity + Pre-booked Token Dispatch',
    geoCoords: { lat: 25.632, lng: 85.042 },
  },
  {
    id: 'br-gaya-bodhgaya',
    state: 'Bihar',
    district: 'Gaya',
    block: 'Bodh Gaya',
    villageOrLocality: 'Bakraur Rural Panchayat',
    pfiScore: 61,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 14.2,
      travelTimeMins: 38,
      transitAvailability: 'Moderate',
      travelFrictionScore: 56,
      primaryLanguage: 'Magahi / Hindi',
      languageMatchPercent: 88,
      digitalLiteracyLevel: 'Basic',
      languageFrictionScore: 45,
      nearestHospitalType: 'ANMMCH Gaya',
      bedOccupancyPercent: 88,
      specialistAvailability: 'Moderate',
      bplPercentage: 58,
      resourceFrictionScore: 70,
      avgOpdWaitTimeMins: 65,
      abhaLinkedPercent: 62,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 58,
    },
    keyBarriers: ['Seasonal flood transit delay', 'High out-of-pocket medicine expense'],
    recommendedIntervention: 'ASHA Field Drug Kit Replenishment & Dialect Audio Consent',
    geoCoords: { lat: 24.696, lng: 84.991 },
  },

  // Uttar Pradesh Locations
  {
    id: 'up-varanasi-kashi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    block: 'Sewapuri',
    villageOrLocality: 'Pindra Village Panchayat',
    pfiScore: 65,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 16.8,
      travelTimeMins: 48,
      transitAvailability: 'Moderate',
      travelFrictionScore: 64,
      primaryLanguage: 'Bhojpuri / Hindi',
      languageMatchPercent: 85,
      digitalLiteracyLevel: 'Basic',
      languageFrictionScore: 48,
      nearestHospitalType: 'Pandit Deendayal Upadhyay Hospital',
      bedOccupancyPercent: 91,
      specialistAvailability: 'Moderate',
      bplPercentage: 46,
      resourceFrictionScore: 72,
      avgOpdWaitTimeMins: 70,
      abhaLinkedPercent: 66,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 62,
    },
    keyBarriers: ['Narrow road congestion', 'High diagnostic lab turnaround time'],
    recommendedIntervention: 'Smart District Diagnostic Hub Routing',
    geoCoords: { lat: 25.317, lng: 82.973 },
  },

  // Maharashtra Locations
  {
    id: 'mh-palghar-tribal',
    state: 'Maharashtra',
    district: 'Palghar',
    block: 'Jawhar',
    villageOrLocality: 'Dabhosa Tribal Settlement',
    pfiScore: 84,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 34.0,
      travelTimeMins: 105,
      transitAvailability: 'Poor',
      travelFrictionScore: 90,
      primaryLanguage: 'Warli / Marathi',
      languageMatchPercent: 60,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 82,
      nearestHospitalType: 'Jawhar Sub-District Hospital',
      bedOccupancyPercent: 85,
      specialistAvailability: 'Deficit',
      bplPercentage: 64,
      resourceFrictionScore: 86,
      avgOpdWaitTimeMins: 90,
      abhaLinkedPercent: 41,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 80,
    },
    keyBarriers: ['Hilly terrain transit desert', 'Malnutrition clinic specialist deficiency', 'Warli dialect barrier'],
    recommendedIntervention: 'Mobile High-Risk Maternal Tele-ICU & Local Language ASHA Tablet',
    geoCoords: { lat: 19.904, lng: 73.232 },
  },

  // Rajasthan Locations
  {
    id: 'rj-barmer-desert',
    state: 'Rajasthan',
    district: 'Barmer',
    block: 'Chohtan',
    villageOrLocality: 'Dhorimanna Desert Outpost',
    pfiScore: 89,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 42.5,
      travelTimeMins: 130,
      transitAvailability: 'Severe Desert',
      travelFrictionScore: 96,
      primaryLanguage: 'Marwari / Rajasthani',
      languageMatchPercent: 68,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 78,
      nearestHospitalType: 'Barmer District Hospital',
      bedOccupancyPercent: 82,
      specialistAvailability: 'Deficit',
      bplPercentage: 70,
      resourceFrictionScore: 89,
      avgOpdWaitTimeMins: 110,
      abhaLinkedPercent: 35,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 86,
    },
    keyBarriers: ['Thar Desert extreme travel distance', 'Sand dune road obstruction', 'Zero public bus frequency'],
    recommendedIntervention: 'Desert Tele-Medicine Pod + Emergency Camel & 4x4 Ambulance Relay',
    geoCoords: { lat: 25.405, lng: 71.054 },
  },
];

export const indiaFrictionService = {
  /**
   * Search locations across India by query string or state filter
   */
  searchLocations(query: string, stateFilter?: string): LocationFrictionData[] {
    const q = (query || '').toLowerCase().trim();
    const sFilter = (stateFilter || '').toLowerCase().trim();

    return INDIA_LOCATIONS_DATABASE.filter((item) => {
      const matchStateFilter = !sFilter || item.state.toLowerCase() === sFilter;
      if (!matchStateFilter) return false;

      if (!q) return true;

      return (
        item.state.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.block.toLowerCase().includes(q) ||
        item.villageOrLocality.toLowerCase().includes(q) ||
        item.metrics.nearestHospitalType.toLowerCase().includes(q)
      );
    });
  },

  /**
   * Compute dynamic PFI Friction score based on real user or location parameters
   */
  computeCustomFrictionScore(params: {
    travelKm: number;
    hasPublicTransit: boolean;
    languageMatched: boolean;
    digitalLiteracy: 'Low' | 'Basic' | 'Moderate' | 'High';
    hasBplCard: boolean;
    hospitalBedOccupancyPct: number;
    opdWaitMins: number;
  }): { pfiScore: number; category: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; breakdown: Record<string, number> } {
    // 1. Travel Friction (35% weight)
    let travelScore = Math.min(100, Math.round((params.travelKm / 35) * 80 + (params.hasPublicTransit ? 0 : 25)));

    // 2. Language Friction (20% weight)
    let langScore = params.languageMatched ? 20 : 80;
    if (params.digitalLiteracy === 'Low') langScore += 15;

    // 3. Resource Friction (25% weight)
    let resourceScore = Math.min(100, Math.round((params.hospitalBedOccupancyPct / 120) * 70 + (params.hasBplCard ? 25 : 10)));

    // 4. Queue / Docs Friction (20% weight)
    let queueScore = Math.min(100, Math.round((params.opdWaitMins / 150) * 85));

    const pfiScore = Math.min(
      100,
      Math.round(travelScore * 0.35 + resourceScore * 0.25 + langScore * 0.2 + queueScore * 0.2)
    );

    let category: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (pfiScore >= 80) category = 'CRITICAL';
    else if (pfiScore >= 65) category = 'HIGH';
    else if (pfiScore >= 45) category = 'MODERATE';

    return {
      pfiScore,
      category,
      breakdown: {
        Travel: travelScore,
        Language: Math.min(100, langScore),
        ResourceScarcity: resourceScore,
        QueueAndDocs: queueScore,
      },
    };
  },
};

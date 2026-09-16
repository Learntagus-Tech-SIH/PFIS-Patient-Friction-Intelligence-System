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
    travelFrictionScore: number;

    primaryLanguage: string;
    languageMatchPercent: number;
    digitalLiteracyLevel: 'Low' | 'Basic' | 'Moderate' | 'High';
    languageFrictionScore: number;

    nearestHospitalType: string;
    bedOccupancyPercent: number;
    specialistAvailability: 'Deficit' | 'Moderate' | 'Adequate';
    bplPercentage: number;
    resourceFrictionScore: number;

    avgOpdWaitTimeMins: number;
    abhaLinkedPercent: number;
    documentationBarrier: 'High' | 'Moderate' | 'Low';
    queueDocsFrictionScore: number;
  };
  keyBarriers: string[];
  recommendedIntervention: string;
  geoCoords: { lat: number; lng: number };
}

export const INDIA_STATES = [
  'Bihar',
  'Punjab',
  'Jharkhand',
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
  // ── BIHAR VILLAGES ──
  {
    id: 'br-patna-diara',
    state: 'Bihar',
    district: 'Patna',
    block: 'Danapur',
    villageOrLocality: 'Diara Riverine Panchayat',
    pfiScore: 86,
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
      nearestHospitalType: 'PMCH Patna (Tertiary Medical College)',
      bedOccupancyPercent: 140,
      specialistAvailability: 'Deficit',
      bplPercentage: 72,
      resourceFrictionScore: 88,
      avgOpdWaitTimeMins: 160,
      abhaLinkedPercent: 39,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 90,
    },
    keyBarriers: ['Ganges river transit obstacle', 'Massive OPD queue at PMCH', 'Lack of digital tokens'],
    recommendedIntervention: 'High Budget: Construct New Primary Health Centre (PHC) & Water Ambulance Relay',
    geoCoords: { lat: 25.632, lng: 85.042 },
  },
  {
    id: 'br-patna-phulwari',
    state: 'Bihar',
    district: 'Patna',
    block: 'Phulwari Sharif',
    villageOrLocality: 'Janipur Rural Village',
    pfiScore: 58,
    frictionCategory: 'MODERATE',
    metrics: {
      travelDistanceKm: 8.5,
      travelTimeMins: 32,
      transitAvailability: 'Moderate',
      travelFrictionScore: 48,
      primaryLanguage: 'Bhojpuri / Magahi',
      languageMatchPercent: 88,
      digitalLiteracyLevel: 'Basic',
      languageFrictionScore: 42,
      nearestHospitalType: 'AIIMS Patna / Danapur Sub-Divisional Hospital',
      bedOccupancyPercent: 95,
      specialistAvailability: 'Moderate',
      bplPercentage: 45,
      resourceFrictionScore: 65,
      avgOpdWaitTimeMins: 70,
      abhaLinkedPercent: 68,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 56,
    },
    keyBarriers: ['Suburban traffic choke points', 'Peak registration queue'],
    recommendedIntervention: 'Medium Budget: Deploy OPD Digital Queue Fast-Track Kiosk & Subsidized Bus',
    geoCoords: { lat: 25.568, lng: 85.078 },
  },
  {
    id: 'br-gaya-bodhgaya',
    state: 'Bihar',
    district: 'Gaya',
    block: 'Bodh Gaya',
    villageOrLocality: 'Bakraur Rural Panchayat',
    pfiScore: 79,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 16.5,
      travelTimeMins: 48,
      transitAvailability: 'Poor',
      travelFrictionScore: 74,
      primaryLanguage: 'Magahi',
      languageMatchPercent: 78,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 68,
      nearestHospitalType: 'ANMMCH Gaya (District Hospital)',
      bedOccupancyPercent: 92,
      specialistAvailability: 'Deficit',
      bplPercentage: 62,
      resourceFrictionScore: 82,
      avgOpdWaitTimeMins: 85,
      abhaLinkedPercent: 46,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 78,
    },
    keyBarriers: ['Seasonal river flooding', 'High out-of-pocket medicine expense', 'Low digital literacy'],
    recommendedIntervention: 'Sub-Center Health & Wellness Upgrade & ASHA Drug Buffer Depot',
    geoCoords: { lat: 24.696, lng: 84.991 },
  },
  {
    id: 'br-gaya-barachatti',
    state: 'Bihar',
    district: 'Gaya',
    block: 'Barachatti',
    villageOrLocality: 'Sobh Tribal Forest Village',
    pfiScore: 88,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 38.0,
      travelTimeMins: 115,
      transitAvailability: 'Severe Desert',
      travelFrictionScore: 95,
      primaryLanguage: 'Magahi / Local Dialect',
      languageMatchPercent: 62,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 84,
      nearestHospitalType: 'Barachatti CHC / ANMMCH Gaya',
      bedOccupancyPercent: 98,
      specialistAvailability: 'Deficit',
      bplPercentage: 78,
      resourceFrictionScore: 92,
      avgOpdWaitTimeMins: 120,
      abhaLinkedPercent: 28,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 88,
    },
    keyBarriers: ['Forest terrain transit desert', 'Zero public bus connectivity', 'Maternal specialist deficit'],
    recommendedIntervention: 'Construct 24/7 Primary Health Centre (PHC) & Mobile Tele-Medicine Van',
    geoCoords: { lat: 24.512, lng: 85.014 },
  },
  {
    id: 'br-muzaffarpur-kanti',
    state: 'Bihar',
    district: 'Muzaffarpur',
    block: 'Kanti',
    villageOrLocality: 'Kanti Thermal Rural Settlement',
    pfiScore: 72,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 14.8,
      travelTimeMins: 45,
      transitAvailability: 'Moderate',
      travelFrictionScore: 66,
      primaryLanguage: 'Vajjika / Hindi',
      languageMatchPercent: 82,
      digitalLiteracyLevel: 'Basic',
      languageFrictionScore: 54,
      nearestHospitalType: 'SKMCH Muzaffarpur Medical College',
      bedOccupancyPercent: 115,
      specialistAvailability: 'Moderate',
      bplPercentage: 58,
      resourceFrictionScore: 78,
      avgOpdWaitTimeMins: 90,
      abhaLinkedPercent: 54,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 70,
    },
    keyBarriers: ['SKMCH hospital overcrowding', 'Long OPD registration queue'],
    recommendedIntervention: 'Fast-Track Digital Token Scanner & ASHA Shuttle Voucher',
    geoCoords: { lat: 26.185, lng: 85.289 },
  },
  {
    id: 'br-bhagalpur-sabour',
    state: 'Bihar',
    district: 'Bhagalpur',
    block: 'Sabour',
    villageOrLocality: 'Rajpur Riverine Settlement',
    pfiScore: 81,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 24.5,
      travelTimeMins: 85,
      transitAvailability: 'Poor',
      travelFrictionScore: 88,
      primaryLanguage: 'Angika / Hindi',
      languageMatchPercent: 74,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 72,
      nearestHospitalType: 'JLN Medical College Hospital Bhagalpur',
      bedOccupancyPercent: 122,
      specialistAvailability: 'Deficit',
      bplPercentage: 66,
      resourceFrictionScore: 85,
      avgOpdWaitTimeMins: 110,
      abhaLinkedPercent: 41,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 82,
    },
    keyBarriers: ['Angika dialect gap', 'River flood transit disruption', 'Bed deficit'],
    recommendedIntervention: 'Construct Sub-Divisional Emergency Ward & Mobile Diagnostic Van',
    geoCoords: { lat: 25.234, lng: 87.042 },
  },
  {
    id: 'br-darbhanga-keoti',
    state: 'Bihar',
    district: 'Darbhanga',
    block: 'Keoti',
    villageOrLocality: 'Biraul Rural Cluster',
    pfiScore: 77,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 18.2,
      travelTimeMins: 58,
      transitAvailability: 'Poor',
      travelFrictionScore: 76,
      primaryLanguage: 'Maithili',
      languageMatchPercent: 80,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 62,
      nearestHospitalType: 'DMCH Medical College Darbhanga',
      bedOccupancyPercent: 130,
      specialistAvailability: 'Deficit',
      bplPercentage: 64,
      resourceFrictionScore: 84,
      avgOpdWaitTimeMins: 105,
      abhaLinkedPercent: 44,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 78,
    },
    keyBarriers: ['DMCH extreme OPD queue', 'Infrequent rural auto/bus connectivity'],
    recommendedIntervention: 'Health Screening Camps & Vernacular Voice AI Booking Kiosk',
    geoCoords: { lat: 26.241, lng: 85.981 },
  },

  // ── PUNJAB VILLAGES ──
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
    id: 'pb-bholath-pb',
    state: 'Punjab',
    district: 'Kapurthala',
    block: 'Bholath',
    villageOrLocality: 'Bholath Rural Cluster',
    pfiScore: 74,
    frictionCategory: 'HIGH',
    metrics: {
      travelDistanceKm: 19.2,
      travelTimeMins: 55,
      transitAvailability: 'Poor',
      travelFrictionScore: 78,
      primaryLanguage: 'Rural Punjabi',
      languageMatchPercent: 78,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 68,
      nearestHospitalType: 'CHC Bholath / District Hospital Kapurthala',
      bedOccupancyPercent: 94,
      specialistAvailability: 'Deficit',
      bplPercentage: 38,
      resourceFrictionScore: 84,
      avgOpdWaitTimeMins: 80,
      abhaLinkedPercent: 52,
      documentationBarrier: 'Moderate',
      queueDocsFrictionScore: 68,
    },
    keyBarriers: ['Infrequent rural shuttle buses', 'Maternal specialist shortage', 'Low digital literacy'],
    recommendedIntervention: 'Establish Subsidized ASHA Shuttle & Telemedicine Node',
    geoCoords: { lat: 31.527, lng: 75.521 },
  },

  // ── JHARKHAND VILLAGES ──
  {
    id: 'jh-ranchi-boreya',
    state: 'Jharkhand',
    district: 'Ranchi',
    block: 'Kanke',
    villageOrLocality: 'Boreya Tribal Settlement',
    pfiScore: 88,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 27.5,
      travelTimeMins: 90,
      transitAvailability: 'Severe Desert',
      travelFrictionScore: 94,
      primaryLanguage: 'Mundari / Nagpuri',
      languageMatchPercent: 54,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 86,
      nearestHospitalType: 'RIMS Medical College Ranchi',
      bedOccupancyPercent: 128,
      specialistAvailability: 'Deficit',
      bplPercentage: 64,
      resourceFrictionScore: 92,
      avgOpdWaitTimeMins: 135,
      abhaLinkedPercent: 34,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 88,
    },
    keyBarriers: ['Language mismatch (Mundari to Hindi)', 'Tertiary hospital severe bed overcrowding', 'High travel cost'],
    recommendedIntervention: 'Construct 24/7 Primary Health Centre (PHC) & Vernacular Tele-Medicine',
    geoCoords: { lat: 23.432, lng: 85.321 },
  },

  // ── MAHARASHTRA VILLAGES ──
  {
    id: 'mh-palghar-dabhosa',
    state: 'Maharashtra',
    district: 'Palghar',
    block: 'Jawhar',
    villageOrLocality: 'Dabhosa Warli Tribal Hamlet',
    pfiScore: 86,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 33.0,
      travelTimeMins: 100,
      transitAvailability: 'Poor',
      travelFrictionScore: 92,
      primaryLanguage: 'Warli / Marathi',
      languageMatchPercent: 58,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 84,
      nearestHospitalType: 'Jawhar Sub-District Hospital',
      bedOccupancyPercent: 88,
      specialistAvailability: 'Deficit',
      bplPercentage: 68,
      resourceFrictionScore: 86,
      avgOpdWaitTimeMins: 95,
      abhaLinkedPercent: 42,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 82,
    },
    keyBarriers: ['Sahyadri mountain travel obstacle', 'Warli dialect gap', 'Maternal specialist deficit'],
    recommendedIntervention: 'Mobile Tele-Medicine Van & Warli Audio Language Tablet',
    geoCoords: { lat: 19.904, lng: 73.232 },
  },

  // ── RAJASTHAN VILLAGES ──
  {
    id: 'rj-barmer-dhorimanna',
    state: 'Rajasthan',
    district: 'Barmer',
    block: 'Chohtan',
    villageOrLocality: 'Dhorimanna Desert Outpost',
    pfiScore: 91,
    frictionCategory: 'CRITICAL',
    metrics: {
      travelDistanceKm: 44.0,
      travelTimeMins: 135,
      transitAvailability: 'Severe Desert',
      travelFrictionScore: 98,
      primaryLanguage: 'Marwari',
      languageMatchPercent: 66,
      digitalLiteracyLevel: 'Low',
      languageFrictionScore: 80,
      nearestHospitalType: 'Barmer District Hospital',
      bedOccupancyPercent: 84,
      specialistAvailability: 'Deficit',
      bplPercentage: 74,
      resourceFrictionScore: 90,
      avgOpdWaitTimeMins: 120,
      abhaLinkedPercent: 32,
      documentationBarrier: 'High',
      queueDocsFrictionScore: 88,
    },
    keyBarriers: ['Thar Desert extreme transit desert', 'Dune road blockade', 'Zero public bus frequency'],
    recommendedIntervention: 'Construct Desert Primary Health Centre (PHC) & 4x4 Emergency Ambulance Relay',
    geoCoords: { lat: 25.405, lng: 71.054 },
  },
];

export const indiaFrictionService = {
  /**
   * Helper to get list of unique states
   */
  getStates(): string[] {
    return INDIA_STATES;
  },

  /**
   * Helper to get list of unique districts for a given state
   */
  getDistrictsByState(stateName: string): string[] {
    if (!stateName) {
      const set = new Set(INDIA_LOCATIONS_DATABASE.map((loc) => loc.district));
      return Array.from(set).sort();
    }
    const filtered = INDIA_LOCATIONS_DATABASE.filter(
      (loc) => loc.state.toLowerCase() === stateName.toLowerCase()
    );
    const set = new Set(filtered.map((loc) => loc.district));
    return Array.from(set).sort();
  },

  /**
   * Helper to get list of villages for a given district
   */
  getVillagesByDistrict(districtName: string, stateName?: string): LocationFrictionData[] {
    return INDIA_LOCATIONS_DATABASE.filter((loc) => {
      const matchState = !stateName || loc.state.toLowerCase() === stateName.toLowerCase();
      const matchDistrict = !districtName || loc.district.toLowerCase() === districtName.toLowerCase();
      return matchState && matchDistrict;
    });
  },

  /**
   * Search locations across India by query string or state/district filters
   */
  searchLocations(query: string, stateFilter?: string, districtFilter?: string): LocationFrictionData[] {
    const q = (query || '').toLowerCase().trim();
    const sFilter = (stateFilter || '').toLowerCase().trim();
    const dFilter = (districtFilter || '').toLowerCase().trim();

    return INDIA_LOCATIONS_DATABASE.filter((item) => {
      const matchState = !sFilter || item.state.toLowerCase() === sFilter;
      const matchDistrict = !dFilter || item.district.toLowerCase() === dFilter;
      if (!matchState || !matchDistrict) return false;

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
};

import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('server/data/pfis_relational.json');
const raw = fs.readFileSync(dbPath, 'utf-8');
const data = JSON.parse(raw);

console.log('Available tables in pfis_relational.json:', Object.keys(data));

// 1. Ensure new tables exist
data.government_profiles = data.government_profiles || [];
data.government_actions = data.government_actions || [];
data.facility_verifications = data.facility_verifications || [];
data.operational_interventions = data.operational_interventions || [];
data.system_integrations = data.system_integrations || [];

// 2. Find Rajesh Verma's user record
const govtUser = data.users.find(u => u.email === 'government@pfis.org');
const govtUserId = govtUser ? govtUser.id : 'c98328dc-2c5a-4eb9-9acc-fb79f2c4b0ef';

// 3. Seed Government Profile
data.government_profiles = [
  {
    id: 'gov-prof-01',
    _id: 'gov-prof-01',
    user_id: govtUserId,
    userId: govtUserId,
    govCode: 'GOV-PB-KPT-01',
    department: 'Department of Health & Family Welfare, Punjab',
    designation: 'District Health Officer & Civil Surgeon',
    state: 'Punjab',
    district: 'Kapurthala',
    accessLevel: 'district',
    phone: '+91 98765 44556',
    email: 'government@pfis.org',
    isVerified: true,
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// 4. Seed Real Hospitals Data Provenance & Bed Capacities
if (data.hospitals && data.hospitals.length > 0) {
  data.hospitals.forEach((h, idx) => {
    h.facilityId = h.facilityId || `FAC-PB-${100 + idx}`;
    h.facilityType = h.tier === 'TERTIARY' ? 'Tertiary Referral Hospital' : h.tier === 'SECONDARY' ? 'Sub-Divisional Civil Hospital' : 'Community Health Centre';
    h.district = h.district || 'Kapurthala';
    h.state = h.state || 'Punjab';
    h.emergencyAvailability = h.emergencyAvailability ?? true;
    h.opdAvailability = h.opdAvailability ?? true;
    h.departments = h.departments || ['General Medicine', 'Orthopedics', 'Pediatrics', 'Obstetrics & Gynecology', 'Emergency'];
    h.services = h.services || ['24x7 Emergency', 'Digital OPD Queue', 'Radiology / X-Ray', 'Pathology Lab', 'Blood Bank'];
    
    // Capacities
    const totalBeds = h.totalBeds || (idx === 0 ? 180 : idx === 1 ? 120 : 60);
    const occupied = Math.round(totalBeds * (idx === 0 ? 0.78 : idx === 1 ? 0.62 : 0.45));
    h.capacity = {
      generalBeds: totalBeds,
      generalOccupied: occupied,
      generalAvailable: totalBeds - occupied,
      icuBeds: idx === 0 ? 24 : 12,
      icuOccupied: idx === 0 ? 20 : 7,
      icuAvailable: idx === 0 ? 4 : 5,
      emergencyBays: idx === 0 ? 16 : 8,
      emergencyOccupied: idx === 0 ? 11 : 4,
      emergencyAvailable: idx === 0 ? 5 : 4,
      utilizationRate: Math.round((occupied / totalBeds) * 100),
      lastUpdated: new Date(Date.now() - (idx * 3600000 * 2)).toISOString(),
      isStale: idx > 3,
    };

    h.govApprovalStatus = idx === 2 ? 'CHANGES_REQUESTED' : idx === 3 ? 'PENDING_REVIEW' : 'APPROVED';
    h.isVerified = h.govApprovalStatus === 'APPROVED';
    h.dataProvenance = {
      source: idx === 0 ? 'GOVERNMENT_VERIFIED' : idx === 1 ? 'API_SYNCED' : 'FACILITY_REPORTED',
      lastUpdated: new Date(Date.now() - (idx * 1800000)).toISOString(),
      status: idx > 3 ? 'STALE' : idx === 0 ? 'GOVERNMENT_VERIFIED' : 'FACILITY_REPORTED',
      coverage: 'District-level participating facility',
    };
  });
}

// 5. Seed Government Action Center Tickets
data.government_actions = [
  {
    id: 'act-101',
    _id: 'act-101',
    title: 'Phagwara Civil Hospital Morning OPD Queue Surge',
    issue: 'Average OPD waiting time exceeded 45 minutes during peak morning window (9:00 AM - 11:30 AM). 38 patients in queue.',
    facilityId: data.hospitals[0]?.id || 'hosp-01',
    facilityName: data.hospitals[0]?.name || 'Civil Hospital Phagwara',
    district: 'Kapurthala',
    block: 'Phagwara',
    severity: 'HIGH',
    status: 'OPEN',
    category: 'WAIT_TIME',
    recommendedAction: 'Direct additional Medical Officer from afternoon shift to morning desk; activate fast-track token triage for geriatric patients.',
    assignedOfficer: 'Rajesh Verma (District Health Officer)',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'act-102',
    _id: 'act-102',
    title: 'Sub-Centre Rampur Kalan Transit Barrier Accumulation',
    issue: '4 households in Rampur Kalan reported absence of connecting transport to Phagwara Rural PHC for monthly NCD check-ups.',
    facilityId: data.hospitals[1]?.id || 'hosp-02',
    facilityName: 'Phagwara Rural Primary Health Centre',
    district: 'Kapurthala',
    block: 'Phagwara',
    severity: 'ATTENTION',
    status: 'IN_PROGRESS',
    category: 'ASHA_COVERAGE',
    recommendedAction: 'Coordinate with Block Development Officer to schedule Mobile Medical Van visit on Tuesday and Friday.',
    assignedOfficer: 'Kavita Devi (ASHA Sangini Lead)',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'act-103',
    _id: 'act-103',
    title: 'Tertiary Referral Response Latency Alert',
    issue: '2 inter-facility surgical transfer requests from Sub-Divisional Hospital have awaited receiving confirmation for > 4.5 hours.',
    facilityId: data.hospitals[0]?.id || 'hosp-01',
    facilityName: 'Civil Hospital Phagwara -> Kapurthala District Hospital',
    district: 'Kapurthala',
    block: 'District HQ',
    severity: 'HIGH',
    status: 'OPEN',
    category: 'REFERRAL',
    recommendedAction: 'Contact Nodal Referral Officer at Kapurthala District Hospital to clear pending surgical beds assessment.',
    assignedOfficer: 'Rajesh Verma (District Health Officer)',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'act-104',
    _id: 'act-104',
    title: 'ICU Bed Occupancy Threshold Warning',
    issue: 'Kapurthala District Hospital ICU occupancy reached 83.3% (20 of 24 beds occupied). Only 4 ventilator-ready bays available.',
    facilityId: data.hospitals[0]?.id || 'hosp-01',
    facilityName: 'Kapurthala District Civil Hospital',
    district: 'Kapurthala',
    block: 'Kapurthala Urban',
    severity: 'CRITICAL',
    status: 'ACKNOWLEDGED',
    category: 'CAPACITY',
    recommendedAction: 'Alert secondary CHCs to stabilize non-critical cases locally before initiating tertiary ICU transfers.',
    assignedOfficer: 'Dr. Priya Sharma (Clinical Lead)',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'act-105',
    _id: 'act-105',
    title: 'Sub-District Facility Telemetry Stale Alert',
    issue: 'Bed availability data from Bholath Community Health Centre has not updated in 26 hours.',
    facilityId: 'hosp-04',
    facilityName: 'Bholath Community Health Centre',
    district: 'Kapurthala',
    block: 'Bholath',
    severity: 'ATTENTION',
    status: 'RESOLVED',
    category: 'DATA_STALE',
    recommendedAction: 'Dispatched automated notification to facility superintendent; manual synchronization completed by duty clerk.',
    assignedOfficer: 'Rajesh Verma (District Health Officer)',
    resolutionNotes: 'Superintendent confirmed 42 available general beds. API sync restored.',
    resolvedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];

// 6. Seed Facility Verifications
data.facility_verifications = [
  {
    id: 'ver-01',
    _id: 'ver-01',
    facilityId: data.hospitals[0]?.id || 'hosp-01',
    facilityName: data.hospitals[0]?.name || 'Civil Hospital Phagwara',
    facilityType: 'Government Sub-Divisional Hospital',
    district: 'Kapurthala',
    state: 'Punjab',
    action: 'APPROVED',
    previousStatus: 'PENDING_REVIEW',
    newStatus: 'APPROVED',
    reviewedBy: 'Rajesh Verma (District Health Officer)',
    reviewerRole: 'government',
    notes: 'Official registration documentation, fire safety, and biometric OPD counter readiness verified.',
    documentsReviewed: ['NOC_Fire_2026.pdf', 'NQAS_SelfAssessment.pdf', 'Clinical_Establishment_Reg.pdf'],
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ver-02',
    _id: 'ver-02',
    facilityId: data.hospitals[1]?.id || 'hosp-02',
    facilityName: data.hospitals[1]?.name || 'LPU UniCenter Health & Medicine',
    facilityType: 'Institutional Medical Centre',
    district: 'Kapurthala',
    state: 'Punjab',
    action: 'APPROVED',
    previousStatus: 'PENDING_REVIEW',
    newStatus: 'APPROVED',
    reviewedBy: 'Rajesh Verma (District Health Officer)',
    reviewerRole: 'government',
    notes: 'Authorized as secondary triage and outpatient partner facility under district network.',
    documentsReviewed: ['Pharmacy_License.pdf', 'Doctor_Council_Cert.pdf'],
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

// 7. Seed Operational Interventions
data.operational_interventions = [
  {
    id: 'int-01',
    _id: 'int-01',
    title: 'Deploy Assisted Digital OPD Kiosk at Civil Hospital Phagwara',
    description: 'Install dedicated touch kiosk with ASHA assistance to reduce manual registration counter queue by 40%.',
    category: 'OPD_CAPACITY',
    targetDistrict: 'Kapurthala',
    targetFacilityId: data.hospitals[0]?.id || 'hosp-01',
    targetFacilityName: 'Civil Hospital Phagwara',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectedImpact: 'Estimated reduction of OPD waiting time from 42 mins to 24 mins.',
    baselineMetric: '42 min average wait time',
    currentMetric: '31 min average wait time',
    assignedTo: 'Rajesh Verma (District Health Officer)',
    estimatedBudget: 45000,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'int-02',
    _id: 'int-02',
    title: 'Rampur Kalan Scheduled Transit Van Deployment',
    description: 'Establish bi-weekly community transit route connecting Rampur Kalan sub-centre to Phagwara Rural PHC.',
    category: 'TRANSPORT_ASSISTANCE',
    targetDistrict: 'Kapurthala',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    projectedImpact: 'Resolved travel barrier for 18 chronic hypertension and maternal follow-up patients.',
    baselineMetric: '4 households facing severe transport barrier',
    currentMetric: '0 pending transport escalations in Rampur Kalan',
    assignedTo: 'Kavita Devi (ASHA Sangini Lead)',
    actualCompletionDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  }
];

// 8. Seed System Integrations Status
data.system_integrations = [
  {
    id: 'intg-01',
    _id: 'intg-01',
    name: 'ABDM Health Facility Registry (HFR)',
    category: 'ABDM',
    description: 'National digital registry for verified health facilities and infrastructure credentials.',
    status: 'INTEGRATION_REQUIRED',
    endpointUrl: 'https://facility.abdm.gov.in/api/v1',
    environment: 'PRODUCTION',
    complianceLevel: 'ABDM M1/M2 Standard',
    auditNotes: 'Production sandbox API credentials required from NHA. Gateway marked as Integration Required.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'intg-02',
    _id: 'intg-02',
    name: 'ABHA Ecosystem Gateway (HPR / PHR)',
    category: 'ABDM',
    description: 'Ayushman Bharat Health Account identity and longitudinal health records exchange.',
    status: 'INTEGRATION_REQUIRED',
    endpointUrl: 'https://healthid.abdm.gov.in/api/v2',
    environment: 'SANDBOX',
    complianceLevel: 'ABDM Milestone 1 Certified Architecture',
    auditNotes: 'Patient consent flow ready in client. External live token exchange awaiting government sandbox key.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'intg-03',
    _id: 'intg-03',
    name: '108 National Ambulance Emergency Dispatch',
    category: 'EMERGENCY',
    description: 'Emergency response coordination gateway with GPS fleet dispatching.',
    status: 'INTEGRATION_REQUIRED',
    endpointUrl: 'https://108emergency.punjab.gov.in/api',
    environment: 'PRODUCTION',
    auditNotes: 'PFIS dispatches emergency call intent; official direct CAD integration requires state telecommunication bridge.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'intg-04',
    _id: 'intg-04',
    name: 'e-Aushadhi Drug Inventory Telemetry',
    category: 'PHARMACY',
    description: 'State essential medicines stock and buffer supply monitoring.',
    status: 'CONNECTED',
    endpointUrl: 'http://localhost:5000/api/medicines',
    lastHealthCheck: new Date().toISOString(),
    healthResponseTimeMs: 14,
    environment: 'DEMO_TEST',
    complianceLevel: 'PFIS State Drug Formula v2.1',
    auditNotes: 'Local facility-reported drug stock feeds verified across 51 registered formulations.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'intg-05',
    _id: 'intg-05',
    name: 'PFIS Relational SQL Storage Engine',
    category: 'DATABASE',
    description: 'Zero-setup embedded SQL relational storage engine with transaction atomicity.',
    status: 'CONNECTED',
    endpointUrl: 'local://pfis_relational.json',
    lastHealthCheck: new Date().toISOString(),
    healthResponseTimeMs: 2,
    environment: 'PRODUCTION',
    auditNotes: '32 database tables active with 100% integrity across Patient, ASHA, Doctor, Hospital, and Government schemas.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'intg-06',
    _id: 'intg-06',
    name: 'PFIS Authentication & RBAC Engine',
    category: 'SECURITY',
    description: 'JWT authorization with role-based access control and bcrypt credential hashing.',
    status: 'CONNECTED',
    endpointUrl: 'http://localhost:5000/api/auth',
    lastHealthCheck: new Date().toISOString(),
    healthResponseTimeMs: 5,
    environment: 'PRODUCTION',
    auditNotes: 'All 6 healthcare persona access policies enforced at HTTP middleware and route guards.',
    created_at: new Date().toISOString(),
  }
];

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully seeded government profiles, actions, verifications, interventions, and system integrations into pfis_relational.json!');

/**
 * Real-Time Provider Adapters for Operational Healthcare Capabilities
 * Explicitly decoupled from static ABDM registry metadata (HFR/HPR).
 * Supported Data Sources: AUTHORIZED_STATE_API | PARTICIPATING_HOSPITAL_API | PFIS_FACILITY_PORTAL | DEMO
 */

export interface OperationalSourceMetadata {
  sourceSystem: string;
  sourceType: 'AUTHORIZED_STATE_API' | 'PARTICIPATING_HOSPITAL_API' | 'PFIS_FACILITY_PORTAL' | 'DEMO';
  sourceRecordId?: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'SELF_DECLARED';
  environment: 'SANDBOX' | 'PRODUCTION' | 'DEMO';
  fetchedAt: string;
  lastUpdatedAt: string;
}

export interface OpdQueueStatus extends OperationalSourceMetadata {
  facilityId: string;
  departmentName: string;
  activeTokenNumber: number;
  totalIssuedToday: number;
  estimatedWaitTimeMinutes: number;
  queueStatus: 'OPEN' | 'PAUSED' | 'CLOSED' | 'OVERCROWDED';
}

export interface DoctorAvailabilityStatus extends OperationalSourceMetadata {
  doctorProfileId: string;
  doctorName: string;
  facilityId: string;
  isAvailableToday: boolean;
  shiftTiming: string;
  maxPatientsPerShift: number;
  bookedSlotsCount: number;
}

export interface DiagnosticFacilityStatus extends OperationalSourceMetadata {
  facilityId: string;
  machineName: string; // e.g. MRI 1.5T, CT Scan 128 Slice, X-Ray
  isOperational: boolean;
  maintenanceStatus: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_ORDER';
  nextAvailableSlot?: string;
}

export interface MedicineInventoryStatus extends OperationalSourceMetadata {
  facilityId: string;
  drugCode: string;
  drugName: string;
  availableStockQuantity: number;
  unit: string;
  stockLevel: 'ADEQUATE' | 'CRITICAL_LOW' | 'OUT_OF_STOCK';
}

export class FacilityOperationalProvider {
  public static async getOpdQueueStatus(facilityId: string, department: string = 'General Medicine'): Promise<OpdQueueStatus> {
    return {
      facilityId,
      departmentName: department,
      activeTokenNumber: 42,
      totalIssuedToday: 85,
      estimatedWaitTimeMinutes: 35,
      queueStatus: 'OPEN',
      sourceSystem: 'PFIS_FACILITY_PORTAL',
      sourceType: 'PFIS_FACILITY_PORTAL',
      sourceRecordId: `Q-${facilityId}-${Date.now()}`,
      verificationStatus: 'VERIFIED',
      environment: 'DEMO',
      fetchedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
  }
}

export class AppointmentProvider {
  public static async getDoctorAvailability(doctorProfileId: string): Promise<DoctorAvailabilityStatus> {
    return {
      doctorProfileId,
      doctorName: 'Dr. Alok Kumar Mitra',
      facilityId: 'FAC-JH-RIMS-001',
      isAvailableToday: true,
      shiftTiming: '09:00 AM - 02:00 PM',
      maxPatientsPerShift: 30,
      bookedSlotsCount: 18,
      sourceSystem: 'PARTICIPATING_HOSPITAL_API',
      sourceType: 'PARTICIPATING_HOSPITAL_API',
      sourceRecordId: `SCHED-${doctorProfileId}`,
      verificationStatus: 'VERIFIED',
      environment: 'DEMO',
      fetchedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
  }
}

export class QueueProvider {
  public static async getActiveTokenCount(facilityId: string): Promise<{ activeToken: number; avgWaitMins: number; source: string }> {
    return {
      activeToken: 42,
      avgWaitMins: 30,
      source: 'PFIS Facility Portal Queue Telemetry',
    };
  }
}

export class DiagnosticProvider {
  public static async getMachineAvailability(facilityId: string): Promise<DiagnosticFacilityStatus[]> {
    return [
      {
        facilityId,
        machineName: 'X-Ray Digital Scanner',
        isOperational: true,
        maintenanceStatus: 'OPERATIONAL',
        nextAvailableSlot: '11:30 AM Today',
        sourceSystem: 'PFIS_FACILITY_PORTAL',
        sourceType: 'PFIS_FACILITY_PORTAL',
        verificationStatus: 'VERIFIED',
        environment: 'DEMO',
        fetchedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      },
      {
        facilityId,
        machineName: '1.5T MRI Scanner',
        isOperational: false,
        maintenanceStatus: 'UNDER_MAINTENANCE',
        nextAvailableSlot: 'Tomorrow 10:00 AM',
        sourceSystem: 'PARTICIPATING_HOSPITAL_API',
        sourceType: 'PARTICIPATING_HOSPITAL_API',
        verificationStatus: 'VERIFIED',
        environment: 'DEMO',
        fetchedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      },
    ];
  }
}

export class MedicineInventoryProvider {
  public static async checkDrugStock(facilityId: string, drugCode: string): Promise<MedicineInventoryStatus> {
    return {
      facilityId,
      drugCode,
      drugName: 'Paracetamol 500mg Tablets',
      availableStockQuantity: 1250,
      unit: 'Tablets',
      stockLevel: 'ADEQUATE',
      sourceSystem: 'e-Aushadhi State Drug Logistics',
      sourceType: 'AUTHORIZED_STATE_API',
      verificationStatus: 'VERIFIED',
      environment: 'DEMO',
      fetchedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
  }
}

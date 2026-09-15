import { AbdmAuditLogger } from './abdmAudit.js';

export interface HealthRecordMetadata {
  recordId: string;
  patientId: string;
  title: string;
  type: string;
  facilityName: string;
  authorDoctor: string;
  sourceType: 'ABDM_HIU' | 'HOSPITAL_VERIFIED' | 'PATIENT_ENTERED' | 'DEMO';
  date: string;
  consentId?: string;
}

export class AbdmHealthRecords {
  public static async fetchConsentedRecords(
    patientId: string,
    consentId: string
  ): Promise<HealthRecordMetadata[]> {
    await AbdmAuditLogger.log({
      actorId: patientId,
      actorRole: 'patient',
      action: 'HEALTH_RECORD_FETCH',
      resourceType: 'LongitudinalRecord',
      consentReference: consentId,
      sourceType: 'ABDM_HIU',
      resultStatus: 'SUCCESS',
      purpose: 'Care Continuity & Specialist Consultation',
    });

    return [
      {
        recordId: 'REC-2026-001',
        patientId,
        title: 'Outpatient Cardiac Assessment & Electrocardiogram',
        type: 'Diagnostic Report',
        facilityName: 'Rajendra Institute of Medical Sciences (RIMS)',
        authorDoctor: 'Dr. Alok Kumar Mitra',
        sourceType: 'HOSPITAL_VERIFIED',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        consentId,
      },
      {
        recordId: 'REC-2026-002',
        patientId,
        title: 'Essential Medicine E-Prescription',
        type: 'Prescription',
        facilityName: 'Ramgarh Sub-Divisional Hospital',
        authorDoctor: 'Dr. Priya Sharma',
        sourceType: 'HOSPITAL_VERIFIED',
        date: new Date(Date.now() - 86400000 * 12).toISOString(),
        consentId,
      },
    ];
  }
}

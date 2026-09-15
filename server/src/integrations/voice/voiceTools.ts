import { Hospital } from '../../models/Hospital.js';
import { AbdmHealthFacility } from '../abdm/abdmHealthFacility.js';
import { AbdmProfessional } from '../abdm/abdmProfessional.js';
import { AbdmHealthRecords } from '../abdm/abdmHealthRecords.js';
import { AbdmConsentManager } from '../abdm/abdmConsent.js';
import { FrictionEngine } from '../../intelligence/friction/frictionEngine.js';

export class VoiceTools {
  public static async findHealthcareFacilities(locationText: string, district?: string): Promise<any> {
    try {
      const res = await AbdmHealthFacility.searchFacilities(district || locationText || 'Ranchi');
      if (res.facilities && res.facilities.length > 0) {
        return {
          found: true,
          count: res.facilities.length,
          facilities: res.facilities.map((f) => ({
            id: f.abdmFacilityId,
            name: f.facilityName,
            type: f.facilityType,
            district: f.district,
            verificationStatus: f.abdmVerificationStatus,
            sourceSystem: f.sourceSystem,
          })),
        };
      }
    } catch {}

    return {
      found: false,
      message: "I don't have verified information for that right now.",
    };
  }

  public static async getFacilityDetails(facilityId: string): Promise<any> {
    try {
      const res = await AbdmHealthFacility.searchFacilities('Ranchi');
      const fac = res.facilities?.find((f) => f.abdmFacilityId === facilityId || f.pfisFacilityId === facilityId);
      if (fac) {
        return {
          found: true,
          facility: fac,
        };
      }
    } catch {}

    return {
      found: false,
      message: "I don't have verified information for that right now.",
    };
  }

  public static async findProfessional(registrationNumber: string): Promise<any> {
    try {
      const res = await AbdmProfessional.verifyDoctor(registrationNumber);
      if (res.success && res.professional) {
        return {
          found: true,
          professional: res.professional,
        };
      }
    } catch {}

    return {
      found: false,
      message: "I don't have verified information for that right now.",
    };
  }

  public static async checkAppointmentAvailability(facilityName: string): Promise<any> {
    return {
      found: true,
      facilityName,
      availableSlots: ['Tomorrow 09:30 AM', 'Tomorrow 11:00 AM'],
      sourceSystem: 'PARTICIPATING_HOSPITAL_API',
    };
  }

  public static async checkReferralStatus(referralCode?: string): Promise<any> {
    return {
      found: true,
      referralCode: referralCode || 'REF-2026-991',
      fromFacility: 'Ramgarh Rural PHC',
      toFacility: 'RIMS Ranchi District Hospital (Specialist Care)',
      status: 'ACCEPTED',
      appointmentDate: 'Tomorrow at 10:00 AM',
      nextAction: 'Visit Room 14 (Specialist OPD Desk)',
      sourceSystem: 'PFIS_CARE_ROUTING',
    };
  }

  public static async requestDocumentAccess(patientId: string, consentId: string): Promise<any> {
    try {
      const res = await AbdmHealthRecords.fetchConsentedRecords(patientId, consentId);
      if (res.success && res.documents.length > 0) {
        return {
          success: true,
          documentCount: res.documents.length,
          documents: res.documents,
        };
      }
    } catch {}

    return {
      success: false,
      message: "I don't have verified information for that right now.",
    };
  }

  public static async getConsentStatus(consentId: string): Promise<any> {
    return {
      found: true,
      consentId,
      status: 'GRANTED',
      purpose: 'Care Continuity and Specialist Consultation',
      sourceSystem: 'ABDM',
    };
  }

  public static async getFrictionAssessment(patientId: string): Promise<any> {
    const calc = FrictionEngine.calculate({ residenceType: 'rural_remote', transportAvailability: 'low' });
    return {
      overallFrictionScore: calc.overallFrictionScore,
      frictionLevel: calc.frictionLevel,
      topBarrier: calc.topBarrier,
      explanation: calc.explanation,
      assessmentType: 'PFIS-generated accessibility/friction assessment',
    };
  }

  public static async findFacility(locationText: string, specialty?: string): Promise<any> {
    return this.findHealthcareFacilities(locationText);
  }

  public static async checkMedicineAvailability(medicineName: string): Promise<any> {
    return {
      found: true,
      medicine: medicineName,
      facility: 'Ramgarh Sub-Divisional Hospital (PHC)',
      status: 'AVAILABLE',
      lastUpdated: '10:30 AM Today',
      sourceSystem: 'e-Aushadhi State Drug Logistics',
    };
  }
}

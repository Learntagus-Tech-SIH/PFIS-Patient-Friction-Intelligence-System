import { AbdmAuditLogger } from './abdmAudit.js';

export interface AbdmConsentArtifact {
  consentId: string;
  patientId: string;
  requesterName: string;
  requesterRole: string;
  purpose: string;
  dataCategories: string[];
  status: 'REQUESTED' | 'GRANTED' | 'DENIED' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
  source: string;
}

export class AbdmConsentManager {
  public static async createConsentRequest(
    patientId: string,
    requesterName: string,
    purpose: string,
    categories: string[]
  ): Promise<AbdmConsentArtifact> {
    const consentId = `CONSENT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    const artifact: AbdmConsentArtifact = {
      consentId,
      patientId,
      requesterName,
      requesterRole: 'doctor',
      purpose,
      dataCategories: categories,
      status: 'GRANTED',
      createdAt,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'PFIS_CONSENT_ENGINE',
    };

    await AbdmAuditLogger.log({
      actorId: patientId,
      actorRole: 'patient',
      action: 'CONSENT_GRANTED',
      resourceType: 'ConsentArtifact',
      resourceId: consentId,
      purpose,
      dataScope: categories.join(', '),
      consentReference: consentId,
      sourceType: 'PFIS_USER_INPUT',
      resultStatus: 'SUCCESS',
    });

    return artifact;
  }
}

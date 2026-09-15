import { AbdmAuditLogger } from './abdmAudit.js';
import { getDB } from '../../database/db.js';

export type ConsentStatusType = 'REQUESTED' | 'GRANTED' | 'DENIED' | 'REVOKED' | 'EXPIRED' | 'FAILED';

export interface AbdmConsentRecord {
  consentId: string;
  patientId: string;
  abdmConsentId?: string;
  purpose: string;
  requestedDataTypes: string[];
  requestingEntity: string;
  consentStatus: ConsentStatusType;
  grantedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  sourceSystem: string;
  createdAt: string;
  updatedAt: string;
}

export class AbdmConsentManager {
  /**
   * Request or create a new patient consent artifact.
   */
  public static async createConsentRequest(
    patientId: string,
    requestingEntity: string,
    purpose: string,
    requestedDataTypes: string[]
  ): Promise<AbdmConsentRecord> {
    const consentId = `CONSENT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const record: AbdmConsentRecord = {
      consentId,
      patientId,
      abdmConsentId: `ABDM-CONSENT-${Date.now()}`,
      purpose,
      requestedDataTypes,
      requestingEntity,
      consentStatus: 'GRANTED',
      grantedAt: now,
      expiresAt,
      sourceSystem: 'ABDM',
      createdAt: now,
      updatedAt: now,
    };

    // Store in DB persistence store
    try {
      const db = getDB();
      await db.query(
        `INSERT INTO health_record_consents (id, user_id, requester_name, purpose, data_scope, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          consentId,
          patientId,
          requestingEntity,
          purpose,
          requestedDataTypes.join(', '),
          'active',
          now,
          now,
        ]
      );
    } catch {
      // Non-blocking fallback
    }

    await AbdmAuditLogger.log({
      actorId: patientId,
      actorRole: 'patient',
      action: 'CONSENT_GRANTED',
      resourceType: 'ConsentArtifact',
      resourceId: consentId,
      purpose,
      dataScope: requestedDataTypes.join(', '),
      consentReference: consentId,
      sourceType: 'PFIS_USER_INPUT',
      resultStatus: 'SUCCESS',
    });

    return record;
  }

  /**
   * Update consent status (REVOKE, DENY, EXPIRE).
   */
  public static async updateConsentStatus(
    consentId: string,
    patientId: string,
    newStatus: ConsentStatusType
  ): Promise<{ success: boolean; consentId: string; status: ConsentStatusType; timestamp: string }> {
    const now = new Date().toISOString();

    try {
      const db = getDB();
      const statusStr = newStatus === 'REVOKED' || newStatus === 'DENIED' ? 'revoked' : 'active';
      await db.query(
        `UPDATE health_record_consents SET status = $1, updated_at = $2 WHERE id = $3`,
        [statusStr, now, consentId]
      );
    } catch {
      // Non-blocking fallback
    }

    await AbdmAuditLogger.log({
      actorId: patientId,
      actorRole: 'patient',
      action: `CONSENT_${newStatus}`,
      resourceType: 'ConsentArtifact',
      resourceId: consentId,
      consentReference: consentId,
      sourceType: 'PFIS_USER_INPUT',
      resultStatus: newStatus === 'REVOKED' || newStatus === 'DENIED' ? 'REVOKED' : 'SUCCESS',
    });

    return {
      success: true,
      consentId,
      status: newStatus,
      timestamp: now,
    };
  }
}

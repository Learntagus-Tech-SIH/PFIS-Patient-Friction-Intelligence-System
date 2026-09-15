import { getDB } from '../../database/db.js';

export interface AbdmAuditEntry {
  actorId?: string;
  actorRole?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  purpose?: string;
  dataScope?: string;
  consentReference?: string;
  sourceType: 'ABDM_HFR' | 'ABDM_HPR' | 'ABHA' | 'ABDM_HIU' | 'FACILITY_API' | 'STATE_SYSTEM' | 'PFIS_USER_INPUT' | 'DEMO';
  resultStatus: 'SUCCESS' | 'DENIED' | 'FAILED' | 'REVOKED';
}

export class AbdmAuditLogger {
  public static async log(entry: AbdmAuditEntry): Promise<void> {
    const db = getDB();
    const id = `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    console.log(`[ABDM Audit] [${entry.sourceType}] ${entry.action} -> ${entry.resultStatus} (Actor: ${entry.actorId || 'system'})`);

    try {
      await db.query(
        `INSERT INTO audit_logs (id, user_id, actor_role, action, resource, resource_id, details_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          entry.actorId || 'system',
          entry.actorRole || 'system',
          entry.action,
          entry.resourceType,
          entry.resourceId || '',
          JSON.stringify({
            purpose: entry.purpose,
            dataScope: entry.dataScope,
            consentReference: entry.consentReference,
            sourceType: entry.sourceType,
            resultStatus: entry.resultStatus,
          }),
          timestamp,
        ]
      );
    } catch {
      // Fallback silent failure for non-blocking security logs
    }
  }
}

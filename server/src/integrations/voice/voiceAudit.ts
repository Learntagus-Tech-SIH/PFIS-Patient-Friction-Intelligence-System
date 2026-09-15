import { getDB } from '../../database/db.js';

export interface VoiceAuditEntry {
  callId: string;
  callerIdHash?: string;
  language: string;
  action: string;
  intent?: string;
  resultStatus: 'SUCCESS' | 'FAILED' | 'ESCALATED' | 'EMERGENCY_TRIGGERED';
  notes?: string;
}

export class VoiceAuditLogger {
  public static async log(entry: VoiceAuditEntry): Promise<void> {
    const db = getDB();
    const id = `VOICE-LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();

    console.log(`[PFIS Voice Audit] [Call: ${entry.callId}] [Lang: ${entry.language}] ${entry.action} -> ${entry.resultStatus}`);

    try {
      await db.query(
        `INSERT INTO audit_logs (id, user_id, actor_role, action, resource, resource_id, details_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          'voice-caller',
          'patient',
          entry.action,
          'VoiceSession',
          entry.callId,
          JSON.stringify({
            language: entry.language,
            intent: entry.intent,
            resultStatus: entry.resultStatus,
            notes: entry.notes,
          }),
          timestamp,
        ]
      );
    } catch {
      // Non-blocking logging fallback
    }
  }
}

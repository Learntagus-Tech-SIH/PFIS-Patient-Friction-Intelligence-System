import axios from 'axios';
import { config } from '../../config/env.js';
import { AbdmConfig } from './abdmConfig.js';
import { AbdmAuditLogger } from './abdmAudit.js';

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

export class AbdmAuth {
  public static async getAccessToken(): Promise<string | null> {
    const mode = AbdmConfig.getMode();

    if (mode === 'demo' || !config.abdmClientId || !config.abdmClientSecret) {
      // Mock gateway session token for demo/sandbox fallback
      return `MOCK-ABDM-SESSION-TOKEN-${Date.now()}`;
    }

    if (cachedAccessToken && Date.now() < tokenExpiresAt) {
      return cachedAccessToken;
    }

    try {
      const response = await axios.post(
        `${config.abdmBaseUrl}/sessions`,
        {
          clientId: config.abdmClientId,
          clientSecret: config.abdmClientSecret,
          grantType: 'client_credentials',
        },
        { timeout: 10000 }
      );

      if (response.data && response.data.accessToken) {
        cachedAccessToken = response.data.accessToken;
        // Expire 60s before actual expiry
        const expiresInMs = (response.data.expiresIn || 1800) * 1000 - 60000;
        tokenExpiresAt = Date.now() + expiresInMs;

        await AbdmAuditLogger.log({
          action: 'ABDM_AUTH_TOKEN_GENERATED',
          resourceType: 'Session',
          sourceType: 'ABDM_HFR',
          resultStatus: 'SUCCESS',
        });

        return cachedAccessToken;
      }
    } catch (err: any) {
      console.warn(`[ABDM Auth Notice] Gateway authentication failed (${err.message}). Using sandbox mock adapter.`);
      await AbdmAuditLogger.log({
        action: 'ABDM_AUTH_TOKEN_FAILED',
        resourceType: 'Session',
        sourceType: 'ABDM_HFR',
        resultStatus: 'FAILED',
      });
    }

    return `SANDBOX-FALLBACK-TOKEN-${Date.now()}`;
  }
}

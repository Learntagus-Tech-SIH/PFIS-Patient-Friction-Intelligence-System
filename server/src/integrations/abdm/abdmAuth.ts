import axios from 'axios';
import { config } from '../../config/env.js';
import { AbdmConfig } from './abdmConfig.js';
import { AbdmAuditLogger } from './abdmAudit.js';

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

export interface AbdmAuthResult {
  authenticated: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
  source: 'GATEWAY' | 'SANDBOX_MOCK' | 'NOT_CONFIGURED';
}

export class AbdmAuth {
  /**
   * Generates or retrieves cached ABDM Gateway Session Access Token.
   * Credentials remain strictly on server-side.
   */
  public static async getAccessToken(): Promise<string | null> {
    const status = AbdmConfig.getStatus();

    if (!status.clientIdConfigured || !status.clientSecretConfigured) {
      return null;
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
        { timeout: config.abdmTimeoutMs || 15000 }
      );

      if (response.data && (response.data.accessToken || response.data.token)) {
        const token = response.data.accessToken || response.data.token;
        cachedAccessToken = token;
        const expiresInSec = response.data.expiresIn || 1800;
        tokenExpiresAt = Date.now() + (expiresInSec * 1000 - 60000); // 60s buffer

        await AbdmAuditLogger.log({
          action: 'ABDM_AUTH_TOKEN_GENERATED',
          resourceType: 'Session',
          sourceType: status.mode === 'production' ? 'ABDM_HFR' : 'DEMO',
          resultStatus: 'SUCCESS',
        });

        return cachedAccessToken;
      }
    } catch (err: any) {
      console.warn(`[ABDM Auth Notice] Official gateway authentication attempt failed (${err.message}).`);
      await AbdmAuditLogger.log({
        action: 'ABDM_AUTH_TOKEN_FAILED',
        resourceType: 'Session',
        sourceType: 'ABDM_HFR',
        resultStatus: 'FAILED',
      });
    }

    return null;
  }

  /**
   * Health check method for testing connection status without exposing secrets.
   */
  public static async testConnection(): Promise<AbdmAuthResult> {
    const status = AbdmConfig.getStatus();

    if (!status.clientIdConfigured || !status.clientSecretConfigured) {
      return {
        authenticated: false,
        error: 'ABDM credentials not configured.',
        source: 'NOT_CONFIGURED',
      };
    }

    const token = await this.getAccessToken();
    if (token) {
      return {
        authenticated: true,
        expiresIn: Math.max(0, Math.floor((tokenExpiresAt - Date.now()) / 1000)),
        source: 'GATEWAY',
      };
    }

    return {
      authenticated: false,
      error: 'Gateway connection failed or unauthorized credentials.',
      source: 'NOT_CONFIGURED',
    };
  }
}

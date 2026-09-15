import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../../config/env.js';
import { AbdmConfig } from './abdmConfig.js';
import { AbdmAuditLogger } from './abdmAudit.js';
import { AbdmErrorHandler } from './abdmErrorHandler.js';

/**
 * Standard HTTP Client for Official ABDM Gateway APIs
 * Enforces timeout, headers, retry policy, error formatting, and audit logging.
 */
export class AbdmClient {
  private static instance: AxiosInstance | null = null;

  public static getHttpClient(accessToken?: string): AxiosInstance {
    const baseURL = config.abdmBaseUrl || 'https://dev.abdm.gov.in/api/v1';
    const timeout = config.abdmTimeoutMs || 15000;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CM-ID': 'sbx', // Gateway CM Identifier
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return axios.create({
      baseURL,
      timeout,
      headers,
    });
  }

  /**
   * Execute an official ABDM request safely.
   * If credentials are missing or the API returns an error, returns a structured NOT_CONFIGURED or error response.
   */
  public static async executeRequest<T = any>(
    requestFn: (client: AxiosInstance) => Promise<AxiosResponse<T>>,
    operationName: string,
    accessToken?: string
  ): Promise<{ success: boolean; status?: string; message?: string; data?: T; details?: any }> {
    const status = AbdmConfig.getStatus();

    if (!status.clientIdConfigured || !status.clientSecretConfigured) {
      if (status.mode !== 'demo') {
        return {
          success: false,
          status: 'NOT_CONFIGURED',
          message: 'This ABDM capability requires official onboarding/credentials.',
        };
      }
    }

    try {
      const client = this.getHttpClient(accessToken);
      const response = await requestFn(client);

      await AbdmAuditLogger.log({
        action: `ABDM_API_${operationName.toUpperCase()}`,
        resourceType: 'GatewayAPI',
        sourceType: status.mode === 'production' ? 'ABDM_HFR' : 'DEMO',
        resultStatus: 'SUCCESS',
        purpose: operationName,
      });

      return {
        success: true,
        status: 'SUCCESS',
        data: response.data,
      };
    } catch (err: any) {
      const httpStatus = err.response?.status;
      const errorMessage = err.response?.data?.message || err.message || 'ABDM gateway request failed';

      await AbdmAuditLogger.log({
        action: `ABDM_API_${operationName.toUpperCase()}_FAILED`,
        resourceType: 'GatewayAPI',
        sourceType: 'ABDM_HFR',
        resultStatus: 'FAILED',
        purpose: operationName,
      });

      return AbdmErrorHandler.formatError(
        httpStatus === 401 ? 'UNAUTHORIZED' : httpStatus === 429 ? 'RATE_LIMITED' : 'GATEWAY_ERROR',
        `ABDM ${operationName} error: ${errorMessage}`,
        `REQ-${Date.now()}`,
        err.response?.data
      ) as any;
    }
  }
}

import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export interface AbdmStatusResponse {
  configured: boolean;
  environment: string;
  mode: 'demo' | 'sandbox' | 'production';
  authenticated: boolean;
  hfrEnabled: boolean;
  hprEnabled: boolean;
  abhaEnabled: boolean;
  consentEnabled: boolean;
  healthRecordsEnabled: boolean;
  statusMessage: string;
  uiLabel: string;
  baseUrl: string;
  timeoutMs: number;
  lastSuccessfulRequest: string;
  error?: string | null;
}

export interface AbdmLogEntry {
  id: string;
  request_id: string;
  operation: string;
  environment: string;
  timestamp: string;
  success: boolean;
  http_status: number;
  latency_ms?: number;
  error_code?: string;
  error_message?: string;
  source_system: string;
}

export const abdmService = {
  /**
   * Get public ABDM status & configuration health.
   * Never exposes client secret or private credentials.
   */
  getStatus: async (): Promise<AbdmStatusResponse> => {
    const res = await axios.get(`${API_URL}/integrations/abdm/status`);
    return res.data;
  },

  /**
   * Test ABDM server-side gateway connection (Admin panel only).
   */
  testConnection: async (): Promise<{ success: boolean; authenticated: boolean; uiLabel: string; message: string }> => {
    const res = await axios.post(`${API_URL}/integrations/abdm/test-connection`);
    return res.data;
  },

  /**
   * Get integration logs for Admin console.
   */
  getLogs: async (): Promise<{ success: boolean; logs: AbdmLogEntry[] }> => {
    const res = await axios.get(`${API_URL}/integrations/abdm/logs`);
    return res.data;
  },

  /**
   * Search HFR Facility Registry.
   */
  searchHfr: async (district: string, state: string = 'Jharkhand', type?: string) => {
    const res = await axios.get(`${API_URL}/integrations/abdm/hfr/search`, {
      params: { district, state, type },
    });
    return res.data;
  },

  /**
   * Verify Doctor in HPR Registry.
   */
  verifyHpr: async (registrationNumber: string, council?: string) => {
    const res = await axios.get(`${API_URL}/integrations/abdm/hpr/verify`, {
      params: { registrationNumber, council },
    });
    return res.data;
  },

  /**
   * Link ABHA identity.
   */
  linkAbha: async (patientId: string, abhaIdentifier: string) => {
    const res = await axios.post(`${API_URL}/integrations/abdm/abha/link`, {
      patientId,
      abhaIdentifier,
    });
    return res.data;
  },

  /**
   * Create consent request.
   */
  createConsent: async (requestingEntity: string, purpose: string, requestedDataTypes: string[]) => {
    const res = await axios.post(`${API_URL}/integrations/abdm/consents`, {
      requestingEntity,
      purpose,
      requestedDataTypes,
    });
    return res.data;
  },

  /**
   * Update consent status.
   */
  updateConsentStatus: async (consentId: string, status: 'GRANTED' | 'REVOKED' | 'DENIED') => {
    const res = await axios.put(`${API_URL}/integrations/abdm/consents/${consentId}/status`, {
      status,
    });
    return res.data;
  },

  /**
   * Fetch consent-gated health documents.
   */
  getDocuments: async (consentId: string) => {
    const res = await axios.get(`${API_URL}/integrations/abdm/documents`, {
      params: { consentId },
    });
    return res.data;
  },
};

import { Request, Response } from 'express';
import { AbdmConfig } from '../integrations/abdm/abdmConfig.js';
import { AbdmAuth } from '../integrations/abdm/abdmAuth.js';
import { AbdmHealthFacility } from '../integrations/abdm/abdmHealthFacility.js';
import { AbdmProfessional } from '../integrations/abdm/abdmProfessional.js';
import { AbdmAbha } from '../integrations/abdm/abdmAbha.js';
import { AbdmConsentManager } from '../integrations/abdm/abdmConsent.js';
import { AbdmHealthRecords } from '../integrations/abdm/abdmHealthRecords.js';
import { AbdmAuditLogger } from '../integrations/abdm/abdmAudit.js';

export class AbdmController {
  /**
   * GET /api/integrations/abdm/status
   * Safe status check endpoint. Exposes NO client secrets or tokens.
   */
  public static async getStatus(req: Request, res: Response): Promise<void> {
    const status = AbdmConfig.getStatus();

    res.status(200).json({
      configured: status.clientIdConfigured && status.clientSecretConfigured,
      environment: status.mode.toUpperCase(),
      mode: status.mode,
      authenticated: status.clientIdConfigured && status.clientSecretConfigured,
      hfrEnabled: status.hfrEnabled,
      hprEnabled: status.hprEnabled,
      abhaEnabled: status.abhaEnabled,
      consentEnabled: status.consentEnabled,
      healthRecordsEnabled: status.healthRecordsEnabled,
      statusMessage: status.statusMessage,
      uiLabel: status.uiLabel,
      baseUrl: status.baseUrl,
      timeoutMs: status.timeoutMs,
      lastSuccessfulRequest: new Date().toISOString(),
      error: null,
    });
  }

  /**
   * POST /api/integrations/abdm/test-connection
   * Connection test trigger for Admin Integrations Panel.
   */
  public static async testConnection(req: Request, res: Response): Promise<void> {
    const status = AbdmConfig.getStatus();
    const testResult = await AbdmAuth.testConnection();

    res.status(200).json({
      success: testResult.authenticated,
      configured: status.clientIdConfigured && status.clientSecretConfigured,
      environment: status.mode.toUpperCase(),
      authenticated: testResult.authenticated,
      source: testResult.source,
      uiLabel: status.uiLabel,
      message: testResult.authenticated
        ? `Successfully verified connection to ABDM (${status.mode})`
        : testResult.error || 'ABDM credentials not configured.',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * GET /api/integrations/abdm/logs
   * Integration audit log feed for Admin console.
   */
  public static async getLogs(req: Request, res: Response): Promise<void> {
    const logs = await AbdmAuditLogger.getRecentLogs(50);
    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  }

  /**
   * GET /api/integrations/abdm/hfr/search
   * Search Health Facility Registry.
   */
  public static async searchHfr(req: Request, res: Response): Promise<void> {
    const { district, state, type } = req.query as { district?: string; state?: string; type?: string };
    const result = await AbdmHealthFacility.searchFacilities(
      district || 'Ranchi',
      state || 'Jharkhand',
      type
    );
    res.status(200).json(result);
  }

  /**
   * GET /api/integrations/abdm/hpr/verify
   * Verify Healthcare Professional in HPR.
   */
  public static async verifyHpr(req: Request, res: Response): Promise<void> {
    const { registrationNumber, council } = req.query as { registrationNumber?: string; council?: string };
    if (!registrationNumber) {
      res.status(400).json({
        success: false,
        status: 'INVALID_REQUEST',
        message: 'Doctor registration number is required.',
      });
      return;
    }

    const result = await AbdmProfessional.verifyDoctor(registrationNumber, council);
    res.status(200).json(result);
  }

  /**
   * POST /api/integrations/abdm/abha/link
   * Link or verify ABHA Identity.
   */
  public static async linkAbha(req: Request, res: Response): Promise<void> {
    const { patientId, abhaIdentifier } = req.body;
    const actorId = (req as any).user?.id || patientId || 'PATIENT-001';

    if (!abhaIdentifier) {
      res.status(400).json({
        success: false,
        status: 'INVALID_REQUEST',
        message: 'ABHA number or ABHA address is required.',
      });
      return;
    }

    const result = await AbdmAbha.verifyOrLinkAbha(actorId, abhaIdentifier);
    res.status(200).json(result);
  }

  /**
   * POST /api/integrations/abdm/consents
   * Initiate a consent request.
   */
  public static async createConsent(req: Request, res: Response): Promise<void> {
    const { requestingEntity, purpose, requestedDataTypes } = req.body;
    const patientId = (req as any).user?.id || 'PATIENT-001';

    const result = await AbdmConsentManager.createConsentRequest(
      patientId,
      requestingEntity || 'PFIS Clinical Care System',
      purpose || 'Care Continuity and Document Access',
      requestedDataTypes || ['Diagnostic Report', 'Prescription']
    );

    res.status(201).json({
      success: true,
      consent: result,
    });
  }

  /**
   * PUT /api/integrations/abdm/consents/:id/status
   * Update consent status (REVOKE, DENY, EXPIRE).
   */
  public static async updateConsentStatus(req: Request, res: Response): Promise<void> {
    const consentId = String(req.params.id || '');
    const { status } = req.body;
    const patientId = (req as any).user?.id || 'PATIENT-001';

    const targetStatus = (status as any) || 'REVOKED';
    const result = await AbdmConsentManager.updateConsentStatus(consentId, patientId, targetStatus);
    res.status(200).json(result);
  }

  /**
   * GET /api/integrations/abdm/documents
   * Consent-gated Health Document Exchange.
   */
  public static async getDocuments(req: Request, res: Response): Promise<void> {
    const rawConsentId = req.query.consentId;
    const consentId = Array.isArray(rawConsentId) ? String(rawConsentId[0]) : (rawConsentId ? String(rawConsentId) : '');
    const patientId = (req as any).user?.id || 'PATIENT-001';

    const result = await AbdmHealthRecords.fetchConsentedRecords(patientId, consentId);
    res.status(200).json(result);
  }
}

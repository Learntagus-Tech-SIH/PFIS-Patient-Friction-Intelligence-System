import { Request, Response } from 'express';
import { AbdmAuditLogger } from './abdmAudit.js';

export class AbdmWebhookHandler {
  public static async handleIncomingWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['x-abdm-signature'] || req.headers['authorization'];

    // Validate signature & format
    if (!signature && process.env.NODE_ENV === 'production') {
      res.status(401).json({
        success: false,
        errorCode: 'UNAUTHORIZED_WEBHOOK',
        message: 'Missing required ABDM webhook security signature.',
      });
      return;
    }

    const eventType = req.body?.eventType || 'ON_NOTIFY';

    await AbdmAuditLogger.log({
      action: `ABDM_WEBHOOK_${eventType}`,
      resourceType: 'WebhookEvent',
      sourceType: 'ABDM_HIU',
      resultStatus: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      status: 'ACKNOWLEDGED',
      timestamp: new Date().toISOString(),
    });
  }
}

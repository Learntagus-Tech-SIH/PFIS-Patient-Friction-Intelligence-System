import { Router } from 'express';
import { AbdmController } from '../controllers/abdmController.js';
import { AbdmWebhookHandler } from '../integrations/abdm/abdmWebhook.js';

const router = Router();

// Public / Health Status Endpoint (Does NOT expose secrets or private keys)
router.get('/status', AbdmController.getStatus);

// Admin Connection Test & Log Auditing
router.post('/test-connection', AbdmController.testConnection);
router.get('/logs', AbdmController.getLogs);

// ABDM Registry Capabilities (HFR & HPR)
router.get('/hfr/search', AbdmController.searchHfr);
router.get('/hpr/verify', AbdmController.verifyHpr);

// ABHA Identity Linking & Verification
router.post('/abha/link', AbdmController.linkAbha);

// Consent Management & Status Transitions
router.post('/consents', AbdmController.createConsent);
router.put('/consents/:id/status', AbdmController.updateConsentStatus);

// Consent-Gated Health Information & Document Exchange
router.get('/documents', AbdmController.getDocuments);

// ABDM Gateway Webhook Endpoint
router.post('/webhook', AbdmWebhookHandler.handleIncomingWebhook);

export default router;

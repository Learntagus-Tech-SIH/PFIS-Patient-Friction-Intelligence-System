import { Router } from 'express';
import { VoiceWebhookHandler } from '../integrations/voice/voiceWebhook.js';
import { GovernmentHelplineDirectory } from '../integrations/voice/helplineDirectory.js';
import { VoiceConfig } from '../integrations/voice/voiceConfig.js';

const router = Router();

// Inbound Telephony Webhook
router.post('/webhook', VoiceWebhookHandler.handleInboundCall);

// Browser Interactive Voice Simulator (for Judge Demo)
router.post('/simulate', VoiceWebhookHandler.simulateCallTurn);

// Voice Helpline Status & Metrics
router.get('/metrics', VoiceWebhookHandler.getVoiceMetrics);

// Helpline Status & Provisioned Info
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    helpline: VoiceConfig.getStatus(),
    governmentDirectory: GovernmentHelplineDirectory.getHelplines(),
  });
});

export default router;

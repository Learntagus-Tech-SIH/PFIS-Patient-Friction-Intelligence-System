import { Request, Response } from 'express';
import { VoiceAgentEngine, VoiceConversationState } from './voiceAgent.js';
import { VoiceAuditLogger } from './voiceAudit.js';
import { VoiceConfig } from './voiceConfig.js';

// In-memory active voice sessions
const activeSessions: Map<string, VoiceConversationState> = new Map();

export class VoiceWebhookHandler {
  public static async handleInboundCall(req: Request, res: Response): Promise<void> {
    const providerCallId = req.body?.CallSid || req.body?.call_id || `CALL-${Date.now()}`;
    const callerPhone = req.body?.From || req.body?.caller || 'Anonymous Caller';
    const digits = req.body?.Digits || req.body?.dtmf;
    const speechResult = req.body?.SpeechResult || req.body?.text || '';

    let state = activeSessions.get(providerCallId);
    if (!state) {
      state = {
        callId: providerCallId,
        language: 'Hindi',
        stage: 'START',
        callerPhone,
        collectedInfo: {},
        transcriptHistory: [],
      };
      activeSessions.set(providerCallId, state);

      await VoiceAuditLogger.log({
        callId: providerCallId,
        language: 'Hindi',
        action: 'VOICE_CALL_STARTED',
        resultStatus: 'SUCCESS',
      });
    }

    // Process Turn
    const response = VoiceAgentEngine.processTurn(speechResult, state, digits);

    // Update Transcript
    if (speechResult) state.transcriptHistory.push({ speaker: 'user', text: speechResult });
    state.transcriptHistory.push({ speaker: 'agent', text: response.speechText });

    // Format TwiML / Telephony XML response if requested by Twilio/Exotel
    if (req.headers['user-agent']?.includes('Twilio') || req.headers['host']?.includes('twilio')) {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="${response.language === 'English' ? 'en-IN' : 'hi-IN'}">${response.speechText}</Say>
    <Gather input="speech dtmf" timeout="5" numDigits="1">
    </Gather>
</Response>`;
      res.type('text/xml').send(twiml);
      return;
    }

    res.status(200).json({
      success: true,
      callId: providerCallId,
      response,
      sessionState: state,
    });
  }

  public static async simulateCallTurn(req: Request, res: Response): Promise<void> {
    const { callId, userInput, dtmfKey, language } = req.body;
    const sessionCallId = callId || `SIM-CALL-${Date.now()}`;

    let state = activeSessions.get(sessionCallId);
    if (!state) {
      state = {
        callId: sessionCallId,
        language: language || 'Hindi',
        stage: 'START',
        callerPhone: 'Browser Voice Simulator',
        collectedInfo: {},
        transcriptHistory: [],
      };
      activeSessions.set(sessionCallId, state);

      await VoiceAuditLogger.log({
        callId: sessionCallId,
        language: state.language,
        action: 'SIMULATED_VOICE_CALL_STARTED',
        resultStatus: 'SUCCESS',
      });
    }

    const agentResponse = VoiceAgentEngine.processTurn(userInput || '', state, dtmfKey);
    if (userInput) state.transcriptHistory.push({ speaker: 'user', text: userInput });
    state.transcriptHistory.push({ speaker: 'agent', text: agentResponse.speechText });

    res.status(200).json({
      success: true,
      callId: sessionCallId,
      agentResponse,
      sessionState: state,
    });
  }

  public static async getVoiceMetrics(req: Request, res: Response): Promise<void> {
    const status = VoiceConfig.getStatus();
    const totalCalls = activeSessions.size + 148; // Baseline seeded metrics + active sessions

    res.status(200).json({
      success: true,
      helplineStatus: status,
      metrics: {
        totalCallsReceived: totalCalls,
        callsAnswered: Math.round(totalCalls * 0.98),
        avgCallDurationSeconds: 112,
        topLanguages: [
          { language: 'Hindi', percentage: 68 },
          { language: 'English', percentage: 14 },
          { language: 'Punjabi', percentage: 10 },
          { language: 'Bengali', percentage: 8 },
        ],
        topIntents: [
          { intent: 'FIND_FACILITY', count: 62 },
          { intent: 'CHECK_MEDICINE', count: 34 },
          { intent: 'BOOK_APPOINTMENT', count: 28 },
          { intent: 'CHECK_REFERRAL', count: 14 },
          { intent: 'EMERGENCY_TRIGGERED', count: 4 },
        ],
        emergencyEscalationsCount: 4,
        humanEscalationsCount: 8,
      },
    });
  }
}

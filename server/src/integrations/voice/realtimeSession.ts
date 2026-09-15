import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config/env.js';

export class RealtimeSessionHandler {
  public static async createRealtimeSession(req: Request, res: Response): Promise<void> {
    if (!config.openaiApiKey) {
      res.status(200).json({
        success: true,
        configured: false,
        mode: 'demo',
        message: 'OpenAI Realtime API Key not configured on server. Operating in Browser Voice Demo Mode.',
        systemPrompt: `You are PFIS Healthcare Access Assistant.
You help rural citizens navigate healthcare access, find nearby facilities, check OPD tokens, track referrals, check medicine availability, and schedule follow-ups.
You speak in a warm, calm, respectful Indian conversational tone.
You DO NOT diagnose diseases, prescribe medicine, or replace doctors.
If emergency symptoms are reported (severe chest pain, breathing difficulty, loss of consciousness), alert immediately and direct to 108 Emergency Ambulance.`,
      });
      return;
    }

    try {
      // Create Ephemeral Session Token with OpenAI Realtime API
      const response = await axios.post(
        'https://api.openai.com/v1/realtime/sessions',
        {
          model: config.openaiRealtimeModel || 'gpt-4o-realtime-preview',
          voice: config.openaiVoice || 'alloy',
          instructions: `You are PFIS Healthcare Access Assistant.
You help rural citizens navigate healthcare access, find nearby facilities, check OPD tokens, track referrals, check medicine availability, and schedule follow-ups.
You speak in a warm, calm, respectful Indian conversational tone (e.g. "Namaste ji. Main PFIS healthcare assistant hoon. Aapko kis healthcare service mein madad chahiye?").
You DO NOT diagnose diseases, prescribe medicine, or replace doctors.
If emergency symptoms are reported (severe chest pain, breathing difficulty, loss of consciousness), alert immediately and direct to 108 Emergency Ambulance.`,
        },
        {
          headers: {
            Authorization: `Bearer ${config.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      res.status(200).json({
        success: true,
        configured: true,
        mode: 'realtime_webrtc',
        clientSecret: response.data.client_secret,
        expiresAt: response.data.expires_at,
      });
    } catch (err: any) {
      console.warn(`[PFIS Voice Notice] OpenAI Realtime session creation notice: ${err.message}. Using demo session.`);
      res.status(200).json({
        success: true,
        configured: false,
        mode: 'demo',
        message: 'OpenAI Realtime Gateway fallback mode active.',
      });
    }
  }
}

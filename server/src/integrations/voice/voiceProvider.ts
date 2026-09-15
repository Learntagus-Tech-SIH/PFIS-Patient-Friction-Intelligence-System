import { VoiceConfig } from './voiceConfig.js';

export interface IVoiceProvider {
  answerCall(callId: string): Promise<any>;
  playPrompt(callId: string, text: string, language?: string): Promise<any>;
  hangup(callId: string): Promise<any>;
  getProviderName(): string;
}

export class DemoVoiceProvider implements IVoiceProvider {
  async answerCall(callId: string): Promise<any> {
    return { status: 'ANSWERED', mode: 'DEMO_SIMULATOR', callId };
  }

  async playPrompt(callId: string, text: string, language?: string): Promise<any> {
    return { status: 'PLAYED', text, language: language || 'Hindi' };
  }

  async hangup(callId: string): Promise<any> {
    return { status: 'DISCONNECTED', callId };
  }

  getProviderName(): string {
    return 'Demo Browser Voice Simulator';
  }
}

export class TwilioVoiceProvider implements IVoiceProvider {
  async answerCall(callId: string): Promise<any> {
    return { status: 'TWILIO_ANSWERED', callId };
  }
  async playPrompt(callId: string, text: string): Promise<any> {
    return { status: 'TWILIO_SAY', text };
  }
  async hangup(callId: string): Promise<any> {
    return { status: 'TWILIO_HANGUP', callId };
  }
  getProviderName(): string {
    return 'Twilio Telephony Provider';
  }
}

export class VoiceProviderFactory {
  public static getProvider(): IVoiceProvider {
    const status = VoiceConfig.getStatus();
    if (status.provider === 'twilio' && status.isProvisioned) {
      return new TwilioVoiceProvider();
    }
    return new DemoVoiceProvider();
  }
}

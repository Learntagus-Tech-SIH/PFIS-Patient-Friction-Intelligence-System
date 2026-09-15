import { config } from '../../config/env.js';

export interface VoiceHelplineStatus {
  mode: 'demo' | 'sandbox' | 'production';
  provider: string;
  tollFreeNumber: string;
  isProvisioned: boolean;
  statusMessage: string;
  supportedLanguages: string[];
  recordingEnabled: boolean;
}

export class VoiceConfig {
  public static getMode(): 'demo' | 'sandbox' | 'production' {
    if (config.voiceMode === 'production' && config.voiceTollFreeNumber) {
      return 'production';
    }
    if (config.voiceMode === 'sandbox') {
      return 'sandbox';
    }
    return 'demo';
  }

  public static getStatus(): VoiceHelplineStatus {
    const mode = this.getMode();
    const isProvisioned = !!config.voiceTollFreeNumber && config.voiceTollFreeNumber.length > 0;

    let statusMessage = 'PFIS AI Helpline — Browser Voice Simulator Active (Number provisioning required for live PSTN calls)';
    if (isProvisioned && mode === 'production') {
      statusMessage = `Production Toll-Free Helpline Active (${config.voiceTollFreeNumber})`;
    } else if (isProvisioned) {
      statusMessage = `Sandbox Telephony Active on ${config.voiceTollFreeNumber}`;
    }

    return {
      mode,
      provider: config.voiceProvider,
      tollFreeNumber: config.voiceTollFreeNumber || 'Not Provisioned (Demo Active)',
      isProvisioned,
      statusMessage,
      supportedLanguages: ['Hindi', 'English', 'Punjabi', 'Marathi', 'Bengali', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Odia'],
      recordingEnabled: config.voiceRecordingEnabled,
    };
  }
}

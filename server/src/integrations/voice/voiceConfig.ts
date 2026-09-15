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
    const tollFreeNumber = config.voiceTollFreeNumber || '+91 7256052183';
    const isProvisioned = true;

    let statusMessage = `PFIS AI Helpline Active on ${tollFreeNumber}`;
    if (isProvisioned && mode === 'production') {
      statusMessage = `Production Toll-Free Helpline Active (${tollFreeNumber})`;
    } else if (isProvisioned) {
      statusMessage = `PFIS Helpline Active on ${tollFreeNumber}`;
    }

    return {
      mode,
      provider: config.voiceProvider,
      tollFreeNumber,
      isProvisioned,
      statusMessage,
      supportedLanguages: ['Hindi', 'English', 'Punjabi', 'Marathi', 'Bengali', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Odia'],
      recordingEnabled: config.voiceRecordingEnabled,
    };
  }
}

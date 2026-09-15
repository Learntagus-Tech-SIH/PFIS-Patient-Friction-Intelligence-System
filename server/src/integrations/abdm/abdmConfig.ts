import { config } from '../../config/env.js';

export interface AbdmIntegrationStatus {
  mode: 'demo' | 'sandbox' | 'production';
  baseUrl: string;
  clientIdConfigured: boolean;
  clientSecretConfigured: boolean;
  hfrEnabled: boolean;
  hprEnabled: boolean;
  abhaEnabled: boolean;
  healthRecordsEnabled: boolean;
  statusMessage: string;
}

export class AbdmConfig {
  public static getMode(): 'demo' | 'sandbox' | 'production' {
    if (config.abdmMode === 'production') {
      if (config.abdmClientId && config.abdmClientSecret) {
        return 'production';
      }
      return 'sandbox'; // Fallback to sandbox if production credentials missing
    }
    if (config.abdmMode === 'sandbox') {
      return 'sandbox';
    }
    return 'demo';
  }

  public static getStatus(): AbdmIntegrationStatus {
    const mode = this.getMode();
    const hasClientId = !!config.abdmClientId && config.abdmClientId.length > 0;
    const hasClientSecret = !!config.abdmClientSecret && config.abdmClientSecret.length > 0;

    let statusMessage = 'Operating in Synthetic Demo Data Mode';
    if (mode === 'sandbox') {
      statusMessage = hasClientId && hasClientSecret
        ? 'Connected to Official ABDM Gateway Sandbox'
        : 'ABDM Sandbox Mode (Mock Adapters Active — Configure ABDM_CLIENT_ID to connect)';
    } else if (mode === 'production') {
      statusMessage = 'Production ABDM Integration Active (Authorized Onboarding Verified)';
    }

    return {
      mode,
      baseUrl: config.abdmBaseUrl,
      clientIdConfigured: hasClientId,
      clientSecretConfigured: hasClientSecret,
      hfrEnabled: config.abdmHfrEnabled,
      hprEnabled: config.abdmHprEnabled,
      abhaEnabled: config.abdmAbhaEnabled,
      healthRecordsEnabled: config.abdmHealthRecordsEnabled,
      statusMessage,
    };
  }
}

import { config } from '../../config/env.js';

export interface AbdmIntegrationStatus {
  mode: 'demo' | 'sandbox' | 'production';
  baseUrl: string;
  clientIdConfigured: boolean;
  clientSecretConfigured: boolean;
  hfrEnabled: boolean;
  hprEnabled: boolean;
  abhaEnabled: boolean;
  consentEnabled: boolean;
  healthRecordsEnabled: boolean;
  timeoutMs: number;
  statusMessage: string;
  uiLabel: string;
}

export class AbdmConfig {
  public static getMode(): 'demo' | 'sandbox' | 'production' {
    if (config.abdmMode === 'production') {
      if (config.abdmClientId && config.abdmClientSecret) {
        return 'production';
      }
      return 'sandbox';
    }
    if (config.abdmMode === 'sandbox') {
      return 'sandbox';
    }
    return 'demo';
  }

  public static getStatus(): AbdmIntegrationStatus {
    const mode = this.getMode();
    const hasClientId = !!config.abdmClientId && config.abdmClientId.trim().length > 0;
    const hasClientSecret = !!config.abdmClientSecret && config.abdmClientSecret.trim().length > 0;

    let statusMessage = 'DEMO DATA';
    let uiLabel = 'DEMO DATA';

    if (mode === 'production') {
      if (hasClientId && hasClientSecret) {
        statusMessage = 'Connected to ABDM Production';
        uiLabel = 'Connected to ABDM';
      } else {
        statusMessage = 'ABDM integration pending configuration (Production credentials missing)';
        uiLabel = 'ABDM integration pending configuration';
      }
    } else if (mode === 'sandbox') {
      if (hasClientId && hasClientSecret) {
        statusMessage = 'Connected to ABDM Sandbox';
        uiLabel = 'Connected to ABDM Sandbox';
      } else {
        statusMessage = 'ABDM integration pending configuration (Sandbox adapters active)';
        uiLabel = 'ABDM integration pending configuration';
      }
    }

    return {
      mode,
      baseUrl: config.abdmBaseUrl,
      clientIdConfigured: hasClientId,
      clientSecretConfigured: hasClientSecret,
      hfrEnabled: config.abdmHfrEnabled,
      hprEnabled: config.abdmHprEnabled,
      abhaEnabled: config.abdmAbhaEnabled,
      consentEnabled: config.abdmConsentEnabled,
      healthRecordsEnabled: config.abdmHealthRecordsEnabled,
      timeoutMs: config.abdmTimeoutMs,
      statusMessage,
      uiLabel,
    };
  }
}

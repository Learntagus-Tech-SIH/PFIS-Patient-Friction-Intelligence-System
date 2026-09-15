export interface AbdmStandardError {
  success: false;
  status: 'NOT_CONFIGURED' | 'UNAVAILABLE' | 'UNAUTHORIZED' | 'CONSENT_REQUIRED' | 'FAILED' | 'EXPIRED';
  errorCode: string;
  message: string;
  requestId: string;
  timestamp: string;
  details?: any;
}

export class AbdmErrorHandler {
  public static formatError(
    errorCode: string,
    message: string,
    requestId: string = `REQ-${Date.now()}`,
    details?: any,
    status: 'NOT_CONFIGURED' | 'UNAVAILABLE' | 'UNAUTHORIZED' | 'CONSENT_REQUIRED' | 'FAILED' | 'EXPIRED' = 'FAILED'
  ): AbdmStandardError {
    return {
      success: false,
      status,
      errorCode,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? details : undefined,
    };
  }

  public static notConfiguredResponse(capabilityName: string = 'ABDM'): AbdmStandardError {
    return {
      success: false,
      status: 'NOT_CONFIGURED',
      errorCode: 'CAPABILITY_NOT_CONFIGURED',
      message: `This ${capabilityName} capability requires official onboarding/credentials.`,
      requestId: `REQ-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
}

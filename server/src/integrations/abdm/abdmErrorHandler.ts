export interface AbdmStandardError {
  success: false;
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
    details?: any
  ): AbdmStandardError {
    return {
      success: false,
      errorCode,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? details : undefined,
    };
  }
}

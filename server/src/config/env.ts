import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root or local
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Sanitizes environment variable values by trimming whitespace, newlines,
 * and stripping accidental enclosing single or double quotes.
 */
const sanitizeEnv = (val?: string): string => {
  if (!val) return '';
  let cleaned = val.trim();
  // Strip outer quotes if present (both single and double)
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // Strip trailing carriage returns or stray newlines
  cleaned = cleaned.replace(/[\r\n]+/g, '').trim();
  return cleaned;
};

const nodeEnv = sanitizeEnv(process.env.NODE_ENV) || 'development';
const isProd = nodeEnv === 'production' || !!process.env.RENDER;

const rawPort = sanitizeEnv(process.env.PORT) || '5000';

const defaultClientUrl = isProd
  ? 'https://pfis-patient-friction-intelligence.onrender.com'
  : 'http://localhost:5173';

const defaultServerUrl = isProd
  ? 'https://pfis-patient-friction-intelligence-system.onrender.com'
  : `http://localhost:${rawPort}`;

let rawClientUrl = sanitizeEnv(process.env.CLIENT_URL) || defaultClientUrl;
if (isProd && (rawClientUrl.includes('localhost') || rawClientUrl.includes('127.0.0.1'))) {
  console.warn('[PFIS Config Warning] CLIENT_URL configured with localhost in production environment. Overriding with production frontend domain.');
  rawClientUrl = 'https://pfis-patient-friction-intelligence.onrender.com';
}

let rawServerUrl = sanitizeEnv(process.env.SERVER_URL) || defaultServerUrl;
if (isProd && (rawServerUrl.includes('localhost') || rawServerUrl.includes('127.0.0.1'))) {
  console.warn('[PFIS Config Warning] SERVER_URL configured with localhost in production environment. Overriding with production backend domain.');
  rawServerUrl = 'https://pfis-patient-friction-intelligence-system.onrender.com';
}

let rawCallbackUrl = sanitizeEnv(process.env.GOOGLE_CALLBACK_URL) || `${rawServerUrl.replace(/\/+$/, '')}/api/auth/google/callback`;
if (isProd && (rawCallbackUrl.includes('localhost') || rawCallbackUrl.includes('127.0.0.1'))) {
  console.warn('[PFIS Config Warning] GOOGLE_CALLBACK_URL configured with localhost in production environment. Overriding with production callback domain.');
  rawCallbackUrl = 'https://pfis-patient-friction-intelligence-system.onrender.com/api/auth/google/callback';
}

export const config = {
  port: parseInt(rawPort, 10),
  databaseType: sanitizeEnv(process.env.DATABASE_TYPE) || 'auto', // 'postgres' | 'mysql' | 'mongodb' | 'auto'
  databaseUrl: sanitizeEnv(process.env.DATABASE_URL),
  mongodbUri: sanitizeEnv(process.env.MONGODB_URI),
  mongodbDbName: sanitizeEnv(process.env.MONGODB_DB_NAME) || 'pfis',
  pgHost: sanitizeEnv(process.env.PG_HOST) || 'localhost',
  pgPort: parseInt(sanitizeEnv(process.env.PG_PORT) || '5432', 10),
  pgUser: sanitizeEnv(process.env.PG_USER) || 'postgres',
  pgPassword: sanitizeEnv(process.env.PG_PASSWORD) || 'postgres',
  pgDatabase: sanitizeEnv(process.env.PG_DATABASE) || 'pfis',
  mysqlHost: sanitizeEnv(process.env.MYSQL_HOST) || 'localhost',
  mysqlPort: parseInt(sanitizeEnv(process.env.MYSQL_PORT) || '3306', 10),
  mysqlUser: sanitizeEnv(process.env.MYSQL_USER) || 'root',
  mysqlPassword: sanitizeEnv(process.env.MYSQL_PASSWORD) || '',
  mysqlDatabase: sanitizeEnv(process.env.MYSQL_DATABASE) || 'pfis',
  jwtSecret: sanitizeEnv(process.env.JWT_SECRET) || 'pfis_super_secure_jwt_secret_key_2026',
  jwtExpiresIn: '7d',
  googleMapsApiKey: sanitizeEnv(process.env.GOOGLE_MAPS_API_KEY),
  googleClientSecret: sanitizeEnv(process.env.GOOGLE_CLIENT_SECRET),
  googleClientId: sanitizeEnv(process.env.GOOGLE_CLIENT_ID),
  clientUrl: rawClientUrl.replace(/\/+$/, ''),
  serverUrl: rawServerUrl.replace(/\/+$/, ''),
  googleCallbackUrl: rawCallbackUrl.replace(/\/+$/, ''),
  nodeEnv,
  maxFileSizeMb: parseInt(sanitizeEnv(process.env.MAX_FILE_SIZE_MB) || '10', 10),

  // ABDM (Ayushman Bharat Digital Mission) Configuration
  abdmMode: (sanitizeEnv(process.env.ABDM_MODE) || 'sandbox').toLowerCase(), // 'sandbox' | 'demo' | 'production'
  abdmBaseUrl: sanitizeEnv(process.env.ABDM_BASE_URL) || 'https://dev.abdm.gov.in/api/v1',
  abdmClientId: sanitizeEnv(process.env.ABDM_CLIENT_ID),
  abdmClientSecret: sanitizeEnv(process.env.ABDM_CLIENT_SECRET),
  abdmRedirectUri: sanitizeEnv(process.env.ABDM_REDIRECT_URI),
  abdmHfrEnabled: (sanitizeEnv(process.env.ABDM_HFR_ENABLED) || 'true').toLowerCase() === 'true',
  abdmHprEnabled: (sanitizeEnv(process.env.ABDM_HPR_ENABLED) || 'true').toLowerCase() === 'true',
  abdmAbhaEnabled: (sanitizeEnv(process.env.ABDM_ABHA_ENABLED) || 'true').toLowerCase() === 'true',
  abdmConsentEnabled: (sanitizeEnv(process.env.ABDM_CONSENT_ENABLED) || 'true').toLowerCase() === 'true',
  abdmHealthRecordsEnabled: (sanitizeEnv(process.env.ABDM_HEALTH_RECORDS_ENABLED) || 'true').toLowerCase() === 'true',
  abdmTimeoutMs: parseInt(sanitizeEnv(process.env.ABDM_TIMEOUT_MS) || '15000', 10),
  dataMode: (sanitizeEnv(process.env.DATA_MODE) || 'demo').toLowerCase(), // 'demo' | 'sandbox' | 'production'

  // Voice AI Toll-Free Helpline Configuration
  voiceMode: (sanitizeEnv(process.env.VOICE_MODE) || 'demo').toLowerCase(), // 'demo' | 'sandbox' | 'production'
  voiceProvider: sanitizeEnv(process.env.VOICE_PROVIDER) || 'demo', // 'demo' | 'twilio' | 'exotel' | 'plivo' | 'asterisk'
  voiceTollFreeNumber: sanitizeEnv(process.env.PFIS_TOLL_FREE_NUMBER) || sanitizeEnv(process.env.VOICE_TOLL_FREE_NUMBER) || '+91 7256052183', // Real provisioned 1800 / helpline number
  voiceAccountId: sanitizeEnv(process.env.VOICE_ACCOUNT_ID) || sanitizeEnv(process.env.TELEPHONY_ACCOUNT_ID),
  voiceAuthToken: sanitizeEnv(process.env.VOICE_AUTH_TOKEN) || sanitizeEnv(process.env.TELEPHONY_AUTH_TOKEN),
  voiceWebhookSecret: sanitizeEnv(process.env.VOICE_WEBHOOK_SECRET),
  voiceRecordingEnabled: (sanitizeEnv(process.env.VOICE_RECORDING_ENABLED) || 'false').toLowerCase() === 'true',
  voiceRetentionDays: parseInt(sanitizeEnv(process.env.VOICE_RETENTION_DAYS) || '30', 10),

  // OpenAI Realtime AI Voice Configuration
  openaiApiKey: sanitizeEnv(process.env.OPENAI_API_KEY),
  openaiRealtimeModel: sanitizeEnv(process.env.OPENAI_REALTIME_MODEL) || 'gpt-4o-realtime-preview',
  openaiVoice: sanitizeEnv(process.env.OPENAI_VOICE) || 'alloy',

  // Teleconsultation Video Provider Configuration
  videoProvider: sanitizeEnv(process.env.VIDEO_PROVIDER) || 'webrtc_native',
  videoApiKey: sanitizeEnv(process.env.VIDEO_API_KEY),
  videoApiSecret: sanitizeEnv(process.env.VIDEO_API_SECRET),
};

/**
 * Safe startup validator for Google OAuth configuration.
 * Validates presence, format, and consistency without ever exposing or logging secret values.
 */
export const validateGoogleOAuthEnv = (): void => {
  const isProd = config.nodeEnv === 'production';
  const hasClientId = !!config.googleClientId && config.googleClientId.length > 0;
  const hasClientSecret = !!config.googleClientSecret && config.googleClientSecret.length > 0;
  const hasCallbackUrl = !!config.googleCallbackUrl && config.googleCallbackUrl.length > 0;

  console.log('[PFIS OAuth Validation]');
  console.log(`  - Target Callback URL: ${config.googleCallbackUrl}`);
  console.log(`  - Client URL (Frontend): ${config.clientUrl}`);
  console.log(`  - Server URL (Backend): ${config.serverUrl}`);
  console.log(`  - Client ID Configured: ${hasClientId ? `YES (length: ${config.googleClientId.length})` : 'NO (MISSING)'}`);
  console.log(`  - Client Secret Configured: ${hasClientSecret ? `YES (length: ${config.googleClientSecret.length})` : 'NO (MISSING)'}`);

  if (isProd) {
    if (!hasClientId) {
      console.error('[PFIS OAuth ERROR] GOOGLE_CLIENT_ID is missing in Render production environment!');
    }
    if (!hasClientSecret) {
      console.error('[PFIS OAuth ERROR] GOOGLE_CLIENT_SECRET is missing in Render production environment!');
    }
    if (!hasCallbackUrl) {
      console.error('[PFIS OAuth ERROR] GOOGLE_CALLBACK_URL is missing or empty!');
    }
    if (hasClientId && !config.googleClientId.includes('.apps.googleusercontent.com')) {
      console.warn('[PFIS OAuth WARNING] GOOGLE_CLIENT_ID does not appear to end with .apps.googleusercontent.com. Please verify your Google Cloud Console Web Application credentials.');
    }
    if (hasClientSecret && config.googleClientSecret.length < 10) {
      console.warn('[PFIS OAuth WARNING] GOOGLE_CLIENT_SECRET appears unusually short. Please ensure you copied the full Client Secret from Google Cloud Console.');
    }
  }
};

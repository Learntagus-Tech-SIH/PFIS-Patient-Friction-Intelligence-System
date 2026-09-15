import { AbdmConfig } from '../integrations/abdm/abdmConfig.js';
import { AbdmAuth } from '../integrations/abdm/abdmAuth.js';
import { AbdmHealthFacility } from '../integrations/abdm/abdmHealthFacility.js';
import { AbdmProfessional } from '../integrations/abdm/abdmProfessional.js';
import { AbdmAbha } from '../integrations/abdm/abdmAbha.js';
import { AbdmConsentManager } from '../integrations/abdm/abdmConsent.js';
import { AbdmHealthRecords } from '../integrations/abdm/abdmHealthRecords.js';
import { AbdmAuditLogger } from '../integrations/abdm/abdmAudit.js';

async function runAbdmTestSuite() {
  console.log('====================================================');
  console.log('         PFIS ABDM INTEGRATION TEST SUITE           ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
    }
  }

  // 1. ABDM Configuration & Mode Validation
  console.log('1. ABDM Configuration & Mode Validation');
  const status = AbdmConfig.getStatus();
  assert(typeof status.mode === 'string', 'ABDM Mode is string ("demo" | "sandbox" | "production")');
  assert(status.uiLabel.length > 0, 'UI Label is non-empty and user-friendly');
  assert(!('clientSecret' in status || 'abdmClientSecret' in status), 'No client secret property exposed in public status');
  assert(status.timeoutMs === 15000, 'Gateway timeout configured to 15,000ms');

  // 2. Authentication & Unconfigured Credentials Fallback
  console.log('\n2. Authentication & Unconfigured Credentials Guard');
  const authRes = await AbdmAuth.testConnection();
  assert(typeof authRes.authenticated === 'boolean', 'Auth check returns structured boolean status');
  assert(authRes.source === 'NOT_CONFIGURED' || authRes.source === 'GATEWAY', 'Auth source identifies integration state without crashing');

  // 3. Unconfigured Endpoint Graceful Response (Requirement 3)
  console.log('\n3. Requirement 3 Graceful NOT_CONFIGURED Responses when Unconfigured');
  const hfrRes = await AbdmHealthFacility.searchFacilities('Ranchi', 'Jharkhand');
  assert(hfrRes.status === 'NOT_CONFIGURED' || hfrRes.success === true, 'HFR search returns NOT_CONFIGURED or success when active');
  assert(hfrRes.message?.includes('credentials') || hfrRes.success === true, 'Returns informative credentials message');

  const hprRes = await AbdmProfessional.verifyDoctor('MCI-2012-9981');
  assert(hprRes.status === 'NOT_CONFIGURED' || hprRes.success === true, 'HPR doctor verify returns NOT_CONFIGURED or success');

  const abhaRes = await AbdmAbha.verifyOrLinkAbha('PATIENT-TEST-001', 'sunita@sbx');
  assert(abhaRes.status === 'NOT_CONFIGURED' || abhaRes.success === true, 'ABHA link request returns NOT_CONFIGURED or success');

  // 4. Consent Management Workflow
  console.log('\n4. Consent Management Workflow');
  const consent = await AbdmConsentManager.createConsentRequest(
    'PATIENT-TEST-001',
    'RIMS Hospital Doctor',
    'Care Continuity',
    ['Diagnostic Report']
  );
  assert(consent.consentStatus === 'GRANTED', 'New consent initialized as GRANTED');
  assert(consent.sourceSystem === 'ABDM', 'Consent sourceSystem tagged as ABDM');

  const revokeRes = await AbdmConsentManager.updateConsentStatus(consent.consentId, 'PATIENT-TEST-001', 'REVOKED');
  assert(revokeRes.status === 'REVOKED', 'Consent successfully revoked');

  // 5. Consent-Gated Health Information Access
  console.log('\n5. Consent-Gated Health Information Access Guard');
  const deniedFetch = await AbdmHealthRecords.fetchConsentedRecords('PATIENT-TEST-001', '');
  assert(deniedFetch.success === false, 'Document fetch denied when consentId is empty');
  assert(deniedFetch.status === 'CONSENT_REQUIRED', 'Returns CONSENT_REQUIRED status when unconsented');

  // 6. Security Audit Logging
  console.log('\n6. Security Audit Logging');
  await AbdmAuditLogger.log({
    action: 'TEST_AUDIT_VERIFICATION',
    resourceType: 'TestResource',
    sourceType: 'ABDM_HIU',
    resultStatus: 'SUCCESS',
  });
  const logs = await AbdmAuditLogger.getRecentLogs(5);
  assert(Array.isArray(logs), 'Audit logger returns recent integration logs');

  console.log('\n====================================================');
  console.log(` TEST SUMMARY: ${passed} / ${total} TESTS PASSED`);
  console.log('====================================================');

  if (passed < total) {
    process.exit(1);
  }
}

// Run test suite if invoked directly
runAbdmTestSuite().catch((err) => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});

# ABDM (Ayushman Bharat Digital Mission) Integration Guide

## 1. Integration Scope & Architecture
PFIS implements server-side adapters for ABDM interoperability across 4 key building blocks:
1. **Health Facility Registry (HFR):** Facility search, tier classification, and metadata normalization.
2. **Healthcare Professionals Registry (HPR):** Professional accreditation verification.
3. **ABHA (Ayushman Bharat Health Account):** Patient identity binding abstraction.
4. **Consent & Health Information Exchange (HIU/HIP):** Consent-based longitudinal health record exchange.

## 2. Operating Modes (`ABDM_MODE`)

### A. Demo Mode (`ABDM_MODE=demo`)
- Uses synthetic demonstration data with explicit `DEMO DATA` provenance tags.
- Allows full functional evaluation of the patient journey without external credentials.

### B. Sandbox Mode (`ABDM_MODE=sandbox`)
- Connects to official ABDM Gateway Sandbox (`https://dev.abdm.gov.in/api/v1`).
- Uses `ABDM_CLIENT_ID` and `ABDM_CLIENT_SECRET` configured in environment.

### C. Production Mode (`ABDM_MODE=production`)
- Disabled by default.
- Requires official onboarding approval, production endpoints, security audit, and production credentials.

## 3. Server-Side ABDM Architecture (`/server/src/integrations/abdm/`)
- `abdmConfig.ts` — Reads environment settings and modes safely.
- `abdmClient.ts` — HTTP client with timeout, retry, and rate limiting.
- `abdmAuth.ts` — Token generation using `client_credentials` grant.
- `abdmHealthFacility.ts` — HFR facility search and data normalization.
- `abdmProfessional.ts` — HPR doctor accreditation check.
- `abdmAbha.ts` — ABHA identity verification abstraction.
- `abdmConsent.ts` — ABDM consent artifact generation.
- `abdmHealthRecords.ts` — Consented EHR metadata exchange.
- `abdmWebhook.ts` — Signature-validated webhook listener.
- `abdmAudit.ts` — Audit logging for compliance.

## 4. Integration Health Endpoint
Verify ABDM gateway connectivity and source status via:
`GET /api/integrations/health`

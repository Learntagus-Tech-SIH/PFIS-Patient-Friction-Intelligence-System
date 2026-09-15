# PFIS API Reference & Endpoint Specification

## 1. System Health & Integration APIs
- `GET /api/health` — Basic service status check.
- `GET /api/integrations/health` — Multi-source provider and ABDM integration health check.

## 2. Authentication
- `POST /api/auth/register` — Register a patient or staff account.
- `POST /api/auth/login` — Authenticate and receive JWT session token.
- `GET /api/auth/me` — Retrieve profile for current authenticated user.

## 3. Patient & Friction Intelligence
- `GET /api/patients/me/friction` — Calculate 8-dimension Patient Friction Score.
- `GET /api/patients/me/risk` — Compute care completion probability and bottlenecks.
- `POST /api/public-health/triage/access-route` — Safe digital triage & facility router.

## 4. Referrals
- `GET /api/public-health/referrals` — List referrals.
- `POST /api/public-health/referrals` — Create inter-facility referral.
- `PATCH /api/public-health/referrals/:id/status` — Update referral stage.

## 5. Health Records & ABDM Consents
- `GET /api/public-health/records` — Retrieve consented longitudinal records.
- `GET /api/public-health/records/consents` — View active patient consent artifacts.
- `PATCH /api/public-health/records/consents/:id` — Grant or revoke consent.

## 6. Admin & Provenance (Judges Suite)
- `GET /api/admin/provenance` — Data Provenance & Source Transparency Audit.
- `GET /api/admin/integrations` — System Integration Gateway status.

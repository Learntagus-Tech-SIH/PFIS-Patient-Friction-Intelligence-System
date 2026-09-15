# PFIS Security & Privacy Architecture

## 1. Non-Clinical Scope & Mandate
PFIS focuses strictly on operational, logistical, geographic, and administrative barriers to healthcare accessibility.
- Does **not** diagnose medical conditions or diseases.
- Does **not** prescribe or recommend pharmaceutical treatments.
- Does **not** replace licensed medical professionals or government health systems.

## 2. Least Privilege & Role-Based Access Control (RBAC)
PFIS enforces strict server-side authorization checks for 5 primary system roles:
- **PATIENT:** Access only to own profile, consent records, requests, and friction scores.
- **DOCTOR:** Access only to assigned OPD queue, consented patient records, and lab/referral orders.
- **HEALTH_WORKER (ASHA/ANM):** Access to assigned community households, field visits, and doorstep care requests.
- **HOSPITAL_STAFF:** Access to facility OPD queue, bed availability, department schedules, and pharmacy stock.
- **ADMIN / GOVERNMENT:** Access to aggregated district/state intelligence, friction maps, and policy simulations (de-identified by default).

## 3. Data Privacy & ABDM Consent Management
PFIS treats health data as highly sensitive.
- **No Unnecessary Storage:** PFIS does not store full medical histories permanently in MongoDB. ABDM health records remain at source (HIP) and are fetched on-demand using explicit patient consent.
- **Consent Artifact Parameters:** Every consent record logs `WHO`, `WHAT DATA`, `WHY`, `FOR WHOM`, `GRANT TIMESTAMP`, and `EXPIRY/REVOCATION`.
- **Zero Secrets in Frontend:** ABDM client secrets, JWT secrets, and database URIs exist strictly in backend environment variables.

## 4. API & Network Protection
- **Security Headers:** Enforced via `helmet`.
- **CORS Whitelisting:** Strict origin validation for trusted frontend clients.
- **Rate Limiting:** IP-level rate limiting on `/api` routes via `express-rate-limit`.
- **Audit Logging:** Every sensitive event (`VIEW_RECORD`, `GRANT_CONSENT`, `CREATE_REFERRAL`, `LOGIN`) is logged with timestamp, actor, and result status.

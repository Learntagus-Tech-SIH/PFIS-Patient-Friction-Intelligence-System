# PFIS Database Architecture

## 1. Primary Database Options
PFIS supports a flexible multi-engine database abstraction layer (`IDatabaseClient`):
1. **MongoDB (Primary Operational Store):** Enabled via `MONGODB_URI`.
2. **PostgreSQL / MySQL:** Supported via `DATABASE_URL` or `PG_*` / `MYSQL_*` environment variables.
3. **Embedded Relational SQL Storage Engine:** Zero-setup fallback store (`server/data/pfis_relational.json`) requiring no external installation.

## 2. Operational Collections / Schema Tables
MongoDB collections and relational tables store PFIS operational data:

- `users` — Authentication credentials and system roles (`patient`, `doctor`, `health_worker`, `hospital`, `admin`, `government`)
- `patient_profiles` — Demographic, geographic, and accessibility barrier attributes
- `hospitals` — Facility metadata, geolocation, bed count, and NQAS quality metrics
- `hospital_services` — Departments, consultation fees, and token capacities
- `doctor_profiles` — Medical staff rosters and OPD schedules
- `asha_profiles` — Frontline health worker coverage zones and household registries
- `appointments` — OPD token requests and visit bookings
- `referrals` — Inter-facility referral tracking and lifecycle events
- `health_records` — Non-clinical health status summaries and document metadata
- `patient_abha` — ABHA identity link records and verification status
- `health_record_consents` — Patient consent artifacts and access scopes
- `diagnostics` & `diagnostic_bookings` — Diagnostic lab tests and bookings
- `essential_medicines` — EDL inventory stock tracking
- `high_risk_registry` — Follow-up tracking for Maternal, Child, and NCD patients
- `frontline_tasks` & `frontline_visits` — ASHA field visit tasks and doorstep care requests
- `emergency_dispatches` — Emergency 108 SOS transport logs
- `audit_logs` — System activity, authentication, and consent audit logs

## 3. Data Integrity & Indexes
- Geospatial indexes (`2dsphere` / GeoJSON Point) on facility latitude/longitude for radial search.
- Compound indexes on `(patientId, status)` for fast request, referral, and follow-up lookups.

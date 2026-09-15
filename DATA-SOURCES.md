# PFIS Multi-Source Data Architecture & Provenance

## 1. Multi-Source Architecture Principle
PFIS operates as an intelligent access and coordination layer over existing health systems using a federated data architecture:

```
                 DATA SOURCES
                       |
        +--------------+--------------+
        |              |              |
       ABDM        State/Govt      Facility
       APIs         Systems          APIs
        |              |              |
        +--------------+--------------+
                       |
                PFIS DATA ADAPTER
                       |
              DATA NORMALIZATION
                       |
             MONGODB / OPERATIONAL DB
```

## 2. Data Categories & Provenance Tags

| Data Category | Provenance Tag | Source System | Verification Level |
|---|---|---|---|
| **Verified Facility Data** | `VERIFIED SOURCE` | ABDM HFR Registry | Government Verified |
| **Verified Professional Data** | `VERIFIED SOURCE` | ABDM HPR Registry | Government Verified |
| **Facility Operational Data** | `FACILITY PROVIDED` | Hospital HIS / OPD API | Facility Verified |
| **Consented Patient EHR** | `VERIFIED SOURCE` | ABDM HIU / HIP Gateway | Patient Consented |
| **PFIS Operational Data** | `SELF DECLARED` | PFIS Friction Engine | Analytical Model |
| **Demo Data** | `DEMO DATA` | PFIS Synthetic Dataset | Demo / Prototype |

## 3. Data Freshness & Transparency Rules
- **Live vs Cached:** Real-time OPD queues and medicine stocks display explicit `Last Updated` timestamps.
- **Stale Data Handling:** If facility operational data exceeds configured freshness thresholds, it is tagged as `STALE DATA`.
- **No Fake Real-Time Claims:** Demo data is explicitly labeled as `DEMO DATA` to ensure full transparency for judges and users.

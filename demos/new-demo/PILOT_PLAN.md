# Pilot Plan — Factory AI Predictive Maintenance
## IBM Client Engineering · DEMO-MFG-001 · 3–4 Week Sprint Plan

---

## Executive Summary

Deploy an IBM watsonx-powered predictive maintenance pilot for manufacturing plant equipment. The pilot connects to the client's actual sensor historian or SCADA data, trains/calibrates the AI anomaly detection on real equipment failure signatures, integrates with the existing CMMS (ServiceNow/Maximo/SAP PM), and delivers a production-ready Carbon UI dashboard with work order automation — in 3–4 sprints.

---

## Objectives

1. **Reduce unplanned downtime by ≥40%** on pilot assets within 90 days of go-live by detecting failure signatures 7+ days in advance.
2. **Automate work order creation** for 100% of AI-predicted failures, reducing CMMS manual entry time by ≥80%.
3. **Establish AI governance baseline** — logging all predictions, confidence scores, and outcomes for continuous model accuracy improvement.

---

## Success Criteria

| Metric | Baseline | Target | Measurement Method |
|---|---|---|---|
| Unplanned downtime hours/month | Client actual (TBD) | –40% | CMMS downtime logs |
| Prediction lead time | 0 days (reactive) | ≥7 days | AI prediction log vs. actual failure date |
| Work order automation rate | 0% | 100% of AI predictions | CMMS integration audit |
| AI prediction accuracy | N/A | ≥85% | Prediction vs. actual outcome (90d) |
| MTTR (Mean Time to Repair) | Client actual | –25% | CMMS repair logs |
| False positive rate | N/A | ≤15% | Technician feedback loop |

---

## Team

| Role | Count | Responsibility |
|---|---|---|
| IBM Tech Sales | 1 | Executive sponsor, demo, stakeholder comms |
| IBM Client Engineer (AI/ML) | 1 | watsonx.ai integration, LangGraph agent |
| IBM Client Engineer (Integration) | 1 | CMMS API, sensor data pipeline |
| Client Data Engineer | 1 | Sensor historian access, data extraction |
| Client Maintenance Lead | 1 | Failure mode knowledge, work order validation |
| Project Manager | 1 | Sprint planning, risk tracking |

---

## Sprint Plan

### Sprint 0 — Environment & Data Assessment (Days 1–3)
**Goal:** Running environments, data access confirmed, pilot assets selected.

- [ ] Provision IBM Cloud watsonx.ai workspace (or on-prem CPD deployment)
- [ ] Clone demo repo, verify mock mode boots (backend + frontend)
- [ ] Confirm sensor data access: OSI PI historian / OPC-UA / SCADA export
- [ ] Inventory pilot assets (target: 10–20 highest-criticality machines)
- [ ] Extract 90 days of historical sensor data for pilot assets
- [ ] Document failure history (past work orders) for training validation
- [ ] Confirm CMMS API access (ServiceNow/Maximo/SAP PM)
- [ ] Set up dev OpenShift namespace (or Code Engine space)
- [ ] Replace mock data with client sensor schema

**Deliverables:** Environment checklist, pilot asset list, data access confirmed, first backend boot on client data.

---

### Sprint 1 — Core AI Pipeline (Week 1–2)
**Goal:** AI agent detecting anomalies on real sensor data, work orders generating.

- [ ] Connect sensor data pipeline (historian → FastAPI `/api/data/equipment`)
- [ ] Calibrate anomaly thresholds per equipment type and environment
- [ ] Fine-tune watsonx.ai prompt for client-specific failure modes and parts catalog
- [ ] Integrate IBM Granite 3.3 8B for on-prem / data-residency requirements (if needed)
- [ ] Build CMMS integration: POST work order to ServiceNow/Maximo REST API
- [ ] Map recommended parts to client parts catalog (ERP/SAP MM)
- [ ] Map technicians to client shift schedule and skill matrix
- [ ] Unit tests for AI pipeline (anomaly detection, failure prediction, WO generation)

**Deliverables:** AI agent running on real sensor data, work orders posting to CMMS, 5+ pilot assets in dashboard.

---

### Sprint 2 — Integration & UI Polish (Week 2–3)
**Goal:** Full integration, client-branded UI, governance baseline, observability.

- [ ] Replace all synthetic data with real client data in frontend
- [ ] IBM Instana APM integration (API response times, error rates, agent latency)
- [ ] watsonx.governance: log AI predictions to FactSheets (model lineage)
- [ ] Customize Carbon UI: client logo, plant/department names, branding
- [ ] Role-based views: Maintenance Manager vs. Technician vs. Plant Director
- [ ] Mobile-responsive layout for tablet use on the shop floor
- [ ] Alert notification integration (email/Teams/Slack)
- [ ] Load testing: 120+ assets, real-time sensor polling
- [ ] Security review: API authentication, network segmentation, secrets management

**Deliverables:** Production-ready UI, Instana dashboard, AI governance baseline, security review sign-off.

---

### Sprint 3 — Testing, Documentation & Handover (Week 3–4)
**Goal:** End-to-end validation, knowledge transfer, go-live plan.

- [ ] End-to-end testing: sensor anomaly → AI prediction → CMMS work order (all 3 scenarios)
- [ ] User acceptance testing with maintenance lead and 2–3 technicians
- [ ] Accuracy validation: back-test AI predictions against last 90 days of failure history
- [ ] Performance tuning: optimize sensor poll interval, batch inference
- [ ] Complete documentation: runbook, API docs, admin guide
- [ ] Knowledge transfer: 2-hour session with client engineering team
- [ ] Go-live plan: cutover, monitoring, rollback procedure
- [ ] Post-pilot roadmap presentation (Phase 2: real-time MQTT, Turbonomic, Phase 3: fleet-wide)

**Deliverables:** Signed UAT, go-live plan, full documentation package, post-pilot roadmap.

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Sensor data quality insufficient | Medium | High | Early data assessment (Sprint 0); fallback to historian batch mode |
| CMMS API access delayed | Low | High | Start with email/CSV work order output; API integration in Sprint 2 |
| False positive rate too high | Medium | Medium | Calibrate thresholds with maintenance lead; confidence score threshold gate |
| watsonx.ai latency on large payload | Low | Medium | Batch inference, async API calls, caching layer |
| Client IT security blocks IBM Cloud | Low | High | On-prem CPD deployment option pre-documented |
| Scope creep beyond pilot assets | Medium | Medium | Freeze pilot asset list in Sprint 0; Phase 2 backlog |

---

## Post-Pilot Roadmap

| Phase | Scope | IBM Products Added | Timeline |
|---|---|---|---|
| **Phase 1** (Pilot) | 10–20 assets, single plant | watsonx.ai, Carbon UI | Weeks 1–4 |
| **Phase 2** | All assets, real-time MQTT | Instana APM, watsonx.governance | Month 2–3 |
| **Phase 3** | Fleet-wide, 5 plants | Turbonomic (resource optimization), App Connect (ERP) | Month 4–6 |
| **Phase 4** | Digital twin integration | watsonx.data (IoT lakehouse), Cognos | Month 6–12 |

---

*IBM Client Engineering · DEMO-MFG-001 · Factory AI Predictive Maintenance · Built with IBM watsonx*

# Demo Script — Factory AI Predictive Maintenance
## DEMO-MFG-001 · 15-minute presentation track

---

## Pre-Demo Checklist

- [ ] Backend running: `http://localhost:8000/api/health` returns `{"status":"ok"}`
- [ ] Frontend running: `http://localhost:5173` loads correctly
- [ ] Browser at 1920×1080, full screen, dark mode
- [ ] All 5 pages loaded and verified (no blank screens)
- [ ] DemoBanner visible (synthetic data disclaimer)
- [ ] Scenario 1 (Spindle Bearing) selected on AI Agent page
- [ ] Backup slides ready if network issues

---

## Opening — Dashboard (0–2 min)

**[Navigate to `/` Dashboard page]**

> "Let me show you what a typical manufacturing plant could look like when every machine is talking to IBM watsonx in real time."

**Point to KPI tiles:**
> "120 assets monitored across 5 plants. Fleet health at 74% — we can see the fleet is under stress. 18 open work orders. And critically — 247 AI predictions in the last 30 days, with 94.1% accuracy."

**Point to the sensor trend chart:**
> "This area chart shows average vibration trending up over the last 10 days — a classic sign of a bearing approaching failure. Without AI, this would be invisible to a maintenance team until the machine breaks."

**Point to alerts table:**
> "Three critical alerts in the last 24 hours. The top one — CNC Milling Machine #012 — vibration is 68% above threshold. Let's go investigate."

---

## Problem — The Cost of Reactive Maintenance (2–5 min)

**[Navigate to `/problem` Problem page]**

> "Here's why this matters financially."

**Point to KPI row:**
> "$3.2 million in annual unplanned downtime costs. 73% of their maintenance is reactive — they're waiting for things to break. Industry best practice is below 30%."

**Point to cost breakdown chart:**
> "The biggest bucket is production loss — $1.8 million. That's machines sitting idle while the team scrambles. Then overtime labor, emergency parts at a premium..."

**Point to failure timeline:**
> "This is the brutal reality. The sensor anomaly starts 14 days before failure. Manual inspection misses it. The machine breaks on Day 0. Emergency shutdown. Parts ordered at premium. And then — collateral damage to adjacent components because the primary failure cascaded."

**Pause for effect:**
> "9.8 hours mean time to repair. What if we could detect this 14 days earlier and plan a 4-hour scheduled repair instead?"

---

## AI Agent Demo — The "Wow Moment" (5–12 min)

**[Navigate to `/solution` AI Agent page]**

> "This is the core of what IBM watsonx delivers. Let me show you the agent live."

**Point to preset scenarios:**
> "I have three pre-loaded scenarios from our sensor data. Let's start with the most urgent — CNC Milling Machine #012, the one that was flagging in our dashboard."

**[Scenario 1 is pre-selected: Spindle Bearing Failure]**

**Point to sensor gauges:**
> "Look at these live readings. Vibration at 4.2 mm/s — threshold is 2.5. Temperature at 82°C. The AI has already flagged these in red and yellow."

**[Click "Run IBM watsonx AI Agent"]**

**[Watch the pipeline progress bar animate through 5 steps]**

> "The agent is running through its pipeline — reading sensors, detecting the anomaly pattern, predicting failure mode, then calling watsonx.ai to generate the full recommendation..."

**[Response appears — AI analysis + work order card]**

> "Look at this. In under 2 seconds, the AI has told us: 87% probability of spindle bearing failure within 8–12 days. It found high-frequency spectral peaks at the bearing pass frequency, and iron particles at 3× the limit in the oil sample."

**Point to the work order:**
> "And it's already created the work order. Priority 1-Critical. Assigned to James O'Brien, our mechanical specialist. 3 specific parts. Scheduled for August 8th — 6 days from now. Total cost: $285."

**[Show repair instructions detail]**

> "It even generated the step-by-step repair procedure. The technician can go straight to the machine with everything they need."

**[Switch to Scenario 2: Compressor Valve]**

> "Let me quickly show the second scenario — an industrial compressor. Different failure mode, same approach."

**[Click Run AI Agent]**

> "72% probability, air valve overhaul needed. Pressure drop, cycle frequency up 31%. $165 in parts, 3 hours. The AI matched this to Priya Sharma — our pneumatics specialist."

---

## Results — ROI (12–14 min)

**[Navigate to `/results` Results page]**

> "This is what the numbers look like after deployment."

**Point to hero metrics:**
> "$1.24 million in cost avoidance in the year-to-date. 68% reduction in unplanned downtime. OEE improved from 71% to 84% — that's 12.8 percentage points, which at typical manufacturing margins is $4–6 million in additional output."

**Point to before/after comparison:**
> "MTBF went from 31 days to 42 — machines are lasting 35% longer between failures. Mean time to repair dropped from 9.8 hours to 6.2, because technicians arrive prepared with the right parts."

**Point to OEE projection chart:**
> "Without AI, OEE continues to drift down as equipment ages. With IBM watsonx, we've reversed that trend."

---

## Close — Architecture & Next Steps (14–15 min)

**[Navigate to `/architecture` Architecture page]**

**Point to diagram:**
> "The architecture is clean. IoT sensors feed a FastAPI backend. IBM watsonx.ai — Llama 4 Maverick — runs the inference. The LangGraph ReAct agent orchestrates the pipeline. Everything deploys to OpenShift on UBI 9 containers. And the door is open to integrate Instana for deep observability in phase 2."

**The close:**
> "What you've seen today is a working application — not a slide deck. With IBM Client Engineering, we can take this exact foundation, connect it to your real CMMS, your real SCADA or OPC-UA sensor feeds, and have a pilot running on your equipment in 3–4 weeks. The ROI numbers we showed are industry averages — your actual results will depend on your failure rates and downtime costs, but the pattern is consistent."

> "Who on your team would be the right person to define the pilot scope?"

---

## FAQ

| Question | Answer |
|---|---|
| Does it need real-time sensor data? | Pilot can start with historian data (OSI PI, Ignition). Real-time MQTT/OPC-UA integration is phase 2. |
| Which assets should we start with? | Start with highest criticality / highest downtime cost. Usually 10–20 assets for pilot. |
| How accurate is the AI? | Demo baseline: 94.1%. Real accuracy depends on data quality and anomaly signature. Typically improves with 90 days of labeled history. |
| Can it integrate with our CMMS? | Yes — ServiceNow, Maximo, SAP PM all have REST APIs. Work order push is standard pilot deliverable. |
| Is IBM Granite available as the LLM? | Yes — `ibm/granite-3-3-8b-instruct` is pre-configured as a fallback. Swap in `.env`. |
| What about data security? | All inference happens in IBM Cloud (or on-prem). No sensor data leaves your network in the on-prem deployment option. |
| How long does the pilot take? | 3–4 weeks with IBM Client Engineering. Sprint 0 (env + data), Sprint 1 (core pipeline), Sprint 2 (integration), Sprint 3 (handover). |

---

*DEMO-MFG-001 · Factory AI Predictive Maintenance · Built with IBM watsonx*

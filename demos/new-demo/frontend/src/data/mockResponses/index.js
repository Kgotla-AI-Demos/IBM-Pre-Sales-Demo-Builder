// Frontend mock responses — mirrors backend mock data for offline fallback
export const MOCK_RESPONSES = {
  bearing_failure: {
    analysis: `Sensor analysis for EQ-0012 (CNC Milling Machine #012) reveals a 87.3% probability of spindle bearing failure within 8–12 days.

Root Indicators:
• Vibration RMS: 4.2 mm/s (threshold: 2.5 mm/s) — 68% above normal
• Temperature: 82°C at spindle housing (baseline: 58°C)
• High-frequency spectral peaks at 3× and 5× bearing pass frequency
• Oil sample: Fe particle count 2,400 ppm (limit: 800 ppm)

AI Recommendation:
Immediate planned maintenance window required. Bearing replacement will prevent catastrophic failure estimated at $34,000 in unplanned downtime + collateral damage. Estimated repair: 4 hours, $285 in parts.`,
    work_order: {
      title: 'Spindle Bearing Replacement — CNC Milling Machine #012',
      priority: 'P1-Critical',
      estimated_downtime_hours: 4,
      estimated_cost_usd: 285.50,
      assigned_technician: 'James O\'Brien',
      technician_specialty: 'Mechanical',
      recommended_parts: [
        { name: 'SKF Bearing 6205-2RS', part_id: 'PRT-A001', qty: 2, unit_cost: 24.50 },
        { name: 'Lubricant Oil ISO 46 (5L)', part_id: 'PRT-A008', qty: 1, unit_cost: 35.00 },
        { name: 'Shaft Coupling Insert', part_id: 'PRT-A009', qty: 1, unit_cost: 18.50 },
      ],
      scheduled_for: '2025-08-08',
      instructions: '1. Isolate & lock-out machine per LOTO procedure.\n2. Remove spindle cover assembly.\n3. Extract worn bearing with bearing puller.\n4. Install new SKF 6205-2RS bearing.\n5. Repack with ISO 46 lubricant.\n6. Reassemble and verify vibration < 2.0 mm/s.',
    },
    confidence: 0.873,
    tokens: 412,
    latency_ms: 1240,
    mode: 'mock',
  },
  compressor_valve: {
    analysis: `Cross-sensor analysis for EQ-0034 (Industrial Compressor #034) indicates 72% risk of air valve failure within 5–7 days.

Root Indicators:
• Discharge pressure drop: 8.2 bar → 6.7 bar (18.3% reduction)
• Cycle frequency increased 31% (motor compensating for leakage)
• Current draw: 14.8A (baseline: 11.2A) — valve leakage loading motor
• Thermal imaging: 23°C hotspot on valve plate assembly

AI Recommendation:
Schedule valve overhaul within 48 hours. Continued operation risks motor burnout ($1,200 motor + $8,400 emergency downtime). Preventive cost: $165 in parts, 3 hours labor.`,
    work_order: {
      title: 'Air Valve Overhaul — Industrial Compressor #034',
      priority: 'P1-Critical',
      estimated_downtime_hours: 3,
      estimated_cost_usd: 165.00,
      assigned_technician: 'Priya Sharma',
      technician_specialty: 'Mechanical',
      recommended_parts: [
        { name: 'Parker O-Ring Kit #12', part_id: 'PRT-A002', qty: 2, unit_cost: 8.75 },
        { name: 'Pressure Relief Valve', part_id: 'PRT-A007', qty: 1, unit_cost: 120.00 },
        { name: 'Air Filter Element', part_id: 'PRT-A010', qty: 1, unit_cost: 28.00 },
      ],
      scheduled_for: '2025-08-07',
      instructions: '1. Depressurize system fully — verify 0 bar before opening.\n2. Remove valve plate access cover.\n3. Replace worn valve plates and O-rings.\n4. Replace pressure relief valve.\n5. Leak test at 10 bar for 15 minutes.',
    },
    confidence: 0.720,
    tokens: 388,
    latency_ms: 980,
    mode: 'mock',
  },
  hydraulic_seal: {
    analysis: `Multi-variate trend analysis for EQ-0061 (Hydraulic Press #061) shows 91.2% confidence of hydraulic seal failure within 3–5 days — elevated urgency.

Root Indicators:
• Hydraulic fluid consumption: +340 mL/day (normal: <20 mL/day)
• System pressure drops 14% during hold phase
• Contamination index: 19/17/14 ISO 4406 (limit: 16/14/11)
• Visual confirmation: seepage detected at rod seal on cylinder 3

AI Recommendation:
Immediate work order — do not defer. Seal failure will cause hydraulic fluid spill (safety risk) and production halt. Preventive: $195 seal kit, 2 hours labor.`,
    work_order: {
      title: 'Hydraulic Cylinder Seal Replacement — Press #061',
      priority: 'P1-Critical',
      estimated_downtime_hours: 2,
      estimated_cost_usd: 195.00,
      assigned_technician: 'Marcus Johnson',
      technician_specialty: 'Electrical',
      recommended_parts: [
        { name: 'Hydraulic Seal Kit', part_id: 'PRT-A005', qty: 1, unit_cost: 45.00 },
        { name: 'Mechanical Seal Assembly', part_id: 'PRT-A011', qty: 1, unit_cost: 195.00 },
        { name: 'Lubricant Oil ISO 46 (5L)', part_id: 'PRT-A008', qty: 2, unit_cost: 35.00 },
      ],
      scheduled_for: '2025-08-06',
      instructions: '1. Relieve all hydraulic pressure — lockout/tagout all isolation valves.\n2. Remove retaining ring and extract rod seal pack.\n3. Install new seal kit — correct orientation per diagram.\n4. Bleed circuit per P-HYD-007.\n5. Pressure test: hold 250 bar × 5 minutes.',
    },
    confidence: 0.912,
    tokens: 445,
    latency_ms: 1480,
    mode: 'mock',
  },
};

// Dashboard mock data
export const MOCK_DASHBOARD = {
  kpis: [
    { id: 'total_assets', label: 'Total Assets Monitored', value: 120, unit: 'units', trend: '+8 this quarter', trend_up: true, color: 'blue' },
    { id: 'health_score', label: 'Fleet Health Score', value: 74.2, unit: '%', trend: '-3.2 pts (30d)', trend_up: false, color: 'yellow' },
    { id: 'open_workorders', label: 'Open Work Orders', value: 18, unit: 'orders', trend: '+5 this week', trend_up: false, color: 'red' },
    { id: 'predictions_made', label: 'AI Predictions (30d)', value: 247, unit: 'alerts', trend: '94.1% accurate', trend_up: true, color: 'green' },
  ],
  status_distribution: [
    { group: 'Normal', value: 62 },
    { group: 'Warning', value: 31 },
    { group: 'Critical', value: 18 },
    { group: 'Offline/Maint', value: 9 },
  ],
  sensor_trend: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const det = i > 20;
    return {
      date: date.toISOString().split('T')[0],
      avg_vibration: parseFloat((0.8 + i * 0.04 * (det ? 1.5 : 0.5)).toFixed(3)),
      avg_temperature: parseFloat((52 + i * 0.3 * (det ? 1.8 : 0.5)).toFixed(1)),
      alerts_count: det ? Math.max(0, i - 18) * 2 : Math.floor(Math.random() * 3),
    };
  }),
  recent_alerts: [
    { alert_id: 'ALT-00001', equipment_name: 'CNC Milling Machine #012', sensor_type: 'Vibration', severity: 'Critical', timestamp: new Date().toISOString(), acknowledged: false },
    { alert_id: 'ALT-00002', equipment_name: 'Industrial Compressor #034', sensor_type: 'Pressure', severity: 'High', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
    { alert_id: 'ALT-00003', equipment_name: 'Hydraulic Press #061', sensor_type: 'Oil Quality', severity: 'Critical', timestamp: new Date(Date.now() - 7200000).toISOString(), acknowledged: true },
    { alert_id: 'ALT-00004', equipment_name: 'Conveyor System #007', sensor_type: 'Temperature', severity: 'Medium', timestamp: new Date(Date.now() - 14400000).toISOString(), acknowledged: true },
    { alert_id: 'ALT-00005', equipment_name: 'Welding Robot #088', sensor_type: 'Current', severity: 'Low', timestamp: new Date(Date.now() - 28800000).toISOString(), acknowledged: true },
  ],
  equipment_by_plant: [
    { group: 'Detroit', value: 24 },
    { group: 'Houston', value: 24 },
    { group: 'Chicago', value: 24 },
    { group: 'Pittsburgh', value: 24 },
    { group: 'Dallas', value: 24 },
  ],
};

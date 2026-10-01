/**
 * SolutionPage — the "wow moment": interactive AI agent analysis of IoT sensor data.
 * Presenter selects a preset scenario → clicks Run AI Agent → sees analysis + work order.
 * Carbon: ProgressIndicator, Select, TextArea, Button, Tag.
 */
import React, { useState, useRef } from 'react';
import { Grid, Column, ProgressIndicator, ProgressStep, TextArea, Button, Tag, Tile } from '@carbon/react';
import { Play, DocumentAdd, Analytics } from '@carbon/icons-react';
import AIResponsePanel from '../components/AIResponsePanel.jsx';
import SensorGauge from '../components/SensorGauge.jsx';
import { analyzeEquipment } from '../services/watsonxService.js';

// Pre-filled scenarios — presenter NEVER types during a live demo
const PRESET_SCENARIOS = [
  {
    key: 'bearing_failure',
    label: 'Spindle Bearing Failure',
    equipment_id: 'EQ-0012',
    description: 'CNC Milling Machine #012 — Vibration 4.2 mm/s, temp 82°C, Fe particles 2,400 ppm.',
    tag: 'CNC Machine',
    sensor_data: { vibration_mm_s: 4.2, temperature_c: 82.0, current_amps: 11.8, pressure_bar: 5.1, oil_viscosity_cst: 36.5, noise_db: 88.3 },
  },
  {
    key: 'compressor_valve',
    label: 'Compressor Valve Degradation',
    equipment_id: 'EQ-0034',
    description: 'Industrial Compressor #034 — Pressure drop 18%, cycle frequency +31%, current 14.8A.',
    tag: 'Compressor',
    sensor_data: { vibration_mm_s: 2.8, temperature_c: 74.5, current_amps: 14.8, pressure_bar: 6.7, oil_viscosity_cst: 43.1, noise_db: 79.5 },
  },
  {
    key: 'hydraulic_seal',
    label: 'Hydraulic Seal Failure',
    equipment_id: 'EQ-0061',
    description: 'Hydraulic Press #061 — Fluid leak +340mL/day, pressure drop 14%, ISO 4406 contamination.',
    tag: 'Hydraulic Press',
    sensor_data: { vibration_mm_s: 3.5, temperature_c: 68.0, current_amps: 9.4, pressure_bar: 4.3, oil_viscosity_cst: 30.2, noise_db: 72.1 },
  },
];

const PROGRESS_STEPS = ['Read Sensors', 'Anomaly Detection', 'Failure Prediction', 'Work Order Gen', 'Complete'];

export default function SolutionPage() {
  const [selectedScenario, setSelectedScenario] = useState(PRESET_SCENARIOS[0]);
  const [customContext, setCustomContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [progressStep, setProgressStep] = useState(0);
  const [progressComplete, setProgressComplete] = useState(false);
  const resultsRef = useRef(null);

  async function handleRunAgent() {
    setIsLoading(true);
    setResponse(null);
    setProgressComplete(false);
    setProgressStep(0);

    // Animate progress steps
    const steps = [0, 1, 2, 3];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 280));
      setProgressStep(step + 1);
    }

    try {
      const result = await analyzeEquipment({
        equipmentId: selectedScenario.equipment_id,
        scenario: selectedScenario.key,
        additionalContext: customContext || undefined,
      });
      setResponse(result);
      setProgressComplete(true);
      setProgressStep(5);
      // Scroll to results
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error('AI analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 600 }}>
        AI Agent — Predictive Maintenance
      </h1>
      <p style={{ color: '#a8a8a8', marginBottom: '2rem', fontSize: '0.875rem' }}>
        IBM watsonx AI analyzes IoT sensor streams, predicts failures, and auto-generates maintenance work orders.
      </p>

      <Grid>
        {/* LEFT — Scenario selector */}
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ background: '#262626', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
              Select Equipment Scenario
            </h3>

            {/* Preset scenario pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {PRESET_SCENARIOS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setSelectedScenario(s); setResponse(null); }}
                  style={{
                    background: selectedScenario.key === s.key ? '#0f62fe' : '#393939',
                    color: '#f4f4f4',
                    border: 'none',
                    borderRadius: '2rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    transition: 'background 0.15s',
                  }}
                  aria-pressed={selectedScenario.key === s.key}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Selected scenario details */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <Tag type="blue" size="sm">{selectedScenario.equipment_id}</Tag>
                <Tag type="teal" size="sm">{selectedScenario.tag}</Tag>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#c6c6c6', lineHeight: 1.5 }}>
                {selectedScenario.description}
              </p>
            </div>

            {/* Live sensor readings */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#a8a8a8', fontWeight: 500 }}>
                LIVE SENSOR READINGS
              </p>
              <div className="sensor-grid">
                {Object.entries(selectedScenario.sensor_data).map(([k, v]) => (
                  <SensorGauge key={k} sensorKey={k} value={v} />
                ))}
              </div>
            </div>

            {/* Optional context */}
            <TextArea
              id="custom-context"
              labelText="Additional context (optional)"
              placeholder="e.g. Machine has been running extra shifts this week, last oil change was 3 months ago..."
              rows={3}
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <Button
              kind="primary"
              renderIcon={Play}
              onClick={handleRunAgent}
              disabled={isLoading}
              size="lg"
              style={{ width: '100%' }}
            >
              {isLoading ? 'Analyzing…' : 'Run IBM watsonx AI Agent'}
            </Button>
          </Tile>

          {/* AI workflow progress */}
          <Tile style={{ background: '#262626', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Agent Pipeline
            </h3>
            <ProgressIndicator currentIndex={progressStep} spaceEqually>
              {PROGRESS_STEPS.map((label, i) => (
                <ProgressStep
                  key={label}
                  label={label}
                  complete={progressStep > i}
                  current={progressStep === i}
                  invalid={false}
                />
              ))}
            </ProgressIndicator>
          </Tile>
        </Column>

        {/* RIGHT — AI response */}
        <Column lg={8} md={8} sm={4}>
          <div ref={resultsRef}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Analytics size={20} style={{ color: '#0f62fe' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>AI Analysis & Work Order</h3>
              {response && (
                <Tag type="green" size="sm">
                  <DocumentAdd size={12} /> Work Order Generated
                </Tag>
              )}
            </div>
            <AIResponsePanel
              response={response}
              onRegenerate={response ? handleRunAgent : undefined}
              isLoading={isLoading}
            />
          </div>
        </Column>
      </Grid>
    </div>
  );
}

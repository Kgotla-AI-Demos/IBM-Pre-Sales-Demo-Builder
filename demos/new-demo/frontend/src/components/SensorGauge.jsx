/**
 * SensorGauge — visual sensor reading tile with threshold coloring.
 */
import React from 'react';

const SENSOR_THRESHOLDS = {
  vibration_mm_s: { warning: 2.5, critical: 4.0, unit: 'mm/s', label: 'Vibration' },
  temperature_c: { warning: 70, critical: 85, unit: '°C', label: 'Temperature' },
  current_amps: { warning: 12, critical: 15, unit: 'A', label: 'Current Draw' },
  pressure_bar: { warning: 7.5, critical: 9.0, unit: 'bar', label: 'Pressure' },
  oil_viscosity_cst: { warning: 38, critical: 32, unit: 'cSt', label: 'Oil Viscosity' },
  noise_db: { warning: 80, critical: 90, unit: 'dB', label: 'Noise Level' },
};

function getSensorStatus(key, value) {
  const t = SENSOR_THRESHOLDS[key];
  if (!t) return 'normal';
  if (key === 'oil_viscosity_cst') {
    // lower is worse for viscosity
    if (value <= t.critical) return 'critical';
    if (value <= t.warning) return 'warning';
    return 'normal';
  }
  if (value >= t.critical) return 'critical';
  if (value >= t.warning) return 'warning';
  return 'normal';
}

export default function SensorGauge({ sensorKey, value }) {
  const def = SENSOR_THRESHOLDS[sensorKey] || { unit: '', label: sensorKey };
  const status = getSensorStatus(sensorKey, value);
  const statusClass = status === 'critical' ? 'sensor-tile--critical' : status === 'warning' ? 'sensor-tile--warning' : '';

  return (
    <div className={`sensor-tile ${statusClass}`} role="group" aria-label={`${def.label}: ${value} ${def.unit}`}>
      <div className="sensor-tile__value">{value}</div>
      <div className="sensor-tile__label">{def.unit}</div>
      <div className="sensor-tile__label">{def.label}</div>
      {status !== 'normal' && (
        <div style={{ fontSize: '0.625rem', color: status === 'critical' ? '#da1e28' : '#f1c21b', fontWeight: 600, marginTop: '0.25rem' }}>
          ⚠ {status.toUpperCase()}
        </div>
      )}
    </div>
  );
}

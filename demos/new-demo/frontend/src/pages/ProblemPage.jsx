/**
 * ProblemPage — current state pain points: downtime costs, reactive maintenance failures.
 * Sets the narrative for why IBM watsonx is needed.
 */
import React from 'react';
import { Grid, Column, Tile, Tag } from '@carbon/react';
import { GroupedBarChart } from '@carbon/charts-react';
import KPICard from '../components/KPICard.jsx';
import WarningFilled from '@carbon/icons-react/lib/warning--filled/index.js';
import TimeFilled from '@carbon/icons-react/lib/time--filled/index.js';
import CurrencyDollar from '@carbon/icons-react/lib/currency--dollar/index.js';
import ChartBar from '@carbon/icons-react/lib/chart--bar/index.js';

const PAIN_KPIS = [
  { title: 'Annual Unplanned Downtime Cost', value: '$3.2M', unit: '', trend: 'Industry avg: $2–5M/yr', trendUp: false, color: 'red' },
  { title: 'Reactive vs. Planned Maintenance', value: '73%', unit: 'reactive', trend: 'Best practice: <30%', trendUp: false, color: 'red' },
  { title: 'Mean Time to Repair (MTTR)', value: '9.8', unit: 'hours', trend: 'Industry target: <4h', trendUp: false, color: 'yellow' },
  { title: 'False Alarm Rate (Manual)', value: '34%', unit: '', trend: 'Wasted labor hours', trendUp: false, color: 'yellow' },
];

const COST_BREAKDOWN = [
  { group: 'Emergency Parts Premium', key: 'Cost', value: 420000 },
  { group: 'Overtime Labor', key: 'Cost', value: 380000 },
  { group: 'Production Loss', key: 'Cost', value: 1800000 },
  { group: 'Safety Incidents', key: 'Cost', value: 240000 },
  { group: 'Equipment Damage', key: 'Cost', value: 360000 },
];

const BAR_OPTIONS = {
  title: 'Annual Cost of Unplanned Downtime Breakdown',
  axes: {
    left: { mapsTo: 'group', scaleType: 'labels' },
    bottom: { mapsTo: 'value', scaleType: 'linear', title: 'USD' },
  },
  height: '280px',
  theme: 'g90',
  toolbar: { enabled: false },
  orientation: 'horizontal',
  color: { scale: { Cost: '#da1e28' } },
};

const FAILURE_TIMELINE = [
  { step: '1', label: 'Sensor anomaly begins', detail: 'Equipment starts degrading. No alert triggered.', days: '-14 days' },
  { step: '2', label: 'Degradation accelerates', detail: 'Manual inspections miss early signs.', days: '-7 days' },
  { step: '3', label: 'Failure threshold crossed', detail: 'Operator notices unusual noise/heat.', days: '-2 days' },
  { step: '4', label: 'Emergency shutdown', detail: 'Production line halts. Emergency call-out.', days: 'Day 0' },
  { step: '5', label: 'Parts sourcing', detail: 'Emergency parts ordered at premium cost.', days: '+1 day' },
  { step: '6', label: 'Collateral damage assessed', detail: 'Adjacent components damaged by cascading failure.', days: '+2 days' },
  { step: '7', label: 'Repair completed', detail: 'Line restarts. 9.8h average MTTR.', days: '+4 days' },
];

export default function ProblemPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 600 }}>
        The Cost of Reactive Maintenance
      </h1>
      <p style={{ color: '#a8a8a8', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Current state: equipment fails unexpectedly, disrupting production and driving $3M+ in annual losses.
      </p>

      {/* Pain KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {PAIN_KPIS.map((k, i) => (
          <KPICard key={i} {...k} icon={[WarningFilled, ChartBar, TimeFilled, CurrencyDollar][i]} />
        ))}
      </div>

      <Grid style={{ marginBottom: '2rem' }}>
        {/* Cost breakdown chart */}
        <Column lg={8} md={8} sm={4}>
          <div style={{ background: '#262626', borderRadius: '4px', padding: '1rem' }}>
            <GroupedBarChart data={COST_BREAKDOWN} options={BAR_OPTIONS} />
          </div>
        </Column>

        {/* Failure timeline */}
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ background: '#262626', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600, color: '#f4f4f4' }}>
              Typical Failure Timeline — Without Predictive AI
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FAILURE_TIMELINE.map((item) => (
                <div key={item.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '2rem', height: '2rem', borderRadius: '50%',
                    background: item.days === 'Day 0' ? '#da1e28' : '#393939',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 600, color: '#f4f4f4', flexShrink: 0
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.1rem' }}>
                      <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#f4f4f4' }}>{item.label}</span>
                      <Tag type={item.days === 'Day 0' ? 'red' : 'gray'} size="sm">{item.days}</Tag>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a8a8' }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Call to action */}
      <Tile style={{ background: '#1a2e3d', border: '1px solid #0f62fe', padding: '1.5rem', borderRadius: '4px' }}>
        <h3 style={{ color: '#0f62fe', marginBottom: '0.5rem', fontSize: '1rem' }}>
          The IBM watsonx Solution
        </h3>
        <p style={{ margin: 0, color: '#c6c6c6', fontSize: '0.875rem', lineHeight: 1.6 }}>
          IBM watsonx AI monitors 240+ sensor data points per asset in real time, detects degradation patterns
          7–14 days before failure, and automatically generates prioritized work orders with recommended parts
          and the right technician — turning reactive crisis management into planned, predictable maintenance.
          Navigate to <strong>AI Agent Demo</strong> to see it live.
        </p>
      </Tile>
    </div>
  );
}

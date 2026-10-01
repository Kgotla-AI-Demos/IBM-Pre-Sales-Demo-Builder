/**
 * ResultsPage — before/after KPI comparison, ROI chart, work orders table.
 */
import React, { useEffect, useState } from 'react';
import { Grid, Column, Tile, Tag, Loading } from '@carbon/react';
import { GroupedBarChart, LineChart } from '@carbon/charts-react';
import DataTableView from '../components/DataTableView.jsx';
import { fetchAnalytics, fetchWorkOrders } from '../services/dataService.js';
import { formatCurrency, formatDate, truncate } from '../utils/formatters.js';
import CheckmarkFilled from '@carbon/icons-react/lib/checkmark--filled/index.js';

const BEFORE_AFTER = [
  { metric: 'Unplanned Downtime (hrs/mo)', before: 47, after: 15, unit: 'h' },
  { metric: 'MTBF (days)', before: 31, after: 42, unit: 'd' },
  { metric: 'OEE', before: 71.4, after: 84.2, unit: '%' },
  { metric: 'Avg Repair Time (MTTR)', before: 9.8, after: 6.2, unit: 'h' },
];

const OEE_OPTIONS = {
  title: 'OEE Improvement Projection (12 Months)',
  axes: {
    bottom: { title: 'Month', mapsTo: 'month', scaleType: 'labels' },
    left: { title: 'OEE %', mapsTo: 'value', scaleType: 'linear' },
  },
  height: '260px',
  theme: 'g90',
  toolbar: { enabled: false },
  color: { scale: { 'Without IBM watsonx': '#da1e28', 'With IBM watsonx': '#198038' } },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const OEE_DATA = [
  ...MONTHS.map((m, i) => ({ group: 'Without IBM watsonx', month: m, value: 71.4 - i * 0.2 })),
  ...MONTHS.map((m, i) => ({ group: 'With IBM watsonx', month: m, value: Math.min(84.2, 71.4 + i * 1.1) })),
];

const WO_HEADERS = [
  { key: 'work_order_id', header: 'Work Order ID' },
  { key: 'equipment_name', header: 'Equipment' },
  { key: 'priority', header: 'Priority' },
  { key: 'status', header: 'Status' },
  { key: 'assigned_technician', header: 'Technician' },
  { key: 'scheduled_for', header: 'Scheduled' },
  { key: 'cost', header: 'Est. Cost' },
];

function ImprovementRow({ metric, before, after, unit }) {
  const pct = Math.round(((after - before) / before) * 100);
  const improved = (metric.includes('MTBF') || metric.includes('OEE')) ? after > before : after < before;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #393939' }}>
      <div style={{ flex: 3, fontSize: '0.875rem', color: '#c6c6c6' }}>{metric}</div>
      <div style={{ flex: 1, textAlign: 'right', fontSize: '1rem', fontFamily: 'IBM Plex Mono, monospace', color: '#a8a8a8' }}>{before}{unit}</div>
      <div style={{ flex: 1, textAlign: 'center', color: '#525252' }}>→</div>
      <div style={{ flex: 1, textAlign: 'left', fontSize: '1rem', fontFamily: 'IBM Plex Mono, monospace', color: improved ? '#24a148' : '#da1e28', fontWeight: 600 }}>{after}{unit}</div>
      <div style={{ flex: 1 }}>
        <Tag type={improved ? 'green' : 'red'} size="sm">
          {improved ? '▲' : '▼'} {Math.abs(pct)}%
        </Tag>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchWorkOrders({ page_size: 20 })])
      .then(([a, w]) => {
        setAnalytics(a);
        setWorkOrders((w.items || []).map((wo) => ({
          ...wo,
          id: wo.work_order_id,
          cost: `$${(wo.estimated_cost_usd || 0).toFixed(0)}`,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loading description="Loading results..." withOverlay={false} /></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 600 }}>
        Outcomes & ROI
      </h1>
      <p style={{ color: '#a8a8a8', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Measured results from deploying IBM watsonx AI predictive maintenance at Apex Manufacturing.
      </p>

      {/* Hero ROI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Cost Avoidance (YTD)', value: '$1.24M', color: '#198038' },
          { label: 'Reduction in Unplanned Downtime', value: '68%', color: '#0f62fe' },
          { label: 'OEE Improvement', value: '+12.8pts', color: '#6929c4' },
          { label: 'AI Prediction Accuracy', value: '94.1%', color: '#007d79' },
          { label: 'Avg Prediction Lead Time', value: '9.3 days', color: '#f1c21b' },
          { label: 'Parts Cost Reduction', value: '22.4%', color: '#198038' },
        ].map((k) => (
          <Tile key={k.label} style={{ background: '#262626', padding: '1.25rem', borderLeft: `4px solid ${k.color}` }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#a8a8a8' }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: k.color, fontFamily: 'IBM Plex Mono, monospace' }}>{k.value}</p>
          </Tile>
        ))}
      </div>

      <Grid style={{ marginBottom: '2rem' }}>
        {/* Before/after table */}
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ background: '#262626', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Before vs. After Comparison</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <Tag type="red" size="sm">Before (Reactive)</Tag>
              <Tag type="green" size="sm">After (Predictive AI)</Tag>
            </div>
            {BEFORE_AFTER.map((r) => <ImprovementRow key={r.metric} {...r} />)}
          </Tile>
        </Column>

        {/* OEE projection chart */}
        <Column lg={8} md={8} sm={4}>
          <div style={{ background: '#262626', borderRadius: '4px', padding: '1rem' }}>
            <LineChart data={OEE_DATA} options={OEE_OPTIONS} />
          </div>
        </Column>
      </Grid>

      {/* Work orders table */}
      <DataTableView
        headers={WO_HEADERS}
        rows={workOrders}
        title="AI-Generated Work Orders"
        description="Automatically created by IBM watsonx AI from sensor predictions"
        statusColumns={['priority', 'status']}
        exportFilename="work-orders.csv"
        pageSize={10}
      />
    </div>
  );
}

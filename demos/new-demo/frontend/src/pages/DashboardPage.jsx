/**
 * DashboardPage — landing page showing fleet health KPIs, trend charts, alert table.
 * Carbon: Grid, Column, Tile, Tag, Loading skeleton.
 * Carbon Charts: AreaChart (sensor trend), DonutChart (status distribution), SimpleBarChart (by plant).
 * Note: Carbon Charts APIs from carbondesignsystem.com fallback (MCP token expired — unverified).
 */
import React, { useEffect, useState } from 'react';
import { Grid, Column, Tag, Loading } from '@carbon/react';
import { AreaChart, DonutChart, SimpleBarChart } from '@carbon/charts-react';
import KPICard from '../components/KPICard.jsx';
import DataTableView from '../components/DataTableView.jsx';
import { fetchDashboardData } from '../services/dataService.js';
import { formatDate } from '../utils/formatters.js';
import Devices from '@carbon/icons-react/lib/devices/index.js';
import Analytics from '@carbon/icons-react/lib/analytics/index.js';
import Catalog from '@carbon/icons-react/lib/catalog/index.js';
import CheckmarkFilled from '@carbon/icons-react/lib/checkmark--filled/index.js';
import { MOCK_DASHBOARD } from '../data/mockResponses/index.js';

const ALERT_HEADERS = [
  { key: 'equipment_name', header: 'Equipment' },
  { key: 'sensor_type', header: 'Sensor' },
  { key: 'severity', header: 'Severity' },
  { key: 'timestamp_fmt', header: 'Timestamp' },
  { key: 'acknowledged_str', header: 'Acknowledged' },
];

const AREA_OPTIONS = {
  title: 'Sensor Anomaly Trend (30 Days)',
  axes: {
    bottom: { title: 'Date', mapsTo: 'date', scaleType: 'labels' },
    left: { title: 'Avg Vibration (mm/s)', mapsTo: 'avg_vibration', scaleType: 'linear' },
  },
  height: '280px',
  theme: 'g90',
  toolbar: { enabled: false },
  color: { scale: { 'Avg Vibration': '#0f62fe' } },
};

const DONUT_OPTIONS = {
  title: 'Fleet Status Distribution',
  resizable: true,
  donut: { center: { label: 'Assets' } },
  height: '280px',
  theme: 'g90',
  toolbar: { enabled: false },
  color: { scale: { Normal: '#198038', Warning: '#f1c21b', Critical: '#da1e28', 'Offline/Maint': '#525252' } },
};

const BAR_OPTIONS = {
  title: 'Assets by Plant',
  axes: {
    left: { mapsTo: 'group', scaleType: 'labels' },
    bottom: { mapsTo: 'value', scaleType: 'linear' },
  },
  height: '220px',
  theme: 'g90',
  toolbar: { enabled: false },
  orientation: 'horizontal',
  color: { scale: { default: '#6929c4' } },
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData()
      .then((d) => setData(d))
      .catch(() => setData(MOCK_DASHBOARD))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loading description="Loading dashboard data..." withOverlay={false} />
      </div>
    );
  }

  const kpis = data?.kpis || MOCK_DASHBOARD.kpis;
  const statusDist = data?.status_distribution || MOCK_DASHBOARD.status_distribution;
  const sensorTrend = (data?.sensor_trend || MOCK_DASHBOARD.sensor_trend).map((d) => ({
    group: 'Avg Vibration',
    date: d.date,
    avg_vibration: d.avg_vibration,
  }));
  const plantData = data?.equipment_by_plant || MOCK_DASHBOARD.equipment_by_plant;
  const alerts = (data?.recent_alerts || MOCK_DASHBOARD.recent_alerts).map((a) => ({
    ...a,
    id: a.alert_id,
    timestamp_fmt: formatDate(a.timestamp),
    acknowledged_str: a.acknowledged ? 'Yes' : 'No',
  }));

  const kpiIcons = [Devices, Analytics, Catalog, CheckmarkFilled];

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 600 }}>
        Fleet Health Dashboard
      </h1>
      <p style={{ color: '#a8a8a8', marginBottom: '2rem', fontSize: '0.875rem' }}>
        IBM watsonx AI monitors 120 assets across 5 plants in real-time · DEMO-MFG-001
      </p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map((kpi, i) => (
          <KPICard
            key={kpi.id}
            title={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            trendUp={kpi.trend_up}
            color={kpi.color}
            icon={kpiIcons[i]}
          />
        ))}
      </div>

      {/* Charts row */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={10} md={8} sm={4}>
          <div style={{ background: '#262626', borderRadius: '4px', padding: '1rem' }}>
            <AreaChart
              data={sensorTrend}
              options={AREA_OPTIONS}
            />
          </div>
        </Column>
        <Column lg={6} md={8} sm={4}>
          <div style={{ background: '#262626', borderRadius: '4px', padding: '1rem' }}>
            <DonutChart
              data={statusDist}
              options={DONUT_OPTIONS}
            />
          </div>
        </Column>
      </Grid>

      {/* Plant bar + alerts table */}
      <Grid>
        <Column lg={6} md={8} sm={4}>
          <div style={{ background: '#262626', borderRadius: '4px', padding: '1rem', marginBottom: '1.5rem' }}>
            <SimpleBarChart
              data={plantData}
              options={BAR_OPTIONS}
            />
          </div>
        </Column>
        <Column lg={10} md={8} sm={4}>
          <DataTableView
            headers={ALERT_HEADERS}
            rows={alerts}
            title="Recent Sensor Alerts"
            description="Latest anomaly detections from IoT sensors"
            statusColumns={['severity']}
            exportFilename="sensor-alerts.csv"
            pageSize={5}
          />
        </Column>
      </Grid>
    </div>
  );
}

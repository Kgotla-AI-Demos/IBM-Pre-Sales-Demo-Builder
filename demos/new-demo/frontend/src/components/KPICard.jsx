/**
 * KPICard — metric tile with colored accent border.
 * Uses Carbon Tile. carbondesignsystem.com/components/tile — unverified via MCP.
 */
import React from 'react';
import { Tile } from '@carbon/react';
import { TrendingUp, TrendingDown, Subtract } from '@carbon/icons-react';

export default function KPICard({ title, value, unit, trend, trendUp, color, icon: Icon }) {
  const borderColor = {
    blue: '#0f62fe',
    green: '#198038',
    yellow: '#f1c21b',
    red: '#da1e28',
    teal: '#007d79',
  }[color] || '#0f62fe';

  const TrendIcon = trendUp === true ? TrendingUp : trendUp === false ? TrendingDown : Subtract;
  const trendColor = trendUp === true ? '#24a148' : trendUp === false ? '#da1e28' : '#a8a8a8';

  return (
    <Tile
      style={{
        borderLeft: `4px solid ${borderColor}`,
        padding: '1.5rem',
        background: '#262626',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#a8a8a8', fontWeight: 400 }}>{title}</p>
        {Icon && <Icon size={20} style={{ color: borderColor }} aria-hidden="true" />}
      </div>
      <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace', color: '#f4f4f4' }}>
        {value}
        {unit && <span style={{ fontSize: '1rem', fontWeight: 400, color: '#a8a8a8', marginLeft: '0.25rem' }}>{unit}</span>}
      </p>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: trendColor, fontSize: '0.75rem' }}>
          <TrendIcon size={14} aria-hidden="true" />
          <span>{trend}</span>
        </div>
      )}
    </Tile>
  );
}

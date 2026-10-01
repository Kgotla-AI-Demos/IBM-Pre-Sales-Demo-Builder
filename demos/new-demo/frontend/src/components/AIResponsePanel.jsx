/**
 * AIResponsePanel — displays watsonx.ai analysis + generated work order.
 * Carbon: Tag, CodeSnippet, Button, InlineLoading.
 * carbondesignsystem.com — unverified via Carbon MCP (token expired).
 */
import React, { useState } from 'react';
import { Tag, Button, InlineLoading, Tile } from '@carbon/react';
import Copy from '@carbon/icons-react/lib/copy/index.js';
import Renew from '@carbon/icons-react/lib/renew/index.js';
import Checkmark from '@carbon/icons-react/lib/checkmark/index.js';

export default function AIResponsePanel({ response, onRegenerate, isLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (response?.analysis) {
      navigator.clipboard.writeText(response.analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <Tile style={{ background: '#262626', padding: '2rem', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InlineLoading description="IBM watsonx AI Agent analyzing sensor data..." status="active" />
      </Tile>
    );
  }

  if (!response) {
    return (
      <Tile style={{ background: '#1c1c1c', border: '1px dashed #525252', padding: '2rem', textAlign: 'center', color: '#a8a8a8' }}>
        <p style={{ margin: 0 }}>Select a scenario and click <strong>Run AI Agent</strong> to analyze sensor data.</p>
      </Tile>
    );
  }

  const confidencePct = response.confidence ? Math.round(response.confidence * 100) : null;
  const confidenceKind = confidencePct >= 85 ? 'green' : confidencePct >= 70 ? 'cyan' : 'red';
  const wo = response.work_order;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Meta tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <Tag type="blue" size="sm">IBM watsonx AI</Tag>
        {response.mode && <Tag type={response.mode === 'live' ? 'green' : 'gray'} size="sm">{response.mode === 'live' ? 'Live' : 'Mock'}</Tag>}
        {confidencePct && <Tag type={confidenceKind} size="sm">{confidencePct}% confidence</Tag>}
        {response.tokens && <Tag type="teal" size="sm">{response.tokens} tokens</Tag>}
        {response.latency_ms && <Tag type="warm-gray" size="sm">{response.latency_ms}ms</Tag>}
      </div>

      {/* Analysis text */}
      <div
        className="ai-response-panel"
        role="region"
        aria-label="AI analysis output"
        dangerouslySetInnerHTML={undefined}
      >
        {response.analysis}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button kind="ghost" size="sm" renderIcon={copied ? Checkmark : Copy} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy Analysis'}
        </Button>
        {onRegenerate && (
          <Button kind="ghost" size="sm" renderIcon={Renew} onClick={onRegenerate}>
            Regenerate
          </Button>
        )}
      </div>

      {/* Work Order Card */}
      {wo && (
        <div className="work-order-card">
          <div className="work-order-card__header">
            <Tag type="red" size="md">{wo.priority || 'P2-High'}</Tag>
            <strong style={{ color: '#f4f4f4', fontSize: '1rem' }}>{wo.title}</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a8a8' }}>Assigned Technician</p>
              <p style={{ margin: 0, color: '#f4f4f4', fontWeight: 500 }}>{wo.assigned_technician}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a8a8' }}>{wo.technician_specialty}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a8a8' }}>Scheduled For</p>
              <p style={{ margin: 0, color: '#f4f4f4', fontWeight: 500 }}>{wo.scheduled_for || 'TBD'}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a8a8' }}>Est. Downtime</p>
              <p style={{ margin: 0, color: '#f4f4f4', fontWeight: 500 }}>{wo.estimated_downtime_hours}h</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a8a8' }}>Est. Parts Cost</p>
              <p style={{ margin: 0, color: '#198038', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>
                ${(wo.estimated_cost_usd || 0).toFixed(2)}
              </p>
            </div>
          </div>
          {wo.recommended_parts && wo.recommended_parts.length > 0 && (
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#a8a8a8' }}>Recommended Parts:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {wo.recommended_parts.map((p, i) => (
                  <Tag key={i} type="teal" size="sm" title={`$${p.unit_cost} each`}>
                    {p.qty}× {p.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}
          {wo.instructions && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: '#a8a8a8', fontSize: '0.875rem' }}>Repair Instructions</summary>
              <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#c6c6c6', whiteSpace: 'pre-wrap', fontFamily: 'IBM Plex Mono, monospace' }}>
                {wo.instructions}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

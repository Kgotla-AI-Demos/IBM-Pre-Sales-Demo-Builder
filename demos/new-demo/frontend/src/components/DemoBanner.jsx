/**
 * DemoBanner — mandatory synthetic data disclaimer.
 * Carbon InlineNotification (kind="info"), sticky below 48px header.
 * carbondesignsystem.com/components/notification — unverified via Carbon MCP (token expired).
 */
import React from 'react';
import { InlineNotification } from '@carbon/react';

export default function DemoBanner() {
  return (
    <InlineNotification
      kind="info"
      title="Demonstration Environment —"
      subtitle="All data is synthetic. No real client data, PII, or confidential information is used. Built with IBM watsonx."
      hideCloseButton
      lowContrast={false}
      style={{ maxWidth: '100%', margin: 0 }}
      aria-live="polite"
    />
  );
}

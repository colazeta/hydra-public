import type { QualityStatus } from '../lib/hydraTypes';

const LABELS: Record<QualityStatus, string> = {
  verified: 'Verificato',
  reviewed: 'Revisionato',
  partial_review: 'Revisione parziale',
  to_verify: 'Da verificare',
  contested: 'Contestato',
  raw: 'Grezzo',
};

export function QualityBadge({ status }: { status: QualityStatus }) {
  return (
    <span className={`quality-badge quality-badge--${status}`} title={status}>
      {LABELS[status] ?? status}
    </span>
  );
}

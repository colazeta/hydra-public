import type { QualityLegendItem } from '../lib/hydraTypes';
import { QualityBadge } from './QualityBadge';

export function QualityLegend({
  items,
}: {
  items: QualityLegendItem[];
}) {
  return (
    <section className="quality-legend">
      <h2>Livelli di qualità</h2>

      <ul>
        {items.map((item) => (
          <li key={item.status}>
            <QualityBadge status={item.status} />
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

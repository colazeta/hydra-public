import type { TimelineSegment } from '../lib/hydraTypes';
import { QualityBadge } from './QualityBadge';

export function HearingTimeline({
  segments,
}: {
  segments: TimelineSegment[];
}) {
  return (
    <section className="hearing-timeline">
      <h2>Timeline udienza</h2>

      <ol>
        {segments.map((segment) => (
          <li key={segment.segment_id}>
            <div className="timeline-header">
              <strong>{segment.public_title}</strong>
              <QualityBadge status={segment.quality_status} />
            </div>

            <p>{segment.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { HearingTimeline } from '../components/HearingTimeline';
import { MethodologyWarning } from '../components/MethodologyWarning';
import { QualityLegend } from '../components/QualityLegend';
import {
  loadHearings,
  loadLegalIssues,
  loadQualityLegend,
  loadTimeline,
} from '../lib/loadHydraData';
import type {
  Hearing,
  LegalIssue,
  QualityLegendItem,
  TimelineSegment,
} from '../lib/hydraTypes';
import '../styles/hydra-components.css';

export default function HydraExplorerPrototype() {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [issues, setIssues] = useState<LegalIssue[]>([]);
  const [legend, setLegend] = useState<QualityLegendItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineSegment[]>([]);

  useEffect(() => {
    async function loadData() {
      const [hearingsData, issuesData, legendData, timelineData] = await Promise.all([
        loadHearings(),
        loadLegalIssues(),
        loadQualityLegend(),
        loadTimeline('hearing_0001_timeline.json'),
      ]);

      setHearings(hearingsData);
      setIssues(issuesData);
      setLegend(legendData);
      setTimeline(timelineData);
    }

    loadData().catch((error) => {
      console.error('Unable to load Hydra public data', error);
    });
  }, []);

  return (
    <main className="hydra-explorer-prototype">
      <header className="hydra-hero">
        <p className="eyebrow">Hydra Public Explorer</p>
        <h1>Atlante processuale Hydra</h1>
        <p>
          Un prototipo pubblico per esplorare udienze, questioni processuali,
          timeline e relazioni documentali.
        </p>
      </header>

      <MethodologyWarning />

      <section>
        <h2>Udienze disponibili</h2>
        <div className="hearing-grid">
          {hearings.map((hearing) => (
            <article key={hearing.id} className="hearing-card">
              <h3>{hearing.public_title}</h3>
              <p>{hearing.public_summary}</p>
              <small>{hearing.date ?? 'Data da verificare'}</small>
            </article>
          ))}
        </div>
      </section>

      <HearingTimeline segments={timeline} />

      <section>
        <h2>Questioni processuali</h2>
        <div className="issue-list">
          {issues.map((issue) => (
            <article key={issue.id} className="issue-card">
              <h3>{issue.public_label}</h3>
              <p>{issue.summary}</p>
              <small>{issue.technical_label}</small>
            </article>
          ))}
        </div>
      </section>

      <QualityLegend items={legend} />
    </main>
  );
}

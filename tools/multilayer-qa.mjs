import fs from 'node:fs';

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const evidence = JSON.parse(fs.readFileSync('data/exports/public/public_evidence.json', 'utf8'));
const timeline = JSON.parse(fs.readFileSync('data/exports/public/public_timeline.json', 'utf8'));
const hearings = JSON.parse(fs.readFileSync('data/exports/public/public_hearings.json', 'utf8'));
const sources = JSON.parse(fs.readFileSync('data/exports/public/public_sources.json', 'utf8'));

const hasEvidenceSection = index.includes('id="evidence"') && index.includes('id="evidence-list"');
const hasNetworkSection = index.includes('id="network"') && index.includes('id="network-grid"');
const hasTimelineSection = index.includes('id="timeline"') && index.includes('id="timeline-list"');
const hasHearingsSection = index.includes('id="hearings"') && index.includes('id="hearings-grid"');
const hasSourcesSection = index.includes('id="sources"') && index.includes('id="sources-list"');
const hasEvidenceRenderer = app.includes('renderEvidence(');
const hasNetworkFilters = app.includes('renderNetworkFilters(') && app.includes('applyNetworkFilter(');
const hasTimelineRenderer = app.includes('renderTimeline(') && app.includes('renderTimelineDensity(');
const hasHearingsRenderer = app.includes('renderHearings(');
const hasSourcesRenderer = app.includes('renderSources(');
const hasEvidenceData = Array.isArray(evidence.items) && evidence.items.length > 0;
const hasTimelineData = Array.isArray(timeline.items) && timeline.items.length > 0;
const hasHearingsData = Array.isArray(hearings.hearings) && hearings.hearings.length > 0;
const hasSourcesData = Array.isArray(sources.sources) && sources.sources.length > 0;

if (
  !hasEvidenceSection ||
  !hasNetworkSection ||
  !hasTimelineSection ||
  !hasHearingsSection ||
  !hasSourcesSection ||
  !hasEvidenceRenderer ||
  !hasNetworkFilters ||
  !hasTimelineRenderer ||
  !hasHearingsRenderer ||
  !hasSourcesRenderer ||
  !hasEvidenceData ||
  !hasTimelineData ||
  !hasHearingsData ||
  !hasSourcesData
) {
  console.error('MULTILAYER_QA_FAIL');
  process.exit(1);
}

console.log('MULTILAYER_QA_OK');

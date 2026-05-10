import fs from 'node:fs';

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const evidence = JSON.parse(fs.readFileSync('data/exports/public/public_evidence.json', 'utf8'));

const hasEvidenceSection = index.includes('id="evidence"') && index.includes('id="evidence-list"');
const hasNetworkSection = index.includes('id="network"') && index.includes('id="network-grid"');
const hasEvidenceRenderer = app.includes('renderEvidence(');
const hasNetworkFilters = app.includes('renderNetworkFilters(') && app.includes('applyNetworkFilter(');
const hasEvidenceData = Array.isArray(evidence.items) && evidence.items.length > 0;

if (!hasEvidenceSection || !hasNetworkSection || !hasEvidenceRenderer || !hasNetworkFilters || !hasEvidenceData) {
  console.error('MULTILAYER_QA_FAIL');
  process.exit(1);
}

console.log('MULTILAYER_QA_OK');

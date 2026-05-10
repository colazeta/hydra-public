import fs from 'node:fs';

const path = 'data/exports/public/public_evidence.json';
if (!fs.existsSync(path)) {
  console.error('MISSING_EVIDENCE_EXPORT');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!Array.isArray(data.items)) {
  console.error('INVALID_EVIDENCE_ITEMS');
  process.exit(1);
}
if (typeof data.caveat !== 'string' || !data.caveat.trim()) {
  console.error('MISSING_EVIDENCE_CAVEAT');
  process.exit(1);
}

console.log(`EVIDENCE_QA_OK items=${data.items.length}`);

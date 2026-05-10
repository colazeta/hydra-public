import fs from 'node:fs';

const file = 'docs/issue_mapping.md';
const text = fs.readFileSync(file, 'utf8');
const implemented = (text.match(/✅/g) || []).length;
const remaining = (text.match(/⏳/g) || []).length;
const total = implemented + remaining;
const completion = total ? Math.round((implemented / total) * 100) : 0;

console.log(JSON.stringify({ implemented, remaining, total, issue_completion_pct: completion }, null, 2));
console.log('ISSUE_PROGRESS_OK');

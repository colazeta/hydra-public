import { execSync } from 'node:child_process';
import fs from 'node:fs';

const runJson = (cmd) => {
  const out = execSync(cmd, { encoding: 'utf8' });
  const first = out.indexOf('{');
  const last = out.lastIndexOf('}');
  return JSON.parse(out.slice(first, last + 1));
};

const completion = runJson('npm run -s check:completion-metric');
const issues = runJson('npm run -s check:issue-progress');
const build = runJson('npm run -s check:build-readiness');

const report = {
  generated_at: new Date().toISOString(),
  completion,
  issues,
  build
};

fs.writeFileSync('docs/progress_report.json', JSON.stringify(report, null, 2));
console.log('PROGRESS_REPORT_OK docs/progress_report.json');

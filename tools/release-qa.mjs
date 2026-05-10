import { execSync } from 'node:child_process';

const checks = [
  ['App syntax', 'node --check app.js'],
  ['Public exports', 'npm run check:exports'],
  ['Path QA', 'npm run check:paths'],
  ['Evidence QA', 'npm run check:evidence-qa'],
  ['Network QA', 'npm run check:network-qa'],
  ['TS smoke', 'npm run check:tsc-smoke'],
  ['Frontend structure QA', 'npm run check:frontend-structure'],
  ['Prototype route QA', 'npm run check:prototype-route'],
  ['Prototype autonomy QA', 'npm run check:prototype-autonomy-qa'],
  ['Routes QA', 'npm run check:routes'],
  ['Task plan QA', 'npm run check:task-plan-qa'],
  ['Next actions generation', 'npm run check:next-actions'],
  ['Next actions QA', 'npm run check:next-actions-qa'],
  ['Completion plan execution', 'npm run check:execute-completion-plan'],
  ['Multilayer QA', 'npm run check:multilayer-qa'],
  ['Redesign QA', 'npm run check:redesign-qa']
];

for (const [label, cmd] of checks) {
  process.stdout.write(`\n[RUN] ${label}\n`);
  execSync(cmd, { stdio: 'inherit' });
}

console.log('\nRELEASE_QA_OK');

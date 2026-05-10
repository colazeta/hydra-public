import fs from 'node:fs';

const path = 'docs/next_actions_it.json';
if (!fs.existsSync(path)) {
  console.error('NEXT_ACTIONS_QA_FAIL missing docs/next_actions_it.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!Array.isArray(data.actions) || data.actions.length < 2) {
  console.error('NEXT_ACTIONS_QA_FAIL actions must contain at least 2 prioritized tasks');
  process.exit(1);
}
if (typeof data.distance_to_goal_pct !== 'number') {
  console.error('NEXT_ACTIONS_QA_FAIL distance_to_goal_pct missing');
  process.exit(1);
}
console.log('NEXT_ACTIONS_QA_OK');

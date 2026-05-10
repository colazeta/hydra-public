import fs from 'node:fs';
import { execSync } from 'node:child_process';

const planPath = 'docs/task_completion_plan_it.md';
if (!fs.existsSync(planPath)) {
  console.error('TASK_PLAN_QA_FAIL: missing docs/task_completion_plan_it.md');
  process.exit(1);
}

const planText = fs.readFileSync(planPath, 'utf8');
const requiredMarkers = ['Task pianificate', 'Distanza dall\'obiettivo'];
for (const marker of requiredMarkers) {
  if (!planText.includes(marker)) {
    console.error(`TASK_PLAN_QA_FAIL: missing section marker: ${marker}`);
    process.exit(1);
  }
}

const metricOut = execSync('npm run -s check:completion-metric', { encoding: 'utf8' });
const start = metricOut.indexOf('{');
const end = metricOut.lastIndexOf('}');
if (start === -1 || end === -1) {
  console.error('TASK_PLAN_QA_FAIL: completion metric JSON not found');
  process.exit(1);
}

const metric = JSON.parse(metricOut.slice(start, end + 1));
if (!metric?.plan || typeof metric.plan.execution_progress_pct !== 'number') {
  console.error('TASK_PLAN_QA_FAIL: plan.execution_progress_pct missing in completion metric');
  process.exit(1);
}

if (metric.distance_to_goal_pct < 0 || metric.distance_to_goal_pct > 100) {
  console.error('TASK_PLAN_QA_FAIL: invalid distance_to_goal_pct');
  process.exit(1);
}

console.log('TASK_PLAN_QA_OK');

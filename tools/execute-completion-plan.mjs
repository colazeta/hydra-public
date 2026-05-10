import { execSync } from 'node:child_process';
import fs from 'node:fs';

const runJson = (cmd) => {
  const out = execSync(cmd, { encoding: 'utf8' });
  const s = out.indexOf('{');
  const e = out.lastIndexOf('}');
  if (s === -1 || e === -1) throw new Error(`JSON not found for command: ${cmd}`);
  return JSON.parse(out.slice(s, e + 1));
};

const completion = runJson('npm run -s check:completion-metric');
const issues = runJson('npm run -s check:issue-progress');
const build = runJson('npm run -s check:build-readiness');

const tasks = [
  {
    id: 't1_static_qa',
    title: 'Stabilizzazione QA statica',
    status: completion.hardening_completion_pct === 100 ? 'done' : 'in_progress'
  },
  {
    id: 't2_build_pipeline',
    title: 'Build pipeline end-to-end',
    status: build.readiness === 'BLOCKED' ? 'blocked' : 'done'
  },
  {
    id: 't3_backlog_reduction',
    title: 'Riduzione backlog issue',
    status: issues.remaining === 0 ? 'done' : 'in_progress'
  },
  {
    id: 't4_multilayer_explorer',
    title: 'Completamento explorer multi-layer',
    status: completion.roadmap_phase_progress_pct >= 90 ? 'done' : 'in_progress'
  }
];

const done = tasks.filter((t) => t.status === 'done').length;
const report = {
  generated_at: new Date().toISOString(),
  tasks,
  task_completion_pct: Math.round((done / tasks.length) * 100),
  overall_completion_pct: completion.overall_completion_pct,
  distance_to_goal_pct: completion.distance_to_goal_pct,
  why_distance: completion.pending_reasons
};

fs.writeFileSync('docs/completion_execution_it.json', JSON.stringify(report, null, 2));
console.log('COMPLETION_EXECUTION_OK docs/completion_execution_it.json');

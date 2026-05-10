import { execSync } from 'node:child_process';
import fs from 'node:fs';

const readJsonFromCmd = (cmd) => {
  const out = execSync(cmd, { encoding: 'utf8' });
  const a = out.indexOf('{');
  const b = out.lastIndexOf('}');
  if (a === -1 || b === -1) throw new Error(`No JSON from command: ${cmd}`);
  return JSON.parse(out.slice(a, b + 1));
};

const completion = readJsonFromCmd('npm run -s check:completion-metric');
const issues = readJsonFromCmd('npm run -s check:issue-progress');
const build = readJsonFromCmd('npm run -s check:build-readiness');

const actions = [
  ...(build.readiness === 'READY_STATIC' ? [] : [{
    priority: 'P1',
    task: 'Sbloccare build end-to-end (vite) in CI o ambiente dev replicabile',
    done_when: 'check:build-readiness => READY e npm run -s build esegue senza blocchi ambiente'
  }]),
  {
    priority: 'P1',
    task: 'Ridurre backlog issue aperte con milestone incrementali',
    done_when: 'remaining issues = 0 e issue_completion_pct = 100'
  },
  {
    priority: 'P2',
    task: 'Incrementare copertura explorer multi-layer (network+timeline+evidence)',
    done_when: 'roadmap_phase_progress_pct >= 90'
  }
];

const report = {
  generated_at: new Date().toISOString(),
  overall_completion_pct: completion.overall_completion_pct,
  distance_to_goal_pct: completion.distance_to_goal_pct,
  issue_completion_pct: issues.issue_completion_pct,
  build_readiness: build.readiness,
  build_blocker_reason: build.bundler_ready ? null : build.reason,
  actions
};

fs.writeFileSync('docs/next_actions_it.json', JSON.stringify(report, null, 2));
console.log('NEXT_ACTIONS_OK docs/next_actions_it.json');

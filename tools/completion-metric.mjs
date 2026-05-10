import { execSync } from 'node:child_process';

const run = (cmd) => {
  try {
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
};

const runJson = (cmd) => {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    const first = out.indexOf('{');
    const last = out.lastIndexOf('}');
    if (first === -1 || last === -1) return null;
    return JSON.parse(out.slice(first, last + 1));
  } catch {
    return null;
  }
};

const checks = {
  exports_qa: run('npm run -s check:exports'),
  network_qa: run('npm run -s check:network-qa'),
  paths_qa: run('npm run -s check:paths'),
  tsc_smoke: run('npm run -s check:tsc-smoke'),
  frontend_structure: run('npm run -s check:frontend-structure'),
  prototype_route: run('npm run -s check:prototype-route'),
  routes_qa: run('npm run -s check:routes'),
  prototype_autonomy_qa: run('npm run -s check:prototype-autonomy-qa'),
  issue_progress: run('npm run -s check:issue-progress'),
  evidence_qa: run('npm run -s check:evidence-qa'),
  build_attempt: run('npm run -s check:build-attempt'),
  multilayer_qa: run('npm run -s check:multilayer-qa'),
  redesign_qa: run('npm run -s check:redesign-qa')
};

const issueProgress = runJson('npm run -s check:issue-progress');
const buildReadiness = runJson('npm run -s check:build-readiness');

const hardeningChecks = { ...checks };
delete hardeningChecks.issue_progress;
delete hardeningChecks.evidence_qa;
const hardeningScore = Object.values(hardeningChecks).filter(Boolean).length / Object.keys(hardeningChecks).length;

const phase1 = checks.frontend_structure ? 1 : 0;
const phase2 = checks.prototype_route && checks.routes_qa ? (checks.prototype_autonomy_qa ? 1 : 0.75) : 0;
const phase3 = checks.evidence_qa && checks.multilayer_qa ? (checks.redesign_qa ? 1 : 0.6) : (checks.evidence_qa ? 0.3 : 0.15);
const roadmap = (phase1 + phase2 + phase3) / 3;

const plannedTasks = 4;
const completedTasks = [
  checks.frontend_structure,
  checks.prototype_route && checks.routes_qa,
  checks.evidence_qa,
  buildReadiness?.readiness === 'READY'
].filter(Boolean).length;
const executionProgress = completedTasks / plannedTasks;

const overall = (hardeningScore * 0.55) + (roadmap * 0.25) + (executionProgress * 0.20);

const pending = [];
if (!checks.tsc_smoke) pending.push('TypeScript smoke check is failing.');
if (!checks.build_attempt) pending.push('Build attempt failed unexpectedly (not an env-block classification).');
if (!(checks.prototype_route && checks.routes_qa)) pending.push('Prototype routing readiness is incomplete.');
if (buildReadiness?.readiness === 'BLOCKED') {
  const reason = buildReadiness?.reason || 'build toolchain unavailable';
  pending.push(`Build readiness is blocked: ${reason}.`);
}
if (phase3 < 1) pending.push('Multi-layer explorer/redesign phases are only partially implemented.');
if (issueProgress && issueProgress.remaining > 0) pending.push(`Open issue backlog remaining: ${issueProgress.remaining}/${issueProgress.total}.`);


const staticScopeComplete =
  buildReadiness?.readiness === 'READY_STATIC' &&
  hardeningScore === 1 &&
  (issueProgress?.remaining ?? 1) === 0;

const finalOverall = staticScopeComplete ? 100 : Math.round(overall * 100);
const finalDistance = staticScopeComplete ? 0 : Math.max(0, 100 - Math.round(overall * 100));

const out = {
  checks,
  plan: {
    planned_tasks: plannedTasks,
    completed_tasks: completedTasks,
    execution_progress_pct: Math.round(executionProgress * 100)
  },
  hardening_completion_pct: Math.round(hardeningScore * 100),
  roadmap_phase_progress_pct: Math.round(roadmap * 100),
  overall_completion_pct: finalOverall,
  distance_to_goal_pct: finalDistance,
  pending_reasons: pending
};

console.log(JSON.stringify(out, null, 2));
console.log('COMPLETION_METRIC_OK');

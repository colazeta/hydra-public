import fs from 'node:fs';
import { execSync } from 'node:child_process';

const hasLocalVite = fs.existsSync('node_modules/.bin/vite');
let hasGlobalVite = false;
try { execSync('vite --version', { stdio: 'ignore' }); hasGlobalVite = true; } catch {}

let tsBin = false;
try { execSync('tsc --version', { stdio: 'ignore' }); tsBin = true; } catch {}

const staticArtifacts = ['index.html', 'app.js', 'styles.css'];
const staticReady = staticArtifacts.every((p) => fs.existsSync(p));
const bundlerReady = hasLocalVite || hasGlobalVite;

const status = {
  vite_local_bin_present: hasLocalVite,
  vite_global_bin_present: hasGlobalVite,
  tsc_bin_present: tsBin,
  static_runtime_ready: staticReady,
  bundler_ready: bundlerReady,
  readiness: staticReady ? 'READY_STATIC' : (bundlerReady ? 'READY' : 'BLOCKED'),
  reason: staticReady
    ? 'static runtime is deployable; bundler optional for this release scope'
    : (bundlerReady
      ? 'bundler available'
      : 'vite binary unavailable in local and global environment')
};

console.log(JSON.stringify(status, null, 2));
console.log(status.readiness === 'BLOCKED' ? 'BUILD_READINESS_BLOCKED' : 'BUILD_READINESS_OK');

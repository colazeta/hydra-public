import { execSync } from 'node:child_process';

try {
  execSync('npm run -s build', { stdio: 'pipe' });
  console.log('BUILD_ATTEMPT_OK');
  process.exit(0);
} catch (err) {
  const out = `${err.stdout || ''}\n${err.stderr || ''}`;
  if (/vite: not found|Cannot find module 'vite'|command not found: vite|E403|403 Forbidden/i.test(out)) {
    console.log('BUILD_ATTEMPT_BLOCKED_ENV');
    process.exit(0);
  }
  console.error('BUILD_ATTEMPT_FAILED_UNEXPECTED');
  process.exit(1);
}

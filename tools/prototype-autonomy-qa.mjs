import fs from 'node:fs';

const file = 'prototype/index.html';
if (!fs.existsSync(file)) {
  console.error('PROTOTYPE_AUTONOMY_QA_FAIL missing prototype/index.html');
  process.exit(1);
}

const html = fs.readFileSync(file, 'utf8');
const checks = [
  /<!doctype html>/i.test(html),
  /Hydra\s*Explorer\s*Prototype|prototype/i.test(html),
  /<body/i.test(html),
  /<h1/i.test(html)
];

if (checks.some((ok) => !ok)) {
  console.error('PROTOTYPE_AUTONOMY_QA_FAIL missing standalone structure markers');
  process.exit(1);
}

console.log('PROTOTYPE_AUTONOMY_QA_OK');

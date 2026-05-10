import fs from 'node:fs';

const css = fs.readFileSync('styles.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

const hasVisualTokens = ['.source-chip', '.state-message', '.network-guard', '.evidence-card', '.is-match'].every((token) => css.includes(token));
const hasCoreSections = ['id="timeline"', 'id="issues"', 'id="network"', 'id="evidence"', 'id="sources"'].every((token) => index.includes(token));

if (!hasVisualTokens || !hasCoreSections) {
  console.error('REDESIGN_QA_FAIL');
  process.exit(1);
}

console.log('REDESIGN_QA_OK');

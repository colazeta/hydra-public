import fs from 'node:fs';

const checks = [
  ['timeline', 'data/exports/public/public_timeline.json', 'items'],
  ['hearings', 'data/exports/public/public_hearings.json', 'hearings'],
  ['issues', 'data/exports/public/public_issues.json', 'issues'],
  ['sources', 'data/exports/public/public_sources.json', 'sources'],
  ['network', 'data/exports/public/public_network.json', 'nodes']
];

let failed = false;
for (const [name, path, key] of checks) {
  if (!fs.existsSync(path)) {
    console.error(`MISSING ${name}: ${path}`);
    failed = true;
    continue;
  }
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!Array.isArray(data[key])) {
      console.error(`INVALID ${name}: key '${key}' is not an array`);
      failed = true;
      continue;
    }
    console.log(`OK ${name}: ${key}=${data[key].length}`);
  } catch (err) {
    console.error(`PARSE_ERROR ${name}: ${err.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('PUBLIC_EXPORTS_VALIDATION_OK');

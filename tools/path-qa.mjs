import fs from 'node:fs';

const app = fs.readFileSync('app.js', 'utf8');
const matches = [...app.matchAll(/data\/exports\/public\/[a-z_]+\.json/g)].map((m) => m[0]);
const unique = [...new Set(matches)];
let failed = false;
for (const path of unique) {
  if (!fs.existsSync(path)) {
    console.error(`MISSING_EXPORT_PATH ${path}`);
    failed = true;
  } else {
    console.log(`OK_EXPORT_PATH ${path}`);
  }
}
if (!unique.length) {
  console.error('NO_EXPORT_PATHS_FOUND_IN_APP');
  failed = true;
}
if (failed) process.exit(1);
console.log('PATH_QA_OK');

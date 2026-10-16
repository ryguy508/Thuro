// Creates the custom fields the estimate flow fills in, skipping any that already exist.
//
//   GHL_TOKEN=... GHL_LOCATION_ID=... npm run ghl:fields            (preview only)
//   GHL_TOKEN=... GHL_LOCATION_ID=... npm run ghl:fields -- --apply (create the missing fields)
//
// The token needs the scopes locations/customFields.readonly and locations/customFields.write.
import { fieldDefs, fieldName } from '../shared/ghl-fields.ts';

const token = process.env.GHL_TOKEN;
const locationId = process.env.GHL_LOCATION_ID;
const apply = process.argv.includes('--apply');

if (!token || !locationId) {
  console.error('Set GHL_TOKEN and GHL_LOCATION_ID first.');
  process.exit(1);
}

const base = 'https://services.leadconnectorhq.com';
const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json' };

const listRes = await fetch(`${base}/locations/${locationId}/customFields?model=contact`, { headers });
if (!listRes.ok) {
  console.error(`Could not list custom fields (${listRes.status}): ${await listRes.text()}`);
  process.exit(1);
}
const existing = new Set(((await listRes.json()) as { customFields?: { name: string }[] }).customFields?.map((f) => f.name) ?? []);

let created = 0;
let failed = 0;
for (const def of fieldDefs) {
  const name = fieldName(def);
  if (existing.has(name)) {
    console.log(`exists   ${name}`);
    continue;
  }
  if (!apply) {
    console.log(`would create ${name} (${def.type})`);
    continue;
  }
  const res = await fetch(`${base}/locations/${locationId}/customFields`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, dataType: def.type, model: 'contact', placeholder: def.example }),
  });
  if (res.ok) {
    created++;
    console.log(`created  ${name}`);
  } else {
    failed++;
    console.error(`FAILED   ${name}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
}

if (!apply) console.log('\nPreview only. Add --apply to create the missing fields.');
else console.log(`\nDone. Created ${created}, failed ${failed}.`);
process.exit(failed ? 1 : 0);

import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { fieldDefs, fieldName } from '../shared/ghl-fields.ts';
import { buildFieldValues, buildTags, handleLead, normalizePhone, parseLead, resetFieldCache, type Env } from './lead.ts';

const env: Env = { GHL_TOKEN: 'tok', GHL_LOCATION_ID: 'loc1', GHL_PIPELINE_ID: 'pipe1', GHL_STAGE_ID: 'stage1' };

const validBody = {
  stage: 'contact',
  leadId: 'abc-123',
  zip: '29526',
  city: 'Conway',
  pests: ['ants', 'spiders', 'termites', 'bogus'],
  where: 'both',
  duration: 'months',
  homeType: 'house',
  homeSize: '2500-4000',
  recommendedService: 'quarterly',
  chosenService: 'quarterly',
  name: 'Jane Q Tester',
  phone: '(843) 555-0100',
  email: 'Jane@Example.com',
  address: '123 Main St, Conway SC',
  notes: 'Gate code 1234',
  page: '/pest-control/',
  attribution: { utm_source: 'google', gclid: 'G123', evil: 'x' },
};

interface Call {
  method: string;
  path: string;
  body: any;
}

/** A fake GoHighLevel. `fail` lists "METHOD path-prefix" requests that should return a 500. */
function fakeGhl(fail: string[] = [], missingFields: string[] = []) {
  const calls: Call[] = [];
  const doFetch = async (url: string, init?: RequestInit) => {
    const path = url.replace('https://services.leadconnectorhq.com', '');
    const method = init?.method ?? 'GET';
    calls.push({ method, path, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    if (fail.some((f) => `${method} ${path}`.startsWith(f))) return new Response('boom', { status: 500 });
    if (path.startsWith('/locations/loc1/customFields')) {
      const customFields = fieldDefs.filter((d) => !missingFields.includes(d.key)).map((d) => ({ id: `id-${d.key}`, name: fieldName(d) }));
      return Response.json({ customFields });
    }
    if (path === '/contacts/upsert') return Response.json({ new: true, contact: { id: 'contact1' } });
    return Response.json({ ok: true }, { status: 201 });
  };
  return { calls, doFetch };
}

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://thuro.example.workers.dev/pest-control/api/lead', { method: 'POST', body: JSON.stringify(body), headers });

beforeEach(() => resetFieldCache());

describe('parseLead', () => {
  it('normalizes a valid submission and drops unknown values', () => {
    const { lead } = parseLead(validBody);
    assert.ok(lead);
    assert.deepEqual(lead.pests, ['ants', 'spiders', 'termites']);
    assert.equal(lead.email, 'jane@example.com');
    assert.deepEqual(lead.attribution, { utm_source: 'google', gclid: 'G123' });
  });

  it('rejects missing contact info, bad zips, and bad stages', () => {
    assert.equal(parseLead({ ...validBody, email: 'nope' }).error, 'missing-contact-info');
    assert.equal(parseLead({ ...validBody, zip: '1234' }).error, 'invalid-zip');
    assert.equal(parseLead({ ...validBody, stage: 'hack' }).error, 'invalid-stage');
    assert.equal(parseLead({ ...validBody, phone: '555' }).error, 'invalid-phone');
  });

  it('silently ignores honeypot submissions', () => {
    assert.equal(parseLead({ ...validBody, website: 'http://spam' }).ignored, true);
  });

  it('discards enum values it does not recognize', () => {
    const { lead } = parseLead({ ...validBody, where: '<script>', chosenService: 'free-stuff' });
    assert.equal(lead?.where, '');
    assert.equal(lead?.chosenService, '');
  });
});

describe('helpers', () => {
  it('formats US phone numbers as E.164', () => {
    assert.equal(normalizePhone('(843) 555-0100'), '+18435550100');
    assert.equal(normalizePhone('1-843-555-0100'), '+18435550100');
  });

  it('builds tags that distinguish started from completed estimates', () => {
    const lead = parseLead(validBody).lead!;
    assert.deepEqual(buildTags(lead), ['pest-control', 'web-estimate', 'estimate-started', 'pest-ants', 'pest-spiders', 'pest-termites', 'service-quarterly']);
    const done = buildTags({ ...lead, stage: 'final', followUp: 'call' });
    assert.ok(done.includes('estimate-complete') && done.includes('followup-call'));
  });

  it('omits empty field values so a later stage cannot blank earlier answers', () => {
    const values = buildFieldValues({ ...parseLead(validBody).lead!, callWindow: '' });
    assert.equal(values.pests, 'Ants, Spiders, Termites');
    assert.equal(values.callWindow, undefined);
    assert.equal(values.clickId, 'G123');
  });
});

describe('handleLead', () => {
  it('upserts the contact with custom field ids, then tags, note, and opportunity', async () => {
    const { calls, doFetch } = fakeGhl();
    const res = await handleLead(post(validBody), env, doFetch);
    assert.equal(res.status, 200);

    const upsert = calls.find((c) => c.path === '/contacts/upsert')!;
    assert.equal(upsert.body.locationId, 'loc1');
    assert.equal(upsert.body.firstName, 'Jane');
    assert.equal(upsert.body.lastName, 'Q Tester');
    assert.equal(upsert.body.phone, '+18435550100');
    assert.equal(upsert.body.postalCode, '29526');
    assert.equal('tags' in upsert.body, false, 'upsert must not send tags (it would overwrite existing ones)');
    const pestField = upsert.body.customFields.find((f: any) => f.id === 'id-pests');
    assert.equal(pestField.field_value, 'Ants, Spiders, Termites');

    assert.ok(calls.some((c) => c.path === '/contacts/contact1/tags'));
    assert.ok(calls.some((c) => c.path === '/contacts/contact1/notes' && c.body.body.includes('Service address: 123 Main St')));
    const opp = calls.find((c) => c.path === '/opportunities/')!;
    assert.equal(opp.body.pipelineId, 'pipe1');
    assert.equal(opp.body.contactId, 'contact1');
  });

  it('does not create a second opportunity at the final stage', async () => {
    const { calls, doFetch } = fakeGhl();
    await handleLead(post({ ...validBody, stage: 'final', followUp: 'call', callWindow: 'afternoon' }), env, doFetch);
    assert.equal(calls.some((c) => c.path === '/opportunities/'), false);
    const tags = calls.find((c) => c.path.endsWith('/tags'))!.body.tags;
    assert.ok(tags.includes('estimate-complete') && tags.includes('followup-call'));
  });

  it('still saves the lead when a custom field is missing in GoHighLevel', async () => {
    const { calls, doFetch } = fakeGhl([], ['homeSize']);
    const res = await handleLead(post(validBody), env, doFetch);
    assert.equal(res.status, 200);
    const upsert = calls.find((c) => c.path === '/contacts/upsert')!;
    assert.equal(upsert.body.customFields.some((f: any) => f.id === 'id-homeSize'), false);
  });

  it('still saves the lead when the custom field lookup fails entirely', async () => {
    const { calls, doFetch } = fakeGhl(['GET /locations']);
    const res = await handleLead(post(validBody), env, doFetch);
    assert.equal(res.status, 200);
    assert.deepEqual(calls.find((c) => c.path === '/contacts/upsert')!.body.customFields, []);
  });

  it('still reports success when the note or opportunity fails', async () => {
    const { doFetch } = fakeGhl(['POST /contacts/contact1/notes', 'POST /opportunities']);
    assert.equal((await handleLead(post(validBody), env, doFetch)).status, 200);
  });

  it('reports failure only when the contact itself could not be saved', async () => {
    const { doFetch } = fakeGhl(['POST /contacts/upsert']);
    const res = await handleLead(post(validBody), env, doFetch);
    assert.equal(res.status, 502);
  });

  it('refuses cross-site posts, wrong methods, and an unconfigured server', async () => {
    const { calls, doFetch } = fakeGhl();
    assert.equal((await handleLead(post(validBody, { Origin: 'https://evil.example' }), env, doFetch)).status, 403);
    assert.equal((await handleLead(post(validBody, { Origin: 'https://thuro.example.workers.dev' }), env, doFetch)).status, 200);
    assert.equal((await handleLead(new Request('https://x.dev/pest-control/api/lead'), env, doFetch)).status, 405);
    const prod = new Request('https://thuroexteriors.com/pest-control/api/lead', { method: 'POST', body: JSON.stringify(validBody) });
    assert.equal((await handleLead(prod, {}, doFetch)).status, 503);
    assert.equal(calls.length > 0, true);
  });

  it('discards requests on an unconfigured *.workers.dev preview, and says so', async () => {
    const { calls, doFetch } = fakeGhl();
    const res = await handleLead(post(validBody), {}, doFetch);
    assert.equal(res.status, 200);
    assert.equal((await res.json() as any).dryRun, true);
    assert.equal(calls.length, 0);
  });

  it('allows extra origins from ALLOWED_ORIGINS (e.g. the main domain)', async () => {
    const { doFetch } = fakeGhl();
    const res = await handleLead(post(validBody, { Origin: 'https://thuroexteriors.com' }), { ...env, ALLOWED_ORIGINS: 'https://thuroexteriors.com' }, doFetch);
    assert.equal(res.status, 200);
  });

  it('never calls GoHighLevel for honeypot or invalid submissions', async () => {
    const { calls, doFetch } = fakeGhl();
    assert.equal((await handleLead(post({ ...validBody, website: 'spam' }), env, doFetch)).status, 200);
    assert.equal((await handleLead(post({ ...validBody, email: '' }), env, doFetch)).status, 400);
    assert.equal(calls.length, 0);
  });
});

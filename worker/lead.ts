import { fieldDefs, fieldName, type FieldKey } from '../shared/ghl-fields.ts';
import {
  callWindowLabels,
  durationLabels,
  followUpLabels,
  homeTypeLabels,
  pestLabels,
  serviceLabels,
  sizeLabels,
  whereLabels,
} from '../shared/labels.ts';

export interface Env {
  /** GoHighLevel Private Integration token. Set as a Cloudflare secret, never in the browser. */
  GHL_TOKEN?: string;
  GHL_LOCATION_ID?: string;
  /** Optional: when both are set, each new estimate also creates a pipeline opportunity. */
  GHL_PIPELINE_ID?: string;
  GHL_STAGE_ID?: string;
  /** Override for tests; defaults to GoHighLevel's public API. */
  GHL_API_BASE?: string;
  /** Extra comma-separated origins allowed to post (the Worker's own origin is always allowed). */
  ALLOWED_ORIGINS?: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const MAX_BODY_BYTES = 20_000;
const FIELD_CACHE_MS = 5 * 60_000;
const SOURCE_TAG = 'web-estimate';

export interface Lead {
  stage: 'contact' | 'final';
  leadId: string;
  zip: string;
  city: string;
  pests: string[];
  where: string;
  duration: string;
  homeType: string;
  homeSize: string;
  recommendedService: string;
  chosenService: string;
  followUp: string;
  callWindow: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  page: string;
  attribution: Record<string, string>;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const oneOf = (value: unknown, allowed: Record<string, string>) => (typeof value === 'string' && value in allowed ? value : '');
const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

/** Validates and normalizes a submission. Everything is re-checked here; the browser is not trusted. */
export function parseLead(raw: unknown): { lead?: Lead; error?: string; ignored?: boolean } {
  if (!raw || typeof raw !== 'object') return { error: 'invalid-body' };
  const b = raw as Record<string, unknown>;

  if (text(b.website, 200)) return { ignored: true }; // honeypot

  const stage = b.stage === 'contact' || b.stage === 'final' ? b.stage : null;
  if (!stage) return { error: 'invalid-stage' };

  const zip = text(b.zip, 5);
  if (!/^\d{5}$/.test(zip)) return { error: 'invalid-zip' };

  const email = text(b.email, 120).toLowerCase();
  const name = text(b.name, 100);
  const phone = text(b.phone, 30);
  const address = text(b.address, 200);
  if (!name || !phone || !address || !/^\S+@\S+\.\S+$/.test(email)) return { error: 'missing-contact-info' };
  if (phone.replace(/\D/g, '').length < 10) return { error: 'invalid-phone' };

  const pests = Array.isArray(b.pests) ? [...new Set(b.pests.filter((p): p is string => typeof p === 'string' && p in pestLabels))].slice(0, 10) : [];

  const attribution: Record<string, string> = {};
  if (b.attribution && typeof b.attribution === 'object') {
    for (const key of ATTRIBUTION_KEYS) {
      const value = text((b.attribution as Record<string, unknown>)[key], 200);
      if (value) attribution[key] = value;
    }
  }

  return {
    lead: {
      stage,
      leadId: text(b.leadId, 64),
      zip,
      city: text(b.city, 60),
      pests,
      where: oneOf(b.where, whereLabels),
      duration: oneOf(b.duration, durationLabels),
      homeType: oneOf(b.homeType, homeTypeLabels),
      homeSize: oneOf(b.homeSize, sizeLabels),
      recommendedService: oneOf(b.recommendedService, serviceLabels),
      chosenService: oneOf(b.chosenService, serviceLabels),
      followUp: oneOf(b.followUp, followUpLabels),
      callWindow: oneOf(b.callWindow, callWindowLabels),
      name,
      phone,
      email,
      address,
      notes: text(b.notes, 1000),
      page: text(b.page, 200),
      attribution,
    },
  };
}

/** US numbers become E.164 (+1XXXXXXXXXX) so GoHighLevel can dedupe and text them. */
export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return input.startsWith('+') ? `+${digits}` : digits;
}

function splitName(full: string) {
  const parts = full.split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

/** Tags drive GoHighLevel workflows, e.g. "estimate-complete" can trigger a confirmation text. */
export function buildTags(lead: Lead) {
  const tags = ['pest-control', SOURCE_TAG, lead.stage === 'final' ? 'estimate-complete' : 'estimate-started'];
  lead.pests.forEach((p) => tags.push(`pest-${p}`));
  if (lead.chosenService) tags.push(`service-${lead.chosenService}`);
  if (lead.stage === 'final' && lead.followUp) tags.push(`followup-${lead.followUp}`);
  return tags;
}

export function buildFieldValues(lead: Lead): Partial<Record<FieldKey, string>> {
  const a = lead.attribution;
  const values: Partial<Record<FieldKey, string>> = {
    pests: lead.pests.map((p) => pestLabels[p]).join(', '),
    where: whereLabels[lead.where],
    duration: durationLabels[lead.duration],
    homeType: homeTypeLabels[lead.homeType],
    homeSize: sizeLabels[lead.homeSize],
    recommended: serviceLabels[lead.recommendedService],
    chosen: serviceLabels[lead.chosenService],
    followUp: followUpLabels[lead.followUp],
    callWindow: callWindowLabels[lead.callWindow],
    notes: lead.notes,
    leadId: lead.leadId,
    landingPage: lead.page,
    utmSource: a.utm_source,
    utmMedium: a.utm_medium,
    utmCampaign: a.utm_campaign,
    clickId: a.gclid ?? a.fbclid,
  };
  // Never send empty values, so a later stage cannot blank out what an earlier stage saved.
  return Object.fromEntries(Object.entries(values).filter(([, v]) => v)) as Partial<Record<FieldKey, string>>;
}

export function buildNote(lead: Lead) {
  const lines = [
    lead.stage === 'final' ? 'Web estimate completed (thuroexteriors.com/pest-control)' : 'Web estimate started (thuroexteriors.com/pest-control)',
    `Location: ${lead.city ? `${lead.city}, SC ` : ''}${lead.zip}`,
    `Service address: ${lead.address}`,
    lead.pests.length ? `Pests: ${lead.pests.map((p) => pestLabels[p]).join(', ')}` : '',
    lead.where ? `Where: ${whereLabels[lead.where]}` : '',
    lead.duration ? `How long: ${durationLabels[lead.duration]}` : '',
    lead.homeType || lead.homeSize ? `Home: ${[homeTypeLabels[lead.homeType], sizeLabels[lead.homeSize]].filter(Boolean).join(', ')}` : '',
    lead.recommendedService ? `Recommended: ${serviceLabels[lead.recommendedService]}` : '',
    lead.chosenService ? `Chose: ${serviceLabels[lead.chosenService]}` : '',
    lead.stage === 'final' && lead.followUp ? `Wants: ${followUpLabels[lead.followUp]}${lead.callWindow ? ` (${callWindowLabels[lead.callWindow]})` : ''}` : '',
    lead.notes ? `Customer notes: ${lead.notes}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

// Field name to GoHighLevel id, cached briefly so most requests skip the lookup.
let fieldCache: { at: number; locationId: string; ids: Map<string, string> } | null = null;
export const resetFieldCache = () => {
  fieldCache = null;
};

type ConfiguredEnv = Required<Pick<Env, 'GHL_TOKEN' | 'GHL_LOCATION_ID'>> & Env;

class Ghl {
  private env: ConfiguredEnv;
  private doFetch: FetchLike;

  constructor(env: ConfiguredEnv, doFetch: FetchLike) {
    this.env = env;
    this.doFetch = doFetch;
  }

  async call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const base = this.env.GHL_API_BASE ?? 'https://services.leadconnectorhq.com';
    const res = await this.doFetch(`${base}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.env.GHL_TOKEN}`,
        Version: '2021-07-28',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GHL ${method} ${path} -> ${res.status} ${(await res.text()).slice(0, 300)}`);
    return (await res.json()) as T;
  }

  async fieldIds() {
    if (fieldCache && fieldCache.locationId === this.env.GHL_LOCATION_ID && Date.now() - fieldCache.at < FIELD_CACHE_MS) return fieldCache.ids;
    const data = await this.call<{ customFields?: { id: string; name: string }[] }>('GET', `/locations/${this.env.GHL_LOCATION_ID}/customFields?model=contact`);
    const ids = new Map((data.customFields ?? []).map((f) => [f.name, f.id]));
    fieldCache = { at: Date.now(), locationId: this.env.GHL_LOCATION_ID, ids };
    return ids;
  }
}

function allowedOrigin(request: Request, env: Env) {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // non-browser callers (tests, curl) carry no Origin
  const allowed = new Set([new URL(request.url).origin, ...(env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean)]);
  return allowed.has(origin);
}

// Wrapped so Cloudflare's global fetch is never called as a method of another object ("Illegal invocation").
const globalFetch: FetchLike = (input, init) => fetch(input, init);

export async function handleLead(request: Request, env: Env, doFetch: FetchLike = globalFetch): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'method-not-allowed' }, 405);
  if (!allowedOrigin(request, env)) return json({ ok: false, error: 'forbidden' }, 403);
  const bodyText = await request.text();
  if (bodyText.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too-large' }, 413);
  let raw: unknown;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return json({ ok: false, error: 'invalid-json' }, 400);
  }

  const parsed = parseLead(raw);
  if (parsed.ignored) return json({ ok: true }); // bots get a quiet success
  if (!parsed.lead) return json({ ok: false, error: parsed.error }, 400);
  const lead = parsed.lead;

  if (!env.GHL_TOKEN || !env.GHL_LOCATION_ID) {
    // Preview links on *.workers.dev accept and discard requests so the flow can be demoed before
    // GoHighLevel is connected. Any real domain fails loudly instead of silently dropping leads.
    if (new URL(request.url).hostname.endsWith('.workers.dev')) {
      console.warn('GoHighLevel is not configured; discarding estimate request (preview host)');
      return json({ ok: true, dryRun: true });
    }
    console.error('Lead endpoint is not configured: set GHL_TOKEN and GHL_LOCATION_ID secrets');
    return json({ ok: false, error: 'not-configured' }, 503);
  }

  const ghl = new Ghl(env as ConfiguredEnv, doFetch);

  // Custom fields are best-effort: a missing or renamed field must never cost us the lead.
  const customFields: { id: string; key?: string; field_value: string }[] = [];
  try {
    const ids = await ghl.fieldIds();
    const values = buildFieldValues(lead);
    for (const def of fieldDefs) {
      const value = values[def.key];
      if (!value) continue;
      const id = ids.get(fieldName(def));
      if (id) customFields.push({ id, field_value: value });
      else console.warn(`Custom field not found in GoHighLevel: "${fieldName(def)}"`);
    }
  } catch (err) {
    console.error('Could not load custom fields; saving contact without them', err);
  }

  // Tags are added separately because the upsert call replaces all existing tags, which would wipe
  // the tags of someone who is already a Thuro Exteriors customer.
  const { firstName, lastName } = splitName(lead.name);
  let contactId: string;
  try {
    const result = await ghl.call<{ contact?: { id?: string }; new?: boolean }>('POST', '/contacts/upsert', {
      locationId: env.GHL_LOCATION_ID,
      firstName,
      lastName,
      email: lead.email,
      phone: normalizePhone(lead.phone),
      address1: lead.address,
      city: lead.city || undefined,
      state: 'SC',
      postalCode: lead.zip,
      country: 'US',
      customFields,
    });
    if (!result.contact?.id) throw new Error('GHL upsert returned no contact id');
    contactId = result.contact.id;
  } catch (err) {
    console.error('Contact upsert failed', err);
    return json({ ok: false, error: 'upstream' }, 502);
  }

  const steps: Promise<unknown>[] = [
    ghl.call('POST', `/contacts/${contactId}/tags`, { tags: buildTags(lead) }),
    ghl.call('POST', `/contacts/${contactId}/notes`, { body: buildNote(lead) }),
  ];
  if (lead.stage === 'contact' && env.GHL_PIPELINE_ID) {
    steps.push(
      ghl.call('POST', '/opportunities/', {
        pipelineId: env.GHL_PIPELINE_ID,
        locationId: env.GHL_LOCATION_ID,
        pipelineStageId: env.GHL_STAGE_ID || undefined,
        name: `${lead.name} - ${serviceLabels[lead.chosenService] ?? 'Pest control estimate'}`,
        status: 'open',
        contactId,
      }),
    );
  }
  (await Promise.allSettled(steps)).forEach((r) => r.status === 'rejected' && console.error('Secondary GHL step failed', r.reason));

  return json({ ok: true });
}

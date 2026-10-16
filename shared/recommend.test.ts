import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { planSummary, recommend, severityOf } from './recommend.ts';

const base = { where: '', duration: '', homeType: '' };

describe('recommend', () => {
  it('suggests the quarterly plan plus targeted treatments for general pests', () => {
    const r = recommend({ ...base, pests: ['ants', 'spiders'] });
    assert.deepEqual(r.planOptions.map((p) => p.id), ['quarterly', 'one-time']);
    assert.deepEqual(r.treatments.map((t) => t.title), ['Ant Colony & Perimeter Treatment', 'Spider & Web Treatment']);
    assert.equal(r.optionalPlan, null);
  });

  it('puts the termite inspection in as an add-on next to the plan', () => {
    const r = recommend({ ...base, pests: ['termites', 'ants'] });
    assert.deepEqual(r.treatments.map((t) => `${t.title}:${t.kind}`), ['Ant Colony & Perimeter Treatment:plan', 'Termite Inspection:addon']);
  });

  it('leads with the specific treatment, and offers the plan as optional, for add-on-only pests', () => {
    const r = recommend({ ...base, pests: ['mosquitoes'] });
    assert.equal(r.planOptions.length, 0);
    assert.equal(r.optionalPlan?.id, 'quarterly');
    assert.equal(r.treatments[0].title, 'Mosquito Yard Treatment');
  });

  it('falls back to an inspection when they are not sure', () => {
    const r = recommend({ ...base, pests: ['not-sure'] });
    assert.equal(r.treatments[0].title, 'Whole-Home Inspection');
    assert.equal(r.planOptions[0].id, 'quarterly');
  });

  it('tailors the note to location and home type', () => {
    const inside = recommend({ ...base, pests: ['cockroaches'], where: 'inside' }).treatments[0].note;
    const condo = recommend({ ...base, pests: ['cockroaches'], where: 'inside', homeType: 'townhome-condo' }).treatments[0].note;
    assert.match(inside, /kitchens, bathrooms/);
    assert.match(condo, /shared walls/);
  });

  it('scores severity from duration and location', () => {
    assert.equal(severityOf('outside', 'new'), 'light');
    assert.equal(severityOf('inside', 'new'), 'moderate');
    assert.equal(severityOf('outside', 'weeks'), 'moderate');
    assert.equal(severityOf('outside', 'months'), 'heavy');
  });

  it('writes a plain-text summary for the CRM', () => {
    const text = planSummary(recommend({ ...base, pests: ['rodents'], where: 'inside' }));
    assert.match(text, /Rodent Inspection & Exclusion \(add-on\)/);
    assert.match(text, /attic, walls, and garage/);
  });
});

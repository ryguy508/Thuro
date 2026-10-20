import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { towns } from '../src/data/towns.ts';
import { distanceMiles, nearest } from './geo.ts';

const bySlug = (slug: string) => towns.find((t) => t.slug === slug)!;
const near = (slug: string, n = 4) => nearest(bySlug(slug), towns, n).map((x) => x.place.slug);

describe('nearest towns', () => {
  it('measures a known distance sensibly (Conway to Myrtle Beach is about 13 miles as the crow flies)', () => {
    const miles = distanceMiles(bySlug('conway'), bySlug('myrtle-beach'));
    assert.ok(miles > 11 && miles < 16, `got ${miles}`);
  });

  it('never includes the current town and returns the requested count, nearest first', () => {
    for (const town of towns) {
      const result = nearest(town, towns, 4);
      assert.equal(result.length, 4);
      assert.ok(result.every((r) => r.place.slug !== town.slug));
      assert.deepEqual(result.map((r) => r.miles), [...result.map((r) => r.miles)].sort((a, b) => a - b));
    }
  });

  it('gives different neighbors for different towns', () => {
    const lists = towns.map((t) => near(t.slug).join(','));
    assert.ok(new Set(lists).size >= 10, `only ${new Set(lists).size} distinct lists`);
  });

  it('picks the geographically obvious neighbors', () => {
    assert.equal(near('pawleys-island', 1)[0], 'murrells-inlet');
    assert.equal(near('north-myrtle-beach', 1)[0], 'little-river');
    assert.ok(near('surfside-beach', 2).includes('murrells-inlet'));
    assert.ok(near('conway').includes('red-hill'));
    assert.ok(near('myrtle-beach').includes('forestbrook'));
    assert.ok(!near('pawleys-island').includes('longs'));
  });
});

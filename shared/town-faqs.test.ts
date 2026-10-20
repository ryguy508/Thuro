import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pests } from '../src/data/pests.ts';
import { towns } from '../src/data/towns.ts';
import { faqsFor } from '../src/data/town-faqs.ts';

describe('town FAQs', () => {
  it('gives every town three town-specific questions plus two shared ones', () => {
    for (const town of towns) {
      const faqs = faqsFor(town);
      assert.equal(faqs.length, 5, town.slug);
      assert.equal(faqs.filter((f) => f.pest).length, 3, `${town.slug} should have 3 pest-linked questions`);
    }
  });

  it('never repeats a town-specific question or answer across pages', () => {
    const questions = new Set<string>();
    const answers = new Set<string>();
    for (const town of towns) {
      for (const f of faqsFor(town).filter((x) => x.pest)) {
        assert.ok(!questions.has(f.q), `duplicate question: ${f.q}`);
        assert.ok(!answers.has(f.a), `duplicate answer for: ${f.q}`);
        questions.add(f.q);
        answers.add(f.a);
      }
    }
    assert.equal(questions.size, towns.length * 3);
  });

  it('links only to pest pages that exist', () => {
    const slugs = new Set(pests.map((p) => p.slug));
    for (const town of towns) for (const f of faqsFor(town)) assert.ok(!f.pest || slugs.has(f.pest), `${town.slug}: ${f.pest}`);
  });

  it('puts the town name in the shared, search-friendly questions', () => {
    for (const town of towns) {
      const [cost, licensed] = faqsFor(town).slice(3);
      assert.match(cost.q, new RegExp(town.name));
      assert.match(licensed.q, new RegExp(town.name));
    }
  });

  it('keeps answers a readable length and free of overclaims', () => {
    for (const town of towns) {
      for (const f of faqsFor(town)) {
        assert.ok(f.a.length >= 100 && f.a.length <= 520, `${town.slug}: "${f.q}" is ${f.a.length} chars`);
        assert.doesNotMatch(f.a, /#1|guarantee[sd]? (to|that)|100%|completely safe|non-toxic/i, `${town.slug}: ${f.q}`);
      }
    }
  });
});

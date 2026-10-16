import { addOnLabels, pestLabels } from './labels.ts';

// The recommendation engine behind the estimate flow. Shared by the browser (to show the plan) and the
// Worker (to record the same plan in GoHighLevel), so what the customer saw is what the team sees.

export type Severity = 'light' | 'moderate' | 'heavy';

export interface Answers {
  pests: string[];
  where: string;
  duration: string;
  homeType: string;
}

export interface Treatment {
  /** Pest slug this treatment is for ("not-sure" for the inspection-first card). */
  pest: string;
  title: string;
  /** "plan" is covered by the quarterly plan; "addon" is a separate service. */
  kind: 'plan' | 'addon';
  steps: string[];
  /** One sentence tailored to where they see the pest, how long, and their home type. */
  note: string;
}

export interface PlanOption {
  id: 'quarterly' | 'one-time';
  title: string;
  blurb: string;
  includes: string[];
}

export interface Recommendation {
  severity: Severity;
  severityNote: string;
  reason: string;
  /** Main plan choices. Empty when they only selected add-on pests (see optionalPlan). */
  planOptions: PlanOption[];
  /** Offered as an optional extra when the customer only selected add-on pests. */
  optionalPlan: PlanOption | null;
  treatments: Treatment[];
}

const quarterly: PlanOption = {
  id: 'quarterly',
  title: 'Quarterly Protection Plan',
  blurb: 'Four visits a year keep a protective barrier around your home through every season.',
  includes: ['Ants, roaches, spiders, and wasp nests', 'Perimeter and entry-point protection', 'Free re-treatment between visits'],
};

const oneTime: PlanOption = {
  id: 'one-time',
  title: 'One-Time Service',
  blurb: 'A targeted treatment for the problem you have right now.',
  includes: ['Inspection to find the source', 'Treatment matched to the pest', 'Prevention tips to keep them gone'],
};

interface Def {
  title: string;
  kind: 'plan' | 'addon';
  steps: string[];
  /** Notes by where the pest is seen. */
  inside?: string;
  outside?: string;
  both?: string;
  /** Extra note for townhomes and condos, where pests travel between units. */
  shared?: string;
}

const CATALOG: Record<string, Def> = {
  ants: {
    title: 'Ant Colony & Perimeter Treatment',
    kind: 'plan',
    steps: ['Identify the species: fire ants, carpenter ants, or house ants', 'Bait and treat to reach the colony, not just the ants you see', 'Treat the perimeter and entry points'],
    inside: 'Since they are getting inside, we will trace the trails back to their entry points.',
    outside: 'We will treat mounds and trails around your yard and foundation before they head indoors.',
    both: 'We will treat the trails inside and the colonies and entry points outside.',
    shared: 'Ants move between units in shared walls, so we focus on entry points and shared-wall areas.',
  },
  cockroaches: {
    title: 'Roach & Palmetto Bug Treatment',
    kind: 'plan',
    steps: ['Treat cracks, crevices, drains, and garages where they hide', 'Targeted bait for roaches already indoors', 'Treat the exterior to stop palmetto bugs coming in'],
    inside: 'Because you are seeing them indoors, we will focus on kitchens, bathrooms, and plumbing entry points.',
    outside: 'Palmetto bugs live in mulch and drains outside, so we will treat there before they get in.',
    both: 'We will treat the indoor hiding spots and the outdoor areas that keep feeding the problem.',
    shared: 'Roaches travel through shared walls and plumbing, so we focus on those routes.',
  },
  spiders: {
    title: 'Spider & Web Treatment',
    kind: 'plan',
    steps: ['Remove accessible webs and egg sacs', 'Treat eaves, entry points, and hiding spots', 'Cut back the insects they feed on'],
    inside: 'We will check storage areas, garages, and corners where spiders settle indoors.',
    outside: 'We will clear webs and treat eaves, porches, and light fixtures where they build.',
    both: 'We will treat outdoor nesting spots and the indoor areas they are reaching.',
  },
  'wasps-hornets': {
    title: 'Wasp & Hornet Nest Treatment',
    kind: 'plan',
    steps: ['Locate and treat accessible exterior nests', 'Remove treated nests', 'Treat favorite nesting spots to discourage new ones'],
    inside: 'Wasps inside the home often mean a nest in a wall or attic. We will locate the entry point.',
    outside: 'Please keep clear of the nest until we arrive; swatting or spraying can provoke an attack.',
    both: 'We will find the outdoor nest feeding the activity and check how they are getting inside.',
  },
  mosquitoes: {
    title: addOnLabels.mosquitoes,
    kind: 'addon',
    steps: ['Treat foliage and shaded spots where adult mosquitoes rest', 'Find and reduce standing water around the property', 'Repeat on a seasonal schedule'],
    outside: 'This is the right fix for biting outdoors, since treatment happens where they breed and rest.',
    both: 'We treat the yard where they live; we will also check what is letting them indoors.',
  },
  termites: {
    title: addOnLabels.termites,
    kind: 'addon',
    steps: ['Inspect inside, the crawl space, and the foundation', 'Give you clear written findings', 'Explain baiting and liquid-barrier options if protection is needed'],
    inside: 'Signs inside the home make this inspection a priority, because termite damage is hidden and costly.',
    outside: 'Activity outside can lead indoors, so we will check the foundation and any wood-to-soil contact.',
    both: 'Activity inside and out makes this inspection a priority.',
  },
  rodents: {
    title: addOnLabels.rodents,
    kind: 'addon',
    steps: ['Find entry points and where they are active', 'Trap and monitor until activity stops', 'Recommend sealing entry points so they stay out'],
    inside: 'Since you are hearing or seeing them indoors, we will check the attic, walls, and garage.',
    outside: 'We will look for burrows, roofline gaps, and food sources before they move in.',
    both: 'We will treat the activity inside and find how they are getting in from outside.',
    shared: 'Rodents travel along shared walls, so sealing entry points matters even more in a townhome or condo.',
  },
  'fleas-ticks': {
    title: addOnLabels['fleas-ticks'],
    kind: 'addon',
    steps: ['Treat the yard areas where pets and wildlife spend time', 'Treat indoors as needed when fleas are inside', 'Pair with vet-approved care for your pets'],
    inside: 'We will treat the areas where pets rest and where fleas settle in carpet and bedding.',
    outside: 'We will treat shaded yard areas, where ticks and fleas wait for pets.',
    both: 'We will treat the yard and the indoor areas pets use.',
  },
};

const NOT_SURE: Treatment = {
  pest: 'not-sure',
  title: 'Whole-Home Inspection',
  kind: 'plan',
  steps: ['Inspect inside, outside, and around the perimeter', 'Identify what you are dealing with', 'Recommend the right treatment before we start'],
  note: 'Not sure what it is? That is what our inspection is for.',
};

const GENERAL = ['ants', 'cockroaches', 'spiders', 'wasps-hornets'];

/** How urgent this looks, from how long it has been going on and where it is. */
export function severityOf(where: string, duration: string): Severity {
  if (duration === 'months') return 'heavy';
  if (duration === 'weeks' || where === 'inside' || where === 'both') return 'moderate';
  return 'light';
}

const SEVERITY_NOTES: Record<Severity, string> = {
  light: 'This looks like early activity, which is the easiest to stop. Steady protection keeps it from taking hold.',
  moderate: 'This is an active problem. We recommend a full initial service, then regular protection to keep it from coming back.',
  heavy: 'This has been going on for a while, so we recommend a thorough initial service first, then regular protection.',
};

function noteFor(def: Def, a: Answers) {
  const bySpot = a.where === 'inside' ? def.inside : a.where === 'outside' ? def.outside : a.where === 'both' ? def.both : '';
  const shared = a.homeType === 'townhome-condo' ? def.shared : '';
  return [bySpot, shared].filter(Boolean).join(' ');
}

function joinNames(slugs: string[]) {
  const names = slugs.map((s) => pestLabels[s]?.toLowerCase()).filter(Boolean);
  if (names.length <= 1) return names[0] ?? 'pests';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function recommend(a: Answers): Recommendation {
  const known = a.pests.filter((p) => p in CATALOG);
  const wantsGeneral = known.some((p) => GENERAL.includes(p)) || known.length === 0;
  const severity = severityOf(a.where, a.duration);

  const treatments: Treatment[] = known.map((pest) => ({ pest, title: CATALOG[pest].title, kind: CATALOG[pest].kind, steps: CATALOG[pest].steps, note: noteFor(CATALOG[pest], a) }));
  if (known.length === 0) treatments.push(NOT_SURE);
  // Plan treatments first, then add-ons, each in the order the customer picked them.
  treatments.sort((x, y) => (x.kind === y.kind ? 0 : x.kind === 'plan' ? -1 : 1));

  const generalPicked = known.filter((p) => GENERAL.includes(p));
  const reason = wantsGeneral
    ? generalPicked.length
      ? `${capitalize(joinNames(generalPicked))} keep coming back in the Myrtle Beach area, so steady protection works better than one-off fixes.`
      : 'Our inspection finds the cause first, and regular protection keeps pests from coming back.'
    : `${capitalize(joinNames(known))} need a specific treatment, so we start there instead of a general plan.`;

  return {
    severity,
    severityNote: SEVERITY_NOTES[severity],
    reason,
    planOptions: wantsGeneral ? [quarterly, oneTime] : [],
    optionalPlan: wantsGeneral ? null : quarterly,
    treatments,
  };
}

/** Plain-text version of the plan, saved in GoHighLevel so the team sees what the customer was shown. */
export function planSummary(r: Recommendation) {
  return r.treatments.map((t) => `${t.title} (${t.kind === 'plan' ? 'quarterly plan' : 'add-on'}): ${t.steps.join('; ')}.${t.note ? ` ${t.note}` : ''}`).join('\n');
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

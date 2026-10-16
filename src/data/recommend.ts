import { pests } from './pests';

export interface Answers {
  pests: string[];
  where: string;
  duration: string;
  size: string;
}

export type ServiceId = 'quarterly' | 'one-time' | 'termite' | 'rodent' | 'yard';

export interface ServiceOption {
  id: ServiceId;
  title: string;
  blurb: string;
  includes: string[];
}

export interface Recommendation {
  primary: ServiceOption;
  alternatives: ServiceOption[];
  reason: string;
  addOns: string[];
}

const GENERAL = ['ants', 'cockroaches', 'spiders', 'wasps-hornets', 'not-sure'];
const nameOf = (slug: string) => pests.find((p) => p.slug === slug)?.name.toLowerCase() ?? 'pests';

const quarterly: ServiceOption = {
  id: 'quarterly',
  title: 'Quarterly Protection Plan',
  blurb: 'Four visits a year keep a protective barrier around your home through every season.',
  includes: ['Ants, roaches, spiders, and more', 'Perimeter and entry-point protection', 'Free re-treatment between visits'],
};

const oneTime: ServiceOption = {
  id: 'one-time',
  title: 'One-Time Service',
  blurb: 'A targeted treatment for the problem you have right now.',
  includes: ['Inspection to find the source', 'Treatment matched to the pest', 'Prevention tips to keep them gone'],
};

const termite: ServiceOption = {
  id: 'termite',
  title: 'Termite Inspection & Protection',
  blurb: 'Termites hide. We inspect first, then recommend baiting or a barrier treatment.',
  includes: ['Thorough inspection of the home', 'Protection options explained clearly', 'Monitoring to catch new activity early'],
};

const rodent: ServiceOption = {
  id: 'rodent',
  title: 'Rodent Inspection & Control',
  blurb: 'We find how they are getting in, remove them, and help keep them out.',
  includes: ['Entry points and activity located', 'Trapping and monitoring', 'Sealing recommendations'],
};

function yardService(selected: string[]): ServiceOption {
  const parts = [selected.includes('mosquitoes') && 'Mosquito', selected.includes('fleas-ticks') && 'Flea & Tick'].filter(Boolean);
  return {
    id: 'yard',
    title: `${parts.join(', ')} Yard Treatment`.replace(', Flea', ' and Flea'),
    blurb: 'Targeted treatment of the areas around your home where these pests live and breed.',
    includes: ['Yard treated where pests rest and breed', 'A schedule that fits the season', 'Follow-up if they come back'],
  };
}

function listNames(slugs: string[]) {
  const names = slugs.filter((s) => s !== 'not-sure').map(nameOf);
  if (names.length === 0) return 'pests';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Suggests a service from the customer's answers. Pricing is confirmed by the team after review. */
export function recommend(a: Answers): Recommendation {
  const selected = a.pests;
  const hasGeneral = selected.length === 0 || selected.some((p) => GENERAL.includes(p));
  const wantsTermite = selected.includes('termites');
  const wantsRodent = selected.includes('rodents');
  const wantsYard = selected.includes('mosquitoes') || selected.includes('fleas-ticks');

  const addOns: string[] = [];
  if (wantsTermite) addOns.push('Termite inspection');
  if (wantsRodent) addOns.push('Rodent inspection');
  if (wantsYard) addOns.push(yardService(selected).title);

  const longRunning = a.duration === 'months';
  const indoors = a.where === 'inside' || a.where === 'both';
  const extras = [
    longRunning ? 'Since this has been going on for a while, we would start with a thorough initial visit.' : '',
    indoors ? 'We will check inside as well as around the outside of your home.' : '',
  ].filter(Boolean);

  if (hasGeneral) {
    return {
      primary: quarterly,
      alternatives: [oneTime],
      reason: [`${capitalize(listNames(selected.filter((p) => GENERAL.includes(p))))} keep coming back in the Myrtle Beach area, so steady protection works better than one-off fixes.`, ...extras].join(' '),
      addOns,
    };
  }
  if (wantsTermite) {
    return { primary: termite, alternatives: [], reason: ['Termite damage is hidden and expensive, so an inspection comes first.', ...extras].join(' '), addOns: addOns.filter((x) => x !== 'Termite inspection') };
  }
  if (wantsRodent) {
    return { primary: rodent, alternatives: [], reason: ['Rodents need their entry points found and sealed, not just removed.', ...extras].join(' '), addOns: addOns.filter((x) => x !== 'Rodent inspection') };
  }
  return { primary: yardService(selected), alternatives: [], reason: `Treating the yard cuts ${listNames(selected)} at the source.`, addOns: [] };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

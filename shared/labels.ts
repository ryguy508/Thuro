// Human-readable labels for the answers the estimate flow collects. Also the allow-lists the Worker
// validates against, so unexpected values are rejected instead of stored.
export const pestLabels: Record<string, string> = {
  ants: 'Ants',
  cockroaches: 'Roaches & Palmetto Bugs',
  spiders: 'Spiders',
  'wasps-hornets': 'Wasps & Hornets',
  mosquitoes: 'Mosquitoes',
  termites: 'Termites',
  rodents: 'Rodents',
  'fleas-ticks': 'Fleas & Ticks',
  'not-sure': 'Not sure',
};

export const whereLabels: Record<string, string> = { inside: 'Inside', outside: 'Outside', both: 'Inside and outside' };
export const durationLabels: Record<string, string> = { new: 'Just noticed', weeks: 'A few weeks', months: 'Months or more' };
export const homeTypeLabels: Record<string, string> = { house: 'House', 'townhome-condo': 'Townhome / condo', other: 'Other' };
export const sizeLabels: Record<string, string> = {
  'under-1500': 'Under 1,500 sq ft',
  '1500-2500': '1,500 to 2,500 sq ft',
  '2500-4000': '2,500 to 4,000 sq ft',
  '4000-plus': '4,000+ sq ft',
  unsure: 'Not sure',
};
export const serviceLabels: Record<string, string> = {
  quarterly: 'Quarterly Protection Plan',
  'one-time': 'One-Time Service',
  termite: 'Termite Inspection & Protection',
  rodent: 'Rodent Inspection & Control',
  yard: 'Yard Treatment (mosquito / flea & tick)',
};
export const followUpLabels: Record<string, string> = { call: 'Call me', 'reach-out': 'Reach out when you can', pay: 'Book and pay now' };
export const callWindowLabels: Record<string, string> = { asap: 'As soon as possible', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

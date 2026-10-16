export interface Pest {
  slug: string;
  name: string;
  icon: string;
  short: string;
  /** Covered by the standard quarterly plan (true) or offered as an add-on / stand-alone service (false). */
  inPlan: boolean;
  intro: string;
  signs: string[];
  approach: string[];
  tips: string[];
}

// Starting lineup based on what top South Carolina providers include in standard quarterly
// programs. Confirm the plan vs. add-on split before launch.
export const pests: Pest[] = [
  {
    slug: 'ants',
    name: 'Ants',
    icon: 'bug',
    short: 'Fire ants, carpenter ants, and the sugar ants that march into kitchens.',
    inPlan: true,
    intro:
      'Ants are the number one pest call in the Lowcountry and Grand Strand. Warm, humid weather keeps colonies active nearly all year, and one trail across the counter usually means a nest nearby.',
    signs: [
      'Trails of ants along baseboards, counters, or window sills',
      'Raised mounds of loose soil in the yard (fire ants)',
      'Sawdust-like debris near wood trim or ceilings (carpenter ants)',
    ],
    approach: [
      'Identify the species, since the right treatment depends on it',
      'Treat the perimeter and entry points where ants get in',
      'Target nests and trails instead of just spraying what you can see',
    ],
    tips: [
      'Wipe up sweet spills and store pantry items in sealed containers',
      'Trim tree limbs and shrubs so they do not touch the house',
      'Fix leaky pipes and keep mulch a few inches below the siding',
    ],
  },
  {
    slug: 'cockroaches',
    name: 'Roaches & Palmetto Bugs',
    icon: 'bug',
    short: 'Palmetto bugs and household roaches that hide in warm, damp spots.',
    inPlan: true,
    intro:
      'Palmetto bugs are large American cockroaches, and they are a fact of life in coastal South Carolina. They live outdoors in mulch and drains, then slip inside through gaps, garages, and plumbing.',
    signs: [
      'Roaches seen at night in kitchens, bathrooms, or garages',
      'Small dark droppings or an oily smell in cabinets',
      'Egg cases tucked behind appliances or in dark corners',
    ],
    approach: [
      'Inspect likely harborage areas such as drains, crawl spaces, and garages',
      'Apply targeted treatments to entry points and the perimeter',
      'Reduce the outdoor population that keeps feeding the problem',
    ],
    tips: [
      'Seal gaps around pipes, doors, and weather stripping',
      'Keep trash sealed and pet food put away overnight',
      'Fix moisture problems under sinks and in crawl spaces',
    ],
  },
  {
    slug: 'spiders',
    name: 'Spiders',
    icon: 'bug',
    short: 'Webs, egg sacs, and the occasional black widow or brown recluse.',
    inPlan: true,
    intro:
      'Most spiders are harmless, but a few, like black widows and brown recluses, are worth keeping away from your family. Spiders follow their food, so a bug problem often becomes a spider problem.',
    signs: [
      'Webs in eaves, corners, garages, and around outdoor lights',
      'Egg sacs near windows, sheds, or woodpiles',
      'Frequent sightings indoors, especially in basements and storage areas',
    ],
    approach: [
      'Remove accessible webs and egg sacs',
      'Treat eaves, entry points, and hiding spots around the structure',
      'Cut off their food supply by controlling the insects they eat',
    ],
    tips: [
      'Swap white outdoor bulbs for yellow bulbs to attract fewer insects',
      'Store boxes and firewood off the floor and away from the house',
      'Shake out gloves and shoes kept in garages or sheds',
    ],
  },
  {
    slug: 'wasps-hornets',
    name: 'Wasps & Hornets',
    icon: 'bug',
    short: 'Paper wasps, yellow jackets, and hornets nesting on your home.',
    inPlan: true,
    intro:
      'Wasps build nests under eaves, in porch ceilings, and in shrubs, often right by doors and play areas. Stings can be dangerous, especially for anyone with allergies, so nests are best handled by a professional.',
    signs: [
      'Papery nests under eaves, railings, or in shrubs',
      'Wasps flying to and from the same spot repeatedly',
      'A steady buzzing sound inside a wall or soffit',
    ],
    approach: [
      'Locate and treat accessible exterior nests',
      'Remove nests once they are treated',
      'Treat favorite nesting spots to discourage new ones',
    ],
    tips: [
      'Do not swat or spray a nest yourself, because that can provoke an attack',
      'Keep trash cans sealed and clean up sweet drinks outdoors',
      'Check eaves and porch ceilings in early spring for new nests',
    ],
  },
  {
    slug: 'mosquitoes',
    name: 'Mosquitoes',
    icon: 'droplets',
    short: 'Yard treatments that take back your patio and your evenings.',
    inPlan: false,
    intro:
      'Marsh, ponds, and warm weather mean mosquito season in the Myrtle Beach area runs long. Treating your yard reduces biting mosquitoes so you can actually use your outdoor space.',
    signs: [
      'Bites when you step outside, especially at dawn and dusk',
      'Standing water in planters, gutters, or low spots',
      'Swarms in shaded areas of the yard',
    ],
    approach: [
      'Treat the foliage and shaded areas where adult mosquitoes rest',
      'Identify and reduce standing water around the property',
      'Follow a regular schedule through the warm months',
    ],
    tips: [
      'Empty standing water weekly, including saucers, buckets, and toys',
      'Clean gutters so water does not collect',
      'Run a fan on the patio, since mosquitoes are weak fliers',
    ],
  },
  {
    slug: 'termites',
    name: 'Termites',
    icon: 'worm',
    short: 'Inspections and protection against the pest that damages homes silently.',
    inPlan: false,
    intro:
      'Termites cause billions in damage nationwide each year, and the mild, humid climate of coastal South Carolina keeps them active. Damage can go unnoticed for years, so inspections and prevention matter.',
    signs: [
      'Mud tubes on foundation walls or in crawl spaces',
      'Discarded wings near windows and doors',
      'Wood that sounds hollow or crumbles when tapped',
    ],
    approach: [
      'Start with a thorough inspection of the structure',
      'Recommend baiting or liquid barrier protection based on what we find',
      'Monitor so new activity gets caught early',
    ],
    tips: [
      'Keep wood, mulch, and soil away from direct contact with siding',
      'Fix leaks and improve drainage around the foundation',
      'Schedule a termite inspection every year',
    ],
  },
  {
    slug: 'rodents',
    name: 'Rodents',
    icon: 'rat',
    short: 'Rats and mice in attics, walls, and garages, handled for good.',
    inPlan: false,
    intro:
      'Roof rats, Norway rats, and house mice look for warmth, food, and shelter, and they can squeeze through surprisingly small gaps. Beyond the noise, rodents chew wiring and spread contamination.',
    signs: [
      'Scratching or scurrying sounds in walls or the attic',
      'Droppings, gnaw marks, or greasy rub marks along walls',
      'Chewed wiring, insulation, or food packaging',
    ],
    approach: [
      'Inspect to find entry points and activity',
      'Set up trapping and monitoring suited to the situation',
      'Recommend sealing entry points so they do not return',
    ],
    tips: [
      'Seal gaps larger than a quarter inch around pipes and vents',
      'Trim trees away from the roofline',
      'Store pet food and birdseed in sealed containers',
    ],
  },
  {
    slug: 'fleas-ticks',
    name: 'Fleas & Ticks',
    icon: 'paw-print',
    short: 'Protect your pets, your family, and your yard.',
    inPlan: false,
    intro:
      'Fleas and ticks ride in on pets and wildlife, then settle into yards and carpets. They are more than a nuisance because they can spread disease and make pets miserable.',
    signs: [
      'Pets scratching or chewing more than usual',
      'Tiny dark specks on pet bedding or furniture',
      'Ticks on pets or clothing after time outdoors',
    ],
    approach: [
      'Treat the yard areas where pets and wildlife spend time',
      'Treat indoor areas as needed when fleas are inside',
      'Pair treatments with a vet-approved plan for your pets',
    ],
    tips: [
      'Keep grass mowed and clear leaf litter near the house',
      'Wash pet bedding weekly in hot water',
      'Talk to your vet about flea and tick prevention for pets',
    ],
  },
];

export const planPests = pests.filter((p) => p.inPlan);
export const addOnPests = pests.filter((p) => !p.inPlan);

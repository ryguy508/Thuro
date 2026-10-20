import type { Town } from './towns.ts';

export interface TownFaq {
  q: string;
  a: string;
  /** Pest slug the answer is about; renders a link to that pest page. */
  pest?: string;
}

// Three questions written for each town. They differ by pest and by local conditions so town pages do not
// read as copies of each other. Review the local details (waterways, housing types) before launch.
const unique: Record<string, TownFaq[]> = {
  conway: [
    {
      q: 'How common are termites in Conway, SC?',
      pest: 'termites',
      a: 'Termites are a real concern in Conway. Older homes, mature trees, and moisture near the Waccamaw River create good conditions for subterranean termites. Spring swarms, typically March through May, are often the first sign. Our termite inspection covers the foundation, crawl space, and any wood-to-soil contact, and we explain baiting and barrier options if protection is needed.',
    },
    {
      q: 'Do you handle mosquitoes near the Waccamaw River?',
      pest: 'mosquitoes',
      a: 'Yes. Yards near the river and in low-lying areas hold standing water that mosquitoes breed in. Our mosquito yard treatment targets the shaded foliage where adults rest and helps you find standing water around the property, then repeats on a seasonal schedule.',
    },
    {
      q: 'Why do older Conway homes seem to get more pests?',
      pest: 'ants',
      a: 'Older homes tend to have more gaps around pipes, foundations, and rooflines where ants, roaches, and rodents get in. Each quarterly visit treats the perimeter and entry points, and we point out gaps worth sealing so the problem does not keep coming back.',
    },
  ],
  'myrtle-beach': [
    {
      q: 'Why are there so many palmetto bugs in Myrtle Beach?',
      pest: 'cockroaches',
      a: 'Palmetto bugs are large American cockroaches, and Myrtle Beach\'s warm, humid weather suits them nearly year-round. They live in mulch, drains, and garages, then slip inside through gaps. We treat the cracks, drains, and perimeter they use, and our quarterly plan keeps that barrier in place.',
    },
    {
      q: 'Do pests stay active in Myrtle Beach during winter?',
      pest: 'ants',
      a: 'Mild Grand Strand winters mean many pests slow down but do not disappear. Ants, roaches, and spiders can stay active, especially around warm spots in and near your home. That is why our quarterly plan runs year-round instead of only in summer.',
    },
    {
      q: 'What should I do if I see wasps on my Myrtle Beach home?',
      pest: 'wasps-hornets',
      a: 'Keep your distance and do not spray or swat the nest, since that can provoke an attack. Call us and we will locate and treat accessible exterior nests, remove them once treated, and treat favorite nesting spots to discourage new ones.',
    },
  ],
  'north-myrtle-beach': [
    {
      q: 'Do ants get into North Myrtle Beach condos and townhomes?',
      pest: 'ants',
      a: 'They do. Ants follow moisture and food along shared walls and plumbing, so one unit\'s problem can spread to the next. We focus on entry points and shared-wall areas, and treat the exterior perimeter so ants are stopped before they come inside.',
    },
    {
      q: 'Are mosquitoes worse near the Intracoastal Waterway?',
      pest: 'mosquitoes',
      a: 'Waterfront and marshy areas tend to produce more mosquitoes because they breed in standing and slow-moving water. If you are near the waterway or a pond, our mosquito yard treatment on a seasonal schedule can cut down on biting so you can use your patio again.',
    },
    {
      q: 'Is year-round pest control worth it in North Myrtle Beach?',
      pest: 'cockroaches',
      a: 'For most homes, yes. The coastal climate keeps pests active nearly all year, so one-off treatments tend to wear off as new pests move in. Our quarterly plan means four visits a year to keep a barrier around your home, with free re-treatment if pests return between visits.',
    },
  ],
  'carolina-forest': [
    {
      q: 'Do the ponds in Carolina Forest cause more mosquitoes?',
      pest: 'mosquitoes',
      a: 'Retention ponds and wooded buffers can give mosquitoes places to breed and rest. Our mosquito yard treatment focuses on the shaded foliage where adults hide and on reducing standing water, repeated on a seasonal schedule through the warm months.',
    },
    {
      q: 'Do newer Carolina Forest homes still get ants?',
      pest: 'ants',
      a: 'Yes. New construction does not keep ants out, since landscaping, mulch, and small gaps around the foundation give them easy access. We identify the species, bait to reach the colony, and treat the perimeter and entry points.',
    },
    {
      q: 'Who removes wasp nests under eaves in Carolina Forest?',
      pest: 'wasps-hornets',
      a: 'We do. Paper wasps and hornets like eaves, porches, and light fixtures. We treat accessible exterior nests, remove them once treated, and treat common nesting spots. Please keep clear of the nest until we arrive.',
    },
  ],
  socastee: [
    {
      q: 'Why are roaches a problem in Socastee?',
      pest: 'cockroaches',
      a: 'Homes near waterways and low, damp areas give roaches the moisture they love. Palmetto bugs live outside in drains and mulch, while smaller roaches settle in kitchens and bathrooms. We treat the indoor hiding spots and the exterior perimeter that keeps feeding the problem.',
    },
    {
      q: 'Does moisture near the Intracoastal affect termites in Socastee?',
      pest: 'termites',
      a: 'Damp soil and wood-to-soil contact attract termites, and homes in low-lying spots can have more moisture around the foundation. Our termite inspection checks for mud tubes, damaged wood, and moisture problems, then explains protection options if needed.',
    },
    {
      q: 'Can you treat my yard for mosquitoes in Socastee?',
      pest: 'mosquitoes',
      a: 'Yes. Our mosquito yard treatment targets the foliage and shaded areas where adults rest, helps identify standing water, and repeats on a seasonal schedule so your yard stays usable through the warm months.',
    },
  ],
  'surfside-beach': [
    {
      q: 'Why are there fire ants in my sandy Surfside Beach yard?',
      pest: 'ants',
      a: 'Fire ants build mounds in sunny, open ground, including sandy yards and lawn edges, and mounds can appear quickly after heavy rain. We identify the species, treat mounds and trails, and treat the perimeter so ants stay out of the house.',
    },
    {
      q: 'Do Surfside Beach homes get a lot of palmetto bugs?',
      pest: 'cockroaches',
      a: 'Warm, humid coastal weather keeps palmetto bugs active, and homes with garages, drains, and mulch beds give them places to live. We treat cracks, drains, and the exterior to stop them from coming in.',
    },
    {
      q: 'How do I keep spiders off my porch near the beach?',
      pest: 'spiders',
      a: 'Lights draw insects, and insects draw spiders. We remove accessible webs and egg sacs, treat eaves and entry points, and cut back the insects they feed on. Switching to yellow outdoor bulbs can also help.',
    },
  ],
  'murrells-inlet': [
    {
      q: 'Are mosquitoes worse near the Murrells Inlet marsh?',
      pest: 'mosquitoes',
      a: 'Marsh and creek frontage can produce plenty of mosquitoes. Our mosquito yard treatment targets the shaded foliage where adults rest, helps you reduce standing water, and repeats on a seasonal schedule so you can enjoy your deck and yard.',
    },
    {
      q: 'How do I keep palmetto bugs out of my Murrells Inlet home?',
      pest: 'cockroaches',
      a: 'Seal gaps around doors, pipes, and weather stripping, keep trash sealed, and fix moisture problems under sinks. We treat the cracks, drains, and perimeter where palmetto bugs hide and enter.',
    },
    {
      q: 'Do coastal homes in Murrells Inlet need regular termite inspections?',
      pest: 'termites',
      a: 'We recommend an inspection every year. Humid coastal conditions suit termites, and damage can go unnoticed for years. Our inspection checks the foundation, crawl space, and any wood-to-soil contact.',
    },
  ],
  'pawleys-island': [
    {
      q: 'Are termites a concern for older coastal homes in Pawleys Island?',
      pest: 'termites',
      a: 'They can be. Coastal humidity and moisture around foundations make termites a year-round risk, and older wood construction gives them plenty to feed on. Our termite inspection looks for mud tubes, damaged wood, and moisture problems, and we explain protection options if needed.',
    },
    {
      q: 'Which ants show up in Pawleys Island homes?',
      pest: 'ants',
      a: 'Fire ants in the yard, carpenter ants in damp wood, and small sugar-loving house ants in kitchens are the usual suspects. Treatment depends on the species, so we identify it first, then bait and treat the perimeter.',
    },
    {
      q: 'Can you control mosquitoes around marsh and creek-front properties?',
      pest: 'mosquitoes',
      a: 'Yes. Properties near marsh and creeks tend to have more mosquitoes. Our yard treatment targets the places adults rest, helps reduce standing water, and repeats on a seasonal schedule.',
    },
  ],
  'little-river': [
    {
      q: 'Do waterfront homes in Little River get more mosquitoes?',
      pest: 'mosquitoes',
      a: 'Often, yes. Standing and slow-moving water near the waterway gives mosquitoes places to breed. Our mosquito yard treatment targets where adults rest in your yard and repeats on a seasonal schedule.',
    },
    {
      q: 'Are rats a problem near docks and marinas in Little River?',
      pest: 'rodents',
      a: 'Waterfront areas can attract rats and mice looking for food and shelter. We find entry points and activity, trap and monitor, and recommend sealing gaps so they stay out. Roofline gaps and overgrown vegetation next to the house are common culprits.',
    },
    {
      q: 'Why do roaches keep coming back in Little River?',
      pest: 'cockroaches',
      a: 'Humidity and moisture keep roaches coming, and outdoor populations in drains and mulch keep feeding the problem. We treat both the indoor hiding spots and the exterior perimeter, and our quarterly plan keeps the barrier in place.',
    },
  ],
  longs: [
    {
      q: 'Do rural homes near Longs get more rodents?',
      pest: 'rodents',
      a: 'Fields, woods, and outbuildings give rats and mice plenty of cover close to the house. We find where they enter, trap and monitor, and recommend sealing gaps, along with simple tips like storing pet food and birdseed in sealed containers.',
    },
    {
      q: 'How do I handle fire ants in open lots around Longs?',
      pest: 'ants',
      a: 'Fire ants thrive in sunny, open ground, so larger lots can have many mounds. We identify the species, treat mounds and trails, and treat the perimeter to help keep them from moving toward the house.',
    },
    {
      q: 'Do wasps and hornets nest on rural properties near Longs?',
      pest: 'wasps-hornets',
      a: 'They do. Barns, sheds, eaves, and fence posts are all common nesting spots. We treat accessible exterior nests, remove them once treated, and treat favorite nesting spots to discourage new ones.',
    },
  ],
  'long-bay': [
    {
      q: 'What is the best way to stop ants in Long Bay?',
      pest: 'ants',
      a: 'The best fix targets the colony, not just the ants you see. We identify the species, bait and treat to reach the nest, and treat the perimeter and entry points. Our quarterly plan keeps that barrier in place through every season.',
    },
    {
      q: 'Do spiders get into Long Bay garages and sheds?',
      pest: 'spiders',
      a: 'Yes. Garages, sheds, and storage areas give spiders quiet places to settle. We remove accessible webs and egg sacs, treat entry points and hiding spots, and reduce the insects they feed on.',
    },
    {
      q: 'Is a termite inspection worth it for Long Bay homes?',
      pest: 'termites',
      a: 'In humid coastal South Carolina, yes. Termite damage is hidden and costly, so catching activity early matters. Our inspection checks the foundation, crawl space, and any wood-to-soil contact, with clear written findings.',
    },
  ],
  homewood: [
    {
      q: 'Do I need flea and tick control in Homewood?',
      pest: 'fleas-ticks',
      a: 'If you have pets or a wooded or grassy lot, it is worth considering. Fleas and ticks ride in on pets and wildlife, then settle into yards and carpet. We treat the yard areas where pets spend time, treat indoors when fleas are inside, and suggest pairing it with vet-approved care.',
    },
    {
      q: 'How do I keep mice and rats out of my Homewood home?',
      pest: 'rodents',
      a: 'Start by sealing gaps larger than a quarter inch around pipes and vents and trimming trees away from the roofline. We find entry points and activity, trap and monitor, and recommend what to seal so they do not come back.',
    },
    {
      q: 'Why do fire ant mounds keep returning in Homewood?',
      pest: 'ants',
      a: 'If the colony is not reached, new mounds appear. Treating only the visible mound often is not enough. We identify the species, bait and treat to reach the colony, and treat the perimeter of your home.',
    },
  ],
  forestbrook: [
    {
      q: 'What causes wasp nests in Forestbrook neighborhoods?',
      pest: 'wasps-hornets',
      a: 'Wasps look for sheltered spots such as eaves, porch ceilings, and shrubs, often right next to doors and play areas. We treat accessible exterior nests, remove them once treated, and treat favorite nesting spots to discourage new ones.',
    },
    {
      q: 'How do I keep spiders out of my Forestbrook home?',
      pest: 'spiders',
      a: 'Spiders follow their food, so controlling other insects matters. We remove accessible webs and egg sacs, treat eaves and entry points, and keep a barrier around the home with our quarterly plan.',
    },
    {
      q: 'Do ants come back after treatment in Forestbrook?',
      pest: 'ants',
      a: 'They can if the colony was not reached or entry points are still open. We bait and treat to reach the colony and treat the perimeter every quarterly visit. If ants return between visits, we re-treat at no charge.',
    },
  ],
  'red-hill': [
    {
      q: 'Are ticks a problem around Red Hill?',
      pest: 'fleas-ticks',
      a: 'Wooded areas and tall grass are where ticks wait for pets and people. We treat the shaded yard areas pets and wildlife use, and recommend keeping grass mowed and leaf litter cleared near the house.',
    },
    {
      q: 'Should I worry about termites on a wooded lot?',
      pest: 'termites',
      a: 'Wooded lots mean more wood, roots, and moisture near the foundation, which termites love. Our inspection checks wood-to-soil contact and the foundation, and we explain protection options if needed.',
    },
    {
      q: 'How do rodents get into homes near Red Hill?',
      pest: 'rodents',
      a: 'Usually through small gaps around pipes, vents, rooflines, and garage doors, helped by nearby woods that give them cover. We find entry points and activity, trap and monitor, and recommend sealing the gaps.',
    },
  ],
};

/** Town-specific questions plus two shared ones that carry the town name (good for local search). */
export function faqsFor(town: Town): TownFaq[] {
  return [
    ...(unique[town.slug] ?? []),
    {
      q: `How much does pest control cost in ${town.name}?`,
      a: 'It depends on the size of your home and yard, the pests involved, and whether you choose quarterly protection or a one-time service. Request a free estimate and we will confirm your exact price after a quick review, with no obligation.',
    },
    {
      q: `Is Thuro Pest Control licensed and insured in ${town.name}?`,
      a: `Yes. Thuro Pest Control is licensed and insured in South Carolina and serves ${town.name} and the surrounding Grand Strand communities.`,
    },
  ];
}

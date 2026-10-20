export interface Town {
  slug: string;
  name: string;
  blurb: string;
}

// Short, locally flavored intros. Expand each into unique content before launch to avoid thin location pages.
export const towns: Town[] = [
  { slug: 'myrtle-beach', name: 'Myrtle Beach', blurb: 'Warm, humid weather and a constant flow of visitors keep pests active in Myrtle Beach nearly year-round.' },
  { slug: 'north-myrtle-beach', name: 'North Myrtle Beach', blurb: 'Condos, vacation rentals, and coastal landscaping give ants, roaches, and spiders plenty of ways indoors.' },
  { slug: 'conway', name: 'Conway', blurb: 'Older homes, mature trees, and the Waccamaw River nearby make Conway a hotspot for termites, carpenter ants, and mosquitoes.' },
  { slug: 'carolina-forest', name: 'Carolina Forest', blurb: 'Wooded lots, retention ponds, and newer construction mean mosquitoes, ants, and wasps are common neighbors.' },
  { slug: 'socastee', name: 'Socastee', blurb: 'Close to the Intracoastal Waterway, Socastee homes deal with moisture-loving pests like roaches, termites, and mosquitoes.' },
  { slug: 'surfside-beach', name: 'Surfside Beach', blurb: 'Salt air, sandy soil, and tightly packed neighborhoods make steady perimeter protection worthwhile in Surfside Beach.' },
  { slug: 'murrells-inlet', name: 'Murrells Inlet', blurb: 'Marsh and creek frontage bring mosquitoes, palmetto bugs, and moisture pests to Murrells Inlet properties.' },
  { slug: 'pawleys-island', name: 'Pawleys Island', blurb: 'Coastal humidity and lush landscaping keep ants, roaches, and termites a year-round concern in Pawleys Island.' },
  { slug: 'little-river', name: 'Little River', blurb: 'Waterfront living in Little River comes with mosquitoes, ants, and moisture-driven pest pressure.' },
  { slug: 'longs', name: 'Longs', blurb: 'Rural lots and wooded edges around Longs invite rodents, wasps, fire ants, and termites.' },
  { slug: 'long-bay', name: 'Long Bay', blurb: 'Mature landscaping and coastal humidity make recurring protection a smart move for Long Bay homeowners.' },
  { slug: 'homewood', name: 'Homewood', blurb: 'Open lots and nearby woods around Homewood mean fire ants, wasps, and rodents are frequent visitors.' },
  { slug: 'forestbrook', name: 'Forestbrook', blurb: 'Established neighborhoods and wooded buffers in Forestbrook are prime territory for ants, spiders, and termites.' },
  { slug: 'red-hill', name: 'Red Hill', blurb: 'Close to the Intracoastal and wooded areas, Red Hill homes see mosquitoes, roaches, and ants through the warm months.' },
];

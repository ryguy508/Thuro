export interface Town {
  slug: string;
  name: string;
  /** Approximate town center, used to rank nearby towns by distance. */
  lat: number;
  lng: number;
  blurb: string;
}

// Short, locally flavored intros. Expand each into unique content before launch to avoid thin location pages.
export const towns: Town[] = [
  { slug: 'myrtle-beach', name: 'Myrtle Beach', lat: 33.6956, lng: -78.89, blurb: 'Warm, humid weather and a constant flow of visitors keep pests active in Myrtle Beach nearly year-round.' },
  { slug: 'north-myrtle-beach', name: 'North Myrtle Beach', lat: 33.8278, lng: -78.68, blurb: 'Condos, vacation rentals, and coastal landscaping give ants, roaches, and spiders plenty of ways indoors.' },
  { slug: 'conway', name: 'Conway', lat: 33.836, lng: -79.0478, blurb: 'Older homes, mature trees, and the Waccamaw River nearby make Conway a hotspot for termites, carpenter ants, and mosquitoes.' },
  { slug: 'carolina-forest', name: 'Carolina Forest', lat: 33.758, lng: -78.967, blurb: 'Wooded lots, retention ponds, and newer construction mean mosquitoes, ants, and wasps are common neighbors.' },
  { slug: 'socastee', name: 'Socastee', lat: 33.6909, lng: -78.9744, blurb: 'Close to the Intracoastal Waterway, Socastee homes deal with moisture-loving pests like roaches, termites, and mosquitoes.' },
  { slug: 'surfside-beach', name: 'Surfside Beach', lat: 33.606, lng: -78.9731, blurb: 'Salt air, sandy soil, and tightly packed neighborhoods make steady perimeter protection worthwhile in Surfside Beach.' },
  { slug: 'murrells-inlet', name: 'Murrells Inlet', lat: 33.5475, lng: -79.064, blurb: 'Marsh and creek frontage bring mosquitoes, palmetto bugs, and moisture pests to Murrells Inlet properties.' },
  { slug: 'pawleys-island', name: 'Pawleys Island', lat: 33.4293, lng: -79.1216, blurb: 'Coastal humidity and lush landscaping keep ants, roaches, and termites a year-round concern in Pawleys Island.' },
  { slug: 'little-river', name: 'Little River', lat: 33.8788, lng: -78.6327, blurb: 'Waterfront living in Little River comes with mosquitoes, ants, and moisture-driven pest pressure.' },
  { slug: 'longs', name: 'Longs', lat: 33.9385, lng: -78.7331, blurb: 'Rural lots and wooded edges around Longs invite rodents, wasps, fire ants, and termites.' },
  { slug: 'long-bay', name: 'Long Bay', lat: 33.746, lng: -78.8136, blurb: 'Mature landscaping and coastal humidity make recurring protection a smart move for Long Bay homeowners.' },
  { slug: 'homewood', name: 'Homewood', lat: 33.8856, lng: -79.0486, blurb: 'Open lots and nearby woods around Homewood mean fire ants, wasps, and rodents are frequent visitors.' },
  { slug: 'forestbrook', name: 'Forestbrook', lat: 33.7212, lng: -78.96, blurb: 'Established neighborhoods and wooded buffers in Forestbrook are prime territory for ants, spiders, and termites.' },
  { slug: 'red-hill', name: 'Red Hill', lat: 33.8137, lng: -79.0094, blurb: 'Close to the Intracoastal and wooded areas, Red Hill homes see mosquitoes, roaches, and ants through the warm months.' },
];

export const site = {
  name: 'Thuro Pest Control',
  parent: 'Thuro Exteriors',
  url: 'https://thuroexteriors.com',
  mainSite: 'https://thuroexteriors.com',
  phone: '(978) 608-3019',
  phoneHref: 'tel:+19786083019',
  region: 'Myrtle Beach & Horry County, SC',
  // Add the SC structural pest control license number once available; it renders in the footer.
  licenseNumber: '',
  // GoHighLevel order-form / checkout URL. While empty, the "pay now" option is hidden in the estimate flow.
  checkoutUrl: '',
};

// Every ZIP within 20 miles of Conway (29526) by centroid distance, plus the three nearby towns that are
// advertised on thuroexteriors.com but sit just outside that radius (North Myrtle Beach, Little River,
// Murrells Inlet). Maps ZIP to the town name shown to the customer.
export const serviceAreaZips: Record<string, string> = {
  '29526': 'Conway',
  '29527': 'Conway',
  '29528': 'Conway',
  '29511': 'Aynor',
  '29519': 'Centenary',
  '29544': 'Galivants Ferry',
  '29546': 'Gresham',
  '29568': 'Longs',
  '29569': 'Loris',
  '29572': 'Myrtle Beach',
  '29575': 'Myrtle Beach',
  '29577': 'Myrtle Beach',
  '29578': 'Myrtle Beach',
  '29579': 'Myrtle Beach',
  '29587': 'Myrtle Beach',
  '29588': 'Myrtle Beach',
  // Just outside 20 miles but advertised on the main site
  '29566': 'Little River',
  '29576': 'Murrells Inlet',
  '29582': 'North Myrtle Beach',
  '29597': 'North Myrtle Beach',
  '29598': 'North Myrtle Beach',
};

// Writes the Cloudflare routing files that sit next to the built site in dist/.
import { writeFileSync } from 'node:fs';

// Visitors who land on the host's root go to the pest-control home page.
writeFileSync('dist/_redirects', '/ /pest-control/ 302\n');

// Fingerprinted files never change, so browsers may keep them for a year. The workers.dev address is a
// preview: it is kept out of search engines so it cannot compete with thuroexteriors.com/pest-control.
writeFileSync(
  'dist/_headers',
  `/pest-control/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

https://:worker.:account.workers.dev/*
  X-Robots-Tag: noindex
`,
);

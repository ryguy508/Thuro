import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The site is served from a subfolder of the main domain
// (thuroexteriors.com/pest-control/) so it inherits the main site's SEO authority.
export default defineConfig({
  site: 'https://thuroexteriors.com',
  base: '/pest-control',
  trailingSlash: 'always',
  // Output lands in dist/pest-control so static hosts serve it at the same /pest-control/ path
  // it will have on thuroexteriors.com.
  outDir: './dist/pest-control',
  build: { format: 'directory' },
  integrations: [sitemap()],
});

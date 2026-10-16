import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The site is served from a subfolder of the main domain
// (thuroexteriors.com/pest-control/) so it inherits the main site's SEO authority.
export default defineConfig({
  site: 'https://thuroexteriors.com',
  base: '/pest-control',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});

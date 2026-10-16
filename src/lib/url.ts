/** Builds a link that respects the site's base path (/pest-control). */
export const u = (path = '') =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');

import { handleLead, type Env } from './lead.ts';

const LEAD_PATH = '/pest-control/api/lead';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === LEAD_PATH) return handleLead(request, env);
    if (pathname.startsWith('/pest-control/api/')) return new Response('Not found', { status: 404 });
    // Everything else is the static site. Only /pest-control/api/* reaches this Worker (see wrangler.jsonc).
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
  },
};

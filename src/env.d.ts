/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Server endpoint that receives estimate requests and forwards them to GoHighLevel. */
  readonly PUBLIC_LEAD_ENDPOINT?: string;
}

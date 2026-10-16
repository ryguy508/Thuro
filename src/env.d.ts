/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Optional override for the lead endpoint. Defaults to <base>/api/lead (the Worker route). */
  readonly PUBLIC_LEAD_ENDPOINT?: string;
}

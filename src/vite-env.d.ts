/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Shopify store origin, without trailing slash. Defaults to https://renewseoul.com. */
  readonly VITE_SHOPIFY_STORE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** SHA-256 of the private-preview PIN, set from SITE_PIN in vite.config.ts. Empty when there is no gate. */
declare const __SITE_PIN_HASH__: string;
/** Number of digits in the PIN. */
declare const __SITE_PIN_LENGTH__: number;

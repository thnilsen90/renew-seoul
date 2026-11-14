/**
 * Soft access gate for the preview deploy.
 *
 * The PIN is set at build time (SITE_PIN, see vite.config.ts) and only its hash ships to the
 * browser. This keeps casual visitors out; it is not real security, since the whole site is
 * still in the public JavaScript bundle.
 */
export const PIN_HASH = __SITE_PIN_HASH__;
export const PIN_LENGTH = __SITE_PIN_LENGTH__;
export const GATE_ENABLED = PIN_HASH !== "";

const STORAGE_KEY = "renew-seoul-access";
// Must match the prefix in vite.config.ts.
const SALT = "renew-seoul:";

/** True when there is no gate, or this browser has already entered the current PIN. */
export function hasAccess(): boolean {
  if (!GATE_ENABLED) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === PIN_HASH;
  } catch {
    return false;
  }
}

export function rememberAccess() {
  try {
    localStorage.setItem(STORAGE_KEY, PIN_HASH);
  } catch {
    // Private mode or blocked storage: the visitor just has to enter the PIN again next time.
  }
}

/** Throws when the page isn't served over https (crypto.subtle is unavailable). */
export async function checkPin(code: string): Promise<boolean> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(SALT + code));
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return hex === PIN_HASH;
}

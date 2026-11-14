import { createHash } from "node:crypto";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Private-preview PIN (see src/lib/access.ts). Read without the VITE_ prefix so the
  // plain PIN never reaches the browser; only its hash and length are baked in.
  const env = loadEnv(mode, import.meta.dirname, "");
  const pin = (env.SITE_PIN ?? "").trim();
  if (pin && !/^\d{4,8}$/.test(pin)) {
    throw new Error("SITE_PIN must be 4–8 digits.");
  }
  if (!pin && process.env.VERCEL) {
    throw new Error(
      "SITE_PIN is not set. Add it in Vercel → Project → Settings → Environment Variables; " +
        "without it the site would go live with no access screen.",
    );
  }
  // The "renew-seoul:" prefix must match SALT in src/lib/access.ts.
  const pinHash = pin ? createHash("sha256").update(`renew-seoul:${pin}`).digest("hex") : "";

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        // Keep the gated preview out of search results.
        name: "noindex-while-gated",
        transformIndexHtml: (html) =>
          pin ? html.replace("</head>", '    <meta name="robots" content="noindex, nofollow" />\n  </head>') : html,
      },
    ],
    resolve: {
      alias: { "@": `${import.meta.dirname}/src` },
    },
    define: {
      __SITE_PIN_HASH__: JSON.stringify(pinHash),
      __SITE_PIN_LENGTH__: JSON.stringify(pin.length || 4),
    },
  };
});

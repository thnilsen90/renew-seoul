# Deploy

Siden er en statisk React-app. Shopify (renewseoul.com) tar seg fortsatt av handlekurv, checkout, policy-sider og bloggen. Kassen får varene via en Shopify-handlekurvlenke (`/cart/<variant>:<antall>`).

## Velg én host

Prosjektet har oppsett for tre hoster. Når du har valgt, slett filene til de to andre.

| Host | Fil | Første deploy | Merk |
| --- | --- | --- | --- |
| Cloudflare | `wrangler.jsonc` | `npx wrangler login`, så `npm run build && npx wrangler deploy` | Gratis også for kommersiell bruk |
| Netlify | `netlify.toml` | `npx netlify-cli login`, så `npx netlify-cli deploy --build --prod` | Dra-og-slipp av `dist/` tar ikke med `netlify.toml`, bruk CLI eller Git |
| Vercel | `vercel.json` | `vercel`, så `vercel --prod` | Gratisplanen (Hobby) tillater ikke kommersielle sider; krever Pro |

`public/_headers` (cache og sikkerhetsheadere) brukes av Cloudflare og Netlify. Vercel bruker headerne i `vercel.json`.

Alle tre sender ukjente adresser (f.eks. `/routines/the-essential-routine`) til `index.html`, slik at direktelenker og reload virker.

## Miljøvariabel

| Navn | Standard | Når den må endres |
| --- | --- | --- |
| `VITE_SHOPIFY_STORE_URL` | `https://renewseoul.com` | Når Shopify flyttes til et subdomene (se under) |
| `SITE_PIN` | (tom = ingen PIN-skjerm) | Påkrevd på Vercel så lenge siden er i privat forhåndsvisning |

Settes i hostens dashboard, eller i `.env.local` lokalt (se `.env.example`). Verdiene bakes inn ved bygging, så du må bygge og deploye på nytt etter en endring.

## PIN-skjerm (midlertidig)

Når `SITE_PIN` er satt (4–8 sifre), møter besøkende en PIN-skjerm før de ser siden. Riktig PIN huskes i nettleseren til PIN-en endres. Siden får også `noindex`, så den ikke dukker opp i Google.

Dette holder tilfeldige besøkende ute, men det er ikke ekte sikkerhet: hele siden ligger fortsatt i den offentlige JavaScript-koden, og en kort PIN kan gjettes av noen som leser koden.

Første deploy på Vercel:

1. `vercel link` (logger inn og kobler mappen til et Vercel-prosjekt uten å deploye)
2. `vercel env add SITE_PIN production` og `vercel env add SITE_PIN preview` (du blir spurt om verdien)
3. `vercel --prod`

Bygget på Vercel feiler med vilje hvis `SITE_PIN` mangler, så siden ikke kan gå ut uten PIN-skjerm ved et uhell.

Når siden skal åpnes for alle: fjern `AccessGate` fra `src/App.tsx`, PIN-delen i `vite.config.ts` og `src/lib/access.ts`.

## Flytte renewseoul.com til den nye siden

Gjør dette først når den nye siden er testet på hostens egen adresse (`*.workers.dev`, `*.netlify.app` eller `*.vercel.app`).

1. I Shopify: **Settings → Domains**, legg til `shop.renewseoul.com` og gjør den til primærdomene.
2. Sett `VITE_SHOPIFY_STORE_URL=https://shop.renewseoul.com` hos hosten og deploy på nytt.
3. Legg inn videresendinger (301) hos hosten fra gamle Shopify-adresser på renewseoul.com til `shop.renewseoul.com`, så lenker fra Google og e-post ikke gir 404: `/collections/*`, `/pages/*`, `/blogs/*`, `/policies/*`, `/cart*`, `/account*`. `/products/*` trenger ingen videresending, fordi den nye siden bruker de samme produktadressene. Rutinesidene i Shopify (`/pages/the-essential-routine` osv.) bør heller sendes til `/routines/<samme slug>` på den nye siden, og de reglene må stå før `/pages/*`.
4. Pek DNS for `renewseoul.com` og `www` mot den nye hosten.
5. Test hele kjøpsflyten: legg i handlekurv, gå til checkout, se at riktige varer og antall kommer med.

## Kjent begrensning

`src/data/products.ts` er en kopi av Shopify-katalogen. Pris, lagerstatus og varianter oppdateres ikke automatisk. Hvis en variant slettes eller byttes i Shopify, feiler handlekurvlenken for den varen. Oppdater filen når katalogen endres.

# Tarn by El Mehdi

Website for a cash-flow forecasting product for small and mid-size businesses: product tour, pricing with a free-trial form,
customer stories, a journal, about, contact and legal pages. Static Astro build, hosted on Cloudflare Pages.

## Run it

```bash
npm start        # http://localhost:5335
```

Node 18+. No install step: `scripts/serve.mjs` serves `site/` the way Cloudflare Pages does (`/x` → `/x/`, the 404 page).

## Deploy (Cloudflare Pages)

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick this repo →
Framework preset **None**, Build command **empty**, Build output directory **`site`** → Save and Deploy.

`wrangler.toml` holds the same settings (`npx wrangler pages deploy` works too), and `site/_headers` sets the response
headers (noindex, nosniff, long caching for the hashed `/_astro/` files). All forms run in the browser: no server code.

## Structure

```
site/             18 pages + 404, Astro bundles, fonts, images, _headers
scripts/serve.mjs local preview
wrangler.toml     Cloudflare Pages settings
```

## Contact

El Mehdi Sekrare · [LinkedIn](https://www.linkedin.com/in/el-mehdi-sekrare-77000629b) · [GitHub](https://github.com/elmehdi-sekrare)

---

Based on the Tarn template by Visuvate.

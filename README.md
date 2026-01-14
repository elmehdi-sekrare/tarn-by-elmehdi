# Tarn by El Mehdi

Website for a cash-flow forecasting product for small and mid-size businesses: product tour, pricing with a free-trial form,
customer stories, a journal, about, contact and legal pages. Static Astro build, hosted on Cloudflare (Workers static assets).

## Run it

```bash
npm start        # http://localhost:5335
```

Node 18+. No install step: `scripts/serve.mjs` serves `site/` the way Cloudflare does (`/x` → `/x/`, the 404 page).

## Deploy (Cloudflare)

Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → pick this repo → leave the defaults
(deploy command `npx wrangler deploy`). Every push to `main` deploys again.

`wrangler.toml` serves `site/` as static assets (no Worker script): `/x` → `/x/`, `site/404.html` for missing pages, and
`site/_headers` for the response headers (noindex, nosniff, long caching for the hashed `/_astro/` files). All forms run in
the browser: no server code.

## Structure

```
site/             18 pages + 404, Astro bundles, fonts, images, _headers
scripts/serve.mjs local preview
wrangler.toml     Cloudflare settings
```

## Contact

El Mehdi Sekrare · [LinkedIn](https://www.linkedin.com/in/el-mehdi-sekrare-77000629b) · [GitHub](https://github.com/elmehdi-sekrare)

---

Based on the Tarn template by Visuvate.

# 555531.com — The Number Desk

Free phone-number intelligence, scam-call defence and a business phone desk. Concept: **555** (the famous fictional phone exchange) + **31** (the 31-day do-not-call grace period).

- Static HTML + Jekyll layouts, built natively by **GitHub Pages** (free plan, `main` branch, root).
- All internal links use `{{ site.baseurl }}`, so the site works on `https://webworksa1.github.io/555531-com/` and, unchanged, on a custom domain.
- Google AdSense loader on every page; `ads.txt` at root.
- Forms post via AJAX to FormSubmit; the destination inbox is assembled at runtime and never appears in page source.

## Custom domain
1. Point DNS for `555531.com` to GitHub Pages (A records 185.199.108.153, .109.153, .110.153, .111.153; `www` CNAME → `webworksa1.github.io`).
2. Add a `CNAME` file containing `555531.com` and set the custom domain in **Settings → Pages**. `site.baseurl` switches to empty automatically.

## Docs
- `RESEARCH.md` — number research, idea scoring, 27-site competitive audit, sources.
- `BUILD-PROMPTS.md` — phase-wise build prompts.

## Credits
libphonenumber-js (MIT, loaded from jsDelivr, pinned 1.13.16); area-code regions derived from Google libphonenumber metadata (Apache-2.0).

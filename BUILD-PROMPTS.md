# 555531.com — Phase-wise Build Prompts

Concept: **555531 — The Number Desk.** Phone-number intelligence, scam-call defence and a business-phone desk, built on "555" (the famous phone exchange) + "31" (the 31-day do-not-call window).
Stack: static HTML + Jekyll layout (GitHub Pages free plan, `main` branch), vanilla JS, no build step, no backend.
Global rules for every phase:
- AdSense loader in `<head>` on every page: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`; `ads.txt` = `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
- Top bar on every page: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linked to https://web.works/contact — the link text must never display "web.works".
- All forms post via AJAX to FormSubmit; the destination inbox is assembled at runtime from an obfuscated char array. The address never appears in HTML, text, meta or comments.
- Never use "555531" as a trademark; include the disclosure in the footer and on `trademark.html`.
- All internal URLs use `{{ site.baseurl }}` so the site works on `*.github.io/555531-com/` and on the custom domain.

---

### Phase 1 — Foundation & design system
> Create a Jekyll-compatible static repo `555531-com` with `_config.yml` (title, description, url, `plugins: [jekyll-sitemap]`, exclude md files), `_layouts/default.html`, `assets/css/style.css`, `assets/js/main.js`. Design language: "modern switchboard" — deep ink navy background, signal-amber primary, line-green success, coral warning; fonts Bricolage Grotesque (display), Inter (body), JetBrains Mono (numbers). Logo: keypad-style badge "555·31". Include skip link, sticky header with mobile burger, light/dark toggle (saved), top contact bar, footer with newsletter form, 4 link columns, trademark & ad disclosure, cookie-consent banner (Accept / Essential only) that sets Google consent mode, mobile sticky CTA bar, exit/scroll nudge for the lead magnet, reading-progress bar, scroll-reveal animations, back-to-top. Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95.

### Phase 2 — Home page
> Build `index.html`: hero with animated keypad dial ("5-5-5-5-3-1"), headline "Know who's calling. Stop who shouldn't. Get a better line.", an inline Number Inspector input that deep-links to `/inspect.html?n=`, trust stats strip (52.5B robocalls 2025, $15.9B fraud losses 2025, 31-day DNC window, 450 area codes), tool cards (Inspector, Scam Checker, 31-Day Plan, Area Codes, Fictional Numbers, Business Desk), "Why 555 + 31" story band, latest guides, a video, Scam Spotter Challenge promo, business quote lead band, FAQ accordion with FAQPage schema, newsletter CTA.

### Phase 3 — Core tools
> 3a `inspect.html`: vendor `libphonenumber-js` (max metadata). Parse any input with default-country selector; output validity, E.164, international, national, RFC3966 `tel:` link, country, line type (mobile / fixed / toll-free / premium / VoIP / shared cost / personal / pager / UAN / voicemail), NANP area-code region from `npa-data.js`, and red-flag rules (fictional 555-01XX, premium 900, Caribbean one-ring codes, invalid length, N11). Copy buttons and "check this call" handoff to the scam checker. Recent lookups saved locally.
> 3b `scam-check.html`: 12 yes/no signals with weights (urgency, payment by gift card/crypto/wire, secrecy, threats, caller asked for codes, spoofed government/bank, unknown international, voice of a relative in distress, remote-access request, prize fee, press-1 robocall, callback to unknown number) → animated gauge, verdict, tailored next steps and country-specific report links (US, Canada, UK, Australia, India).
> 3c `quiet-31.html`: DNC registration date → "telemarketers must stop by" date (+31 days), days remaining, downloadable `.ics` reminder; 31-step Quiet Line checklist with progress saved locally and printable.
> 3d `area-codes.html`: searchable/filterable table of 450 NANP codes (US, Canada, Caribbean, toll-free, premium), one-ring warning panel, deep links into the inspector.
> 3e `fictional-numbers.html`: generator for safe numbers (US/CA 555-0100–0199, UK Ofcom drama ranges by city, mobile 07700 900xxx, Ireland 020 91x xxxx) with copy-all and CSV export; usage notes for writers/devs/QA.

### Phase 4 — Business Phone Desk & lead generation
> `business.html`: VoIP savings calculator (lines, current monthly cost per line, plan price, hardware), number types (local, toll-free, vanity, porting), buyer checklist, AI-feature explainer, compliance (STIR/SHAKEN, 10DLC, TCPA). `get-quote.html`: a dedicated 3-step lead form (needs → company → contact) with progress bar, consent checkbox, honeypot, UTM capture, instant thank-you state, plus a consumer lead magnet "Free Scam-Proof Family Kit" form. Lead bands repeated on home, guides and tools.

### Phase 5 — Content engine
> `guides/index.html` + 10 original guides (900–1,400 words, sources section, Article schema): why 555; the 31-day DNC rule (US & Canada); AI voice-clone scams & family safe word; one-ring scams & Caribbean area codes; how to report scam calls (US/CA/UK/AU/IN); caller-ID spoofing & STIR/SHAKEN; SIM-swap defence; choosing a business number (local vs toll-free vs vanity); VoIP vs landline costs; fictional numbers for writers & developers. `videos.html` with verified YouTube embeds (lite-embed, privacy-enhanced). `meaning.html` — what 555531 represents.

### Phase 6 — Community & monetisation pages
> `challenge.html` (monthly Scam Spotter Challenge: quiz + entry form, prizes, leaderboard placeholder, sponsor slots) + `rules.html`. `support.html` (donation tiers 5.55 / 31 / 555.31, one-time pledge form, allocation: operations, promotion & marketing, hiring, contest prizes). `careers.html` (open roles + talent-pool form). `advertise.html` (audience, placements, sponsorship packages, inquiry form).

### Phase 7 — Trust, compliance & AdSense readiness
> `about.html`, `contact.html`, `editorial-policy.html`, `privacy.html` (AdSense/DoubleClick cookie wording, opt-out links, GDPR/CCPA/PIPEDA rights), `cookies.html`, `terms.html`, `disclaimer.html`, `trademark.html`, `404.html`, `robots.txt`, `ads.txt`, `site.webmanifest`, OG image & favicon, JSON-LD (WebSite, Organization, FAQPage, Article, HowTo). No thin pages, no ad-like placeholders, clear navigation, original content on every URL.

### Phase 8 — QA & launch
> Validate all internal links, check the inbox never appears in any file, run tools with sample numbers (+1 212 555 0123, +44 7700 900123, +1 876 xxx, +1 900 xxx), test 360px/768px/1280px layouts, dark/light, keyboard navigation. Push to `webworksa1/555531-com` on `main`, enable GitHub Pages (main / root), confirm the live URL, then submit to AdSense and Google Search Console. When DNS for 555531.com points to GitHub Pages, add `CNAME` and set the custom domain in Pages settings.

### Phase 9 — Growth (post-launch)
> Monthly "Robocall Pulse" post, area-code landing pages (one per code, generated from the dataset), UGC number reports (moderated), affiliate partnerships with call-blocking apps and VoIP vendors, newsletter automation, Spanish/French versions.

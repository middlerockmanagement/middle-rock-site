# QA Report — Middle Rock Management website

Prepared for the initial build. Covers structure, accessibility, responsiveness, links,
performance posture, motion, and a safe go-live (DNS) checklist.

## Summary

The site is a five-page static build (Home, The Middle Rocks, About, Contact, 404) generated
from two data files. Automated structural checks pass; the items below marked **manual** should
be eyeballed in a browser before sharing widely, and the go-live/DNS section must be done
carefully when Amanda is ready to move the domain.

---

## Automated checks — passing

| Check | Result |
|---|---|
| All pages return HTTP 200 on a local server | ✅ 5/5 |
| All local CSS/JS/asset/data references resolve | ✅ 24/24, no 404s |
| Exactly one `<h1>` per page | ✅ 5/5 |
| No skipped heading levels (h1→h2→h3) | ✅ |
| Every `<img>` has an `alt` attribute | ✅ 25/25 |
| Every `target="_blank"` link has `rel="noopener noreferrer"` | ✅ |
| `lang`, skip link, `<main>` landmark present on every page | ✅ |
| Roster renders from data (10 clients, 6 featured on home) | ✅ |
| Team renders from data (2 members) | ✅ |
| Discipline filter buttons generated (All + 10 disciplines) | ✅ |
| Works with JavaScript disabled (content + nav still available) | ✅ by design |

## Accessibility (target: WCAG 2.2 AA)

- Semantic landmarks: `header`, `nav` (labelled), `main`, `footer`.
- Keyboard: skip-link to content; visible focus outlines on all interactive elements; mobile
  menu closes on `Esc`; filter is real `<button>`s with `aria-pressed`.
- Color: monochrome palette with charcoal `#2b2724` body text on warm paper `#f6f4ef`
  (comfortably above AA contrast). Footer uses light text on near-black.
- Motion: all animation is opacity/underline/translate only and is fully disabled under
  `prefers-reduced-motion`.
- Body text ≥ 16px on mobile (fluid type floors at 1rem).
- Information is never conveyed by color/hover alone; the roster filter also announces results
  via a visually-hidden live region.
- **Manual:** run Lighthouse (Chrome DevTools → Lighthouse) once deployed to confirm 95+ across
  Performance / Accessibility / Best Practices / SEO. Nothing in the build should block this.

## Responsiveness — **manual spot-check recommended**

Layout uses fluid `clamp()` type and auto-fitting grids, and `overflow-x: hidden` guards
against sideways scroll. Please eyeball these widths in DevTools' device toolbar:
**320, 375, 390, 768, 1024, 1280, 1440**, and ultrawide.
- Confirm: no horizontal scrollbar; roster cards stay readable; the mobile menu opens/closes;
  hero and headings scale smoothly.

## Links — **manual confirm before launch**

External roster links were seeded from the current live site. Before go-live, click each and
confirm it opens the correct profile (IMDb, personal sites). Current external targets:
Carlo Nicdao, Cassi Jerkins, Lauren Astore, Nathaniel Shriver, Tiff Campbell, Tommy Schneiders
(IMDb); Jake Carr (jaketreks.com); Pam & Lindsay (pamandlindsay.com). Nathaniel Seybold and
Philip Asta currently have no external link on the live site — none is shown (hidden cleanly).

## Forms

No contact form is included (per the approved simplest version): direct `mailto:` link plus
social links. The unsolicited-submissions policy is stated on the Contact page and in the
contact bands. If Amanda later wants a business-inquiry form, add validation, a honeypot, rate
limiting, and a serverless handler before shipping it.

## Performance posture

- Zero third-party requests, zero web fonts to download (system font stack), ~4 KB of JS.
- All images have explicit `width`/`height` (no layout shift); below-the-fold images use
  `loading="lazy"`.
- Long-cache headers for `/assets/*` set in `vercel.json`.
- **Manual:** run Lighthouse after deploy to confirm Core Web Vitals pass.

## Reduced motion

Verified in CSS: `@media (prefers-reduced-motion: reduce)` removes reveal animations, smooth
scroll, and hover transforms. Content is shown immediately.

---

## Safe go-live / DNS checklist (do only when Amanda approves the domain move)

> Her email lives on `middlerockmanagement.com`. A careless DNS change can break it. Go slow.

1. [ ] Site reviewed and approved on the free `*.vercel.app` preview URL.
2. [ ] Identify the registrar / DNS provider and current email provider.
3. [ ] **Export and save every existing DNS record**, especially `MX`, `SPF` (TXT), `DKIM`,
       `DMARC`. Keep a copy.
4. [ ] In Vercel → Settings → Domains, add `middlerockmanagement.com` and the `www` variant.
5. [ ] Add **only** the records Vercel specifies. **Do not modify or remove the mail records.**
6. [ ] Pick one canonical host (recommend `www`, matching the current site) and redirect the
       other.
7. [ ] Confirm the site loads on the real domain and SSL is active.
8. [ ] Confirm the legacy redirects work: `/contact-us` → `/contact/`,
       `/our-creatives` → `/the-middle-rocks/`.
9. [ ] Send and receive a test email to/from `info@middlerockmanagement.com`.
10. [ ] Only after all the above: downgrade/cancel Squarespace, with Amanda's OK and mindful of
        her billing cycle.

#!/usr/bin/env node
/* =============================================================
   Middle Rock Management - build.js
   Zero-dependency generator. Reads data/clients.json and
   data/team.json and writes the roster + team markup DIRECTLY
   into the HTML files, between comment markers like:
       <!-- ROSTER:START -->  ...generated...  <!-- ROSTER:END -->
   This keeps a single, obvious edit surface (the JSON files)
   while shipping real HTML that works with JavaScript disabled.

   USAGE:  node build.js
   Requires only Node.js (no npm install).
   ============================================================= */

const fs = require("fs");
const path = require("path");

/* =============================================================
   SITE OPTIONS - flip a value, then run:  node build.js
   ------------------------------------------------------------
   showHomeRoster:
     false = the homepage does NOT show a "Selected roster"
             preview (recommended - avoids implying some clients
             matter more). The full roster page is unaffected.
     true  = show a preview of up to 6 featured clients on the
             homepage. Choose which appear by setting
             "featured": true on those clients in data/clients.json.
   ============================================================= */
const OPTIONS = {
  showHomeRoster: false,
};

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const readJSON = (p) => JSON.parse(read(p));

/* --------------------------- helpers --------------------------- */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function attr(str) { return esc(str).replace(/'/g, "&#39;"); }
const has = (v) => v !== null && v !== undefined && String(v).trim() !== "";
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function disciplineTokens(disciplines) {
  return (disciplines || []).map(slugify).join(" ");
}
function disciplineText(disciplines) {
  return (disciplines || [])
    .map((d) => esc(d))
    .join(' <span class="sep" aria-hidden="true">/</span> ');
}

/* ----------------------- roster card --------------------------- */
function rosterCard(c) {
  const pid = "rc-" + attr(c.id);
  const alt = attr(c.imageAlt || ("Portrait of " + c.name));
  const lines = [];
  lines.push(`        <article class="card" data-disciplines="${attr(disciplineTokens(c.disciplines))}">`);
  // Summary (thumbnail + name + professions): the accordion tab on mobile;
  // on desktop the thumbnail/chevron hide and this becomes the card's caption.
  lines.push(`          <h3 class="card__head">`);
  lines.push(`            <button class="card__summary" type="button" aria-expanded="true" aria-controls="${pid}">`);
  lines.push(`              <span class="card__thumb img-mono" aria-hidden="true"><img src="${attr(c.image)}" alt="" width="128" height="160" loading="lazy" decoding="async"></span>`);
  lines.push(`              <span class="card__id">`);
  lines.push(`                <span class="card__name">${esc(c.name)}</span>`);
  if (has(c.disciplines && c.disciplines.length)) {
    lines.push(`                <span class="card__disciplines">${disciplineText(c.disciplines)}</span>`);
  }
  lines.push(`              </span>`);
  lines.push(`              <span class="card__chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>`);
  lines.push(`            </button>`);
  lines.push(`          </h3>`);
  // Detail (full portrait + links): collapsed on mobile via main.js; always shown on desktop / without JS.
  lines.push(`          <div class="card__detail" id="${pid}">`);
  lines.push(`            <div class="card__media">`);
  lines.push(`              <div class="img-window ratio-4-5 img-mono">`);
  lines.push(`                <img src="${attr(c.image)}" alt="${alt}" width="640" height="800" loading="lazy" decoding="async">`);
  lines.push(`              </div>`);
  lines.push(`            </div>`);
  if (has(c.bio)) lines.push(`            <p class="card__bio">${esc(c.bio)}</p>`);
  const links = [];
  if (has(c.primaryUrl)) links.push([c.primaryUrl, c.primaryLabel || "Profile"]);
  if (has(c.secondaryUrl)) links.push([c.secondaryUrl, c.secondaryLabel || "More"]);
  if (links.length) {
    lines.push(`            <div class="card__links">`);
    for (const [url, label] of links) {
      lines.push(`              <a class="card__link" href="${attr(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span class="arrow" aria-hidden="true">&#8599;</span><span class="visually-hidden"> (opens in a new tab)</span></a>`);
    }
    lines.push(`            </div>`);
  }
  if (has(c.status)) lines.push(`            <span class="card__status">${esc(c.status)}</span>`);
  lines.push(`          </div>`);
  lines.push(`        </article>`);
  return lines.join("\n");
}

/* ----------------------- team member --------------------------- */
function teamMember(m) {
  const pid = "tm-" + attr(m.id);
  const alt = attr(m.imageAlt || ("Portrait of " + m.name));
  const lines = [];
  lines.push(`        <article class="team-member" id="${attr(m.id)}" data-team-member>`);
  // Summary row (thumbnail + name/role). On mobile it's the accordion tab;
  // on desktop the thumbnail + chevron are hidden and the name/role sit in the card.
  lines.push(`          <h3 class="team-member__head">`);
  lines.push(`            <button class="team-member__summary" type="button" aria-expanded="true" aria-controls="${pid}">`);
  lines.push(`              <span class="team-member__thumb img-mono" aria-hidden="true"><img src="${attr(m.image)}" alt="" width="140" height="176" loading="lazy" decoding="async"></span>`);
  lines.push(`              <span class="team-member__id">`);
  lines.push(`                <span class="team-member__name">${esc(m.name)}</span>`);
  if (has(m.role)) lines.push(`                <span class="team-member__role">${esc(m.role)}</span>`);
  lines.push(`              </span>`);
  lines.push(`              <span class="team-member__chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>`);
  lines.push(`            </button>`);
  lines.push(`          </h3>`);
  // Detail (full portrait + bio). Collapsed on mobile via main.js; always shown on desktop / without JS.
  lines.push(`          <div class="team-member__detail" id="${pid}">`);
  lines.push(`            <div class="team-member__media">`);
  lines.push(`              <div class="img-window ratio-3-4 img-mono">`);
  lines.push(`                <img src="${attr(m.image)}" alt="${alt}" width="600" height="800" loading="lazy" decoding="async">`);
  lines.push(`              </div>`);
  if (has(m.photoCredit)) lines.push(`              <p class="team-member__credit">Photography by ${esc(m.photoCredit)}</p>`);
  lines.push(`            </div>`);
  lines.push(`            <div class="team-member__copy">`);
  if (has(m.bio)) lines.push(`              <p class="team-member__bio">${esc(m.bio)}</p>`);
  lines.push(`            </div>`);
  lines.push(`          </div>`);
  lines.push(`        </article>`);
  return lines.join("\n");
}

/* --------------------- mini member (home) ---------------------- */
function miniMember(m) {
  // Homepage preview: portrait + name + title only. Full bios live on /about/.
  const lines = [];
  lines.push(`        <article class="mini-member">`);
  lines.push(`          <div class="img-window ratio-4-5 img-mono mini-member__media">`);
  lines.push(`            <img src="${attr(m.image)}" alt="${attr(m.imageAlt || ("Portrait of " + m.name))}" width="640" height="800" loading="lazy" decoding="async">`);
  lines.push(`          </div>`);
  lines.push(`          <h3 class="mini-member__name">${esc(m.name)}</h3>`);
  if (has(m.role)) lines.push(`          <p class="mini-member__role">${esc(m.role)}</p>`);
  lines.push(`        </article>`);
  return lines.join("\n");
}

/* ----------------------- filter buttons ------------------------ */
function filterButtons(clients) {
  // Discipline <option>s for the roster filter dropdown.
  const set = new Map();
  for (const c of clients) for (const d of (c.disciplines || [])) set.set(slugify(d), d);
  const items = [...set.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const out = [`          <option value="all">All professions</option>`];
  for (const [token, label] of items) {
    out.push(`          <option value="${attr(token)}">${esc(label)}</option>`);
  }
  return out.join("\n");
}

/* ------------- home "Selected roster" section (optional) ------- */
function homeRosterSection(featured) {
  if (!OPTIONS.showHomeRoster) return ""; // toggled off - render nothing
  const cards = featured.map((c) => rosterCard(c)).join("\n");
  return `    <section class="section container container--wide" aria-labelledby="roster-title">
      <div class="section-head">
        <h2 class="section-head__title" id="roster-title">Selected roster</h2>
        <a class="link-underline" href="/the-middle-rocks/">View the full roster &rarr;</a>
      </div>
      <div class="roster-grid" data-reveal>
${cards}
      </div>
    </section>`;
}

/* --------------------- site chrome (nav/footer) ---------------- */
const SITE = {
  // Email is split so the raw address never appears in the HTML (spam harvesters
  // scrape mailto:/text). js/main.js reassembles it into a mailto: on click.
  emailUser: "info",
  emailDomain: "middlerockmanagement.com",
  linkedin: "https://www.linkedin.com/company/middle-rock-management",
  instagram: "https://www.instagram.com/middlerockmgmt/",
  logo: "/assets/brand/middle-rock-management-logo.webp",
  nav: [
    { href: "/the-middle-rocks/", label: "The Middle Rocks", key: "rocks" },
    { href: "/about/", label: "About", key: "about" },
    { href: "/contact/", label: "Contact", key: "contact" },
  ],
};

const ICON_LINKEDIN = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>`;
const ICON_INSTAGRAM = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>`;

function navLinks(activeKey) {
  return SITE.nav
    .map((n) => {
      const cur = n.key === activeKey ? ' aria-current="page"' : "";
      return `            <li><a class="nav__link" href="${n.href}"${cur}>${esc(n.label)}</a></li>`;
    })
    .join("\n");
}

function header(activeKey) {
  return `      <a class="skip-link" href="#main">Skip to content</a>
      <header class="site-header" data-header>
        <div class="container container--wide site-header__inner">
          <a class="masthead-brand" href="/" aria-label="Middle Rock Management home">
            <img class="brand__logo" src="${SITE.logo}" alt="Middle Rock Management" width="1141" height="1014">
            <span class="brand__descriptor">Boutique entertainment management</span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu" data-nav-toggle>
            <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          <nav class="nav" id="primary-nav" aria-label="Primary" data-nav>
            <ul class="nav__list">
${navLinks(activeKey)}
            </ul>
            <div class="nav__socials">
              <a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Middle Rock Management on LinkedIn">${ICON_LINKEDIN}</a>
              <a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Middle Rock Management on Instagram">${ICON_INSTAGRAM}</a>
            </div>
          </nav>
        </div>
      </header>`;
}

function footer() {
  return `      <div class="container container--wide footer__inner">

        <div class="footer__cta">
          <div class="footer__cta-text">
            <p class="eyebrow footer__cta-eyebrow">Get in touch</p>
            <a class="footer__email" data-e-user="${SITE.emailUser}" data-e-domain="${SITE.emailDomain}" href="/contact/">Email us <span class="footer__email-arrow" aria-hidden="true">&rarr;</span></a>
            <p class="footer__policy"><strong>We are not currently accepting unsolicited submissions.</strong> Any unsolicited material sent via email or form will be deleted.</p>
          </div>
        </div>

        <div class="footer-grid">
          <div class="footer-nav">
          <nav class="footer__col" aria-label="Explore">
            <h2>Explore</h2>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/the-middle-rocks/">The Middle Rocks</a></li>
              <li><a href="/about/">About</a></li>
              <li><a href="/contact/">Contact</a></li>
            </ul>
          </nav>
          <div class="footer__col">
            <h2>Connect</h2>
            <div class="footer__socials">
              <a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Middle Rock Management on LinkedIn">${ICON_LINKEDIN}</a>
              <a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Middle Rock Management on Instagram">${ICON_INSTAGRAM}</a>
            </div>
          </div>
          </div>
          <a class="footer__logo-link" href="/" aria-label="Middle Rock Management home">
            <img class="footer__logo" src="/assets/brand/middle-rock-management-logo-light.webp" alt="Middle Rock Management" width="1141" height="1014">
          </a>
        </div>

        <div class="footer__legal">
          <!-- [APPROVAL REQUIRED] Placeholder legal text - please have Amanda / counsel review before launch. -->
          <p>Middle Rock Management does not accept or review unsolicited submissions. Any unsolicited materials sent by email or through this website will not be read, returned, or considered, and may be deleted.</p>
          <p>All third-party names, logos, and trademarks are the property of their respective owners and are used for identification purposes only. No affiliation or endorsement is implied.</p>
          <p>This website is provided for general informational purposes only and does not constitute an offer of representation or professional advice.</p>
        </div>

        <div class="footer__bottom">
          <p>&copy; <span data-year>2026</span> Middle Rock Management. All rights reserved.</p>
        </div>
      </div>

      <button class="to-top" type="button" data-to-top aria-label="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>
      </button>`;
}

/* ------------------------- injector ---------------------------- */
function inject(file, marker, content) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, "utf8");
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(html)) {
    console.warn(`  ! marker ${marker} not found in ${file} - skipped`);
    return false;
  }
  html = html.replace(re, `${start}\n${content}\n        ${end}`);
  fs.writeFileSync(filePath, html);
  return true;
}

/* --------------------------- run ------------------------------- */
function main() {
  const clientsData = readJSON("data/clients.json");
  const clients = clientsData.clients
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const team = readJSON("data/team.json").team
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Keep profession labels basic: warn if a client uses one that isn't in the
  // canonical "professions" list (the queue). Filter options are still derived
  // from clients, so a profession only appears once someone actually has it.
  const canon = new Set((clientsData.professions || []).map(slugify));
  if (canon.size) {
    for (const c of clients)
      for (const d of (c.disciplines || []))
        if (!canon.has(slugify(d)))
          console.warn(`  ! non-canonical profession "${d}" on ${c.name} — add it to data/clients.json "professions" or boil it down.`);
  }

  const featured = clients.filter((c) => c.featured).slice(0, 6);

  // Site chrome (header + footer) injected into every page for a single source of truth.
  const pages = [
    ["index.html", "home"],
    ["the-middle-rocks/index.html", "rocks"],
    ["about/index.html", "about"],
    ["contact/index.html", "contact"],
    ["404.html", ""],
  ];

  const jobs = [];
  for (const [file, key] of pages) {
    jobs.push([file, "HEADER", header(key)]);
    jobs.push([file, "FOOTER", footer()]);
  }

  // Data-driven content.
  jobs.push(
    ["the-middle-rocks/index.html", "ROSTER", clients.map((c) => rosterCard(c, "h3")).join("\n")],
    ["the-middle-rocks/index.html", "FILTER", filterButtons(clients)],
    ["index.html", "HOME_ROSTER", homeRosterSection(featured)],
    ["index.html", "TEAM_PREVIEW", team.map((m) => miniMember(m)).join("\n")],
    ["about/index.html", "TEAM", team.map((m) => teamMember(m)).join("\n")]
  );

  let ok = 0;
  for (const [file, marker, content] of jobs) {
    if (inject(file, marker, content)) {
      console.log(`  ✓ ${marker} → ${file}`);
      ok++;
    }
  }
  console.log(`\nBuilt ${ok}/${jobs.length} sections from data/. ` +
    `${clients.length} clients, ${team.length} team members.`);
}

main();

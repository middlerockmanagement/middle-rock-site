# Middle Rock Management — website

A lightweight, hand-built static website for Middle Rock Management. No framework, no
database, no page builder — just HTML, CSS, and a little vanilla JavaScript. It is designed
so you (Kris) can update the roster and team without touching the layout, and deploy with a
single `git push`.

**Brand note:** this build preserves Middle Rock's existing logo, monochrome identity, voice,
and public facts. It is a respectful evolution of Amanda's brand — not a rebrand.

---

## 1. What's in the box

```
middle-rock-site/
├─ index.html                  Home
├─ the-middle-rocks/index.html The full roster
├─ about/index.html            About / Our Team
├─ contact/index.html          Contact
├─ 404.html                    Branded "not found" page
├─ data/
│  ├─ clients.json             ← EDIT THIS to change the roster
│  └─ team.json                ← EDIT THIS to change the team
├─ build.js                    Turns the JSON above into the HTML (run: node build.js)
├─ css/
│  ├─ base.css                 Design tokens (colors, type, spacing) + resets
│  ├─ components.css           Header, footer, cards, buttons
│  └─ pages.css                Page-specific layout
├─ js/main.js                  Menu, subtle animations, roster filter (optional polish)
├─ assets/
│  ├─ brand/                   Logo, favicons, social image
│  └─ images/placeholders/     Portrait placeholders (see that folder's README)
├─ robots.txt, sitemap.xml, site.webmanifest, vercel.json
└─ README.md                   You are here
```

The two files you'll touch most are **`data/clients.json`** and **`data/team.json`**.
Everything visible on the roster and team sections is generated from them.

---

## 2. Preview it on your computer

You need a local web server (opening the HTML files directly won't load the `/css` and
`/assets` paths correctly). Two easy options — pick one:

**Option A — VS Code "Live Server" extension (easiest)**
1. In VS Code, open the Extensions panel and install **Live Server** (by Ritwick Dey).
2. Right-click `index.html` → **Open with Live Server**.
3. Your browser opens the site. It auto-refreshes when you save a file.

**Option B — one command in the VS Code terminal**
```bash
npx serve
```
Then open the URL it prints (usually http://localhost:3000). (Requires Node.js, which you
already have.)

---

## 3. Update the roster (the thing you'll do most)

All clients live in **`data/clients.json`** as a list of objects. To add a client, copy an
existing block and edit the fields:

```json
{
  "id": "jane-doe",
  "name": "Jane Doe",
  "disciplines": ["Screenwriter", "Producer"],
  "image": "/assets/images/placeholders/jane-doe.svg",
  "imageAlt": "Portrait of Jane Doe",
  "primaryUrl": "https://www.imdb.com/name/nm0000000/",
  "primaryLabel": "IMDb",
  "secondaryUrl": null,
  "secondaryLabel": null,
  "bio": null,
  "status": null,
  "featured": true,
  "order": 110
}
```

Field guide:

| Field | What it does |
|---|---|
| `id` | Unique slug (lowercase-with-dashes). Used for the image filename. |
| `name` | Displayed name. |
| `disciplines` | List of roles, e.g. `["Author"]`. Shown under the name and used by the filter. |
| `image` / `imageAlt` | Path to the portrait and its alt text. |
| `primaryUrl` / `primaryLabel` | Main external link (opens in a new tab). Set `null` to hide. |
| `secondaryUrl` / `secondaryLabel` | Optional second link. |
| `bio` | Optional short biography. `null` to hide. |
| `status` | Optional label, e.g. `"On submission"`. `null` to hide. |
| `featured` | `true` shows the client in the homepage preview (first 6 featured). |
| `order` | Lower numbers appear first. Leave gaps (10, 20, 30…) so you can insert later. |

**Any field set to `null` simply disappears** — no empty gaps, no broken layout.

### After editing the JSON — rebuild
Run this once in the VS Code terminal:
```bash
node build.js
```
This rewrites the roster/team sections inside the HTML files. Refresh the preview to see it.
(You never edit the roster inside the HTML by hand — always edit the JSON and rebuild.)

To **remove** a client, delete their object. To **reorder**, change the `order` numbers.

---

## 3b. Homepage options (show/hide the "Selected roster")

The homepage can optionally show a small preview of a few clients ("Selected roster").
It's **off by default** — a boutique roster generally shouldn't imply some clients matter
more than others. To turn it on or off, open **`build.js`** and edit the flag near the top:

```js
const OPTIONS = {
  showHomeRoster: false,   // false = hidden (default);  true = show the preview
};
```

Save, run `node build.js`, refresh. When it's on, it shows up to 6 clients that have
`"featured": true` in `data/clients.json`. The full roster page (The Middle Rocks) is never
affected by this switch.

## 4. Update the team

Same idea, in **`data/team.json`**. Then run `node build.js`. Bios are shown verbatim, so
edit them exactly as you want them to read.

---

## 5. Replace a placeholder image with a real photo

Portraits currently use neutral SVG placeholders sized **4:5** (clients) and **3:4** (team).
To drop in a real photo without breaking the layout:

1. Crop/export the photo to the same shape (e.g. 640×800 for a client, 600×800 for team).
   Save it as an optimized **`.webp`** or **`.jpg`**.
2. Put it in `assets/images/placeholders/` (or anywhere under `assets/images/`).
3. In the client/team JSON, change the `image` path to your new file, e.g.
   `"/assets/images/placeholders/jane-doe.webp"`, and update `imageAlt`.
4. Run `node build.js`, preview, done.

Keeping the same shape means the page never shifts. See
`assets/images/placeholders/README.md` for the full list of images still needed and their
recommended dimensions.

---

## 6. Deploy — GitHub + Vercel

Your repo: **https://github.com/kshumanproof/middle-rock-gift**

> This is a plain static site, so it deploys to **any** static host the same way —
> **Cloudflare Pages, Netlify, Vercel, or GitHub Pages.** The steps below use Vercel as the
> example; connecting the same repo to another host is nearly identical. See **Section 10** for
> why switching hosts (or handing the whole thing to another developer) is straightforward.

### First-time setup — mostly done for you
The repo is **already initialized**: there's one commit with every file, `origin` is set to your
GitHub repo, and the branch is `main`. You do **not** need to run `git init` / `git remote add`
again. All that's left is to push once (which needs your GitHub login).

**Prerequisite:** Git must be installed on Windows so VS Code can use it. Check with
`git --version` in the VS Code terminal; if it errors, install "Git for Windows" from
https://git-scm.com/download/win (accept the defaults — it includes the login helper).

**Push, one time**, from the project folder in the VS Code terminal:
```bash
git push -u origin main
```
A browser window opens to sign in to GitHub — approve it, and the push completes.

- *Prefer clicking?* Open this folder in VS Code, open the **Source Control** panel
  (Ctrl+Shift+G), and click **Sync Changes** (or **Publish Branch**). It signs you in the same way.
- *If push is rejected* with "updates were rejected" / "non-fast-forward", the GitHub repo
  already has a file in it (e.g. a README made at creation). Run this once, then push again:
  ```bash
  git pull origin main --allow-unrelated-histories --no-edit
  git push -u origin main
  ```

Then connect it to Vercel:
1. Go to **vercel.com** and sign in with GitHub.
2. **Add New… → Project**, and import `kshumanproof/middle-rock-gift`.
3. Framework preset: **Other** (it's a plain static site). Leave build settings empty.
4. Click **Deploy**. In ~30 seconds you get a live preview URL like
   `middle-rock-gift.vercel.app` — that's the link you can share with Amanda.

### Every update after that
```bash
node build.js          # only if you changed data/*.json
git add .
git commit -m "Describe what changed"
git push
```
Vercel automatically redeploys on every push. Each push also gets its own preview URL, so you
can review before anything reaches production.

### Rolling back
In the Vercel dashboard → your project → **Deployments**, click any earlier deployment and
choose **Promote to Production**. Instant rollback.

---

## 7. Going live on the real domain (do this carefully, later)

This only matters when Amanda is ready to move `middlerockmanagement.com` off Squarespace.
**Do not rush this — her email runs on that domain.**

- The site currently lives happily on the free `*.vercel.app` URL. Amanda can review it there
  for as long as she likes.
- Before changing any DNS: write down every existing DNS record (especially **MX, SPF, DKIM,
  DMARC** — these are her email). Do **not** touch those.
- In Vercel → project → **Settings → Domains**, add `middlerockmanagement.com` and
  `www.middlerockmanagement.com`. Vercel gives you the exact records to add at the domain's
  DNS provider. Only add what Vercel specifies; leave the mail records alone.
- Keep the Squarespace site up until the new site loads on the real domain, SSL is active, and
  email still works. Only then downgrade/cancel Squarespace (with Amanda's OK).
- The `vercel.json` file already redirects the old Squarespace paths
  (`/contact-us` → `/contact/`, `/our-creatives` → `/the-middle-rocks/`).

A short, careful DNS checklist lives in `docs/QA-REPORT.md`.

---

## 8. Release checklist (before each meaningful update)

- [ ] Edited `data/*.json`, then ran `node build.js`.
- [ ] Previewed locally — checked the page on a narrow (phone) and wide (desktop) window.
- [ ] No broken links; external links still open the right profiles.
- [ ] Committed with a clear message and pushed.
- [ ] Reviewed the Vercel preview URL before promoting to production.

---

## 9. Typography (optional upgrade, later)

The site ships with a fast, dependency-free system font stack (an elegant serif for headings,
a clean sans for body). If you and Amanda later want a distinctive self-hosted display face
(e.g. *Fraunces*), add the font files to `assets/fonts/`, declare them with `@font-face` at
the top of `css/base.css`, and change the `--font-display` variable. Everything else updates
automatically because all type flows from that one variable.

---

## 10. Taking it over later (built to be portable)

This site is deliberately built so it is never locked to one person or one account. If Amanda
ever wants a different developer to run it — or to take full control herself — here is why
that is straightforward:

- **It's a plain static site in a Git repo.** No framework, no database, no server, no
  proprietary platform — just standard HTML, CSS, and vanilla JavaScript that any web developer
  can read in minutes. All content is data-driven from `data/clients.json` and `data/team.json`,
  and `build.js` (one small, dependency-free Node script) turns that into the finished pages.
- **It runs on any static host, unchanged.** The exact same repo can be deployed to
  **Cloudflare Pages, Netlify, Vercel, or GitHub Pages** in well under an hour — nothing to
  rewrite or port. Whoever takes over just connects the repo to a host and it's live.
- **Three things make it fully "yours":** the **domain** (already Amanda's — registered and
  DNS-managed at Squarespace, with email on Google Workspace), the **code** (this repo), and the
  **host account**. To keep it independent long-term, the repo (GitHub) and the host account
  (e.g. Cloudflare Pages) should live under a Middle Rock–owned login, with any helper added as a
  collaborator. Then handing it to a new developer is simply: give them the repo plus access to
  the domain's DNS, and they're productive on day one.
- **Everything a new developer needs is already in this README** — content edits (Sections 3–5),
  preview and build (Sections 2–3), and deploy (Section 6). Start in `data/` for content and
  `css/base.css` for the look.

Bottom line: no single person is ever a single point of failure for keeping this site running.

---

Questions later? Everything is plain HTML/CSS/JS with comments. Start in `data/` for content,
`css/base.css` for the look.

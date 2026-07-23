# Missing assets — images still needed

Every portrait on the site currently uses a neutral **placeholder SVG** in this folder. The
layout is final; only the images are pending. When approved photos arrive, follow
"Replace a placeholder image" in the main `README.md`.

**Do not** invent, AI-generate, or scrape portraits. Use only images Amanda approves and has
the rights to use.

## Team portraits
| File to replace | Person | Recommended size (3:4) | Notes |
|---|---|---|---|
| `amanda-robles.svg` | Amanda (Mandy) Robles | 600×800 | Credit **LOTTA Photography** (already set in `data/team.json`; confirm with Amanda). |
| `corrine-ashley.svg` | Corrine Ashley | 600×800 | A black-and-white portrait exists on the current site. |

## Client portraits (4:5 — 640×800 recommended)
| File to replace | Client |
|---|---|
| `carlo-nicdao.svg` | Carlo Nicdao |
| `jake-carr.svg` | Jake Carr |
| `cassi-jerkins.svg` | Cassi Jerkins |
| `lauren-astore.svg` | Lauren Astore |
| `nathaniel-seybold.svg` | Nathaniel Seybold *(an image exists on the current site)* |
| `pam-and-lindsay.svg` | Pam Bassuk & Lindsay Jean Michelle |
| `nathaniel-shriver.svg` | Nathaniel Shriver |
| `tiff-campbell.svg` | Tiff Campbell |
| `tommy-schneiders.svg` | Tommy Schneiders |
| `philip-asta.svg` | Philip Asta |

## Brand assets (in `../../brand/`)
| File | Status |
|---|---|
| `middle-rock-management-logo.webp` / `.png` | ✅ **Real logo**, supplied by Kris (background removed, trimmed). |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`, `icon-maskable-512.png` | ✅ Derived from the real logo. |
| `social-share.jpg` (1200×630) | ⚠️ Auto-made from the logo on a paper background. Fine as-is; replace later if Amanda wants a custom share image. |
| `Final+logo+please+dear+god+(1).webp` | Original logo file as supplied — kept as an untouched backup/source. |

## Image tips
- Export as **`.webp`** (best) or optimized **`.jpg`**. Keep each file well under ~300 KB.
- Match the aspect ratio above so the page never shifts.
- Update the matching `image` and `imageAlt` fields in `data/clients.json` / `data/team.json`,
  then run `node build.js`.

# seanleels.com

Personal site for Sean L.S. Lee, medical student at USC Keck School of Medicine. Static HTML served by GitHub Pages at [seanleels.com](https://seanleels.com).

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The main site: about, projects, publications, research, contact |
| `images/` | Headshot (`headshot.jpg` / `.webp`) and the link-preview card (`og-card.jpg`) |
| `files/Sean-Lee-CV.pdf` | Downloadable CV |
| `antibiotics/` | Antibiotic Stewardship Tool, the empiric regimen reference, served at [seanleels.com/antibiotics/](https://seanleels.com/antibiotics/). Regimens are in `data.js`, allergy and risk-factor rules in `rules.js` |
| `scores/` | Internal Medicine Scoring Calculator, served at [seanleels.com/scores/](https://seanleels.com/scores/). Score definitions are in `data.js` |
| `tools/` | Shared design files for the two clinical tools (`DESIGN.md`, `tokens.css`, `tools.css`), plus redirects from the old `tools/*.html` addresses |
| `eye-atlas/` | Eye Atlas source. The canonical address is [atlas.seanleels.com](https://atlas.seanleels.com); the copy at `seanleels.com/eye-atlas/` redirects there |
| `reads/` | Second Look, paper appraisals. The canonical address is [reads.seanleels.com](https://reads.seanleels.com) (Vercel, root directory `reads`); each appraisal lives in its own folder, e.g. `reads/protocol-s/` |
| `case/` | Ophtho Case of the Day, a daily diagnosis game, served at [seanleels.com/case/](https://seanleels.com/case/). Cases and game logic are in `case/game.js`; it is `noindex` and out of `sitemap.xml` while in beta |
| `beforeyoupageophtho/` | Before You Page Ophtho, the pre-consult worksheet, served at [seanleels.com/beforeyoupageophtho/](https://seanleels.com/beforeyoupageophtho/). `beforeyoupageophto/` redirects to it |
| `dashboard/` | Private personal trackers (study, research, gym, piano). Not linked from the site, marked `noindex`, and meant to sit behind Cloudflare Access. Logged data lives in the browser's localStorage, not in this repo |
| `robots.txt`, `sitemap.xml` | Search engine hints |
| `CNAME` | Custom domain for GitHub Pages |

## Editing

Everything is plain HTML, CSS, and JavaScript with no build step. Edit a file, commit to `main`, and GitHub Pages publishes it within a minute or two.

When updating content, keep the class year, publications, and dates consistent with the CV PDF.

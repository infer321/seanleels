# seanleels.com

Personal site for Sean L.S. Lee, medical student at USC Keck School of Medicine. Static HTML served by GitHub Pages at [seanleels.com](https://seanleels.com).

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The main site: about, projects, publications, research, contact |
| `images/` | Headshot (`headshot.jpg` / `.webp`) and the link-preview card (`og-card.jpg`) |
| `files/Sean-Lee-CV.pdf` | Downloadable CV |
| `tools/` | Antibiotic stewardship reference and IM clinical scores calculator |
| `eye-atlas/` | Eye Atlas source. The canonical address is [atlas.seanleels.com](https://atlas.seanleels.com); the copy at `seanleels.com/eye-atlas/` redirects there |
| `reads/` | Second Look, paper appraisals. The canonical address is [reads.seanleels.com](https://reads.seanleels.com) (Vercel, root directory `reads`); each appraisal lives in its own folder, e.g. `reads/protocol-s/` |
| `dashboard/` | Private personal trackers (study, research, gym, piano). Not linked from the site, marked `noindex`, and meant to sit behind Cloudflare Access. Logged data lives in the browser's localStorage, not in this repo |
| `robots.txt`, `sitemap.xml` | Search engine hints |
| `CNAME` | Custom domain for GitHub Pages |

## Editing

Everything is plain HTML, CSS, and JavaScript with no build step. Edit a file, commit to `main`, and GitHub Pages publishes it within a minute or two.

When updating content, keep the class year, publications, and dates consistent with the CV PDF.

# Second Look · Design system

**What it is:** Sean Lee's critical appraisals of ophthalmology papers. One paper a month: what it found, how far to trust it, and what it means. Name: *Second Look*, confirmed Nov 2026 (a surgical term for re-examining, and what an appraisal does). Address: `reads.seanleels.com`.

**Audience:** residency program directors and faculty skimming for judgment, and students or residents who want a fast, honest read of a paper.

**Feeling:** a well-edited journal, not a blog. Calm, typeset, evidence first. Built for reading long text, then scanning for the verdict.

**Relationship to seanleels.com:** a sister site. It shares the palette, the gold for links, the fonts and the spacing scale from `/DESIGN.md`. It differs by putting long-form reading first: a serif body, a narrower measure, and appraisal-specific components.

**Theme:** follows the visitor's device (light or dark). Designed light-first, because reading is the main task. Print is always light.

Not based on comparisons with real reference sites (UXKIN not connected). Decisions come from seanleels.com, Eye Atlas and the audience.

---

## Color

Pages use token names (`tokens.css`), never raw hex values.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | #f8f6f1 | #0a0a0f | Page (paper / ink) |
| `--surface` | #ffffff | #13131a | Appraisal card, study snapshot |
| `--border` | ink 10% | white 8% | Hairlines, table rules |
| `--border-strong` | ink 22% | white 16% | Chip outlines, empty meter segments |
| `--accent` | #7d5f26 | #c8a96e | **Primary:** links, the active filter, the one button per page |
| `--accent-hover` | #5f4719 | #e8c98e | Hover |
| `--on-accent` | #ffffff | #0a0a0f | Text on accent |
| `--heading` | #16161d | #f1efe9 | Titles, filled certainty segments, verdict text |
| `--text` | #2a2a33 | #e0e0ec | Article body |
| `--muted` | #55556a | #a6a6bc | Secondary text, card values |
| `--subtle` | #6a6a7e | #8686a0 | Dates, meta, field labels |
| `--ok` | #276a46 | #8acfaa | Bias domain: low concern |
| `--warn` | #8a5a00 | #e0b25c | Bias domain: some concerns |
| `--risk` | #a3392a | #f08a7a | Bias domain: high concern |

- **Certainty is not a color.** It's shown as a 4-segment meter in `--heading` plus a word (High, Moderate, Low, Very low), so it reads in grayscale and print.
- Bias-domain colors always come with a symbol (● ◐ ○) and the words.
- All text ≥ 4.5:1 in both themes (checked).

## Typography

Two families, shared with seanleels.com.

| Role | Family | Size | Weight | Line height |
| --- | --- | --- | --- | --- |
| Site wordmark | Newsreader, italic | 24px | 500 | 1 |
| Index title (h1) | Newsreader | 48px (36 on phones) | 400 | 1.1 |
| Article title (h1) | Newsreader | 40px (30 on phones) | 400 | 1.15 |
| Section heading (h2) | Newsreader | 26px | 500 | 1.25 |
| **Article body** | **Newsreader** | **19px** | 400 | 1.65 |
| Standfirst (lede) | Newsreader, italic | 22px | 400 | 1.5 |
| UI text, list rows, card values | IBM Plex Sans | 16px | 400 / 500 | 1.55 |
| Meta, labels, captions | IBM Plex Sans | 14px | 400 / 500 | 1.5 |
| Badges and chip counts | IBM Plex Sans, uppercase, tracking 0.06em | 12px | 500 | 1.4 |

- **Numbers** (N, hazard ratios, confidence intervals, letters gained) use IBM Plex Sans with `tabular-nums`, so they line up in tables.
- **Measure:** article body at most 66 characters (`--measure-read`). The index can run wider.

## Spacing

The same 4px scale as seanleels.com: `--space-1` 4px through `--space-13` 128px.

- **Article column:** 680px wide. The appraisal card and tables may break out to 840px.
- **Index:** 1040px container. Sections are separated by `--space-12` on desktop and `--space-9` on phones; paragraphs by `--space-6`.

## Shape and depth

- 2px radius on cards, chips, buttons and badges. No shadows.
- Depth comes from the `--surface` panel and 1px hairlines only.

## Components

- **Masthead.** The wordmark *Second Look* on the left, with "by Sean Lee" linking to seanleels.com. On the right: Appraisals, Method, About, RSS. No hero image. Show only links whose pages exist; until Method, About and RSS are built, the nav is just Appraisals.
- **Filter chips** (index). Subspecialty (Retina, Glaucoma, Cornea, Neuro-ophthalmology, Oculoplastics, Pediatrics, Uveitis) and design (RCT, Cohort, Real-world data, Meta-analysis). Chips are outlined; the active chip is accent-filled. They work as real buttons with `aria-pressed`. Chips appear only once there are at least 3 appraisals; filtering one or two rows helps no one. Without JavaScript all rows show and the chips are hidden.
- **Index intro.** The h1 "Ophthalmology papers, read critically." with one italic standfirst sentence in Newsreader, then a short "why" paragraph in Sean's words (2–3 sentences, Newsreader 19px in `--text`, no heading, no box), then the appraisal list. No hero, no counts, no "latest" banner.
- **Appraisal row** (index). A date column, then the title (Newsreader 22px), journal and year, tags (with `★ Landmark` first when it applies), a certainty meter, and a one-line bottom line. Rows are separated by hairlines; there are no cards.
- **Study snapshot** (article top, on `--surface`). A two-column definition list: Design · Population · N · Intervention / exposure · Comparator · Primary outcome · Follow-up · Funding · Registration.
- **Certainty meter.** Four segments plus a word, using GRADE-style levels (High, Moderate, Low, Very low). It always comes with a sentence of why.
- **Bias table.** Domain · Concern (symbol + word, colored) · Why. Standard domains: randomization or confounding, deviations, missing data, measurement, selective reporting.
- **"The number that matters."** One figure set large in Newsreader with a plain-language caption. It is never a reproduced chart.
- **Bottom line.** A short boxed paragraph with a hairline in accent on the left. The only accent on the page besides links.
- **Clinical significance takeaway.** Sean's plain-prose answer to "what would I do for this patient," set as an ordinary section (h2 + body text). Sits between "What I'd change" and "Bottom line." No box and no accent, so the bottom line stays the one boxed moment.
- **Companion papers.** An appraisal is built around one main paper. Papers that confirm, extend or challenge it (a second trial, a long-term follow-up, a real-world cohort) are listed under the study snapshot as a hairline-ruled list: role ("Second trial", "5-year follow-up", "Real-world counterpoint"), short citation, one line on what it adds. The snapshot itself describes the main paper only. Companions get their own short subsection under "What they found," and every companion appears in the citation block.
- **Landmark tag.** `★ Landmark` marks a paper that changed guidelines or standard practice (for example, cited as a basis for an AAO Preferred Practice Pattern recommendation). Shown in the article meta line and on the index row, in `--heading`, 14px Plex Sans. The star always comes with the word. It is never colored, never used alone, and never means "good paper": it marks influence, not quality.
- **Draft state.** An unpublished appraisal carries a "Draft · not yet published" status line in the meta (badge style, uppercase), stays `noindex`, is not listed on the index or in RSS, and isn't linked from anywhere until Sean removes the line.
- **Citation block.** Full citation, DOI and PubMed links, and the date of the appraisal.
- **Footer.** A disclaimer ("Educational commentary, not medical advice. Errors are mine; corrections welcome."), a link back to seanleels.com, and RSS.
- **Buttons.** Primary (accent fill), secondary (outline) and quiet (text link), all at least 44px tall. Focus is a 2px accent outline offset 3px.

## Imagery and icons

- No photos and no stock images. The content is the text and the numbers.
- No figures reproduced from papers. A simple chart redrawn from reported numbers, in tokens, is allowed and is labeled "Redrawn from reported data."
- Icons: only RSS and ↗ for external links. Bias status uses ● ◐ ○ with words; landmark papers use ★ with the word "Landmark" (text glyph U+2605, not emoji). No emoji.

## Writing rules (part of the design)

- Every appraisal is written by Sean in his own words, and every claim traces to the paper.
- Fixed order: standfirst → study snapshot (+ companion papers) → what they found → how far to trust it (certainty + bias) → the number that matters → what I'd change → clinical significance takeaway → bottom line → citation.
- About 700–1,000 words. Dates are always absolute ("Nov 2026").

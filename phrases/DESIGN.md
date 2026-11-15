# Look Here · Design system

**What it is:** a phone-first card of short eye exam commands in English, Spanish, Mandarin and Cantonese. Tap a phrase to fill the screen with it for the patient; a reply card lets the patient answer by pointing. Status: Work in progress. "Look Here" is a working name.

**Audience:** residents, students, technicians and nurses examining a patient with limited English, one hand on the slit lamp. Program directors and faculty also land here from seanleels.com.

**Feeling:** a laminated pocket card. Plain, dense and fast in the list; very large and calm in the view the patient sees.

**Relationship to seanleels.com:** a tool with its own identity, in one family with Before You Page Ophtho. It reuses that tool's colors, fonts (Archivo and Atkinson Hyperlegible) and tokens, because both are used at the bedside and should feel like the same hand made them. It differs from the home site because a working tool needs a blue action color and large, blunt type. It shares with the home site the footer link back to seanleels.com, the favicon, the 4px spacing scale, the 2px radius, the no-shadow rule, and the contrast and accessibility rules.

**Address:** `seanleels.com/phrases/` on GitHub Pages. The folder name describes the content, so it survives a name change.

**Theme:** follows the visitor's device, including the large view (a white screen in a dim exam lane would glare). Print is always light.

Not based on comparisons with real reference sites (UXKIN not connected). Decisions come from Before You Page Ophtho, seanleels.com and the audience.

---

## Hard limits

- **Not an interpreter.** The line saying so sits in the header, above the phrases, and again in the footer. No phrases for consent, diagnosis, results or decisions.
- **Draft translations are labelled.** Each language has a status on `<main>` (`data-status-es`, `-cmn`, `-yue`): `draft`, `checked` (a fluent speaker corrected it) or `reviewed` (a second person confirmed it). The note above the list reads from it. Only a person who did the checking changes a status.
- **No machine voice.** Audio is recorded by people. Until a language is recorded there is no Play button.
- **No patient data.** Nothing is typed about a patient, and nothing is sent anywhere.

## Color

Pages use token names (`tokens.css`), never raw hex values. Values match Before You Page Ophtho.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | #f2f4f8 | #0a0f1e | Page, large view |
| `--surface` | #ffffff | #111831 | Fields, buttons, the limit note, row hover |
| `--sunk` | #e8ecf3 | #0c1327 | Reserved |
| `--ink` | #0f1730 | #e6eaf5 | Text, selected state |
| `--muted` | #56607a | #9aa4bf | English line, reading aids, hints, footer |
| `--line` | #d4dae6 | #25304f | Hairlines |
| `--line-strong` | #7f889d | #6d7690 | Control outlines |
| `--accent`, `--accent-soft` | #1e3db8, #e2e7fa | #90a4ff, #1a2452 | **Primary:** the one primary button, links, a starred star |
| `--on-accent` | #ffffff | #0a0f1e | Text on accent |
| `--warn`, `--warn-soft` | #8f5100, #fbf0dc | #f2b44c, #33250b | Work-in-progress badge, draft note |
| `--ok`, `--ok-soft` | #1f6e47, #e1f2e8 | #62d39c, #0f2d20 | Reviewed note |

- **Selected is ink, not blue.** Language, script, "Starred only" and a tapped reply tile invert to ink. Blue stays for the single primary button per view.
- **Status is never color alone.** The note always says "draft", "checked" or "reviewed" in words.
- **Text contrast:** at least 4.5:1 in both themes, checked with axe.

## Typography

| Role | Family | Token | Weight |
| --- | --- | --- | --- |
| Page title | Archivo, wide | clamp(28–38px) | 850 |
| Section titles | Archivo | `--fs-h2` 21px | 750 |
| Translation in the list | Atkinson Hyperlegible, or the device's Chinese font | `--fs-tr` 20px | 700 (Chinese 500) |
| Body, controls | Atkinson Hyperlegible | `--fs-body` 16px | 400–700 |
| English line, reading aids, hints | Atkinson Hyperlegible; system sans for Pinyin and Jyutping | `--fs-sm` 14px | 400 |
| Large view | as the translation | `--fs-show` clamp(40–88px) | 700 (Chinese 500) |
| Reply tiles | as the translation | `--fs-tile` clamp(24–36px) | 700 (Chinese 500) |
| Status badge | Atkinson Hyperlegible, uppercase | `--fs-xs` 12px | 700 |

- **Chinese uses the device's own font** (`--f-cjk`). A web font for it would be several megabytes on a hospital connection.
- **Every translated element carries `lang`** (`es`, `zh-Hans`, `zh-Hant`, `yue`, and `zh-Latn` / `yue-Latn` for the reading aids), so devices pick the right glyphs and screen readers the right voice.
- **Pinyin and Jyutping use the system sans** (`--f-read`), so tone marks never fall back to another font mid-word.
- **Capitals** appear only on the status badge.

## Spacing, shape and depth

- The 4px scale shared with seanleels.com (`--space-1` … `--space-13`). Every padding, margin and gap uses a token.
- **Content width:** 860px, one column. A phrase list is read top to bottom.
- **Radius:** 2px. **No shadows.**
- The large view and the reply card are the only layered elements. They are full-screen `<dialog>`s on the page color, with a hairline above their button bar.

## Components

- **Phrase rows.** A hairline-ruled list, not cards: English small and muted, the translation large, the reading aid under it. The whole row opens the large view; a star at the end keeps it for "Starred only".
- **Controls.** Language (three toggle buttons, each named in its own language), Simplified/Traditional (Mandarin only), search in English, "Starred only", and the one primary button, "Patient reply card". All at least 44px.
- **Large view.** Translation, reading aid, English. Previous / Next (also the arrow keys), Close, and Play once that language has recordings.
- **Patient reply card.** Tiles at least 88px tall with the answer in the patient's language and English beneath, four arrows for the tumbling E, and 0–10 for pain. The tapped tile inverts, and the answer is written in English at the top for the examiner.
- **Notes.** The limit note has an ink rule; the status note has an amber rule while draft and a green one once reviewed.
- **Focus** shows a 2px accent outline offset 3px.

## Behavior notes

- **The phrases live in `index.html`.** There is no data file and no build step. To correct a translation, edit its `<span>` in the HTML. With JavaScript off, every language shows under each English line and the reply card shows as a list.
- **Audio.** Clips go in `phrases/audio/<es|cmn|yue>/<id>.m4a`, where `<id>` is the row's `id` without `p-` (for example `audio/yue/chin.m4a`). When a language is fully recorded, add its code to `data-audio` on `<main>` (`data-audio="yue cmn"`); Play then appears for that language. A missing clip hides Play for that phrase.
- **Stored on the device:** language (`lh-lang`), script (`lh-script`), starred phrases (`lh-stars`). Nothing else.
- **Print** gives a two-column pocket card in the chosen language, with the reply list at the end.
- A clinical tool: keep the "Content last updated" date in the footer current whenever a phrase changes.
- While work in progress: `noindex`, the badge beside the title, and out of `sitemap.xml`.

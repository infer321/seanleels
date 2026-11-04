# Clinical tools · Design system

**What they are:** two reference tools on seanleels.com.

- **Antibiotic Stewardship Tool** (`/antibiotics/`): empiric antibiotic choices for 29 infections by setting, with allergy and MRSA adjustments.
- **Internal Medicine Scoring Calculator** (`/scores/`): calculators for 17 internal medicine scores, with interpretation tied to current guidelines.

Status: Live.

**Audience:** students and residents on the wards, often on a phone, sometimes on a workstation. Program directors and faculty also land here from the home page.

**Feeling:** a careful reference sheet. Plain, typeset and quick to scan. No dashboard chrome.

**Relationship to seanleels.com:** a sister site, like Second Look. It inherits the home palette (ink and gold), Newsreader and IBM Plex Sans, the 4px spacing scale, the 2px radius, the no-shadow rule, and the contrast and accessibility rules. It borrows Second Look's three status colors (`--ok`, `--warn`, `--risk`) for risk tiers, because the home palette has none. Before You Page Ophtho keeps its own clinical identity; these two tools don't need triage colors or a blue action color.

**Addresses:** `seanleels.com/antibiotics/` and `seanleels.com/scores/`, on GitHub Pages. They moved from `tools/antibiotic-stewardship.html` and `tools/im-clinical-scores.html` in Nov 2026. Those old addresses now redirect. This folder (`tools/`) holds the shared design files and the redirects.

**Theme:** follows the visitor's device. Print is always light.

Not based on comparisons with real reference sites (UXKIN not connected). Decisions come from the home site, Second Look and the audience.

---

## Color

Pages use the token names in `tokens.css`, never raw hex values. The values are the same as Second Look's, already checked for contrast.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | #f8f6f1 | #0a0a0f | Page |
| `--surface` | #ffffff | #13131a | The result panel, inputs |
| `--border` / `--border-strong` | ink 10% / 22% | white 8% / 16% | Hairlines / control outlines |
| `--accent` | #7d5f26 | #c8a96e | **Primary:** the one main button, links, the selected choice |
| `--accent-hover` | #5f4719 | #e8c98e | Hover |
| `--on-accent` | #ffffff | #0a0a0f | Text on accent |
| `--heading` / `--text` | #16161d / #2a2a33 | #f1efe9 / #e0e0ec | Headings / body |
| `--muted` / `--subtle` | #55556a / #6a6a7e | #a6a6bc / #8686a0 | Descriptions / labels, meta |
| `--ok` / `--warn` / `--risk` | #276a46 / #8a5a00 / #a3392a | #8acfaa / #e0b25c / #f08a7a | Risk tier words: low / moderate / high |

- **Risk is never color alone.** The tier word ("Low risk", "High risk") always appears, and the score number is in `--heading`.
- **No tinted result boxes.** The result panel is `--surface` with a 2px left rule in the tier color.

## Typography

| Role | Family | Token | Weight |
| --- | --- | --- | --- |
| Tool title (h1) | Newsreader | `--fs-title` clamp(30–40px) | 400 |
| Section heading (h2) | Newsreader | `--fs-h2` 26px | 400 |
| Score name, drug name | Newsreader | `--fs-h3` 20px | 500 |
| Score result number | Newsreader | `--fs-score` clamp(40–56px) | 400, tabular |
| Body, controls | IBM Plex Sans | `--fs-ui` 16px | 400–500 |
| Labels, doses, meta | IBM Plex Sans | `--fs-meta` 14px | 400–500 |
| Status badge only | IBM Plex Sans, uppercase | `--fs-badge` 12px | 500 |

- Doses and numbers use tabular figures.
- No uppercase labels above sections; group labels are plain 14px text.

## Spacing and layout

- The 4px scale shared with seanleels.com (`--space-1` … `--space-13`).
- **Content width:** 880px (`--w-tool`), with a `--space-6` side gutter (`--space-4` on phones).
- Sections are separated by `--space-10`; rows within a list by hairlines.

## Shape and depth

- 2px radius on every control and panel. No shadows. Selected state is an accent fill, never a glow.

## Components

- **Choice chips.** Real `<button>`s with `aria-pressed`, at least 44px tall, outlined in `--border-strong`; the selected chip is accent-filled. Used for body system, infection, setting, risk factors and score categories.
- **Score inputs.** Native radio buttons for one-of-several items (age bands, ECG, NIHSS items), checkboxes for yes/no items, number inputs for labs. Each group is a `<fieldset>` with a `<legend>`. Rows are at least 44px tall.
- **Result panel.** `--surface`, 2px left rule in the tier color, tier word, score in Newsreader, interpretation in plain text, then a "Based on" line naming the guideline or source.
- **Regimen list.** Hairline-ruled rows: role ("First line", "Alternative", "If penicillin allergy"), drug in Newsreader, dose, coverage and note in `--muted`. Duration and stewardship notes follow as plain rows, not boxes.
- **Primary button.** One per view: "Show regimens" on the antibiotics tool. Score results update as you go and need no button.
- **Back link.** "← seanleels.com" at the top of each tool, and in the footer.
- **Footer.** Not-medical-advice line, "Content last updated" month, and a link to the page's Sources and changes section.

## Content rules

- Every recommendation traces to a named guideline in the page's **Sources and changes** section, with the month it was last checked.
- When a guideline changes, update the content, the "Content last updated" month and the change list in the same commit.
- Nothing typed is stored or sent.
- With JavaScript off, each page shows its Sources section and a short note that the tool needs JavaScript.

# Before You Page Ophtho · Design system

**What it is:** a bedside worksheet that walks ED, floor and ICU teams through the workup ophthalmology will ask for, then writes the consult page. It has three tabs: Workup & page, Bedside tools (near card, pupil gauge, red desaturation, OKN strip) and Field guide. Status: Live.

**Audience:** residents and nurses working up an eye complaint overnight, usually on a phone or a workstation, under time pressure. Program directors and faculty also land here from seanleels.com.

**Feeling:** a clinical worksheet. Dense, plain and fast, with triage state always in view.

**Relationship to seanleels.com:** a tool with its own identity, like Eye Atlas. It differs because a working tool needs a blue action color that isn't confused with the triage colors, plus a three-level triage scale. It shares Archivo and Atkinson Hyperlegible with Ophtho Case of the Day, and with the home site it shares the footer link back to seanleels.com, the favicon, the 4px spacing scale, the 2px radius, the no-shadow rule, and the contrast and accessibility rules.

**Address:** `seanleels.com/beforeyoupageophtho/` on GitHub Pages. It moved here from `beforeyoupageophtho.seanleels.com` in Nov 2026. `beforeyoupageophto/` redirects to it.

**Theme:** follows the visitor's device. Print is always light.

Not based on comparisons with real reference sites (UXKIN not connected). Decisions come from the original tool, seanleels.com and the audience.

---

## Color

Pages use token names (`tokens.css`), never raw hex values.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | #f2f4f8 | #0a0f1e | Page |
| `--surface` | #ffffff | #111831 | Cards, fields, the consult page panel |
| `--sunk` | #e8ecf3 | #0c1327 | Message box, tracks, denied history |
| `--ink` | #0f1730 | #e6eaf5 | Text |
| `--muted` | #56607a | #9aa4bf | Labels, hints, footer |
| `--line` | #d4dae6 | #25304f | Hairlines |
| `--line-strong` | #7f889d | #6d7690 | Field outlines |
| `--accent`, `--accent-soft` | #1e3db8, #e2e7fa | #90a4ff, #1a2452 | **Primary:** buttons, links, selected state |
| `--on-accent` | #ffffff | #0a0f1e | Text on accent |
| `--em`, `--em-soft` | #b42318, #fcebe8 | #ff8173, #3a1517 | Emergent |
| `--ur`, `--ur-soft` | #8f5100, #fbf0dc | #f2b44c, #33250b | Urgent |
| `--ro`, `--ro-soft` | #1f6e47, #e1f2e8 | #62d39c, #0f2d20 | Routine, complete |
| `--paper`, `--paper-ink` | #ffffff, #000000 | same | Near card, pupil gauge and OKN strip |
| `--paper-line`, `--paper-muted`, `--paper-key` | #d9d9d9, #555555, #b00020 | same | Chart rows, labels and the answer key |
| `--red-disc` | #e00000 | same | Red desaturation target |

- **Triage is never color alone.** The word (Emergent, Urgent, Routine) always appears.
- **Chart surfaces stay white in dark mode,** because they stand in for a printed card.
- **Eye drop cap swatches are raw colors by design.** They are illustrations of the real cap colors, so they sit outside the token rule, as inline SVG previews do.
- **Text contrast:** at least 4.5:1 in both themes, checked with axe.

## Typography

| Role | Family | Token | Weight |
| --- | --- | --- | --- |
| Page title | Archivo, wide | clamp(25–38px) | 850 |
| Triage word | Archivo, wide | `--fs-word` 28px | 900 |
| Step and tool titles | Archivo | `--fs-h3` 21px | 750 |
| Card titles | Archivo | `--fs-lg` 17px | 700 |
| Body and fields | Atkinson Hyperlegible | `--fs-body` 16px | 400–700 |
| Labels, hints | Atkinson Hyperlegible | `--fs-sm` 14px | 400–700 |
| Status words | Atkinson Hyperlegible | `--fs-xs` 12px | 500 |
| Consult page text, key caps | System monospace | `--fs-sm` | 400 |

- **Monospace** appears only where text is being composed for a pager, so its line and character counts read true. It uses the device's own monospace, so no third web font loads.
- **Capitals** appear only on triage status words.
- **Step numbers** (01–05) are real order, not decoration: the workup runs in that sequence.

## Spacing, shape and depth

- The 4px scale shared with seanleels.com (`--space-1` … `--space-13`). Every padding, margin and gap uses a token.
- **Content width:** 1180px, with a 410px sticky consult panel from 960px up. It stacks on phones, with a bottom bar showing triage and readiness.
- **Radius:** 2px (`--radius`). Pupil circles and status dots stay round because that is what they depict.
- **No shadows.** Selected states use an outline or a border.
- The fixed bottom bar on phones is the only layered element, and it uses a hairline.

## Components

- **Buttons.** One primary per view: Copy page. Secondary: outlined. All controls are at least 44px tall. Focus shows a 2px accent outline offset 3px.
- **Red flags.** Checkbox rows that open a "Do now" action and raise the triage level.
- **Consult panel.** Triage word, alerts, page-ready count with jump links to what's missing, then the message in Secure chat or Pager format with a 240-character counter.
- **Bedside tools.** All true-size targets depend on the card calibration, and their sizes are computed in `tool.js`.

## Behavior notes

- Nothing typed is stored or sent. Only the screen calibration is kept, in `localStorage` under `bypo-pxmm`.
- With JavaScript off, the field guide still shows, with a short note that the worksheet needs JavaScript.
- A clinical tool: keep the "Content last updated" date in the footer current whenever `tool.js` or the field guide changes.

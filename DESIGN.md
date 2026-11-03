# seanleels.com · Design system

**Direction:** keep the dark ink + gold palette and the editorial serif, but drop the stock "AI portfolio" patterns. The site should read like a careful person's academic homepage: typeset, quiet, specific. It is not a landing page.

**Audience:** residency program directors, faculty, collaborators. They skim for 30–60 seconds, often on a bright office monitor, sometimes on a phone or printed.

**Theme:** follows the visitor's device: dark by default for dark-mode devices, light for light-mode devices. Print is always light.

Not based on comparisons with real reference sites (UXKIN not connected). Decisions come from the existing site and its audience.

---

## Color

Every color has one job. Pages use the token names, never raw hex values.

| Token | Dark | Light | Role |
| --- | --- | --- | --- |
| `--bg` | #0a0a0f | #f8f6f1 | Page background |
| `--surface` | #13131a | #ffffff | Interactive cards only (tools, projects) |
| `--border` | white 8% | ink 10% | Hairline rules and card borders |
| `--border-strong` | white 16% | ink 22% | Secondary button outline, tags |
| `--accent` | #c8a96e | #7d5f26 | **Primary:** buttons and links, plus 李洛生 in the hero. Nothing else. |
| `--accent-hover` | #e8c98e | #5f4719 | Hover state of accent |
| `--on-accent` | #0a0a0f | #ffffff | Text on accent buttons |
| `--heading` | #f1efe9 | #16161d | Headings, names, emphasis |
| `--text` | #e0e0ec | #2a2a33 | Strong body text |
| `--muted` | #a6a6bc | #55556a | Body copy, descriptions |
| `--subtle` | #8686a0 | #6a6a7e | Dates, meta, captions |
| `--green` | #8acfaa | #276a46 | Status: published |
| `--blue` | #8aabff | #3556b8 | Status: submitted |

- No other accent. No gradients and no glows.
- Gold never colors dates, meta, departments or decorative numbers.
- Contrast: all text ≥ 4.5:1 on its background in both themes (checked).

## Typography

| Role | Family | Size token | Weight | Line height |
| --- | --- | --- | --- | --- |
| Display (name in hero) | Newsreader | `--fs-display` clamp(48–72px), tracking −0.015em | 400 | 1.04 |
| Section heading (h2) | Newsreader | `--fs-h2` clamp(28–38px) | 400 | 1.15 |
| Sub-heading, card and role titles | Newsreader | `--fs-h3` 22px | 500 | 1.25 |
| Lead text | IBM Plex Sans | `--fs-lg` 18px | 400 | 1.75 |
| Body | IBM Plex Sans | `--fs-body` 16px | 400 | 1.7 |
| Meta, authors, dates, links | IBM Plex Sans | `--fs-sm` 14px | 400–500 | 1.6 |
| Badges only | IBM Plex Sans, uppercase, tracked 0.08em | `--fs-xs` 12px | 500 | 1.6 |

- **Why these two:** Newsreader is a serif built for news and journal text, with optical sizes so headings stay crisp on dark backgrounds. IBM Plex Sans reads as technical and scientific. Both replace a pairing (Cormorant Garamond + DM Sans) that is common on generated portfolios.
- 李洛生 uses Ma Shan Zheng (subset to those three characters), once, in the hero.
- **Uppercase is for badges only.** No small-caps eyebrows above headings.
- **Measure:** body text and publication titles max 70ch (`--measure`).

## Spacing

One 4px-based scale. Every padding, margin and gap uses a token.

`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-7` 32 · `--space-8` 40 · `--space-9` 48 · `--space-10` 64 · `--space-11` 80 · `--space-12` 96 · `--space-13` 128 (px)

- **Sections:** `--space-12` top and bottom on desktop, `--space-9` on phones.
- **Content width:** 1100px container with a `--space-10` side gutter (`--space-6` on phones).
- **Within a section:** heading to content `--space-8`; between list rows `--space-6`.

## Shape and depth

- **Radius:** 2px for buttons, cards, tags and badges. 10px for the app icon only. Round only for the phone avatar.
- **No shadows.** Depth comes from 1px hairlines and the surface color.

## Components

- **Buttons.** Primary: accent fill. Secondary: `--border-strong` outline. Quiet: text link in accent. All are at least 44px tall. Hover darkens or lightens the accent. Focus shows a 2px accent outline offset 3px. Disabled is 50% opacity with no pointer. Use one primary button per view.
- **Links.** In running text: accent and underlined. Standalone: accent, underline on hover. Add ↗ only to links that leave the site.
- **Cards.** Only for things you can open or use (tools, apps). Everything else (education, leadership, certificates, publications) is a hairline-ruled list, not a card.
- **Badges.** Status only: Published (green), Submitted (blue), In preparation (accent outline), Poster (accent fill).
- **Navigation.** Name on the left, five links on the right. On phones, a menu button opens a full-width list.
- **Footer.** One line: name, update date, school and class year.

## Section patterns (de-templating rules)

The site used to repeat one frame for every section: small gold label, big serif heading, content. These rules replace it, and the homepage follows them as of November 2026.

1. **No eyebrow labels.** A section opens with its heading only.
2. **Plain, specific headings.** Use "Research", "Publications", "Projects", "Leadership", "Contact". Avoid stock phrases like "Who I Am", "Get in Touch", "Beyond the Clinic" or "Where It Began".
3. **Vary the layout.** No two adjacent sections share a structure:
   - About: prose column plus a short facts list (school, year, languages). No stat-card grid.
   - Publications: typeset list with year and journal, no oversized numerals.
   - Projects: the ophthalmology projects featured large (Second Look and Ophtho Case of the Day span the full width); the clinical tools as compact list rows, not identical cards.
   - Research: department and date column, project-led bullets (current pattern).
4. **No decoration that isn't information.** No hero glow, fade-in on scroll, or faded numerals.
5. **One accent moment per screen.** If a button is gold, nothing else nearby needs to be.

## Imagery and icons

- **Headshot:** one portrait, 2:3, top-aligned crop; round 88px version on phones.
- **Tool previews:** real screenshots of Eye Atlas and Before You Page Ophtho, in place of the drawn SVG mockups (pending).
- **Photography (optional):** Sean's own photographs may appear between major sections, full-bleed or 2:3, no filters. A natural fit given his photography background.
- **Icons:** none beyond the menu button and the App Store mark. Text labels are preferred over icons, and emoji are never used.

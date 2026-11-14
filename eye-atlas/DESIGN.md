# Eye Atlas · DESIGN.md

Last updated: Nov 13, 2026. Status: **built Nov 11, 2026**; open items at the end.
Tokens live in `eye-atlas/tokens.css`. Pages use token names, never raw hex (SVG illustrations are the exception).

Basis: this direction comes from the existing code, the Nov 11 audit and the seanleels.com house rules. The UXKIN library is not connected, so it is **not** based on comparing real reference sites.

## What this is

A study tool, not a portfolio page. A resident or student opens it to find a structure, see what goes wrong there, and test themselves. It should feel like a reference plate with a good index: quiet, exact, fast to scan.

**A tool with its own identity** (like the project rules allow), not a sister site.
- Different from seanleels.com: ink-blue accent instead of gold; Spectral, Public Sans and JetBrains Mono instead of Newsreader and IBM Plex Sans. Reason: a dense tool needs a UI sans with strong small sizes, and blue keeps red, amber and green free for triage.
- Shared with seanleels.com: the 4px spacing scale, 2px radius, no gradients, glows, shadows or emoji, hairlines for depth, the favicon, the footer link back to seanleels.com, 44px tap targets, the focus ring, 4.5:1 contrast, and light and dark following the device.

## What changes from the current build

| Now | Becomes | Why |
|---|---|---|
| 8–10px radius, card shadows on hover | 2px radius, hairlines only | House rule; rounder reads as an app toy |
| Mono uppercase eyebrows ("STOP 7 OF 9 · FUNDUS", "RISK FACTORS") | Sentence-case labels in Public Sans 600 | House rule: uppercase only on status badges |
| Radial-gradient fundus, saturated fills | Flat tonal plate (see Figures) | The main source of "cartoonish" |
| Zoom, pin-in, flash and reveal animations | One 160ms opacity fade | Motion should confirm, not perform |
| `--faint` (#8a96a3) used for text, 2.7–3.0:1 | `--faint` is non-text only; smallest text uses `--muted` | Fails 4.5:1 |
| Triage colors #c0352b, #a86b12, #3a7653 | #b02a21, #8a5608, #2f6646 | Amber was 3.95–4.4:1; all now pass on every surface |
| "OKAP depth" in the header | Removed | Unsupported claim |

## Color

Light values (dark values are in tokens.css). Contrast is computed against `--bg` / `--surface`.

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--bg` | #f1f3f6 | Page ground | |
| `--surface` | #ffffff | Panels, sheet, list | |
| `--surface-2` | #f6f8fa | Selected row, quiet fill | |
| `--stage` | #e7ebef | Ground behind the figure | |
| `--ink` | #17202b | Headings, body | 14.8 / 16.4 |
| `--ink-2` | #2e3a47 | Secondary body | 10.4 / 11.6 |
| `--muted` | #5d6977 | Meta text, placeholders. The lightest text color allowed. | 5.0 / 5.6 |
| `--faint` | #8a96a3 | Non-text only: ticks, leader lines, inactive dots | n/a |
| `--line`, `--line-2` | #dce2e8, #c8d0d8 | Hairlines; control borders | |
| `--accent` | #294d8c | Buttons and links only | 7.5 / 8.3 |
| `--accent-soft` | #e2e9f5 | Selected tab or chip ground (accent text on it: 6.8) | |
| `--emergent` | #b02a21 | Triage word and dot | 5.9 / 6.6 |
| `--urgent` | #8a5608 | Triage word and dot | 5.5 / 6.2 |
| `--routine` | #2f6646 | Triage word and dot | 6.1 / 6.8 |
| `--c-<stop>` | nine hues | A 3px tick beside the structure name in the rail. Never text, never a fill. | |
| `--pl-<stop>` | nine muted hues | The same nine, desaturated, for tints inside a figure plate | |

Dark mode: all text tokens are 5.3:1 or better on `--bg`, `--surface` and `--surface-2` (computed).

Rules:
- One accent. One primary (filled) button per view.
- Triage is never color alone: every dot sits beside the word "Emergent", "Urgent" or "Routine".
- Per-structure colors shrink to a tick. They no longer tint headers, dots, chips and borders.

## Typography

| Family | Use |
|---|---|
| Spectral 500/600 | Product name, structure and condition titles |
| Public Sans 400/500/600 | Everything else |
| JetBrains Mono 400 | Counts, keyboard keys, citation ids (PMID, DOI). Nothing else. |

Scale: 12 · 14 · 16 · 18 · 22 · 28 · 36 px. Line heights: 1.2 titles, 1.4 UI, 1.55 reading text.
- Card reading text is 16px on phone and desktop. UI lists and controls are 14px. 12px is for badges and counts only.
- Figure labels render at 11px or larger at every viewport.
- Reading column in the card detail is at most 68 characters.

## Spacing and layout

4px scale, `--space-1` to `--space-13`, no off-scale values.

**Desktop (≥ 1024px), three columns.** Header 56px. Rail 248px · figure (flexible) · panel 440px.
- *Rail*: the nine structures, name and color tick only. The open structure expands in place to show its sub-regions with a count. One open at a time. No per-row progress, no keyboard hints, no inset.
- *Figure*: breadcrumb at top; plate in the middle; one caption row (title, "Schematic, not a clinical photograph", Finding / Normal switch); depth scrub at the bottom with a labelled thumb ("Retina · 7 of 9").
- *Panel*: master–detail. List state: one row per condition (triage word, name, one-line hook). Detail state: back link, title, badges, four tabs (Snapshot · Workup · Management · Evidence), then a footer with review status, sources and "Report an error".
- Filters sit behind one "Filter" button with a count. Region is chosen in the rail, so it is not a filter.

**Tablet (640–1023px).** Rail collapses to a "Structures" button that opens it as a left drawer. Figure above, panel below.

**Phone (< 640px).** One-row header 52px (name, search, menu). Figure takes the top of the screen. Depth slider under it. A bottom sheet holds the list and the card, with three snap points: peek 96px, half, full. Sticky controls never exceed 56px. The sheet has a "Structures" list that does everything tapping the diagram does.

## Shape, depth, motion

- Radius 2px everywhere. Exception: the round slider thumb and triage dots.
- No shadows. The phone sheet is separated by a hairline and the surface color.
- Motion: one transition, `--fade` 160ms ease-out on opacity or color. Depth changes crossfade between layers. No scale, slide-in, flash or bounce. The sheet follows the finger and settles without overshoot. `prefers-reduced-motion` sets it to instant.

## Components

- **Button.** Primary: `--accent` fill, `--accent-ink` text. Secondary: `--line-2` border, `--ink` text. Quiet: text only, `--accent`. Height 36px desktop, 44px touch. Hover darkens the border or fill one step; disabled is 40% opacity with `aria-disabled`.
- **Link.** `--accent`, underlined on hover and focus. ↗ only when it leaves atlas.seanleels.com.
- **Focus.** 2px `--accent` outline, 3px offset, on every interactive element including SVG regions.
- **Rail row.** 40px (44px touch). 3px structure tick, name, count in mono `--muted`. Selected: `--surface-2` ground and 600 weight. Child rows indent `--space-6`.
- **Condition row.** 64px min. Line 1: triage dot and word (12px, uppercase allowed here because it is a status), then the name (16px/600). Line 2: hook, one line, `--muted`. Whole row is one button. Hairline between rows.
- **Tabs.** Text tabs with a 2px `--accent` underline on the selected one. Arrow keys move between them.
- **Badge.** Uppercase 12px, 2px radius, soft triage ground with the triage color as text. Only for status: EMERGENT, URGENT, ROUTINE, DRAFT, REVIEWED.
- **Tag.** Sentence case, hairline border, `--ink-2` (category, High-yield).
- **Section label** inside a card: Public Sans 14px/600, sentence case ("Risk factors"), no rule above.
- **Depth scrub.** A track with nine ticks and a round thumb carrying the structure name. `role="slider"`, arrow keys step it.
- **Search.** Input with `--line-2` border. Results are condition rows plus the structure name.
- **Sheet (phone).** Hairline top edge, 4px × 36px grab handle, three snap points. Content scrolls only at full height.
- **Footer.** "Eye Atlas by Sean Lee · seanleels.com ↗ · Educational, not medical advice · Stores no patient data."

## Figures

Every drawing is a **plate**: flat tones, fine line, labels with leader lines. Full rules for whoever draws them are in `eye-atlas/DRAWING-RULES.md`.

Three styles were mocked on the "Eye Atlas — Design Options" canvas:
- **A. Ink plate.** Monochrome line and stipple on paper. One spot color marks the finding.
- **B. Tonal plate (recommended).** Muted flat tissue tones, fine outline, no gradients. Findings in a subdued natural color.
- **C. Fundus-camera plate.** Dark surround, stepped tones, closest to a photograph.

Recommendation is B: it keeps color cues that matter clinically (pallor, hemorrhage, whitening), which A loses, and it stays honest about being a schematic, which C blurs. The `--fig-*` tokens currently hold style B.

Fixed for any style:
- Figures keep their plate colors in dark mode and sit on a light plate ground (`--plate`), like a printed figure. Plate labels use fixed `--fig-label`, not `--ink-2`.
- Every figure carries the caption "Schematic, not a clinical photograph."
- Real images are a separate tier with a visible credit and licence. Never mixed into a schematic.
- Dashes, color and line weight each mean one thing (see DRAWING-RULES.md).

## Added Nov 13, 2026 (after the Nov 13 audit)

Basis: the Nov 13 audit of the live site and the rules above. The UXKIN library is not connected, so none of this is based on comparing reference sites. Each item reuses an existing component; no new colors, fonts or radii.

- **View switch.** Stops that are taught in section (cornea, anterior chamber, lens, choroid) get a second plate. The switch is the existing segmented control in the caption row: "Front view" / "Cross-section". It is hidden while a finding is shown, because finding drawings are front-view only; the Finding / Normal switch takes its place. Cross-section bands are buttons that pick the sub-region, the same as front-view regions.
- **Finding labels.** When a finding is shown the anatomy labels are hidden, not dimmed (12% opacity text is unreadable clutter). The finding gets one to three labels in the same label style, leader ending on the finding. A figure with no finding labels yet shows none; the caption still names the finding.
- **Figure in the phone card.** On a phone the card starts with its figure: a plate across the card, at most 240px tall, on `--plate`, with the caption line under it. It replaces the "Show figure" button. It is a picture only (`role="img"` with the caption as its name); the interactive diagram stays in the stage.
- **Plate size on desktop.** The plate is never taller than its figure. The figure area is square, capped by the column width and the space available; spare height stays as stage ground under the depth scrub.
- **Touch targets.** Below 1024px every rail row, region chip, tab and cross-reference is 44px tall. The depth track and the sheet handle keep their look but have a 44px hit area.
- **Search.** Common abbreviations (GCA, CRAO, PVD…) expand to their full terms. Search also reads presentation, management and differential text. A name or abbreviation match always ranks above a body-text match.
- **Source list (Evidence tab).** One entry per source: authors, title, journal and year in body text; PMID in mono; the DOI as a link with ↗; then "Checked" and an absolute date. A trial line shows its sources as bracketed numbers that match the list. A card with no checked source keeps the "Not yet added" line.
- **Self-test.** A view in the panel, opened from the list header ("Self-test", secondary button). The plate shows a finding with its caption withheld. Four answers are condition rows without triage word or hook. After answering: the right row carries the word "Correct" in `--routine`, a wrong pick carries "Your answer" in `--emergent` (never color alone), the caption appears, and one primary "Next" button moves on. The running score is mono. Questions come only from cards that have a figure, and the four answers come from the same structure.
- **Without JavaScript.** The page shows the nine structures and their sub-regions as a plain ruled list with their one-line descriptions, and says the diagram and cards need JavaScript. Card text is not duplicated into the page (that needs a build step, which is an open decision).

## Accessibility

- Text ≥ 4.5:1 in light and dark (computed above). Controls ≥ 44px on touch.
- The diagram is operable by keyboard: each region is focusable with a name; the "Structures" list is the equivalent non-visual path.
- Works at 375px with no sideways scroll.
- JavaScript off: the page shows the structure list and descriptions (see "Added Nov 13, 2026"). Card text without JavaScript is **not met yet**.
- Short landscape phones (height ≤ 500px) hide the diagram labels, which would be unreadable; the Structures list replaces them.
- Depth changes and card opens are announced through one polite live region.

## Decisions Sean still needs to make

1. ~~Figure style: A, B or C.~~ **Decided Nov 11, 2026: B, tonal plate.**
2. ~~Layout~~ Built as mocked on Nov 11, 2026 (two-level rail, master–detail panel). Sean to confirm after using it.
3. ~~Phone~~ Built as mocked on Nov 11, 2026 (bottom sheet). Sean to confirm after using it.
4. Tissue tones for the non-fundus stops (in `tokens.css`, set Nov 11, 2026). Sean to review.

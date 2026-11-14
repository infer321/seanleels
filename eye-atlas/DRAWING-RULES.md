# Eye Atlas · drawing rules (tonal plate)

Decided Nov 11, 2026: style B, tonal plate. Reference drawings: the "B · Tonal plate" board on the "Eye Atlas — Design Options" canvas (normal fundus, CRAO, papilledema).

These rules are for whoever restyles the 221 existing drawings. **Restyle through the shared helpers and tokens; do not redraw figures one by one.** Shapes and positions stay; fills, strokes and effects change.

## The ten rules

1. **Flat fills only.** No `radialGradient`, `linearGradient`, filters, blur, glow or drop shadow. Today there are 3 gradients; remove all of them. Depth is shown with two or three flat tone steps (see the fundus: `--fig-fundus`, then `--fig-pole`, then `--fig-macula`).
2. **Colors come from `--fig-*` tokens.** No raw hex in drawing code. Add a token before adding a color.
3. **Muted, not saturated.** Tissue tones stay in the token range. Nothing brighter than `--fig-finding` appears in a figure.
4. **One outline weight per role.** Globe or field outline 0.9. Structure outline 0.6. Arteries 1.3, veins 2.1 (veins are always darker and wider). Leader lines 0.8 in `--fig-leader`. Units are viewBox units at a 320-unit field.
5. **Every mark means something.** No decorative strokes, sparkles, highlights or texture for its own sake.
6. **Dashes are reserved.** A dashed vessel means segmented blood column (boxcarring). A dotted outline means "extent of an area that has no real edge" (edema, whitening). Dashes never mean "style".
7. **Findings are the darkest or palest thing in the plate.** Blood and the cherry-red spot use `--fig-finding`. Ischemia, edema and exudate use `--fig-pale` in one or two flat steps. The eye should land on the finding first.
8. **Soft edges are drawn as two flat steps**, never as blur. Example: the swollen disc is a 30-unit circle in a darker tone under a 25-unit circle in a lighter tone.
9. **Labels.** Public Sans, `--fig-label`, 11px or larger as rendered at every viewport, sentence case, at most four per figure (a layer cross-section may label each layer, up to six). Leader lines are straight, never cross each other, and end on the structure. Labels sit outside the field.
10. **Every figure has a caption and alt text.** Caption: the condition, the view (for example "fundus, right eye"), and "Schematic, not a clinical photograph." Alt text names the findings shown.

## Tokens (light; figures keep these in dark mode on a light plate)

| Token | Value | Use |
|---|---|---|
| `--fig-outline` | #5a4a42 | Field and structure outlines |
| `--fig-fundus` | #d6a07e | Fundus ground |
| `--fig-pole` | #deb08f | Posterior pole, one step lighter |
| `--fig-macula` | #c98f70 | Macula, one step darker |
| `--fig-fovea` | #a8674f | Fovea |
| `--fig-disc`, `--fig-cup` | #f1dcbc, #f8edd8 | Optic disc and cup |
| `--fig-artery`, `--fig-vein` | #a8483a, #6e2a26 | Vessels |
| `--fig-finding` | #8f2620 | Blood, cherry-red spot |
| `--fig-pale` | #efe2d2 | Whitening, edema, exudate |
| `--fig-label`, `--fig-leader` | #2e3a47, #8a96a3 | Labels and leader lines (fixed, because the plate stays light in dark mode) |
| `--plate`, `--field`, `--field-ring` | #fbfaf7, #eef0f2, #d3d9df | Plate ground and the circular exam field |
| `--pl-<stop>` | nine muted hues | Structure tints inside a plate (the UI ticks keep the brighter `--c-<stop>`) |

Tissue tones for the other stops (skin, sclera, iris, lens, choroid, RPE and the rest) were set on Nov 11, 2026 in the same muted range and live in `tokens.css`. **They are for Sean's review**: change them there, nowhere else.

## What the build does today (Nov 11, 2026)

- All gradients and blur filters are removed from the layer builders and the drawing defs.
- The layers use tokens. The 221 pathology drawings still contain raw hex in their source (about 200 distinct values). Every drawing passes through one `plate()` step at render time that strips blur filters and desaturates each color (saturation × 0.62, capped at 0.52; lightness unchanged; near-whites kept). This enforces the palette range for all of them at once.
- Follow-up: replace the raw hex in the drawing source with `--fig-*` tokens, one helper at a time, then retire the `plate()` step. Until then, rule 2 is met at render time but not in source.
- Specular highlights, drop shadows and the zoom-in depth transition are gone; depth changes crossfade.

## Added Nov 13, 2026

- **Cross-section plates** for cornea, anterior chamber and angle, lens, and choroid (`xsCornea`, `xsAC`, `xsLens`, `xsChoroid`). Same tokens and line weights as the front views. They are marked "not to scale". Band heights are chosen for legibility, not measured. **For Sean's review:** proportions and label wording.
- **Finding labels.** 29 of the 221 finding drawings have one to three labels (`FLBL`): every emergent card whose finding sits at a fixed place, plus corneal abrasion. Findings drawn as scattered random dots are not labelled, because a leader cannot be guaranteed to land on one. The rest still need labels.
- **Anatomy labels are hidden, not dimmed,** while a finding is shown.
- **Choroid front view.** Each vortex ampulla now collects thin, curved tributaries from the posterior side in one rotational sense, in place of thick spokes in every direction. Ampulla positions (near the equator, one per quadrant) are unchanged, so the 17 choroid finding drawings still line up.
- **Optic nerve front view.** The central vessels now leave the nasal side of the cup as one trunk each and divide on the disc.
- **Adnexa.** Four labels in place of six, none crossing. The lower lid and bulbar conjunctiva keep their regions and hover names.

## How to apply it to the existing code

- The drawing helpers in `eye-atlas.html` (`Bl`/`blobD`, `Ci`, `Ln`, `flame`/`flameD`, `cws`, `conjInj`, `hypo`, `nvRing`, `nvFrond`, `arcSegD`, `polarPath`, `lensAt`) take the new style through tokens and default stroke widths. Change them once.
- The nine layer builders (`layerAdnexa` … `layerOptic`) lose their gradients and saturated fills and use the tone steps.
- Remove the `pin`, `flash` and `reveal` animations. A figure appears with the single 160ms fade.
- Fluorescein figures keep a cobalt view, in flat tones.
- Seeded randomness (`rng`) stays, so drawings are identical on every load.

## Review checklist for each restyled figure

- No gradient, filter or shadow in the output SVG.
- No raw hex.
- The finding is the first thing you notice.
- Labels are 11px or larger at 390px wide.
- Caption and alt text are present.
- It still matches what the card's "Exam findings" says. If the drawing shows something the card doesn't mention, or the reverse, flag it for clinical review instead of guessing.

## Real images (a separate tier, later)

Schematics never imitate photographs. If real images are added, each needs a manifest entry with `source`, `licence`, `credit` and `url`; only open-licence images (CC0, CC BY, CC BY-SA) or images Sean has written permission to use; de-identified; shown with a visible credit line. No AAO, textbook or journal figures without permission.

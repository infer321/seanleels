# Ophtho Case of the Day · Design system

**What it is:** a daily ophthalmology diagnosis game. Six clues open one at a time, written like an exam note, and you name the diagnosis with as few as you can. A new case opens at local midnight, and a practice mode serves random cases. Status: Beta.

**Audience:** medical students and residents who want a two-minute daily habit, and program directors or faculty who land here from seanleels.com. Most play on a phone.

**Feeling:** an eye chart in a clinic. Plain, high-contrast and legible, with one joke: the title is the top of a Snellen chart.

**Relationship to seanleels.com:** a tool with its own identity, like Eye Atlas. It differs because a game needs different things from a reading page: strong display type, a blue action color that isn't confused with the home site's gold links, and red and green to mean wrong and right. It shares the footer link back to seanleels.com, the favicon, the 4px spacing scale, the 2px radius, the no-shadow rule, and the contrast and accessibility rules.

**Theme:** follows the visitor's device (chart paper in light, a dimmed exam room in dark). Print is always light.

Not based on comparisons with real reference sites (UXKIN not connected). Decisions come from the original game, seanleels.com and the audience.

---

## Color

Pages use token names (`tokens.css`), never raw hex values.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | #f3f5fa | #0a0d15 | Page |
| `--surface` | #ffffff | #121726 | Case card, result card, guess field |
| `--border` | #dce1eb | #242b40 | Hairlines |
| `--border-strong` | #7f889d | #6d7690 | Controls: field, secondary button, empty attempt box, Beta badge (3:1 on `--bg`) |
| `--chip` | #e7ebf6 | #1a2136 | Locked clue bars, skipped attempts, chart tracks, highlighted suggestion |
| `--accent` | #2340c8 | #8ea1ff | **Primary:** buttons and links |
| `--accent-hover` | #1a2f96 | #b4c1ff | Hover |
| `--on-accent` | #ffffff | #0a0d15 | Text on accent |
| `--heading`, `--text` | #121621 | #e6e9f2 | Titles and clue text |
| `--muted` | #545c6e | #a4abbd | Labels, meta, footer |
| `--wrong` | #b92c25 | #ff7d72 | Wrong guess, unsolved verdict |
| `--right` | #16703e | #5fdc9e | Correct guess, solved verdict, today's bar in the record |
| `--on-status` | #ffffff | #0a0d15 | Symbol on a wrong or right attempt |
| `--bar` | #6f7890 | #8e96aa | Bars in the record chart |

- **Red and green never work alone.** About 1 in 12 men can't separate them, which matters more than usual on an eye site. Attempts carry a symbol (× wrong, – skipped, ✓ correct), and verdicts are words.
- All text ≥ 4.5:1 in both themes, computed.

## Typography

| Role | Family | Size token | Weight | Line height |
| --- | --- | --- | --- | --- |
| Snellen masthead, three rows | Archivo, expanded | `--fs-chart-1` to `-3` | 800 | 1.05 |
| Diagnosis in the result | Archivo, expanded | `--fs-dx` 22–28px | 800 | 1.15 |
| Record numbers | Archivo, expanded | `--fs-num` 26px | 800 | 1.1 |
| Card and section titles | Archivo, expanded | `--fs-lg` 18px | 700 | 1.3 |
| Guess field | Atkinson Hyperlegible | `--fs-lg` 18px | 400 | 1.5 |
| Clues and body | Atkinson Hyperlegible | `--fs-body` 16px | 400 | 1.5 |
| Labels, meta, footer | Atkinson Hyperlegible | `--fs-sm` 14px | 400–700 | 1.5 |
| Beta badge | Atkinson Hyperlegible | `--fs-xs` 12px | 700 | 1.5 |
| Chart labels, record counts | Archivo, expanded | `--fs-xs`, `--fs-sm` | 400 | 1.5 |

- **Why these two:** Archivo's expanded cut has the blunt, wide shape of chart letters. Atkinson Hyperlegible was designed by the Braille Institute for low-vision readers, which suits clue text and an eye site. The original game's third font (IBM Plex Mono) is gone; two families were enough.
- **Capitals:** the masthead is set in capitals because it is an eye chart. Elsewhere uppercase appears only on the Beta badge.
- **Zeros:** Atkinson draws a slashed zero so it can't be mistaken for the letter O. That helps in clue text, but it gets muddy at small sizes, so chart labels and record counts use Archivo.
- **Chart labels:** 20/200, 20/100 and 20/70 are small labels that say what each row is, as they do on a real chart. They are not display numerals.

## Spacing

The 4px scale shared with seanleels.com (`--space-1` … `--space-13`). Every padding, margin and gap uses a token.

- **Content width:** one 640px column (`--w-column`), with a 24px side gutter (16px on phones).
- **Between blocks:** `--space-5`.

## Shape and depth

- **Radius:** 2px everywhere (`--radius`).
- **No shadows.** The suggestion list is lifted off the page with a `--border-strong` outline.

## Components

- **Buttons.** One primary per view: Guess while playing, Copy result when finished. Secondary: `--border-strong` outline with accent text. Quiet: underlined accent text. All at least 44px tall. Focus shows a 2px accent outline offset 3px. Disabled is 50% opacity.
- **Case card.** Exam-note rows: label on the left, clue on the right, stacked on phones. Locked rows keep their label, so you can see which test is coming, and show a `--chip` bar.
- **Attempts.** Six boxes with a symbol once used.
- **Guess field.** Autocomplete from every case's accepted names plus common distractors, so the list doesn't give the answer away.
- **Result.** Verdict, diagnosis, one teaching pearl, copy and practice buttons.
- **Record.** A hairline-ruled block, not a card: four numbers, then a chart of clues needed once a day has been played. Counts sit beside the bars. Today's bar is `--right`, or `--wrong` for a miss.
- **Footer.** Not-medical-advice line, storage note, content date, link home.

## Motion

A newly opened clue rises 4px and fades in over 420ms so the eye finds it. There is no other motion, and none under `prefers-reduced-motion`.

## Imagery and icons

None. The chart is the picture. Emoji never appear on the page. The one exception is the text placed on the clipboard by Copy result, which uses colored squares because that is how these results read when pasted into a group chat. If the clipboard is blocked, that same text appears in a box for manual copying.

## Behavior notes

- Works with JavaScript off only as far as explaining what it is: the page shows the masthead, a short note and the footer.
- Progress lives in `localStorage` under `ophtho-cotd-v1`. Nothing leaves the browser, and no patient data exists here. The vignettes are fictional.
- Daily numbering starts at #1 on 2 Nov 2026. Cases come from a fixed shuffle of the bank and repeat when the bank runs out, so adding cases to `game.js` changes the order of future days.
- Served at `seanleels.com/case/` on GitHub Pages. If it later moves to `case.seanleels.com`, add the hostname redirect from `reads/index.html` and update the canonical tag.

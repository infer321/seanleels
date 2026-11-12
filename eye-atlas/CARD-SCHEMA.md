# Eye Atlas · card schema (v2)

Last updated: Nov 11, 2026. This is the contract for every condition card. The 238 existing cards use v1 (the fields marked "existing"). v2 adds sources, review status and dates. **No field is ever filled from memory: a source is added only after it has been opened and checked.**

## TypeScript shape

```ts
type Urgency = 'E' | 'U' | 'R';                 // Emergent, Urgent, Routine
type ReviewStatus = 'unreviewed' | 'source-checked' | 'attending-reviewed';

interface Source {
  id: string;                 // short key used by claims, e.g. "eagle-2010"
  type: 'trial' | 'guideline' | 'textbook' | 'review' | 'reference';
  title: string;              // exact title as published
  authors?: string;           // "Schumacher M, et al."
  journal?: string;
  year: number;
  pmid?: string;              // verified in PubMed
  doi?: string;               // rendered as a link
  url?: string;               // for guidelines (AAO PPP) and EyeWiki
  section?: string;           // textbook: "BCSC Section 12, Ch. 6" (edition year in `year`)
  checked: string;            // ISO date the source was opened and matched to the claim
}

interface Trial {             // replaces v1 [name, finding] tuples
  name: string;               // "EAGLE"
  finding: string;            // one sentence, in our words
  source: string;             // Source.id — required
}

interface Card {
  // existing (v1)
  id: string;                 // slug of name; stable, used in URLs
  name: string;
  aka?: string;
  s: string;                  // stop id: adnexa | cornea | ac | iris | lens | vitreous | retina | choroid | optic
  sub: string;                // sub-region id within the stop
  urg: Urgency;
  cat: string;                // Vascular, Infectious, Degenerative, ...
  hy: boolean;                // high-yield
  hook: string;               // one or two sentences
  risk: string[];
  pres: string[];
  find: string[];
  work: string[];
  ddx: string[];              // card ids or names; unresolved strings render as plain text
  mgmt: string[];
  comp?: string[];
  pearls: string[];

  // new (v2)
  trials?: Trial[];
  sources: Source[];          // at least one before status can leave 'unreviewed'
  cites?: Record<string, string[]>;
                              // which source backs which line, e.g. { "find.0": ["bcsc-12-2025"], "mgmt.2": ["eagle-2010"] }
                              // required for every line that contains a number, a percentage or a time window
  review: {
    status: ReviewStatus;
    by?: string;              // reviewer name, only with their permission
    date?: string;            // ISO date of the last status change
    notes?: string;           // open questions for the reviewer
  };
  updated: string;            // ISO date of the last content change, shown on the card
  outline?: string[];         // content-outline areas this card covers, for the coverage matrix
  fig?: { caption: string; alt: string; view: string };  // the drawing itself stays keyed by card id
}
```

## Which tab shows what

| Tab | Fields |
|---|---|
| Header (always visible) | `urg`, `cat`, `hy`, `name`, `aka`, `hook` |
| Snapshot | `risk`, `pres`, `find` |
| Workup | `work`, `ddx` |
| Management | `mgmt`, `comp` |
| Evidence | `trials`, `pearls`, `sources` |
| Footer (always visible) | `review.status`, `updated`, Report an error |

## Rules

1. **Status ladder.** `unreviewed` (default for all 238 today) → `source-checked` (every numbered claim and every trial has a checked source) → `attending-reviewed` (a named ophthalmologist has read it). The card shows the status as a badge: DRAFT, SOURCE-CHECKED, REVIEWED. Never show REVIEWED without a real reviewer and date.
2. **Trials need a verified source.** Look up each trial in PubMed, confirm the finding against the abstract or paper, then record `pmid` and `doi`. If the paper says something different, fix the sentence. If no paper can be found, delete the trial line and log it in VERIFY.md.
3. **Numbers need a cite.** Any line with a percentage, rate, dose, threshold or time window gets an entry in `cites`. No source means the number comes out or the line is softened ("a minority", "within hours").
4. **Preferred sources, in order:** the primary trial; AAO Preferred Practice Pattern; AAO BCSC (cite section and chapter, never quote at length); a recent review; EyeWiki as a pointer only.
5. **Our words.** Summaries are written fresh. At most one short quote per source.
6. **Dates are absolute** (`2026-11-11`), never "recently".
7. **Validation.** A script fails the build if any card lacks `sources` while its status is above `unreviewed`, any `Trial.source` or `cites` id doesn't resolve, any `ddx` id is misspelled against the id list, or any id is duplicated.

## VERIFY.md (one row per card)

`| id | stop | status | open questions | checked by | date |`

Work order: retina (52), optic nerve (22), anterior chamber and glaucoma (20), then the rest. Start with the 43 existing trial lines and the figures already flagged: ZEDS, cenegermin healing rates, CPTS.

## Example (CRAO, after verification; values marked TODO are not yet checked)

```ts
{
  id: 'central-retinal-artery-occlusion',
  name: 'Central retinal artery occlusion', s: 'retina', sub: 'vessels',
  urg: 'E', cat: 'Vascular', hy: true,
  hook: 'Sudden painless profound monocular vision loss: an eye stroke. Send to a stroke center now and rule out GCA.',
  // risk, pres, find, work, ddx, mgmt, comp, pearls unchanged from v1
  trials: [{ name: 'EAGLE', finding: 'Intra-arterial fibrinolysis was no better than conservative treatment and caused more adverse events.', source: 'eagle' }],
  sources: [{ id: 'eagle', type: 'trial', title: 'TODO: copy from PubMed', year: 0 /* TODO */, pmid: 'TODO', doi: 'TODO', checked: 'TODO' }],
  cites: { 'trials.0': ['eagle'] },
  review: { status: 'unreviewed' },
  updated: '2026-11-11'
}
```

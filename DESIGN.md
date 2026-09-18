# How this board is built

The hub and the three boards it opens share one design. Same palette, same two faces, same three shapes, same shell. A person who knows one can read the others without learning anything new. This file is the hub's copy of that agreement; where it differs, it is because the hub has something the boards do not, never because a choice drifted.

## Colour

Colours live as custom properties on `:root` in `assets/css/styles.css`, redefined once under `@media (prefers-color-scheme: dark)`. Nothing in the stylesheet uses a raw colour value, with two deliberate exceptions noted below — if a new colour is needed, it becomes a token first.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--page` | `#F1F6F3` | `#0A130F` | The ground behind everything |
| `--card` | `#FFFFFF` | `#12201A` | Panels, tiles, the menu, the raised surfaces |
| `--field` | `#E6EEE9` | `#1A2B24` | Inputs, chip backgrounds, tracks |
| `--ink` | `#11211B` | `#E7F0EB` | Body text |
| `--muted` | `#52665D` | `#96A9A0` | Second-line text, labels, captions |
| `--line` | `#D6E4DC` | `#26382F` | Hairlines and dividers |
| `--navy` / `--navy-deep` | `#14352C` / `#0C211A` | `#143027` / `#0C1F19` | The dark card art, the sign-in panel |
| `--accent` | `#17A57C` | `#3FBF95` | The green both boards are known by |
| `--accent-ink` | `#0A6B50` | `#7FDCBB` | Links, and text on green |
| `--college-sa` / `--college-mc` / `--college-bv` | teal / red / navy | lighter versions | Skills Academy, Matric College and Bellview, wherever a chart splits by college |
| `--focus` | `#0F766E` | `#6EE7C4` | The focus ring |

**Matric College's red is a college colour, not a verdict.** Every chart that uses the college colours names them in its key, and a state still lives in a chip or a tinted card, never in a bar or a slice.

**The three status colours** carry meaning and are used nowhere decorative: red for stop (needs repair, waiting 8 days or more, nothing recorded), yellow for hold (fixed but unchecked, waiting 4 to 7 days), green for go (checked and passed, something recorded).

**Contrast.** Every text colour measures at least 4.5:1 against the surface behind it, in both themes, measured against its own tint rather than the page.

## Type

Two faces, from Google Fonts:

- **Archivo** (500/600/700) for headings, figures and anything counted.
- **Nunito** (400/600/700) for running text.

Figures use `font-variant-numeric: tabular-nums` wherever they line up in a column, so a changing number does not shift the ones beside it.

## Space and shape

**Three shapes, and nothing else.**

| Token | Size | For |
| --- | --- | --- |
| `--radius` | 16px | Surfaces: panels, tiles, cards, dialogs |
| `--radius-control` | 10px | Controls: buttons, inputs, selects, the menu, notices, the toast |
| `--radius-mark` | 4px | Marks: small bars and swatches |

Pills (`999px`) are for chips and counts only; `50%` is for avatars. Nothing else rounds its own corners.

**Depth instead of outlines.** A surface lifts off the page with `--shell` rather than drawing a border around itself. In dark mode `--shell` becomes a single hairline, because a shadow on a dark ground reads as dirt.

**The page rhythm is 22px.** `.app-main` spaces its children by 22px and `.grid` uses the same gap. Cards in a row stretch to the same depth, so nothing floats above a gap.

## What the hub will not do

These are design decisions, not missing work:

- **It keeps no figures.** Every number is asked of the board that owns it, so the hub cannot be out of date or out of step. A board that does not answer is shown as unread rather than guessed at.
- **It adds nothing across boards.** The only sum it does is counting how many things are waiting, because that is a count of links and not a measure of anything.
- **It does not compare two boards' figures.** Two boards read at different times, so a number from one is not a number from the other. Each card says when its board was read.
- **It carries no machine review.** Nothing here judges, ranks or suggests.

## Components

- **The menu** — a light column on `--card`, held off the page by a single hairline, with the three boards themselves under **Other boards** at the foot. Three pages fit easily, but the same `clamp()` sizing is kept so the menu behaves like the others on a short screen.
- **The page header** — the page name and its one-line note, closed by a hairline.
- **The attention list** — on Home, everything the three boards say is waiting, in two groups: **Needs a decision**, meaning somebody has to choose, and **Waiting on someone**, meaning it is moving but not finished. Each row is a count, what it is, and a tag saying which board it came from, and the whole row links into that group on that board. Which group an item lands in is the board's own call, set in its `summary.js`, because the board knows whether a thing is a decision or a queue.
- **The readings line** — under the controls on Home, naming when each board was read. Three boards are three separate readings, and a page that shows them together has to say so or it invites a comparison it cannot support.
- **Save this list** — the attention list as a spreadsheet file, through the same `downloadRows()` the boards use. It writes what is on screen, with a full address for each row, so it can be pasted into an agenda.
- **The board door** — on The boards, one card per board and the whole card is the link. It shows that board's headline figures, how many things are waiting and when it was read. A board that has not answered shows the reason in its place.

- **`.panel`** — the surface everything else sits in.
- **Tables** (`.results`) show a heading row on a laptop. On a phone the heading row is hidden and each cell carries its own heading through `data-label`.
- **Sign in** — one card resting on `--page`: the green panel on the left with the brand, the lead line and three points; the form on the right. The panel's soft lights are radial gradients on a `::after`, never images. Under 900px the panel drops away and the form fills the screen.

## Asking the boards

All four sites sit on one address, so `assets/js/shared/boards.js` opens each board's `summary.html` in a hidden frame and listens for what it posts back. The origin is checked before a message is read, so nothing from elsewhere can put a figure on the hub. A board that does not answer within eight seconds is shown as unread, with the reason, and nothing is carried over from a previous visit.

The hub finds its neighbours by stepping out of its own folder rather than by a written-down address, so the set works served from the top of a domain or from a folder inside one.

`tools/build-pages.js` writes the three signed-in pages from one template, the same as the lead tracker.

## Asset addresses

Every link to a stylesheet, a script or the logo carries `?v=` and a short hash of that file, written by `tools/stamp-assets.js` before a commit. GitHub Pages caches assets for ten minutes, and without this a new page can load beside a cached older script: the markup is there, the behaviour is not, and the page looks broken in a way nothing on screen explains.

## Motion

Almost none, and always short: 0.15s ease on colour and shadow, and the menu drawer sliding in. `prefers-reduced-motion` turns transitions off. Nothing animates on load — the page is readable in its first frame.

## Writing

Plain words, and the same voice as the mailer board. A control says exactly what happens. A figure says what it counts and what it does not. Nothing on the page claims a result the numbers do not support.

## Accessibility

Every control reaches 44px on a touch screen, every field has a real label, focus is always visible, and colour is never the only thing carrying a meaning — a status has words as well as a tint.

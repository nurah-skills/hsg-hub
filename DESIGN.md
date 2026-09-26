# How this board is built

> **This board follows the Service Board design system.** Its tokens, type, spacing,
> radii and component rules come from there, so the boards in the family read as one
> thing. Where this file and the system disagree, the system wins — except for the one
> deviation recorded under Colour.

The hub and the three boards it opens share one design. Same palette, same two faces, same three shapes, same shell. A person who knows one can read the others without learning anything new. This file is the hub's copy of that agreement; where it differs, it is because the hub has something the boards do not, never because a choice drifted.

## Colour

The palette is the Service Board system's, light only. The boards are read at a desk in
office light and on meeting-room projectors, so there is no dark theme.

| Token | Value | Used for |
| --- | --- | --- |
| `--page` | `#F4F5F8` | The cool grey canvas behind every card |
| `--card` | `#FFFFFF` | Cards, the sidebar, controls |
| `--subtle` | `#FAFBFC` | Table headers, row hover, the user block |
| `--ink` | `#0F172A` | Headings, figures and body text |
| `--ink-2` | `#334155` | Secondary text: menu rows, table cells, neutral pills |
| `--muted` | `#5B6878` | Notes, labels, chart axes |
| `--line` | `#E7E9EE` | The hairline every surface is defined by |
| `--accent` | `#2F6FEB` | Charts, focus rings. Never text |
| `--accent-ink` | `#1D56C9` | Link and accent text |
| `--navy` | `#0E1B3D` | Primary buttons, the current menu icon, the dark card art |

**The State Colour Rule.** Green means on track, amber means attention, red means late,
and they mean nothing else. They appear as a soft pill, a thin meter or a short phrase —
never as a card fill.

**One deviation from the system, deliberately.** The system sets `--muted` to `#64748B`,
and its own note warns that this reaches only 4.4:1 on the page. These boards also use
`--field` and the segmented track as surfaces, where it falls to 4.17:1 and 4.02:1 —
below the system's own 4.5:1 requirement. One notch darker, `#5B6878`, clears 4.5:1 on
all five grounds these boards actually use.

## Type

One face, **Geist**, at 400/500/600/700, carries everything. **Geist Mono** at 500 is for
figures that should read like an instrument, and never for words. Both load from Google
Fonts, the only external resource the content security policy allows.

Every figure, table and scorecard uses `font-variant-numeric: tabular-nums`.

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
- **The page header** — the page name and its one-line note, closed by a hairline. A page's own actions (**Save this list** on Home) sit on the right beside **Read the boards again**, never at the foot of the page. A preview page's note does not say "a preview": its banner already does.
- **The attention list** — on Home, everything the three boards say is waiting, in two groups: **Needs a decision**, meaning somebody has to choose, and **Waiting on someone**, meaning it is moving but not finished. Each row is a count, what it is, and a tag saying which board it came from, and the whole row links into that group on that board. Which group an item lands in is the board's own call, set in its `summary.js`, because the board knows whether a thing is a decision or a queue.
- **A preview page** — a page for something not built, carrying `.preview-banner` at the top: what is not built, what on the page is invented and what is real, and a link to the reasoning. Controls that would write are drawn and disabled rather than left out, so the shape is honest, and nothing on a preview page is ever counted anywhere else.
- **A mock** — a small dashed-edge block inside an item on **What's next**, showing what the thing would look like, with a line underneath saying it is made up.
- **A Soon entry** — a menu row for something that is not built, greyed, with a **Soon** tag, and linking to the part of **What's next** that explains it. It is never a dead control: a menu item that does nothing teaches people not to trust the ones that do.
- **The readings line** — under the controls on Home, naming when each board was read, and which board did not answer. Three boards are three separate readings, and a page that shows them together has to say so or it invites a comparison it cannot support. Which boards answered is said here and nowhere else on the page.
- **The Home figures** — two tiles, **Needs a decision** and **Waiting on someone**, each with its (i) and its base ("across all three boards"). They are the only place on Home the two totals appear: there is no banner restating them and no count on the list groups. There is no combined total either, since it would only be the two added together.
- **Saved views** — behind one secondary button at the end of the filter row (the disclosure the student tracker calls **More filters**; here saved views are the only thing behind it, so the button says so). It opens by itself when the page is showing a saved view, counts the views kept for the page when closed ("Saved views · 2"), reads **Hide saved views** when open, and carries `aria-expanded`/`aria-controls`. The controls fade in over 150ms on `--ease-out` through `@starting-style`, with no slide and no transition under reduced motion. On a phone the set spans the row.
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

Almost none, and always short: 0.15s ease on colour and shadow, the saved-views fade (150ms, `--ease-out`), and the menu drawer sliding in. `prefers-reduced-motion` turns transitions off. Nothing animates on load — the page is readable in its first frame.

## Writing

Plain words, and the same voice as the mailer board. A control says exactly what happens. A figure says what it counts and what it does not. Nothing on the page claims a result the numbers do not support.

## Accessibility

Every control reaches 44px on a touch screen, every field has a real label, focus is always visible, and colour is never the only thing carrying a meaning — a status has words as well as a tint.

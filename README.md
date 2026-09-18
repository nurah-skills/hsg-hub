# HSG boards

One front door to the three HSG boards: what needs you on each one, and a way straight in.

**Live:** https://nurah-skills.github.io/hsg-hub/

## The three boards

| Board | What it holds | Live |
| --- | --- | --- |
| Sales scoreboard | Registrations and cash by person and college, with the cards that recognise them. | https://nurah-skills.github.io/every-sale-matters/ |
| Mailer board | What is ready to send, what needs a decision, and what the mail did. | https://nurah-skills.github.io/hsg-mailer-management/ |
| Lead tracker | Where the survey leads went, how long they waited, and what was recorded. | https://nurah-skills.github.io/hsg-lead-tracker/ |

## Where the figures come from

**The hub keeps no figures of its own.** Every number on it is asked of the board that owns it, so the hub and the board can never disagree.

All four sites sit on the same address, so the hub opens each board's `summary.html` in a hidden frame. That page runs the board's own data and posts back a small summary — what is waiting, a couple of headline figures, and when the board was last read. The hub shows what comes back.

A board that does not answer within eight seconds is shown as **unread**, with the reason. It is never guessed at, and no figure is ever carried over from a previous visit.

This means two things worth knowing:

- Changing a figure on a board changes it on the hub, with no work here.
- Renaming or moving a board breaks its card until `assets/js/shared/data.js` is updated. The card says so rather than going quiet.

## Pages

| Page | What it does |
| --- | --- |
| `pages/home.html` | The landing page: everything the three boards say needs attention, pulled into one list. **Needs a decision** first, then **Waiting on someone**, each row saying how many, what it is and which board it came from, and each row a link straight to that group on that board. Switch it to **By board** to read it a board at a time. **Save this list** writes the whole thing to a spreadsheet file for a meeting. Above it, four figures and a line naming when each board was read, because two boards read on different days are not one reading. |
| `pages/boards.html` | Three cards, one per board. The whole card is the way in. Each shows that board's headline figures, how many things are waiting on it and when it was read. |
| `pages/connections.html` | Every workbook the three boards read, which board reads it, and what to know about it. Then what is not joined up — a mail to a registration, a lead to a registration, a lead to a mail, and the missing shared account list. |
| `pages/access.html` | What each role can open on each board today, and how signing in actually works. |
| `pages/whats-next.html` | What these boards cannot do yet: five things in the order they would have to be done, each saying what it would answer, what has to happen first, where it would show up and how big it is, with a picture of what it would look like. Then a shorter list of what comes after. |
| `pages/trends.html` | **A preview.** Four figures with nine weeks behind them, and the same figure shown with and without its run, so the difference is the point. |
| `pages/analytics.html` | **A preview.** Pick a measure and a college and see nine weeks of it, with five measures from three boards in one table. |
| `pages/alerts.html` | **A preview.** Who would be told what, on which morning, and what Monday's message would say. The message is written from what the three boards answer right now, so its shape is real. |
| `pages/assign.html` | **A preview.** Four things with nobody against them, each with the control that would settle it, drawn and switched off, and what would happen when you pressed it. |
| `pages/join.html` | **A preview.** One person, four records, three boards, and the identifier that would tie them together. |
| `index.html` | Sign in, or look around. |

## The summary file in each board

Each of the three repos carries two small files:

```
summary.html            a page with no design, loaded by the hub in a hidden frame
assets/js/summary.js    builds the summary from that board's own data and posts it back
```

If a board gains a figure worth showing on the hub, that is the file to change — not anything here.

The message is posted to `location.origin` and the hub checks the origin before reading it, so nothing off this address can put a figure on the hub.

## Sample data

The three boards behind this one carry made-up names, campaigns, leads and results. Nothing real is on any of them.

## Working on it

Plain HTML, CSS and JavaScript, with nothing to build.

Because the hub reads its neighbours, it cannot be tested on its own. Put the four folders side by side and serve the folder that holds them:

```
npx.cmd serve .
```

Then open `hsg-hub/index.html` from that server. Served on its own, every board card will honestly say it got no answer.

After changing the shell or adding a page:

```
node tools/build-pages.js
```

Before committing a change to anything in `assets/`:

```
node tools/stamp-assets.js
```

Changes pushed to the `main` branch go live on GitHub Pages within a few minutes.

## How it looks

All four sites share one design, so a person who knows one can read the others. It is written down in [DESIGN.md](DESIGN.md).

## What is not built

The **What's next** page is the list, and it is the honest version: each item says what is in the way, not just what it would be nice to have, and carries a picture of what it would look like.

All five are built far enough to click into, and sit in the menu under **Coming next** with a **Soon** tag. Each opens with a banner saying the page is not built, what on it is invented and what is real, and each carries its own four questions at the bottom, so the page and the reasoning travel together. That banner is the whole point: a preview earns its place by showing the shape of a thing, and loses it the moment somebody mistakes it for a working page.

## Still to do

- One account list for all four, so access is set in one place rather than agreed in conversation
- Join a registration back to the lead and the campaign that started it, which is what would let any board answer "did it work?"
- A note on each card when a board's reading is older than the others, so two figures are not compared across different days
- More in the menu as it is needed: the group is set up so a page can be added under **Across the boards** without moving anything
- Flag a board whose reading is more than a day behind the others, rather than only naming the times

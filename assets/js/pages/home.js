setUpShell();

const answers = new Map();

// Everything waiting, from all three boards, in one list.
// Stop before hold, and the biggest count first inside each, so the worst is read first.
// Each group carries its caveat behind an (i): what it counts and what it does not.
const URGENCY = [
  ['stop', 'Needs a decision', 'Nothing moves on these until somebody settles them.',
    'Blocked decisions, open problems and leads nobody has recorded anything against for over a week. It counts things to look at, not hours of work, and a board that did not answer is left out rather than guessed at.'],
  ['hold', 'Waiting on someone', 'Moving, but waiting on a person, a check or a reply.',
    'Waiting on a person, a check or a reply. These do not need a decision from you today, but they stop being other people’s problem if nobody chases them. A board that did not answer is left out rather than guessed at.']
];

const GROUPINGS = [['urgency', 'By what it needs'], ['board', 'By board']];
const state = { grouping: GROUPINGS.some(([key]) => key === Params.get('group', '')) ? Params.get('group', '') : 'urgency' };

function everything() {
  const items = [];
  BOARDS.forEach((board) => {
    const entry = answers.get(board.key);
    if (!entry || !entry.summary) return;
    entry.summary.needs.filter((need) => need.count).forEach((need) => {
      items.push({
        board,
        count: need.count,
        what: need.count === 1 ? need.one : need.many,
        href: boardLink(board, need.href),
        tone: need.tone
      });
    });
  });
  return items;
}

function attentionRow(item, withBoard) {
  const row = create('li');
  const link = create('a', 'attention-row');
  link.href = item.href;
  link.append(create('b', 'attention-count', formatNumber(item.count)), create('span', 'attention-what', item.what));
  if (withBoard) link.append(create('span', 'attention-board', item.board.name));
  else link.append(statusChip({ tone: item.tone === 'stop' ? 'changed' : 'waiting', text: item.tone === 'stop' ? 'A decision' : 'Waiting' }));
  row.append(link);
  return row;
}

// The (i) works as it does on a figure card: a button that opens the caveat under the
// heading, with aria-expanded and aria-controls, and the caveat printed open on paper.
let aboutCount = 0;
// The list is redrawn each time a board answers, so an open caveat stays open.
const openAbout = new Set();
function attentionPanel(title, detail, items, withBoard, about) {
  const section = create('section', 'panel');
  const head = create('div', 'panel-head');
  const heading = create('div');
  const name = create('h2', 'attention-heading', title);
  heading.append(name, create('p', 'panel-note', detail));
  head.append(heading);
  section.append(head);

  if (about) {
    aboutCount += 1;
    const id = `group-about-${aboutCount}`;
    const ask = create('button', 'tile-about-open');
    ask.type = 'button';
    ask.setAttribute('aria-expanded', 'false');
    ask.setAttribute('aria-controls', id);
    ask.setAttribute('aria-label', `What "${title}" counts`);
    ask.append(icon(ICONS.about, 15));
    name.append(ask);

    const explain = create('p', 'tile-about', about);
    explain.id = id;
    explain.hidden = !openAbout.has(title);
    ask.setAttribute('aria-expanded', String(!explain.hidden));
    ask.addEventListener('click', () => {
      explain.hidden = !explain.hidden;
      ask.setAttribute('aria-expanded', String(!explain.hidden));
      if (explain.hidden) openAbout.delete(title); else openAbout.add(title);
    });
    section.append(explain);
  }

  const list = create('ul', 'attention-list');
  items.forEach((item) => list.append(attentionRow(item, withBoard)));
  section.append(list);
  return section;
}

function showList() {
  const holder = document.getElementById('attention');
  holder.replaceChildren();

  const items = everything();
  const answered = [...answers.values()].length;

  // Still waiting to hear from the boards is not the same as hearing that nothing
  // is waiting, so the banner only speaks once every board has answered.
  if (!items.length && answered < BOARDS.length) {
    holder.append(create('p', 'empty', 'Reading the boards…'));
    return;
  }

  // The one banner, and the only place the two totals are said. The list below breaks
  // them down and carries no count of its own; which boards answered is the readings line.
  const decisions = items.filter((item) => item.tone === 'stop').reduce((sum, item) => sum + item.count, 0);
  const waiting = items.filter((item) => item.tone !== 'stop').reduce((sum, item) => sum + item.count, 0);

  holder.append(buildBanner([
    {
      count: decisions,
      one: 'thing needs a decision across the boards.',
      many: 'things need a decision across the boards.'
    },
    { count: waiting, one: 'more is only waiting on someone', many: 'more are only waiting on someone' }
  ], {
    calmTitle: 'Nothing on any board is waiting on anyone.'
  }));

  if (!items.length) return;

  if (state.grouping === 'board') {
    BOARDS.forEach((board) => {
      const group = items.filter((item) => item.board.key === board.key)
        .sort((a, b) => (a.tone === b.tone ? b.count - a.count : a.tone === 'stop' ? -1 : 1));
      if (!group.length) return;
      holder.append(attentionPanel(board.name, board.what, group, false));
    });
  } else {
    URGENCY.forEach(([tone, title, detail, about]) => {
      const group = items.filter((item) => item.tone === tone).sort((a, b) => b.count - a.count);
      if (!group.length) return;
      holder.append(attentionPanel(title, detail, group, true, about));
    });
  }
}

function showRules() {
  const holder = document.getElementById('rule-list');
  holder.replaceChildren();
  RULES.forEach((rule) => {
    const item = create('li');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', rule.title));
    item.append(top, create('p', '', rule.detail), create('p', 'panel-note', rule.action));
    holder.append(item);
  });
}

// The boards are read at different moments. Two figures from two days are not a comparison,
// so the page says when each was read rather than letting them look like one reading.
function showReadings() {
  const holder = document.getElementById('readings');
  const read = BOARDS.map((board) => {
    const entry = answers.get(board.key);
    return entry && entry.summary ? `${board.name} ${entry.summary.read}` : null;
  }).filter(Boolean);
  const missing = BOARDS.filter((board) => {
    const entry = answers.get(board.key);
    return entry && !entry.summary;
  }).map((board) => board.name);

  if (!read.length && !missing.length) {
    holder.textContent = 'Asking each board for its own figures…';
    return;
  }
  // Which boards answered, and when each was read, is said here and nowhere else on the page.
  const parts = [];
  if (read.length) parts.push(`Read: ${read.join(' · ')}.`);
  if (missing.length) parts.push(`${missing.join(' and ')} did not answer, so nothing from ${missing.length === 1 ? 'it' : 'them'} is counted.`);
  holder.textContent = parts.join(' ');
}

function showExport() {
  const button = document.getElementById('home-export');
  const items = everything();
  button.replaceChildren(icon(ICONS.download, 16), create('span', '', items.length ? `Save this list (${formatNumber(items.length)})` : 'Save this list'));
  button.disabled = !items.length;
}

function render() {
  showReadings();
  showList();
  showExport();
}

buildSegmented(document.getElementById('group-picker'), GROUPINGS, state.grouping, (value) => {
  state.grouping = value;
  Params.set({ group: value === 'urgency' ? '' : value });
  showList();
});

document.getElementById('home-export').addEventListener('click', () => {
  const items = everything();
  downloadRows(
    'waiting-on-you',
    ['Board', 'What it needs', 'How many', 'What it is', 'Where to look'],
    items.map((item) => [
      item.board.name,
      item.tone === 'stop' ? 'A decision' : 'Waiting on someone',
      item.count,
      item.what,
      new URL(item.href, location.href).href
    ])
  );
});

render();
showRules();

askBoards((board, summary, problem) => {
  answers.set(board.key, { board, summary, problem });
  render();
});

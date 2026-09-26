setUpShell();

const answers = new Map();

// Everything waiting, from all three boards, in one list.
// Stop before hold, and the biggest count first inside each, so the worst is read first.
const URGENCY = [
  ['stop', 'Needs a decision', 'Nothing moves on these until somebody settles them.'],
  ['hold', 'Waiting on someone', 'Moving, but waiting on a person, a check or a reply.']
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

function redrawTiles() {
  showTiles();
}

// Two figures, each said once: how many things need a decision and how many are only
// waiting. The list below breaks each one down, and the readings line says which boards
// answered, so neither is repeated here.
function showTiles() {
  const items = everything();
  const answered = [...answers.values()].filter((entry) => entry.summary).length;
  const stop = items.filter((item) => item.tone === 'stop').reduce((sum, item) => sum + item.count, 0);
  const hold = items.filter((item) => item.tone === 'hold').reduce((sum, item) => sum + item.count, 0);
  const base = answered === BOARDS.length ? 'across all three boards' : `across ${answered} of the three boards`;

  const tiles = [
    {
      label: 'Needs a decision',
      value: formatNumber(stop),
      watch: { value: stop, unit: 'decisions', better: 'below' },
      note: base,
      about: 'Blocked decisions, open problems and leads nobody has recorded anything against for over a week. It counts things to look at, not hours of work, and a board that did not answer is left out rather than guessed at.'
    },
    {
      label: 'Waiting on someone',
      value: formatNumber(hold),
      watch: { value: hold, unit: 'things', better: 'below' },
      note: base,
      about: 'Waiting on a person, a check or a reply. These do not need a decision from you today, but they stop being other people’s problem if nobody chases them. A board that did not answer is left out rather than guessed at.'
    }
  ];

  document.getElementById('home-tiles').replaceChildren(...tiles.map(statTile));
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

function attentionPanel(title, detail, items, withBoard) {
  const section = create('section', 'panel');
  const head = create('div', 'panel-head');
  const heading = create('div');
  heading.append(create('h2', '', title), create('p', 'panel-note', detail));
  head.append(heading);
  section.append(head);

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

  // Still waiting to hear from the boards is not the same as hearing that nothing is waiting.
  if (!items.length) {
    holder.append(create('p', 'empty', answered < BOARDS.length ? 'Reading the boards…' : 'Nothing on any board is waiting on anyone.'));
    return;
  }

  if (state.grouping === 'board') {
    BOARDS.forEach((board) => {
      const group = items.filter((item) => item.board.key === board.key)
        .sort((a, b) => (a.tone === b.tone ? b.count - a.count : a.tone === 'stop' ? -1 : 1));
      if (!group.length) return;
      holder.append(attentionPanel(board.name, board.what, group, false));
    });
  } else {
    URGENCY.forEach(([tone, title, detail]) => {
      const group = items.filter((item) => item.tone === tone).sort((a, b) => b.count - a.count);
      if (!group.length) return;
      holder.append(attentionPanel(title, detail, group, true));
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
  showTiles();
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

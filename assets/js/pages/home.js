setUpShell();

const answers = new Map();

// Everything waiting, from all three boards, in one list.
// Stop before hold, and the biggest count first inside each, so the worst is read first.
const URGENCY = [
  ['stop', 'Needs a decision', 'Nothing moves on these until somebody settles them.'],
  ['hold', 'Waiting on someone', 'Moving, but waiting on a person, a check or a reply.']
];

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

function showTiles() {
  const items = everything();
  const answered = [...answers.values()].filter((entry) => entry.summary).length;
  const stop = items.filter((item) => item.tone === 'stop').reduce((sum, item) => sum + item.count, 0);
  const hold = items.filter((item) => item.tone === 'hold').reduce((sum, item) => sum + item.count, 0);

  const tiles = [
    {
      label: 'Waiting on you', icon: ICONS.alert, tone: 'is-warn',
      value: formatNumber(stop + hold),
      note: answered === BOARDS.length ? 'across all three boards' : `across ${answered} of the three boards`,
      about: 'Added up from what each board says is waiting. It counts things to look at, not hours of work, and a board that did not answer is left out rather than guessed at.'
    },
    {
      label: 'Needs a decision', icon: ICONS.rows, tone: '',
      value: formatNumber(stop),
      note: 'nothing moves until these are settled',
      about: 'Blocked decisions, open problems and leads nobody has recorded anything against for over a week.'
    },
    {
      label: 'Waiting on someone', icon: ICONS.clock, tone: 'is-info',
      value: formatNumber(hold),
      note: 'moving, but not finished',
      about: 'Waiting on a person, a check or a reply. These do not need a decision from you today, but they stop being other people’s problem if nobody chases them.'
    },
    {
      label: 'Boards answering', icon: ICONS.check, tone: 'is-good',
      value: `${answered} of ${BOARDS.length}`,
      note: answered === BOARDS.length ? 'every board was read just now' : 'a board did not answer',
      about: 'Each board is asked for its own figures when this page opens. Nothing here is kept from a previous visit, so a board that cannot be reached shows as unanswered rather than out of date.'
    }
  ];

  document.getElementById('home-tiles').replaceChildren(...tiles.map(statTile));
}

function showList() {
  const holder = document.getElementById('attention');
  holder.replaceChildren();

  const items = everything();
  const answered = [...answers.values()].length;

  if (!items.length) {
    holder.append(create('p', 'empty', answered === BOARDS.length
      ? 'Nothing on any board is waiting on anyone. Worth checking the boards answered — each card on The boards says when it was read.'
      : 'Reading the boards…'));
    return;
  }

  URGENCY.forEach(([tone, title, detail]) => {
    const group = items.filter((item) => item.tone === tone).sort((a, b) => b.count - a.count);
    if (!group.length) return;

    const section = create('section', 'panel');
    const head = create('div', 'panel-head');
    const heading = create('div');
    heading.append(create('h2', '', title), create('p', 'panel-note', detail));
    head.append(heading, statusChip({
      tone: tone === 'stop' ? 'changed' : 'waiting',
      text: `${formatNumber(group.reduce((sum, item) => sum + item.count, 0))} in all`
    }));
    section.append(head);

    const list = create('ul', 'attention-list');
    group.forEach((item) => {
      const row = create('li');
      const link = create('a', 'attention-row');
      link.href = item.href;
      link.append(
        create('b', 'attention-count', formatNumber(item.count)),
        create('span', 'attention-what', item.what),
        create('span', `attention-board is-${item.board.key}`, item.board.name)
      );
      row.append(link);
      list.append(row);
    });
    section.append(list);
    holder.append(section);
  });

  const missing = BOARDS.filter((board) => {
    const entry = answers.get(board.key);
    return entry && !entry.summary;
  });
  if (missing.length) {
    const note = create('p', 'panel-note');
    note.textContent = `${missing.map((board) => board.name).join(' and ')} did not answer, so nothing from ${missing.length === 1 ? 'it' : 'them'} is in this list.`;
    holder.append(note);
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

function render() {
  showTiles();
  showList();
}

render();
showRules();

askBoards((board, summary, problem) => {
  answers.set(board.key, { board, summary, problem });
  render();
});

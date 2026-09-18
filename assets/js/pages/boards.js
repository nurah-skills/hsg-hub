setUpShell();

const answers = new Map();

function toneClass(tone) {
  return tone === 'stop' ? 'is-stop' : tone === 'hold' ? 'is-hold' : '';
}

// The strip at the top adds up what is waiting across all three, once every board has answered
function showStartHere() {
  const holder = document.getElementById('start-here');
  holder.replaceChildren();

  const waiting = [...answers.values()].filter((entry) => entry.summary);
  if (!waiting.length) {
    holder.append(create('p', 'start-empty', answers.size === BOARDS.length
      ? 'No board answered, so there is nothing to add up. Each card below says the same.'
      : 'Reading the boards…'));
    return;
  }

  const total = waiting.reduce((sum, entry) => sum + entry.summary.needs.reduce((count, need) => count + need.count, 0), 0);
  const unread = [...answers.values()].filter((entry) => !entry.summary).length;

  holder.append(create('b', 'start-lead', 'Where to start'));
  waiting.forEach(({ board, summary }) => {
    const count = summary.needs.reduce((sum, need) => sum + need.count, 0);
    const link = create('a', `start-item ${count ? 'is-stop' : ''}`);
    link.href = boardLink(board, summary.home);
    link.append(create('b', '', formatNumber(count)), create('span', '', `on the ${board.name.toLowerCase()}`));
    holder.append(link);
  });

  const words = unread
    ? `${formatNumber(total)} things waiting across ${waiting.length} of the three boards. ${unread === 1 ? 'One board' : `${unread} boards`} did not answer.`
    : `${formatNumber(total)} things waiting across the three boards.`;
  holder.append(create('small', 'start-note', words));
}

function boardCard(board, summary, problem) {
  const card = create('section', 'panel board-card-panel');

  const head = create('div', 'panel-head');
  const heading = create('div');
  heading.append(create('h2', '', board.name), create('p', 'panel-note', board.what));
  head.append(heading);

  if (summary) {
    const open = create('a', 'button button-secondary button-inline');
    open.href = boardLink(board, summary.home);
    open.textContent = 'Open it';
    head.append(open);
  }
  card.append(head);

  if (!summary) {
    card.append(create('p', 'empty', problem));
    return card;
  }

  const figures = create('div', 'board-figures');
  summary.figures.forEach((figure) => {
    const item = create('div', 'board-figure');
    item.append(create('span', '', figure.label), create('b', '', figure.value), create('small', '', figure.note));
    figures.append(item);
  });
  card.append(figures);

  const needs = summary.needs.filter((need) => need.count);
  if (!needs.length) {
    card.append(create('p', 'empty', 'Nothing on this board is waiting on anyone.'));
  } else {
    const list = create('div', 'start-here');
    needs.forEach((need) => {
      const link = create('a', `start-item ${toneClass(need.tone)}`);
      link.href = boardLink(board, need.href);
      link.append(create('b', '', formatNumber(need.count)), create('span', '', need.count === 1 ? need.one : need.many));
      list.append(link);
    });
    card.append(list);
  }

  card.append(create('p', 'panel-note', `Read ${summary.read}. Every figure on this card came from the board itself, so the two cannot disagree.`));
  return card;
}

function showCards() {
  const holder = document.getElementById('board-cards');
  holder.replaceChildren();
  BOARDS.forEach((board) => {
    const entry = answers.get(board.key);
    if (!entry) {
      const waitingCard = create('section', 'panel board-card-panel');
      const head = create('div', 'panel-head');
      head.append(create('h2', '', board.name));
      waitingCard.append(head, create('p', 'empty', 'Reading this board…'));
      holder.append(waitingCard);
      return;
    }
    holder.append(boardCard(board, entry.summary, entry.problem));
  });
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

showCards();
showStartHere();
showRules();

askBoards((board, summary, problem) => {
  answers.set(board.key, { board, summary, problem });
  showCards();
  showStartHere();
});

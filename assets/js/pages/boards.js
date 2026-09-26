setUpShell();

const answers = new Map();

// Three doors. The whole card is the link, so there is nothing to aim at.
function boardCard(board, summary, problem) {
  const card = create('a', 'board-door');
  card.href = boardLink(board, summary ? summary.home : '');

  const top = create('div', 'board-door-top');
  top.append(create('h2', '', board.name), icon(ICONS.forward, 22));
  // What the board holds is said once, in the table under the cards.
  card.append(top);

  if (summary) {
    const figures = create('div', 'board-figures');
    summary.figures.forEach((figure) => {
      const item = create('div', 'board-figure');
      item.append(create('span', '', figure.label), create('b', '', figure.value), create('small', '', figure.note));
      figures.append(item);
    });
    card.append(figures);

    const count = summary.needs.reduce((sum, need) => sum + need.count, 0);
    const foot = create('div', 'board-door-foot');
    foot.append(statusChip({
      tone: count ? 'changed' : 'good',
      text: count ? `${formatNumber(count)} waiting on you` : 'Nothing waiting'
    }));
    foot.append(create('small', '', `Read ${summary.read}`));
    card.append(foot);
  } else {
    card.append(create('p', 'empty', problem || 'Reading this board…'));
  }

  return card;
}

function showCards() {
  const holder = document.getElementById('board-cards');
  holder.replaceChildren();
  BOARDS.forEach((board) => {
    const entry = answers.get(board.key);
    holder.append(boardCard(board, entry && entry.summary, entry && entry.problem));
  });
}

function showWhat() {
  const table = document.getElementById('what-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Board', 'What it holds', 'Who opens it'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  BOARDS.forEach((board) => {
    const row = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', board.name));
    row.append(first, create('td', '', board.holds), create('td', '', board.who));
    body.append(row);
  });

  table.append(head, body);
  labelCells(table);
}

showCards();
showWhat();

askBoards((board, summary, problem) => {
  answers.set(board.key, { board, summary, problem });
  showCards();
});

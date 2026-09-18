setUpShell();

// A preview. Nothing is sent and nothing is saved. What the email would say, though,
// is built from what the boards answer right now, so the shape of it is real.

const answers = new Map();

function showWho() {
  const table = document.getElementById('who-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Who', 'When', 'What they would get', 'How'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  PREVIEW_ALERTS.forEach((row) => {
    const line = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', row.who));

    const how = create('td', 'cell-status');
    how.append(row.how === 'Not set'
      ? statusChip({ tone: 'changed', text: 'Not set' })
      : statusChip({ tone: 'good', text: row.how }));

    line.append(first, create('td', '', row.when), create('td', '', row.what), how);
    body.append(line);
  });

  table.append(head, body);
  labelCells(table);
}

// The email itself, built from what the boards say right now
function showEmail() {
  const holder = document.getElementById('email-body');
  holder.replaceChildren();

  const items = [];
  BOARDS.forEach((board) => {
    const entry = answers.get(board.key);
    if (!entry || !entry.summary) return;
    entry.summary.needs.filter((need) => need.count).forEach((need) => {
      items.push({ board, count: need.count, what: need.count === 1 ? need.one : need.many, tone: need.tone });
    });
  });

  if (!items.length) {
    holder.append(create('p', 'empty', 'Waiting for the boards to answer, so the email can be written from what they say…'));
    return;
  }

  const decisions = items.filter((item) => item.tone === 'stop');
  const waiting = items.filter((item) => item.tone === 'hold');
  const total = items.reduce((sum, item) => sum + item.count, 0);

  holder.append(create('p', 'email-greeting', 'Monday morning, HSG boards'));
  holder.append(create('p', '', `${formatNumber(total)} things are waiting across the three boards. ${formatNumber(decisions.reduce((sum, item) => sum + item.count, 0))} of them need a decision.`));

  [['Needs a decision', decisions], ['Waiting on someone', waiting]].forEach(([title, group]) => {
    if (!group.length) return;
    holder.append(create('h3', '', title));
    const list = create('ul', 'email-list');
    group.sort((a, b) => b.count - a.count).forEach((item) => {
      const row = create('li');
      row.append(create('b', '', formatNumber(item.count)), document.createTextNode(` ${item.what} · ${item.board.name}`));
      list.append(row);
    });
    holder.append(list);
  });

  holder.append(create('p', 'email-foot', 'Open the boards · HSG · SAST · read-only. Every figure came from the board it belongs to.'));
}

function render() {
  showWho();
  showEmail();
}

render();

askBoards((board, summary, problem) => {
  answers.set(board.key, { board, summary, problem });
  showEmail();
});
showQuestions('alerts');

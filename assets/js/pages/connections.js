setUpShell();

const boardName = (key) => (BOARDS.find((board) => board.key === key) || { name: key }).name;

function showConnections() {
  const table = document.getElementById('connection-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Workbook', 'State', 'Which boards read it', 'What to know'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  CONNECTIONS.forEach((connection) => {
    const row = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', connection.name));

    const [label, tone] = CONNECTION_STATES[connection.state];
    const state = create('td', 'cell-status');
    state.append(statusChip({ tone, text: label }));

    const boards = create('td');
    boards.textContent = connection.boards.length
      ? connection.boards.map(boardName).join(', ')
      : 'None';

    row.append(first, state, boards, create('td', '', connection.note));
    body.append(row);
  });

  table.append(head, body);
  labelCells(table);
}

function showJoins() {
  const joins = [
    {
      title: 'A mail is not joined to a registration',
      detail: 'The mailer board counts what went out. The scoreboard counts what was registered. Nothing matches one to the other.',
      action: 'Match campaigns to registrations by the person, not by the day, before anyone claims a mail earned a sale.'
    },
    {
      title: 'A lead is not joined to a registration',
      detail: 'The lead tracker holds submission numbers. The scoreboard holds registrations. They have never been matched.',
      action: 'Match registrations back to the original submission number.'
    },
    {
      title: 'A lead is not joined to a mail',
      detail: 'A person can fill in a survey form and receive a campaign, and no board would know it was the same person.',
      action: 'Agree one identifier a person carries across all three before joining anything.'
    },
    {
      title: 'There is no shared account list',
      detail: 'Each board has its own demo sign-in. Nobody can be given or refused access in one place, and no board knows who opened it.',
      action: 'Set up real sign-in once, for all three, rather than three times.'
    }
  ];

  const holder = document.getElementById('join-list');
  holder.replaceChildren();
  joins.forEach((join) => {
    const item = create('li');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', join.title), statusChip({ tone: 'info', text: 'Not joined up' }));
    item.append(top, create('p', '', join.detail), create('p', 'panel-note', join.action));
    holder.append(item);
  });
}

showConnections();
showJoins();

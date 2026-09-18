setUpShell();

function showAccess() {
  const table = document.getElementById('access-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Role', ...BOARDS.map((board) => board.name)].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  ACCESS.forEach((entry) => {
    const row = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', entry.role));
    row.append(first);

    BOARDS.forEach((board) => {
      const cell = create('td');
      const value = entry[board.key];
      if (value === 'No access') cell.append(statusChip({ tone: 'changed', text: 'No access' }));
      else cell.textContent = value;
      row.append(cell);
    });

    body.append(row);
  });

  table.append(head, body);
  labelCells(table);
}

function showSignIn() {
  const rows = [
    ['Accounts', 'None. Every board has a demo sign-in that remembers a sample person in that browser and nothing else.'],
    ['Who can open a board', 'Anyone with the address. The boards carry made-up figures, so nothing real is exposed, but that changes the day they read real workbooks.'],
    ['What a board knows about you', 'Nothing. No board records who opened it or when.'],
    ['What a board can change', 'Nothing outside your own browser. Every board reads its workbooks and writes nothing back.'],
    ['What has to happen first', 'One account list for all three, approved work emails, and a decision about which roles see which college.']
  ];

  const holder = document.getElementById('signin-list');
  holder.replaceChildren();
  rows.forEach(([term, value]) => {
    const row = create('div');
    row.append(create('dt', '', term), create('dd', '', value));
    holder.append(row);
  });
}

showAccess();
showSignIn();

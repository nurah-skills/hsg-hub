setUpShell();

// A preview. The controls are drawn and disabled: these boards read their sheets and write nothing.
const WAITING = [
  { what: 'Bellview general enquiry', where: 'F-307 · Lead tracker · 41 leads on the sheet', people: ['Kagiso Tau', 'Chloe Naidoo', 'Elton Pillay'] },
  { what: 'Reactivation — old enquiries', where: 'F-401 · Lead tracker · 78 leads on the sheet', people: ['Lerato Mokoena', 'Sipho Dlamini', 'Ayesha Patel'] },
  { what: 'Multi-college course matcher', where: 'F-404 · Lead tracker · two owners recorded', people: ['Imran Ismail', 'Boitumelo Phiri'] },
  { what: 'Jobs marked sent while the stage says otherwise', where: 'Mailer board · 3 rows · nobody agreed to clear them', people: ['Refiloe Sibanda', 'Megan Fourie'] }
];

function showRows() {
  const holder = document.getElementById('assign-rows');
  holder.replaceChildren();

  WAITING.forEach((item, index) => {
    const row = create('div', 'mock-row');
    const what = create('div');
    what.append(create('b', '', item.what), create('small', '', item.where));

    const control = create('div', 'mock-control');
    const label = create('label', 'sr-only', `Name an owner for ${item.what}`);
    label.htmlFor = `owner-${index}`;
    const select = create('select', 'select');
    select.id = `owner-${index}`;
    select.append(new Option('Name an owner…'), ...item.people.map((person) => new Option(person)));
    select.disabled = true;
    const button = create('button', 'button button-secondary button-inline', 'Save to the sheet');
    button.type = 'button';
    button.disabled = true;
    control.append(label, select, button);

    row.append(what, control);
    holder.append(row);
  });
}

function showAfter() {
  const rows = [
    ['What would be written', 'The name, against the form, in the register the lead tracker reads.'],
    ['What else would be kept', 'Who set it and when, so a change can be asked about afterwards.'],
    ['What would not happen', 'Nothing is sent to the person named. Telling them is still a conversation.'],
    ['What could go wrong', 'A board that can write can write the wrong thing. It needs real sign-in first, so a change has a name on it, and an agreement about who may assign to whom.']
  ];
  const holder = document.getElementById('after-list');
  holder.replaceChildren();
  rows.forEach(([term, value]) => {
    const row = create('div');
    row.append(create('dt', '', term), create('dd', '', value));
    holder.append(row);
  });
}

showRows();
showAfter();
showQuestions('assign');

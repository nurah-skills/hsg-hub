setUpShell();

// A preview. One invented person, to show what a joined record would look like.
const STEPS = [
  { board: 'leads', when: '2 September', what: 'Filled in a form', detail: 'Adult matric readiness check · submission TS-2417', holds: 'a name, a phone number, an email and a college' },
  { board: 'mailer', when: '4 September', what: 'Was sent a campaign', detail: 'C-118 · R390 offer, matric courses', holds: 'that the mail was sent, delivered and opened' },
  { board: 'leads', when: '5 September', what: 'Was followed up', detail: 'Voicemail, then a WhatsApp, recorded by the salesperson', holds: 'a status and a date' },
  { board: 'scoreboard', when: '9 September', what: 'Registered', detail: 'Skills Academy · R 1 450 recorded', holds: 'the registration and the cash' }
];

const boardName = (key) => BOARDS.find((board) => board.key === key).name;

function showChain() {
  const holder = document.getElementById('chain');
  holder.replaceChildren();

  STEPS.forEach((step, index) => {
    const item = create('li', 'chain-step');
    item.append(create('span', 'chain-mark', String(index + 1)));

    const body = create('div', 'chain-body');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', step.what), statusChip({ tone: 'info', text: boardName(step.board) }));
    body.append(top, create('p', '', step.detail), create('small', '', `${step.when} · that board holds ${step.holds}`));

    item.append(body);
    holder.append(item);
  });
}

function showGap() {
  const rows = [
    ['What is missing', 'One identifier the person carries from the form, through the mail, to the registration. Nothing on the sheets does that today, so these four records sit on three boards and nothing says they are the same person.'],
    ['What it would let anyone say', 'That this registration came from that form, and that this mail was sent in between. Nothing more than that, but that is the whole question.'],
    ['What it would still not prove', 'That the mail caused the registration. Two things happening in order is not one causing the other, and no board here would say otherwise.'],
    ['Why it is not a quick one', 'It starts on the sheets rather than on a board, so it needs the people who keep them. No amount of work on these pages can produce it.']
  ];
  const holder = document.getElementById('gap-list');
  holder.replaceChildren();
  rows.forEach(([term, value]) => {
    const row = create('div');
    row.append(create('dt', '', term), create('dd', '', value));
    holder.append(row);
  });
}

showChain();
showGap();
showQuestions('join');

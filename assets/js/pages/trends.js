setUpShell();

// A preview. The runs below are made up: no board keeps its readings yet, which is the point.
const SHOWN = [
  { board: 'leads', label: 'Leads waiting for evidence', now: '1 050', run: [624, 661, 703, 742, 806, 878, 941, 1002, 1050], good: 'down' },
  { board: 'leads', label: 'Leads with something recorded', now: '20.4%', run: [24, 23, 23, 22, 22, 21, 21, 20, 20], good: 'up' },
  { board: 'mailer', label: 'Rows needing a check', now: '26', run: [38, 36, 37, 34, 31, 31, 29, 28, 26], good: 'down' },
  { board: 'scoreboard', label: 'Registrations a week', now: '404', run: [365, 369, 384, 385, 398, 412, 416, 431, 416], good: 'up' }
];

const boardName = (key) => BOARDS.find((board) => board.key === key).name;

function direction(run, good) {
  const move = run[0] ? (run[run.length - 1] - run[0]) / run[0] : 0;
  const rising = move > 0;
  const better = good === 'up' ? rising : !rising;
  return {
    tone: Math.abs(move) < 0.02 ? 'move' : better ? 'good' : 'changed',
    text: `${rising ? 'Up' : 'Down'} ${formatPercent(Math.abs(move))} over nine weeks`
  };
}

function showFigures() {
  const holder = document.getElementById('figures');
  holder.replaceChildren();

  SHOWN.forEach((item) => {
    const card = create('div', 'trend-card');
    const top = create('div', 'trend-top');
    const what = create('div');
    what.append(create('span', '', item.label), create('small', '', boardName(item.board)));
    top.append(what, statusChip(direction(item.run, item.good)));

    const figure = create('div', 'trend-figure');
    figure.append(create('b', '', item.now), sparkline(item.run, `${item.label}, nine weeks`));

    card.append(top, figure);
    holder.append(card);
  });
}

function showBeforeAfter() {
  const holder = document.getElementById('before-after');
  holder.replaceChildren();

  const before = mockBlock();
  before.append(create('p', 'mock-label', 'What a figure looks like today'));
  const one = create('div', 'trend-figure');
  one.append(create('b', '', '1 050'));
  before.append(one, create('small', '', 'A number on its own. It reads the same whether it was 600 last week or 1 400, so nobody can tell whether the thing they tried last month worked.'));

  const after = mockBlock();
  after.append(create('p', 'mock-label', 'What it would look like'));
  const two = create('div', 'trend-figure');
  two.append(create('b', '', '1 050'), sparkline(SHOWN[0].run, 'Nine weeks, rising'));
  const chip = create('div');
  chip.append(statusChip(direction(SHOWN[0].run, 'down')));
  after.append(two, chip, create('small', '', 'The same number, with nine weeks behind it. Now it is a direction, and a bad one.'));

  holder.append(before, after);
}

showFigures();
showBeforeAfter();
showQuestions('readings');

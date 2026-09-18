setUpShell();

// A preview. Every figure on this page is invented to show the shape a stored reading gives you.
// When the boards keep their readings, this page reads those instead and nothing else changes.

const state = {
  measure: PREVIEW_MEASURES.some((m) => m.key === Params.get('measure', '')) ? Params.get('measure', '') : 'waiting',
  college: Params.get('college', 'All')
};

const measure = () => PREVIEW_MEASURES.find((m) => m.key === state.measure);

function seriesFor(item) {
  if (state.college !== 'All') return item.series[state.college];
  return PREVIEW_WEEKS.map((week, index) => {
    const values = COLLEGES.map((key) => item.series[key][index]);
    return item.unit === 'percent'
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : values.reduce((sum, value) => sum + value, 0);
  });
}

const format = (item, value) => (item.unit === 'percent' ? formatPercent(value) : formatNumber(value));

function showChart() {
  const item = measure();
  const values = seriesFor(item);
  const points = PREVIEW_WEEKS.map((week, index) => ({ label: week, value: values[index] }));

  document.getElementById('chart-title').textContent = item.label;
  document.getElementById('chart-note').textContent = `${item.note} ${state.college === 'All' ? 'All three colleges' : COLLEGE_NAMES[state.college]}, week ending.`;
  document.getElementById('measure-chart').replaceChildren(areaChart(points, {
    label: item.label,
    key: item.label,
    format: (value) => format(item, value)
  }));

  const first = values[0];
  const last = values[values.length - 1];
  const move = first ? (last - first) / first : 0;
  const better = item.key === 'waiting' || item.key === 'checks' ? move < 0 : move > 0;

  const chip = document.getElementById('chart-move');
  chip.replaceChildren(statusChip({
    tone: Math.abs(move) < 0.02 ? 'move' : better ? 'good' : 'changed',
    text: `${move > 0 ? 'Up' : 'Down'} ${formatPercent(Math.abs(move))} over nine weeks`
  }));
}

function showByCollege() {
  const item = measure();
  const rows = COLLEGES.map((key) => {
    const values = item.series[key];
    const first = values[0];
    const last = values[values.length - 1];
    return {
      label: COLLEGE_NAMES[key],
      value: last,
      colour: COLLEGE_COLOURS[key],
      note: `${format(item, first)} nine weeks ago · ${last === first ? 'no change' : last > first ? 'up' : 'down'}`
    };
  });
  document.getElementById('college-chart').replaceChildren(barList(rows, { format: (value) => format(item, value) }));
}

function showTable() {
  const table = document.getElementById('weeks-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Measure', ...PREVIEW_WEEKS.slice(-5)].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  PREVIEW_MEASURES.forEach((item) => {
    const values = state.college === 'All'
      ? PREVIEW_WEEKS.map((week, index) => COLLEGES.reduce((sum, key) => sum + item.series[key][index], 0) / (item.unit === 'percent' ? COLLEGES.length : 1))
      : item.series[state.college];

    const row = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', item.label), create('small', '', BOARDS.find((board) => board.key === item.board).name));
    row.append(first);
    values.slice(-5).forEach((value) => row.append(create('td', 'cell-best', format(item, value))));
    body.append(row);
  });

  table.append(head, body);
  labelCells(table);
}

function render() {
  showChart();
  showByCollege();
  showTable();
}

buildSegmented(document.getElementById('measure-picker'), PREVIEW_MEASURES.map((item) => [item.key, item.label]), state.measure, (value) => {
  state.measure = value;
  Params.set({ measure: value === 'waiting' ? '' : value });
  render();
});

const college = document.getElementById('college-filter');
college.replaceChildren(new Option('All three colleges', 'All'), ...COLLEGES.map((key) => new Option(COLLEGE_NAMES[key], key)));
college.value = state.college;
college.addEventListener('change', (event) => {
  state.college = event.target.value;
  Params.set({ college: state.college });
  render();
});

render();

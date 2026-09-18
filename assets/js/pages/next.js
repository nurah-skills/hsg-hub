setUpShell();

// The index of the five. Each has a page of its own now, so this page is the order they
// would have to be done in, and the reasoning that puts them in that order.
// withEmphasis() comes from preview.js, which every page loads.

function showNext() {
  const holder = document.getElementById('next-list');
  holder.replaceChildren();

  NEXT.forEach((item, index) => {
    const section = create('section', 'panel next-item');
    section.id = item.id;

    const head = create('div', 'panel-head');
    const heading = create('div', 'next-heading');
    heading.append(create('span', 'next-step', String(index + 1)), create('h2', '', item.title));
    head.append(heading, statusChip({ tone: 'info', text: item.size.split(',')[0] }));
    section.append(head);

    const lines = create('dl', 'figure-list');
    [
      ['What it would answer', item.answers],
      ['What has to happen first', item.needs],
      ['Where it would show up', item.where],
      ['How big', item.size]
    ].forEach(([term, value]) => {
      const row = create('div');
      const answer = create('dd');
      answer.append(withEmphasis(value));
      row.append(create('dt', '', term), answer);
      lines.append(row);
    });
    section.append(lines);

    const link = create('a', 'button button-secondary button-inline mock-link');
    link.href = item.preview;
    link.append(document.createTextNode(`See the ${item.page} preview`), icon(ICONS.forward, 16));
    section.append(link);

    holder.append(section);
  });
}

function showLater() {
  const holder = document.getElementById('later-list');
  holder.replaceChildren();
  LATER.forEach(([title, detail]) => {
    const item = create('li');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', title));
    item.append(top, create('p', '', detail));
    holder.append(item);
  });
}

showNext();
showLater();

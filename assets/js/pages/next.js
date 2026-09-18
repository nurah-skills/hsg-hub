setUpShell();

// Bold in the copy is written as **like this**, because these lines are data and not markup
function withEmphasis(text) {
  const holder = create('p');
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (part.startsWith('**') && part.endsWith('**')) holder.append(create('b', '', part.slice(2, -2)));
    else if (part) holder.append(document.createTextNode(part));
  });
  return holder;
}

// A small picture of what the thing would look like. Made up, and labelled as made up.
const MOCKS = {
  readings: () => {
    const holder = create('div', 'mock');
    const row = create('div', 'mock-figure');
    const left = create('div');
    left.append(create('span', '', 'Leads waiting for evidence'), create('b', '', '1 050'));
    row.append(left, sparkline([624, 661, 703, 742, 806, 878, 941, 1002, 1050], 'Nine weeks, rising'));
    holder.append(row, create('small', '', 'A figure with nine weeks behind it. Today the same figure sits alone, and nobody can say whether it is getting better.'));
    return holder;
  },
  assign: () => {
    const holder = create('div', 'mock');
    const row = create('div', 'mock-row');
    const what = create('div');
    what.append(create('b', '', 'Bellview general enquiry'), create('small', '', 'F-307 · nobody recorded · 41 leads on the sheet'));
    const control = create('div', 'mock-control');
    const select = create('select', 'select');
    select.append(new Option('Name an owner…'), new Option('Kagiso Tau'), new Option('Chloe Naidoo'), new Option('Elton Pillay'));
    select.disabled = true;
    const button = create('button', 'button button-secondary button-inline', 'Save to the sheet');
    button.type = 'button';
    button.disabled = true;
    control.append(select, button);
    row.append(what, control);
    holder.append(row, create('small', '', 'Greyed out because it is a picture. The real one would write the name to the form register and record who set it.'));
    return holder;
  },
  join: () => {
    const holder = create('div', 'mock');
    const list = create('dl', 'figure-list mock-join');
    [
      ['A form was filled in', 'TS-2417 · Adult matric readiness check · 2 September'],
      ['A mail went out', 'C-118 · R390 offer, matric courses · 4 September'],
      ['Somebody followed up', 'Voicemail, then a WhatsApp · 5 September'],
      ['A registration was recorded', 'Skills Academy · 9 September · R 1 450']
    ].forEach(([term, value]) => {
      const row = create('div');
      row.append(create('dt', '', term), create('dd', '', value));
      list.append(row);
    });
    holder.append(list, create('small', '', 'One person, four records, joined by one identifier they carry all the way through. Today these four sit on three boards and nothing says they are the same person.'));
    return holder;
  }
};

function showNext() {
  const holder = document.getElementById('next-list');
  holder.replaceChildren();

  NEXT.forEach((item, index) => {
    const section = create('section', 'panel next-item');
    section.id = item.id;

    const head = create('div', 'panel-head');
    const heading = create('div', 'next-heading');
    heading.append(create('span', 'next-step', String(index + 1)), create('h2', '', item.title));
    head.append(heading);
    if (item.page) head.append(statusChip({ tone: 'info', text: `${item.page} page` }));
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
    if (item.preview) {
      const link = create('a', 'button button-secondary button-inline mock-link');
      link.href = item.preview;
      link.append(document.createTextNode(`See the ${item.page} page`), icon(ICONS.forward, 16));
      section.append(link);
    }

    if (item.mock) {
      const heading = create('p', 'mock-label', 'What it would look like');
      section.append(heading, MOCKS[item.mock]());
    }

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

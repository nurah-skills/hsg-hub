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

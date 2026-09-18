// The parts every preview page shares: the four questions that belong to the feature,
// and the small pictures of things that are not built. Nothing here reads a board.

function showQuestions(id) {
  const item = NEXT.find((entry) => entry.id === id);
  const holder = document.getElementById('questions');
  if (!item || !holder) return;

  const head = create('div', 'panel-head');
  const heading = create('div', 'next-heading');
  heading.append(create('span', 'next-step', String(NEXT.indexOf(item) + 1)), create('h2', '', item.title));
  head.append(heading, statusChip({ tone: 'info', text: item.size.split(',')[0] }));

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

  const back = create('a', 'text-link', 'All five, in the order they would have to be done');
  back.href = 'whats-next.html';

  holder.replaceChildren(head, lines, back);
}

// Bold in the copy is written as **like this**, because these lines are data and not markup
function withEmphasis(text) {
  const holder = create('p');
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (part.startsWith('**') && part.endsWith('**')) holder.append(create('b', '', part.slice(2, -2)));
    else if (part) holder.append(document.createTextNode(part));
  });
  return holder;
}

// A dashed block saying plainly that what is inside it is a picture
function mockBlock(...children) {
  const holder = create('div', 'mock');
  holder.append(...children);
  return holder;
}

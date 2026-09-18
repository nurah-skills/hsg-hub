// The three signed-in pages share one shell. Run it after changing the shell or adding a page:
//
//   node tools/build-pages.js
//
// Then run tools/stamp-assets.js before committing.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const ICONS = {
  home: '<path d="M4 10.5 12 4l8 6.5"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/>',
  boards: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  connections: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  access: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>'
};

const svg = (paths, size = 20) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// group: where the entry sits in the menu. null means it sits above the first heading.
const PAGES = [
  { file: 'home.html', script: 'home', name: 'Home', icon: 'home', group: null,
    title: 'Waiting on you', note: 'Everything the three boards say needs you, in one list.',
    description: 'Everything across the three HSG boards that needs attention.' },
  { file: 'boards.html', script: 'boards', name: 'The boards', icon: 'boards', group: null,
    title: 'The boards', note: 'Three boards. Open one to work in it.',
    description: 'The three HSG boards, and a way in to each.' },
  { file: 'connections.html', script: 'connections', name: 'Connections', icon: 'connections', group: 'Across the boards',
    title: 'Connections', note: 'What the three boards read, what is joined up, and what is not.',
    description: 'What the three boards read and what is not joined up.' },
  { file: 'access.html', script: 'access', name: 'Who sees what', icon: 'access', group: 'Across the boards',
    title: 'Who sees what', note: 'What each role can open on each board today.',
    description: 'What each role can open on each board.' }
];

function menu(current) {
  const lines = [];
  let group = null;
  PAGES.forEach((page) => {
    if (page.group !== group) {
      group = page.group;
      if (group) lines.push(`        <p class="menu-label">${group}</p>`);
    }
    const here = page.file === current ? ' aria-current="page"' : '';
    lines.push(`        <a class="menu-item" href="${page.file}"${here}>`);
    lines.push(`          ${svg(ICONS[page.icon])}`);
    lines.push(`          <span>${page.name}</span>`);
    lines.push('        </a>');
  });
  return lines.join('\n');
}

const shell = (page, body) => `<!doctype html>
<html lang="en" data-page="app">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'">
  <meta name="theme-color" content="#F1F6F3" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0A130F" media="(prefers-color-scheme: dark)">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="noindex">
  <meta name="description" content="${page.description}">
  <title>${page.title} · HSG boards</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script src="../assets/js/shared/session.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="app" id="app">
    <aside class="sidebar" id="sidebar" aria-label="Main menu">
      <a class="brand" href="home.html"><img src="../assets/img/logo.svg" width="36" height="36" alt=""><span class="brand-text"><b>HSG boards</b><small>One way in</small></span></a>

      <nav class="menu" aria-label="Pages">
${menu(page.file)}
      </nav>

      <div class="sidebar-user">
        <span class="avatar" id="user-initials" aria-hidden="true"></span>
        <div><b id="user-name"></b><small id="user-role"></small></div>
        <button class="icon-button" id="sign-out" type="button" aria-label="Sign out" title="Sign out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </aside>

    <div class="scrim" id="scrim"></div>

    <div class="app-body">
      <header class="topbar">
        <button class="icon-button" id="menu-button" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <a class="brand" href="home.html"><img src="../assets/img/logo.svg" width="30" height="30" alt=""><span>HSG boards</span></a>
      </header>

      <main class="app-main" id="main" tabindex="-1">
        <div class="page-header">
          <div>
            <h1>${page.title}</h1>
            <p class="page-note">${page.note}</p>
          </div>
        </div>

${body}
      </main>
    </div>
  </div>

  <div class="toast" id="toast" role="status" hidden></div>

  <script src="../assets/js/shared/data.js"></script>
  <script src="../assets/js/shared/app.js"></script>
  <script src="../assets/js/shared/boards.js"></script>
  <script src="../assets/js/pages/${page.script}.js"></script>
</body>
</html>
`;

const BODIES = {
  home: `        <section class="tiles tiles-four" id="home-tiles" aria-label="Totals"></section>

        <div class="stack" id="attention"></div>

        <section class="panel" aria-labelledby="rules-title">
          <div class="panel-head">
            <h2 id="rules-title">True of all three boards</h2>
          </div>
          <ul class="decision-list" id="rule-list"></ul>
        </section>`,

  boards: `        <div class="board-doors" id="board-cards"></div>

        <section class="panel" aria-labelledby="what-title">
          <div class="panel-head">
            <h2 id="what-title">What each one holds</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="what-table"></table>
          </div>
        </section>`,

  connections: `        <p class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>
          <span>Every board reads its workbooks and writes nothing back. A workbook read by two boards is still read twice, at two different times.</span>
        </p>

        <section class="panel" aria-labelledby="connections-title">
          <div class="panel-head">
            <h2 id="connections-title">What the boards read</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="connection-table"></table>
          </div>
        </section>

        <section class="panel" aria-labelledby="joins-title">
          <div class="panel-head">
            <h2 id="joins-title">What is not joined up</h2>
          </div>
          <ul class="decision-list" id="join-list"></ul>
        </section>`,

  access: `        <p class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>
          <span>This is what the boards do today, not a policy anybody has signed off. There is no shared account list yet, so each board has its own sign-in and access is agreed in conversation.</span>
        </p>

        <section class="panel" aria-labelledby="access-title">
          <div class="panel-head">
            <h2 id="access-title">What each role can open</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="access-table"></table>
          </div>
        </section>

        <section class="panel" aria-labelledby="signin-title">
          <div class="panel-head">
            <h2 id="signin-title">How signing in works today</h2>
          </div>
          <dl class="figure-list" id="signin-list"></dl>
        </section>`
};

PAGES.forEach((page) => {
  const body = BODIES[page.script];
  if (!body) throw new Error('no body for ' + page.script);
  fs.writeFileSync(path.join(root, 'pages', page.file), shell(page, body));
});

console.log(`built ${PAGES.length} pages`);

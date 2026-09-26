// The hub keeps no figures of its own. Each board is asked for its own, through the
// summary page in that board's repo, so a number here can never disagree with the board it came from.
// What lives here is only the things that are about the boards rather than in them.

// The three colleges, named the same way every board names them
const COLLEGES = ['SA', 'MC', 'BV'];
const COLLEGE_NAMES = { SA: 'Skills Academy', MC: 'Matric College', BV: 'Bellview' };
const COLLEGE_COLOURS = { SA: 'var(--college-sa)', MC: 'var(--college-mc)', BV: 'var(--college-bv)' };

const SNAPSHOT = {
  today: '18 September 2026',
  todayShort: '18 Sep'
};

// The four sites sit beside each other, so the hub finds them by stepping out of its own folder.
// Working this out from the address means it holds whether the set is served from the top of a
// domain or from a folder inside one.
const SITE_ROOT = `${location.pathname.replace(/\/hsg-hub(\/.*)?$/, '')}/`;

// All three sit on the same address, so the hub can read them. A board that does not
// answer within a few seconds is shown as unread rather than guessed at.
const BOARDS = [
  {
    key: 'scoreboard',
    name: 'Sales scoreboard',
    what: 'Registrations and cash by person and college, with the cards that recognise them.',
    base: `${SITE_ROOT}every-sale-matters/`,
    who: 'Sales managers and salespeople',
    holds: 'Registrations, cash, streaks, recognition cards, shout-outs and feedback.',
    reads: ['Registrations workbook', 'Incentive sheet']
  },
  {
    key: 'mailer',
    name: 'Mailer board',
    what: 'What is ready to send, what needs a decision, and what the mail did.',
    base: `${SITE_ROOT}hsg-mailer-management/`,
    who: 'Marketing managers only',
    holds: 'Mailer jobs, campaigns, evidence checks, problems and fixes, lessons learnt.',
    reads: ['Mailer trackers', 'The mail tool']
  },
  {
    key: 'leads',
    name: 'Lead tracker',
    what: 'Where the survey leads went, how long they waited, and what was recorded.',
    base: `${SITE_ROOT}hsg-lead-tracker/`,
    who: 'Sales managers, marketing managers and salespeople',
    holds: 'Survey and Tally leads, follow-up notes, the form register, form repairs.',
    reads: ['Salespeople master', 'Form inventory', 'Repair tracker']
  }
];

// The workbooks behind all three, and which board reads each one.
// A connection nothing reads is as much a problem as a board with nothing behind it.
const CONNECTIONS = [
  { name: 'Registrations workbook', state: 'read', boards: ['scoreboard'], note: 'Read for the scoreboard. Not matched to the leads or the mail, so no board says a lead became a registration.' },
  { name: 'Incentive sheet', state: 'read', boards: ['scoreboard'], note: 'Read for the scoreboard only.' },
  { name: 'Mailer trackers', state: 'read', boards: ['mailer'], note: 'One tab per phase. The mailer board treats a row marked sent as a reported state until a campaign is matched to it.' },
  { name: 'The mail tool', state: 'read', boards: ['mailer'], note: 'Campaign counters, read at a fixed time. Opens and clicks can include automated scanning.' },
  { name: 'Salespeople master', state: 'read', boards: ['leads'], note: 'One tab per salesperson. The lead tracker counts one row per submission.' },
  { name: 'Form inventory', state: 'read', boards: ['leads'], note: 'Every form somebody told us about. A form built elsewhere and never reported is invisible to every board.' },
  { name: 'Repair tracker', state: 'read', boards: ['leads'], note: 'Problems found on forms and what was done about them.' },
  { name: 'Survey responses', state: 'partly', boards: ['mailer'], note: 'Counted on the mailer board beside the mail figures. Not joined to a campaign or to a lead.' },
  { name: 'A shared account list', state: 'missing', boards: [], note: 'Nothing yet. Each board has its own demo sign-in, so access is agreed in conversation rather than set anywhere.' }
];

const CONNECTION_STATES = {
  read: ['Read', 'good'],
  partly: ['Read, not joined up', 'waiting'],
  missing: ['Not connected', 'changed']
};

// Who can open what. This is what the boards do today, not a policy anyone has signed off.
const ACCESS = [
  // Marketing are on the lead tracker because they build and own the forms the leads arrive on
  { role: 'Sales manager', scoreboard: 'Everything', mailer: 'No access', leads: 'Everything, and records decisions on repairs' },
  { role: 'Marketing manager', scoreboard: 'No access', mailer: 'Everything', leads: 'Everything, and records decisions on form repairs' },
  { role: 'Salesperson', scoreboard: 'Their own results, and how the team is doing', mailer: 'No access', leads: 'The leads allocated to them' }
];

// What is true of all three, and worth saying once rather than three times
const RULES = [
  {
    title: 'No board turns activity into a result',
    detail: 'The scoreboard counts registrations, the mailer board counts sends, the lead tracker counts leads. None of them joins one to another, so nothing here says a mail earned a registration or a lead became a sale.',
    action: 'Match registrations to submission numbers and to campaigns before anyone asks for a conversion rate.'
  },
  {
    title: 'Every figure is a reading, taken once',
    detail: 'Each board reads its workbooks at a moment and holds that reading. Refreshing a board does not re-read anything on the others, and two boards read at different times will not agree about today.',
    action: 'Read the time under each board before comparing two of them.'
  },
  {
    title: 'A blank is not a nothing',
    detail: 'A lead with no note, a mailer row with no stage, a day with no registration recorded: each means nobody wrote it down. It does not mean nothing happened.',
    action: 'Ask before acting on an empty cell.'
  },
  {
    title: 'Nothing here judges a person',
    detail: 'The boards count what was recorded. They do not score the quality of a call, a mail or a follow-up, and they are not built to.',
    action: 'Keep it that way. A board that scores people gets better records, not better work.'
  }
];



// ---------------------------------------------------------------------------
// Everything below this line belongs to a preview: a page that shows what a
// feature would look like before it is built. None of it is read from a board.
// The pages that use it say so at the top, every time.
// ---------------------------------------------------------------------------

// Eight weeks of made-up readings. The real thing would be the boards' own summaries,
// stored once a day; this is here to show the shape a stored reading gives you.
const PREVIEW_WEEKS = ['21 Jul', '28 Jul', '4 Aug', '11 Aug', '18 Aug', '25 Aug', '1 Sep', '8 Sep', '15 Sep'];

const PREVIEW_MEASURES = [
  {
    key: 'waiting',
    label: 'Leads waiting for evidence',
    board: 'leads',
    note: 'Lead records with nothing written against them, counted at the end of each week.',
    series: { SA: [402, 418, 441, 470, 503, 538, 566, 601, 624], MC: [188, 201, 214, 236, 249, 268, 281, 297, 311], BV: [96, 103, 99, 112, 118, 121, 127, 130, 135] }
  },
  {
    key: 'recorded',
    label: 'Leads with something recorded',
    board: 'leads',
    unit: 'percent',
    note: 'The share of lead records carrying a status, a note or a worked marker.',
    series: { SA: [0.24, 0.23, 0.22, 0.22, 0.21, 0.2, 0.2, 0.19, 0.19], MC: [0.28, 0.27, 0.27, 0.26, 0.25, 0.25, 0.24, 0.23, 0.22], BV: [0.31, 0.3, 0.32, 0.3, 0.29, 0.29, 0.28, 0.28, 0.27] }
  },
  {
    key: 'sent',
    label: 'Emails sent',
    board: 'mailer',
    note: 'What the mail tool reports as sent in the week.',
    series: { SA: [186000, 174000, 198000, 205000, 191000, 216000, 224000, 238000, 246000], MC: [98000, 104000, 96000, 112000, 108000, 119000, 124000, 131000, 129000], BV: [64000, 71000, 68000, 74000, 79000, 81000, 86000, 88000, 92000] }
  },
  {
    key: 'checks',
    label: 'Rows needing a check',
    board: 'mailer',
    note: 'Tracker rows where the record contradicts itself or is missing something.',
    series: { SA: [18, 17, 19, 16, 15, 14, 14, 13, 12], MC: [11, 12, 10, 11, 9, 9, 8, 8, 7], BV: [9, 8, 8, 7, 7, 8, 7, 7, 7] }
  },
  {
    key: 'registrations',
    label: 'Registrations',
    board: 'scoreboard',
    note: 'Non-cancelled registrations recorded in the week.',
    series: { SA: [181, 176, 194, 188, 203, 197, 211, 206, 191], MC: [96, 102, 94, 108, 101, 112, 106, 118, 97], BV: [88, 91, 96, 89, 94, 103, 99, 107, 128] }
  }
];

const PREVIEW_EVERY = 'Every morning at 06:40, after the boards are read';

const PREVIEW_ALERTS = [
  { who: 'Jan Badenhorst', when: 'Monday', what: 'Everything waiting, all three boards', how: 'Email' },
  { who: 'Marketing manager', when: 'Monday', what: 'The mailer board only', how: 'Email' },
  { who: 'Sales managers', when: 'Monday and Thursday', what: 'The scoreboard and the lead tracker', how: 'Email' },
  { who: 'Nobody yet', when: 'When a board stops answering', what: 'A note that a reading did not happen', how: 'Not set' }
];

// What is not built. Each one says what it would answer and what has to happen first,
// because a list of wishes is worth nothing next to a list of what is in the way.
// They are in the order they would have to be done: each one leans on the ones above it.
const NEXT = [
  {
    id: 'readings',
    title: 'Keep the readings, so a figure has a direction',
    page: 'Trends',
    preview: 'trends.html',
    answers: 'Is it getting better or worse? Every board holds one reading and forgets the last one, so “1 050 leads waiting” reads the same whether it was 600 last week or 1 400.',
    needs: 'Somewhere to keep one reading a day. Each board already builds its own summary; a stored, dated copy of that is enough to draw a line.',
    where: 'A **Trends** page here, a small run behind each figure on the boards, and the thing everything below is built on.',
    size: 'Small, once there is somewhere to write.'
  },
  {
    id: 'analytics',
    title: 'Ask a question across the three boards',
    page: 'Analytics',
    preview: 'analytics.html',
    answers: 'How did Matric College do last month, across mail, leads and registrations at once? Today that means opening three boards, reading three periods and holding the answer in your head.',
    needs: 'The kept readings above, and each board reporting its figures split by college and by week rather than as one number. Then a page where a period, a college and a measure are chosen and drawn.',
    where: 'An **Analytics** page here, with the boards left as they are.',
    size: 'Medium, and it cannot start before the readings are kept.'
  },
  {
    id: 'alerts',
    title: 'A Monday morning email',
    page: 'Alerts',
    preview: 'alerts.html',
    answers: 'What needs me this week, without having to remember to look.',
    needs: 'Something that can send mail on a schedule, and one address list. It sends what the home page already works out, so nothing new has to be counted.',
    where: 'An **Alerts** page here, to say who gets it and on which morning.',
    size: 'Small.'
  },
  {
    id: 'assign',
    title: 'Name an owner from the board',
    page: 'Name an owner',
    preview: 'assign.html',
    answers: 'Who is doing something about it. Today a board can say three forms have nobody against them, and the fixing happens somewhere else entirely.',
    needs: 'Write access to the source sheets, real sign-in so a change is attributed, and a decision about who may assign to whom. It would be the first time any board writes rather than only reads, so it needs care.',
    where: 'A **Name an owner** page here to settle a batch of them, and the same control on the lead tracker beside a form with no owner.',
    size: 'Medium, and it changes what these boards are.'
  },
  {
    id: 'join',
    title: 'Join a registration to the lead and the campaign that started it',
    page: 'Join the records',
    preview: 'join.html',
    answers: 'Did it work. This is the question none of the three boards will answer, and the reason they will not is that nothing connects a registration back to the submission or the mail that came before it.',
    needs: 'One identifier a person carries from the form, through the mail, to the registration. Until that exists on the sheets, no amount of work on these boards can produce it.',
    where: 'Everywhere, and a **Join the records** page here to show one person end to end. It is the difference between counting activity and knowing what the activity did.',
    size: 'Large, and it starts with the sheets rather than with a board.'
  }
];

// Also on the list, in the order I would do them
const LATER = [
  ['Reconcile what the forms sent against what arrived', 'Nothing checks that every submission a form issued reached a sheet, so a lead that vanished between the two is invisible to every board.'],
  ['One sign-in for all four', 'Access is agreed in conversation today. One account list would mean it can be given and taken away in one place.'],
  ['Record the decision, not just the outcome', 'When something is settled, keep the reason next to it, so the same question is not asked again next month.'],
  ['Flag a board whose reading is behind the others', 'The home page names the times. It could say plainly when one board is a day behind, rather than leaving it to be noticed.']
];

const formatNumber = (value) => Math.round(value).toLocaleString('en-ZA').replace(/,/g, ' ');
const formatPercent = (value, places = 1) => `${(value * 100).toFixed(places)}%`;

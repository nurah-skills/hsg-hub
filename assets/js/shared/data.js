// The hub keeps no figures of its own. Each board is asked for its own, through the
// summary page in that board's repo, so a number here can never disagree with the board it came from.
// What lives here is only the things that are about the boards rather than in them.

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
    who: 'Sales managers and salespeople',
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
  { role: 'Sales manager', scoreboard: 'Everything', mailer: 'No access', leads: 'Everything, and records decisions on repairs' },
  { role: 'Salesperson', scoreboard: 'Their own results, and how the team is doing', mailer: 'No access', leads: 'The leads allocated to them' },
  { role: 'Marketing manager', scoreboard: 'No access', mailer: 'Everything', leads: 'No access' }
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
    detail: 'A lead with no note, a mailer row with no stage, a day with no registration recorded — each means nobody wrote it down. It does not mean nothing happened.',
    action: 'Ask before acting on an empty cell.'
  },
  {
    title: 'Nothing here judges a person',
    detail: 'The boards count what was recorded. They do not score the quality of a call, a mail or a follow-up, and they are not built to.',
    action: 'Keep it that way. A board that scores people gets better records, not better work.'
  }
];

const formatNumber = (value) => Math.round(value).toLocaleString('en-ZA').replace(/,/g, ' ');

// There are no real accounts yet. The demo sign-in just remembers a sample person in this browser.
const SESSION_KEY = 'hsg-hub-session';

const DEMO_USER = {
  name: 'Jan Prinsloo',
  role: 'Head of sales and marketing',
  team: 'HSG'
};

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function startSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
}

const startDemoSession = () => startSession(DEMO_USER);

function endSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
}

// Runs in the <head> so people never see a flash of the wrong page.
const pageType = document.documentElement.dataset.page;
const signedIn = readSession();
const SIGN_IN_PAGE = '../index.html';
const HOME_PAGE = pageType === 'app' ? 'boards.html' : 'pages/boards.html';

if (pageType === 'app' && !signedIn) location.replace(SIGN_IN_PAGE);
if (pageType === 'auth' && signedIn) location.replace(HOME_PAGE);

// Asking each board for its own figures.
//
// All three boards sit on the same address as this one, so a hidden frame pointed at a board's
// summary page can run that board's own data and post the answer back. Nothing is copied here,
// so a figure on the hub cannot drift from the board it came from.
//
// A board that does not answer is shown as unread. It is never guessed at.

const ASK_TIMEOUT = 8000;

function askBoards(onBoard) {
  const waiting = new Map(BOARDS.map((board) => [board.key, board]));
  const frames = [];

  const listener = (event) => {
    if (event.origin !== location.origin) return;
    const summary = event.data && event.data.hsgSummary;
    if (!summary) return;
    const board = waiting.get(summary.board);
    if (!board) return;
    waiting.delete(summary.board);
    onBoard(board, summary, null);
  };

  window.addEventListener('message', listener);

  BOARDS.forEach((board) => {
    const frame = document.createElement('iframe');
    frame.title = `${board.name} figures`;
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.style.position = 'absolute';
    frame.style.width = '1px';
    frame.style.height = '1px';
    frame.style.opacity = '0';
    frame.style.pointerEvents = 'none';
    frame.src = `${board.base}summary.html`;
    document.body.append(frame);
    frames.push(frame);
  });

  setTimeout(() => {
    window.removeEventListener('message', listener);
    frames.forEach((frame) => frame.remove());
    waiting.forEach((board) => onBoard(board, null, 'No answer from this board. It may not be published yet, or the browser may be holding an older copy of it.'));
  }, ASK_TIMEOUT);
}

const boardLink = (board, path) => `${board.base}${path}`;

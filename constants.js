// enum like
export const EVENT_NAMES = {
  setLevel: "setLevel",
  start: "start",
  prepareBoard: "prepareBoard",
  playMove: "playMove",
  wrongMove: "wrongMove",
  rightMove: "rightMove",
  end: "end",

  timeChange: "timeChange",
};

export const ATTRIBUTES = {
  editable: "contenteditable",
};

export const CLASSES = {
  gameBtn: "game-btn",
  playBtn: "play-btn",
  endBtn: "end-btn",

  timer: "timer",

  level: "choose-level",
  levelReadOnly: "choose-level-read-only",

  cell: "sudoku-cell",
  activeCell: "active-cell",
  errorCell: "error-cell",
};

export const classSelectors = Object.keys(CLASSES).reduce((acc, cur) => {
  acc[cur] = "." + CLASSES[cur];
  return acc;
}, {});

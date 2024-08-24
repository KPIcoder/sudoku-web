const ATTRIBUTES = {
  editable: "contenteditable",
};

const CLASSES = {
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

const classSelectors = Object.keys(CLASSES).reduce((acc, cur) => {
  acc[cur] = "." + CLASSES[cur];
  return acc;
}, {});

export function setupListeners(onGameStart, onGameEnd) {
  document.addEventListener("click", (e) => {
    if (e.target.matches(classSelectors.playBtn)) {
      handleClickPlay();
      return onGameStart();
    }

    if (e.target.matches(classSelectors.endBtn)) {
      handleClickEnd();
      return onGameEnd();
    }
  });
}

export function handleClickPlay() {
  const button = document.querySelector(classSelectors.gameBtn);
  const levelSelector = document.querySelector(classSelectors.level);

  button.classList.replace("play-btn", "end-btn");
  button.innerText = "End";
  levelSelector.classList.add(CLASSES.levelReadOnly);
}

export function handleClickEnd() {
  const button = document.querySelector(classSelectors.gameBtn);
  const levelSelector = document.querySelector(classSelectors.level);

  const cells = document.querySelectorAll(classSelectors.cell);
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove(CLASSES.activeCell);
    cell.classList.remove(CLASSES.errorCell);
    cell.setAttribute(ATTRIBUTES.editable, "false");
  });
  button.classList.replace(CLASSES.endBtn, CLASSES.playBtn);
  button.innerText = "Play";

  levelSelector.classList.remove(CLASSES.levelReadOnly);
}

export function fillCell(coords, value) {
  const cell = getCell(coords);

  cell.innerText = value;
}

export function listenToCellChanges(coords, checker) {
  const cell = getCell(coords);
  cell.addEventListener("click", () => selectCell(coords, checker));
}

export function selectCell(coords, checker) {
  const cell = getCell(coords);
  const isEditable = cell.getAttribute(ATTRIBUTES.editable) === "true";

  if (!isEditable) throw new Error("You cannot select a filled cell");
  cell.addEventListener("keyup", (e) => handleKeyUp(e, checker));

  cell.classList.add(CLASSES.activeCell);
}

export function handleKeyUp(event, checker) {
  const { id, innerText: value } = event.target;
  const cellCoords = parseCellId(id);
  const cell = getCell(cellCoords);
  if (value) {
    cell.blur();
    const isValid = checker(...cellCoords, parseInt(value));

    return isValid ? onRightKeyUp(cell) : onWrongKeyUp(cell);
  }

  if (event.key === "Escape") cell.blur();
}

function onRightKeyUp(cell) {
  makeCellUneditable(cell);
}

function onWrongKeyUp(cell) {
  cell.classList.add(CLASSES.errorCell);
}

export function makeCellEditable(coords) {
  const cell = getCell(coords);
  return cell.setAttribute(ATTRIBUTES.editable, "true");
}

export function makeCellUneditable(cell) {
  return cell.setAttribute(ATTRIBUTES.editable, "false");
}

export function getCell(coords) {
  const [x, y] = coords;
  return document.getElementById(`cell-${x}-${y}`);
}

export function onTimeChange(displayedTime) {
  const timerNode = document.querySelector(classSelectors.timer);
  timerNode.innerText = `Time: ${displayedTime}`;
}

const parseCellId = (cellId) =>
  cellId
    .substring("cell-".length)
    .split("-")
    .map((v) => parseInt(v));

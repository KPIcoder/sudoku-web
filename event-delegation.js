import {
  EVENT_NAMES,
  CLASSES,
  ATTRIBUTES,
  classSelectors,
} from "./constants.js";
import { messageBroker } from "./message-broker.js";

export function setupListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.matches(classSelectors.playBtn)) {
      return messageBroker.publish(EVENT_NAMES.start);
    }

    if (e.target.matches(classSelectors.endBtn)) {
      handleClickEnd();
      return messageBroker.publish(EVENT_NAMES.end);
    }
  });
}

function handleClickPlay() {
  const button = document.querySelector(classSelectors.gameBtn);
  const levelSelector = document.querySelector(classSelectors.level);

  button.classList.replace("play-btn", "end-btn");
  button.innerText = "End";
  levelSelector.classList.add(CLASSES.levelReadOnly);
}

function prepareBoard(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const value = board[i][j];
      listenToCellChanges([i, j]);
      if (value !== 0) fillCell([i, j], value);
      else makeCellEditable([i, j]);
    }
  }
}

function handleClickEnd() {
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

function fillCell(coords, value) {
  const cell = getCell(coords);

  cell.innerText = value;
}
function listenToCellChanges(coords) {
  const cell = getCell(coords);
  cell.addEventListener("click", () => selectCell(coords));
}

function selectCell(coords) {
  const cell = getCell(coords);
  const isEditable = cell.getAttribute(ATTRIBUTES.editable) === "true";

  if (!isEditable) throw new Error("You cannot select a filled cell");
  cell.addEventListener("keyup", (e) => handleKeyUp(e));

  cell.classList.add(CLASSES.activeCell);
}

function handleKeyUp(event) {
  const { id, innerText: value } = event.target;
  const cellCoords = parseCellId(id);
  const cell = getCell(cellCoords);

  if (value) {
    cell.blur();
    messageBroker.publish(EVENT_NAMES.playMove, cellCoords, parseInt(value));
  }

  if (event.key === "Escape") cell.blur();
}

function onRightKeyUp(coords) {
  const cell = getCell(coords);
  cell.classList.remove(CLASSES.errorCell);
  makeCellUneditable(cell);
}

function onWrongKeyUp(coords) {
  const cell = getCell(coords);
  cell.classList.add(CLASSES.errorCell);
}

function makeCellEditable(coords) {
  const cell = getCell(coords);
  return cell.setAttribute(ATTRIBUTES.editable, "true");
}

function makeCellUneditable(cell) {
  return cell.setAttribute(ATTRIBUTES.editable, "false");
}

function getCell(coords) {
  const [x, y] = coords;
  return document.getElementById(`cell-${x}-${y}`);
}

function onTimeChange(displayedTime) {
  const timerNode = document.querySelector(classSelectors.timer);
  timerNode.innerText = `Time: ${displayedTime}`;
}

messageBroker.subscribe(EVENT_NAMES.timeChange, onTimeChange);
messageBroker.subscribe(EVENT_NAMES.rightMove, onRightKeyUp);
messageBroker.subscribe(EVENT_NAMES.wrongMove, onWrongKeyUp);
messageBroker.subscribe(EVENT_NAMES.start, handleClickPlay);
messageBroker.subscribe(EVENT_NAMES.end, handleClickEnd);
messageBroker.subscribe(EVENT_NAMES.prepareBoard, prepareBoard);

const parseCellId = (cellId) =>
  cellId
    .substring("cell-".length)
    .split("-")
    .map((v) => parseInt(v));

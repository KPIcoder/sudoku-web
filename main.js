import { Sudoku } from "./sudoku.js";

const sudoku = new Sudoku();
startTimer();

const game = sudoku.generateGame();

for (let i = 0; i < game.length; i++) {
  for (let j = 0; j < game.length; j++) {
    const cell = document.getElementById(`cell-${i}-${j}`);
    cell.innerText = game[i][j] === 0 ? "" : game[i][j];
  }
}

const cells = document.getElementsByClassName("sudoku-cell");

for (const cell of cells) {
  cell.addEventListener("click", selectCell);
}

let activeCell = null;

function selectCell(event) {
  const cell = event.target;

  if (activeCell) {
    activeCell.classList.remove("active-cell");
  }
  if (cell.innerText.length === 0) {
    activeCell = cell;
    activeCell.classList.add("active-cell");
    activeCell.setAttribute("contenteditable", "true");

    activeCell.addEventListener("keyup", inputNumber);
  }
}

function inputNumber(event) {
  const { id, innerText: value } = event.target;
  const cellCoords = parseCellId(id);
  if (value) {
    document.activeElement.blur();
    const isValid = sudoku.checkUserNumber(...cellCoords, parseInt(value));

    if (!isValid) activeCell?.classList.add("error-cell");
    else event.target.setAttribute("contenteditable", "false");
  }

  if (event.key === "Escape") document.activeElement.blur();
}

const parseCellId = (cellId) =>
  cellId
    .substring("cell-".length)
    .split("-")
    .map((v) => parseInt(v));

function startTimer() {
  const timerNode = document.getElementsByClassName("timer")[0];
  let time = 0;

  setInterval(() => {
    time++;
    timerNode.innerText = `Time: ${time}`;
  }, 1000);
}

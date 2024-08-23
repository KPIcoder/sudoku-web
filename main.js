import {
  fillCell,
  handleClickPlay,
  makeCellEditable,
  listenToCellChanges,
} from "./event-delegation.js";
import { Sudoku } from "./sudoku.js";

function main() {
  const sudoku = new Sudoku();
  document.addEventListener("click", (e) => {
    if (e.target.matches(".play-btn")) {
      const gameBoard = sudoku.generateGame();
      startTimer();
      handleClickPlay();

      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
          const value = gameBoard[i][j];
          listenToCellChanges([i, j], () => sudoku.checkUserNumber);
          if (value !== 0) fillCell([i, j], value);
          else makeCellEditable([i, j]);
        }
      }
    }
  });
}

main();

function startTimer() {
  const timerNode = document.getElementsByClassName("timer")[0];
  let time = 0;

  setInterval(() => {
    time++;
    timerNode.innerText = `Time: ${time}`;
  }, 1000);
}

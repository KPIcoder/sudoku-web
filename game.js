import { Sudoku } from "./sudoku.js";
import { Timer } from "./timer.js";

import {
  fillCell,
  makeCellEditable,
  listenToCellChanges,
  onTimeChange,
} from "./event-delegation.js";

export class Game {
  timer;
  sudoku;
  gameBoard;

  constructor() {
    this.sudoku = new Sudoku();
    this.timer = new Timer();
    this.prepareSudoku();
  }

  prepareSudoku() {
    this.gameBoard = this.sudoku.generateGame();
  }

  start() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        const value = this.gameBoard[i][j];
        listenToCellChanges(
          [i, j],
          this.sudoku.checkUserNumber.bind(this.sudoku)
        );
        if (value !== 0) fillCell([i, j], value);
        else makeCellEditable([i, j]);
      }
    }
    this.timer.start(onTimeChange);
  }

  end() {
    this.timer.end();
  }
}

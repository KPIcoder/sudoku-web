import { Sudoku } from "./sudoku.js";
import { Timer } from "./timer.js";

import { messageBroker } from "./message-broker.js";
import { EVENT_NAMES } from "./constants.js";

export class Game {
  timer;
  sudoku;
  gameBoard;

  constructor() {
    this.sudoku = new Sudoku();
    this.timer = new Timer();

    messageBroker.subscribe(EVENT_NAMES.start, () => this.start());
    messageBroker.subscribe(EVENT_NAMES.end, () => this.end());
    messageBroker.subscribe(EVENT_NAMES.playMove, (...args) =>
      this.playMove(...args)
    );
    messageBroker.subscribe(EVENT_NAMES.setLevel, (...args) =>
      this.setLevel(...args)
    );
  }

  setLevel(level) {
    this.sudoku.setLevel(level);
  }

  prepareSudoku() {
    this.gameBoard = this.sudoku.generateGame();
  }

  start() {
    this.prepareSudoku();
    this.timer.start();
    messageBroker.publish(EVENT_NAMES.prepareBoard, this.gameBoard);
  }

  playMove(coords, value) {
    const [x, y] = coords;
    const isValid = this.sudoku.checkUserNumber(x, y, value);

    if (!isValid) return messageBroker.publish(EVENT_NAMES.wrongMove, coords);
    this.sudoku.board[x][y] = value;
    if (this.sudoku.isSolved()) return messageBroker.publish(EVENT_NAMES.end);
    return messageBroker.publish(EVENT_NAMES.rightMove, coords);
  }

  end() {
    this.timer.end();
  }
}

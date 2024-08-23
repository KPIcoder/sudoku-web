export class Sudoku {
  // identifiers
  // [ [] ]
  level; // 1,2,3
  board;
  size = 9;
  goal; //
  constructor() {}
  // public methods

  generateGame() {
    const REMOVED_CELLS_BY_LEVEL = { 1: 20, 2: 30, 3: 50 };
    this.board = this._initBoard();

    const initState = this._generateInitialState();

    for (const entry of initState.entries()) {
      const [coords, value] = entry;
      const [x, y] = coords;
      this.board[x][y] = value;
    }

    this.goal = this.solveSudoku();
    this._removeCellsForUniqueSolution(REMOVED_CELLS_BY_LEVEL[this.level ?? 1]);

    return this.board;
  }

  setLevel(level) {
    this.level = level;
  }

  checkUserNumber(cellX, cellY, number) {
    console.log(this.goal);
    return this.goal[cellX][cellY] === number;
  }

  solveSudoku() {
    this._solveSudoku();

    this.goal = this._initBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.goal[i][j] = this.board[i][j];
      }
    }
    return this.goal;
  }

  // private methods

  _checkNumber(cellX, cellY, number) {
    return (
      this._checkRowForNumber(cellX, number) &&
      this._checkColumnForNumber(cellY, number) &&
      this._checkSquare(cellX, cellY, number)
    );
  }

  _solveSudoku() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          // Find an empty cell
          for (let num = 1; num <= 9; num++) {
            if (this._checkNumber(row, col, num)) {
              this.board[row][col] = num; // Tentatively place num in the cell

              if (this._solveSudoku()) {
                // Recursively try to solve the rest of the board
                return true;
              }

              this.board[row][col] = 0; // Backtrack if placing num doesn't lead to a solution
            }
          }
          return false; // If no number can be placed in this cell, backtrack
        }
      }
    }
    return true; // Board is fully solved
  }

  _removeCellsForUniqueSolution(cellsToRemove) {
    let attempts = 0;

    while (cellsToRemove > 0 && attempts < 200) {
      // Limit attempts to avoid infinite loop
      let row = Math.floor(Math.random() * this.size);
      let col = Math.floor(Math.random() * this.size);

      if (this.board[row][col] !== 0) {
        // Ensure the cell isn't already empty
        let backup = this.board[row][col];
        this.board[row][col] = 0;

        // Copy the board to check for uniqueness
        let copy = this.board.map((row) => [...row]);
        let solutionCount = this._countSolutions(copy);

        if (solutionCount !== 1) {
          this.board[row][col] = backup; // Restore the removed value if there's more than one solution
          attempts++;
        } else {
          cellsToRemove--;
        }
      }
    }
  }

  _countSolutions(board) {
    let solutions = 0;

    const solve = (board) => {
      let minPossibilities = 10;
      let bestRow = -1;
      let bestCol = -1;

      // Find the cell with the minimum number of possible values
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (board[row][col] === 0) {
            let possibilities = this._getValidNumbers(board, row, col).length;
            if (possibilities < minPossibilities) {
              minPossibilities = possibilities;
              bestRow = row;
              bestCol = col;
            }
          }
        }
      }

      if (bestRow === -1) {
        // No empty cell found, which means the board is solved
        solutions++;
        return solutions;
      }

      // Try each valid number in the best cell
      for (let num of this._getValidNumbers(board, bestRow, bestCol)) {
        board[bestRow][bestCol] = num;

        // Continue solving with this placement
        solve(board);

        if (solutions > 1) return solutions; // Stop early if more than one solution is found

        board[bestRow][bestCol] = 0; // Backtrack
      }

      return solutions;
    };

    return solve(board);
  }

  _getValidNumbers(board, row, col) {
    const possibleNumbers = new Set(Array.from({ length: 9 }, (_, i) => i + 1));

    // Eliminate numbers already in the row
    for (let i = 0; i < this.size; i++) {
      possibleNumbers.delete(board[row][i]);
    }

    // Eliminate numbers already in the column
    for (let i = 0; i < this.size; i++) {
      possibleNumbers.delete(board[i][col]);
    }

    // Eliminate numbers already in the 3x3 square
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        possibleNumbers.delete(board[startRow + i][startCol + j]);
      }
    }

    return Array.from(possibleNumbers);
  }

  _generateInitialState() {
    const state = new Map();
    const shuffledValues = this._generateShuffledValueArray();
    while (state.size !== this.size) {
      const coord = this._generateRandomCoordinate();
      if (!state.has(coord)) state.set(coord, shuffledValues.pop());
    }

    return state;
  }

  _generateShuffledValueArray() {
    const arr = new Array(this.size).fill(0).map((_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  _checkRowForNumber(rowIndex, number) {
    for (let i = 0; i < this.size; i++) {
      if (this.board[rowIndex][i] === number) return false;
    }
    return true;
  }

  _checkColumnForNumber(columnIndex, number) {
    for (let i = 0; i < this.size; i++) {
      if (this.board[i][columnIndex] === number) return false;
    }
    return true;
  }

  _checkSquare(cellX, cellY, number) {
    const [rowIndex, columnIndex] = this._getSquareCoords(cellX, cellY);
    for (let i = rowIndex; i < rowIndex + Math.sqrt(this.size); i++) {
      for (let j = columnIndex; j < columnIndex + Math.sqrt(this.size); j++) {
        if (this.board[i][j] === number) return false;
      }
    }
    return true;
  }

  _getSquareCoords(cellX, cellY) {
    const x = cellX > 2 ? (cellX > 5 ? 6 : 3) : 0; // 0-8 range
    const y = cellY > 2 ? (cellY > 5 ? 6 : 3) : 0; // 0-8 range

    return [x, y];
  }

  _generateRandomCoordinate() {
    const x = this._generateRandomNumberInSizeRange() - 1;
    const y = this._generateRandomNumberInSizeRange() - 1;

    return [x, y];
  }

  _generateRandomNumberInSizeRange() {
    return Math.floor(Math.random() * this.size + 1);
  }

  _initBoard() {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }
}

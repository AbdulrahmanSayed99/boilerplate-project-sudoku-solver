class SudokuSolver {
  constructor() {
    this.isValid = this.isValid.bind(this);
    this.solve = this.solve.bind(this);
    this.rowToNum = this.rowToNum.bind(this);
  }

  validate(puzzle) {
    // error on invalid puzzle
    const re = /^[\d.]+$/gi;
    if (puzzle.length !== 81)
      return [false, { error: "Expected puzzle to be 81 characters long" }];
    if (re.test(puzzle) === false)
      return [false, { error: "Invalid characters in puzzle" }];
    // return puzzle string to array of rows to solve and check placement
    let arr = puzzle.split("");
    let a1 = [],
      a2 = [],
      a3 = [],
      a4 = [],
      a5 = [],
      a6 = [],
      a7 = [],
      a8 = [],
      a9 = [];
    arr.forEach((itm, i) => {
      let num = i + 1;
      if (num / 9 <= 1) a1.push(itm);
      if (num / 9 > 1 && num / 9 <= 2) a2.push(itm);
      if (num / 9 > 2 && num / 9 <= 3) a3.push(itm);
      if (num / 9 > 3 && num / 9 <= 4) a4.push(itm);
      if (num / 9 > 4 && num / 9 <= 5) a5.push(itm);
      if (num / 9 > 5 && num / 9 <= 6) a6.push(itm);
      if (num / 9 > 6 && num / 9 <= 7) a7.push(itm);
      if (num / 9 > 7 && num / 9 <= 8) a8.push(itm);
      if (num / 9 > 8 && num / 9 <= 9) a9.push(itm);
    });
    const result = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
    return [true, result];
  }

  rowToNum(r) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let num;
    // convert row letter to number
    rows.forEach((itm, i) => {
      if (r.toUpperCase() === itm) num = i;
    });
    return num;
  }

  checkRow(puzzle, r, col, value) {
    r = this.rowToNum(r);
    col = col - 1;
    let result = true;
    // check if value is in row
    puzzle[r].forEach((itm) => {
      if (value == itm) result = "row";
    });
    // check if value is already in place
    if (puzzle[r][col] == value) result = true;
    return result;
  }

  checkCol(puzzle, r, col, value) {
    r = this.rowToNum(r);
    col = col - 1;
    let result = true;
    // check if value is in column
    puzzle.forEach((itm) => {
      if (value == itm[col]) result = "column";
    });
    // check if value is already in place
    if (puzzle[r][col] == value) result = true;
    return result;
  }

  checkReg(puzzle, r, col, value) {
    r = this.rowToNum(r);
    col = col - 1;
    let result = true;
    // check if value is in region
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);
      if (value == puzzle[m][n]) result = "region";
    }
    // check if value is already in place
    if (puzzle[r][col] == value) result = true;
    return result;
  }

  isValid(puzzle, r, col, reg) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);
      if (puzzle[r][i] == reg || puzzle[i][col] == reg || puzzle[m][n] == reg) {
        return false;
      }
    }
    return true;
  }

  solve(puzzle) {
    for (let r = 0; r < 9; r++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[r][col] == ".") {
          for (let reg = 1; reg <= 9; reg++) {
            if (this.isValid(puzzle, r, col, reg)) {
              puzzle[r][col] = reg;
              // return array to string if exists for result solution
              if (this.solve(puzzle)) {
                return puzzle.toString().replace(/,/g, "");
              } else {
                puzzle[r][col] = ".";
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

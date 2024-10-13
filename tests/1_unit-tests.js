const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const testStrings = require("../controllers/puzzle-strings.js")
  .puzzlesAndSolutions;

suite("UnitTests", () => {
  test("Valid puzzle of 81 characters", (done) => {
    const puzzle = testStrings[0][0];
    assert.lengthOf(puzzle, 81);
    assert.isNotFalse(solver.validate(puzzle)[0]);
    done();
  });

  test("Puzzle with invalid characters", (done) => {
    const puzzle = testStrings[0][0].replace(".", "#");
    assert.isFalse(solver.validate(puzzle)[0]);
    assert.deepEqual(solver.validate(puzzle)[1], {
      error: "Invalid characters in puzzle"
    });
    done();
  });

  test("Puzzle that is not 81 characters long", (done) => {
    const puzzle = testStrings[0][0].replace(".", "");
    assert.lengthOf(puzzle, 80);
    assert.isFalse(solver.validate(puzzle)[0]);
    assert.deepEqual(solver.validate(puzzle)[1], {
      error: "Expected puzzle to be 81 characters long"
    });
    done();
  });

  test("Puzzle with valid row placement", (done) => {
    const puzzle = solver.validate(testStrings[5][0])[1],
      row = "a",
      col = 1,
      value = 3;
    assert.isTrue(solver.checkRow(puzzle, row, col, value));
    done();
  });

  test("Puzzle with invalid row placement", (done) => {
    const puzzle = solver.validate(testStrings[5][0])[1],
      row = "C",
      col = 5,
      value = 3;
    assert.equal(solver.checkRow(puzzle, row, col, value), "row");
    done();
  });

  test("Puzzle with valid column placement", (done) => {
    const puzzle = solver.validate(testStrings[5][0])[1],
      row = "i",
      col = 9,
      value = 1;
    assert.isTrue(solver.checkCol(puzzle, row, col, value));
    done();
  });

  test("Puzzle with invalid column placement", (done) => {
    const puzzle = solver.validate(testStrings[5][0])[1],
      row = "H",
      col = 2,
      value = 5;
    assert.equal(solver.checkCol(puzzle, row, col, value), "column");
    done();
  });

  test("Puzzle with valid region placement", (done) => {
    const puzzle = solver.validate(testStrings[5][0])[1],
      row = "b",
      col = 1,
      value = 8;
    assert.isTrue(solver.checkReg(puzzle, row, col, value));
    done();
  });

  test("Puzzle with invalid region placement", (done) => {
    const puzzle = solver.validate(testStrings[5][0])[1],
      row = "C",
      col = 9,
      value = 2;
    assert.equal(solver.checkReg(puzzle, row, col, value), "region");
    done();
  });

  test("Valid puzzles pass the solver", (done) => {
    const incompletePuzzle = testStrings[0][0],
      completePuzzle = testStrings[0][1],
      validatedPuzzle = solver.validate(incompletePuzzle)[1];
    assert.equal(solver.solve(validatedPuzzle), completePuzzle);
    done();
  });

  test("Invalid puzzles fail the solver", (done) => {
    const invalidPuzzle = testStrings[0][0].replace(".", "1"),
      validatedPuzzle = solver.validate(invalidPuzzle)[1];
    assert.isFalse(solver.solve(validatedPuzzle));
    done();
  });

  test("Sovler returns the expected solution for an incomplete puzzle", (done) => {
    const incompletePuzzle = testStrings[1][0],
      completedPuzzle = testStrings[1][1],
      validatedPuzzle = solver.validate(incompletePuzzle)[1];
    assert.equal(solver.solve(validatedPuzzle), completedPuzzle);
    done();
  });
});

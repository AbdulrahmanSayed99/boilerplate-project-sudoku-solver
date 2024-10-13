'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
 let rows= solver.validate('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51')[1]
 let cols = [];
 Object.values(rows).forEach(itm=>{
  cols.push(itm[1])
 })
 /*let rowtest= solver.checkRowPlacement('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51', 'A', 2, 6);
 let coltest= solver.checkColPlacement('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51', 'A', 2, 6);
let regiontest = solver.checkRegionPlacement('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51', 'A', 2, 6)
 //console.log(rows['a'])
 //console.log(rowtest)
 //console.log(cols)
 //console.log(coltest) 
 console.log(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'))*/
 app.route("/api/check").post((req, res) => {
  const puzzle = req.body.puzzle;
  const coord = req.body.coordinate;
  const value = req.body.value;
  if (!puzzle || !coord || !value)
    return res.json({ error: "Required field(s) missing" });
  // check if puzzle is valid
  const validate = solver.validate(puzzle);
  if (validate[0] === false) return res.json(validate[1]);
  // check if coordinate and value is valid
  const coordRe = /^[a-iA-I][1-9]$/gi;
  const valueRe = /^[1-9]$/;
  
  if (valueRe.test(value) === false)
    return res.json({ error: 'Invalid value' });

  if (coordRe.test(coord) === false)
    return res.json({ error: 'Invalid coordinate'});
  
  // seperate row and column
  const row = coord.split("")[0];
  const col = coord.split("")[1];
  // check conflict
  let conflicts = [];
  const checkRow = solver.checkRow(validate[1], row, col, value);
  const checkCol = solver.checkCol(validate[1], row, col, value);
  const checkReg = solver.checkReg(validate[1], row, col, value);
  if (checkRow !== true) conflicts.push(checkRow);
  if (checkCol !== true) conflicts.push(checkCol);
  if (checkReg !== true) conflicts.push(checkReg);
  if (conflicts.length !== 0)
    return res.json({ valid: false, conflict: conflicts });
  // return true if true
  res.json({ valid: true });
});

app.route("/api/solve").post((req, res) => {
  const puzzle = req.body.puzzle;
  // error on no puzzle
  if (!puzzle) return res.json({ error: "Required field missing" });
  // validate puzzle
  const validate = solver.validate(puzzle);
  if (validate[0] === false) return res.json(validate[1]);
  // error if puzzle cannot be solved
  const solution = solver.solve(validate[1]);
  if (solution === false)
    return res.json({ error: "Puzzle cannot be solved" });
  // return puzzle solution
  res.json({ solution: solution });
});
};

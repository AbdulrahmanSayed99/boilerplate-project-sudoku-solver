const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const testStrings = require("../controllers/puzzle-strings.js")
  .puzzlesAndSolutions;

suite("Functional Tests", () => {
  suite("POST request to (/api/solve)", () => {
    test("Solve a valid puzzle", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: testStrings[3][0] })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, testStrings[3][1]);
          done();
        });
    });

    test("Solve a puzzle with a missing string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", (done) => {
      const invalidPuzzle = testStrings[0][0].replace(".", "@");
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Puzzle with incorrect length", (done) => {
      const shortPuzzle = testStrings[0][0].replace(".", "");
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: shortPuzzle })
        .end((err, res) => {
          if (err) done(err);
          assert.lengthOf(shortPuzzle, 80);
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Puzzle that cannot be solved", (done) => {
      const puzzle = testStrings[0][0].replace(".", "1");
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST request to (/api/check)", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0],
          coordinate: "A1",
          value: "9"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[5][0],
          coordinate: "a1",
          value: "2"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 1);
          assert.equal(res.body.conflict[0], "region");
          done();
        });
    });

    test("Check a puzzle with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[5][0],
          coordinate: "b3",
          value: "4"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 2);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "region");
          done();
        });
    });

    test("Check a puzzle with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[5][0],
          coordinate: "e3",
          value: "9"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.lengthOf(res.body.conflict, 3);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          assert.equal(res.body.conflict[2], "region");
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          value: "3"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[0][0].replace(".", "@"),
          coordinate: "A2",
          value: "3"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      const puzzle = testStrings[0][0].replace(".", "");
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "a1",
          value: "9"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.lengthOf(puzzle, 80);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[4][0],
          coordinate: "K1",
          value: "3"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: testStrings[3][0],
          coordinate: "I5",
          value: "10"
        })
        .end((err, res) => {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});

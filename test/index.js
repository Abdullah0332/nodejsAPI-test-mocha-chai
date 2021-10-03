//During the test the env variable is set to test
process.env.NODE_ENV = "test";

import app from "../server.js";
import chai from "chai";
import chaiHttp from "chai-http";
import { LowSync, JSONFileSync } from "lowdb";
var should = chai.should();

// Instantiating database module
// This will create db.json storage in the root folder
const db = new LowSync(new JSONFileSync("file.json"));

chai.use(chaiHttp);

//Our parent block
describe("Tasks", () => {
  // GET all tasks
  describe("/GET tasks", () => {
    it("it should GET all the tasks", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  // GET on task
  describe("/GET/:id task", () => {
    it("it should GET single task", (done) => {
      db.read();
      var task = db.data.tasks[0];
      chai
        .request(app)
        .get("/tasks/" + task.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("task");
          res.body.should.have.property("id");
          done();
        });
    });
  });

  //POST task
  describe("/POST task", () => {
    it("it should POST new task", (done) => {
      let task = { task: "TESTING" };
      chai
        .request(app)
        .post("/tasks")
        .send(task)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Task Added Successfully!");
          res.body.task.should.have.property("task");
          res.body.task.should.have.property("id");
          done();
        });
    });
  });

  // PUT update task
  describe("/PUT/:id task", () => {
    it("it should UPDATE the task", (done) => {
      var task = db.data.tasks[0];
      let body = { task: "Updated Task" };
      chai
        .request(app)
        .put("/tasks/" + task.id)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Task Updated Successfully!");
          done();
        });
    });
  });

  // DELETE a task
  describe("/DELETE/:id task", () => {
    it("it should DELETE the task", (done) => {
      var task = db.data.tasks[1];
      chai
        .request(app)
        .delete("/tasks/" + task.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Task Deleted Successfully!");
          done();
        });
    });
  });
});

// Loading modules
import express from "express";
import { LowSync, JSONFileSync } from "lowdb";

// Instantiating express module
var app = express();

// Instantiating database module
// This will create db.json storage in the root folder
const db = new LowSync(new JSONFileSync("file.json"));

// Adding body-parser middleware to parser JSON data
app.use(express.json());

const PORT = process.env.PORT || 3000;

// // CRUD routes to manage a task list
// Listing all tasks
app.get("/tasks", function (req, res) {
  db.read();
  return res.status(200).json(db.data.tasks);
});

// // Finding a task
app.get("/tasks/:id", function (req, res) {
  var id = req.params.id;
  db.read();
  var task = db.data.tasks.find((task) => (task.id = parseFloat(id)));

  if (task) {
    return res.status(200).json(task);
  }
  return res.status(404).end();
});

// Adding new task
app.post("/tasks", function (req, res) {
  var task = req.body;
  db.read();
  task.id = Math.random();

  db.data = { tasks: [...db.data.tasks, task] };
  db.write();

  return res.status(201).send({ message: "Task Added Successfully!", task });
});

// Updating a task
app.put("/tasks/:id", function (req, res) {
  var id = req.params.id;
  var task = req.body.task;
  db.read();

  var foundIndex = db.data.tasks.findIndex(
    (task) => (task.id = parseFloat(id))
  );

  db.data.tasks[foundIndex].task = task;
  db.write();

  return res.status(201).send({ message: "Task Updated Successfully!" });
});

// Delete a task
app.delete("/tasks/:id", function (req, res) {
  var id = req.params.id;

  db.read();
  const updatedArray = db.data.tasks.filter(
    (task) => task.id.toString() !== id.toString()
  );

  db.data.tasks = updatedArray;
  db.write();

  return res.status(200).send({ message: "Task Deleted Successfully!" });
});

// API server listing port 3000
app.listen(PORT, function () {
  console.log(`API up and running on PORT ${PORT}`);
});

// Exporting the app module
export default app;

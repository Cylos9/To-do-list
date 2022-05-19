const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysqlpassword",
  dateStrings: true,
  multipleStatements: true,
  database: "todolist",
});

//  display an error message when not able to connect to mySQL
connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.get("/", (req, res) => {
  connection.query(
    "SELECT * FROM tasks; SELECT * FROM history",
    (error, results) => {
      res.render("index.ejs", { tasks: results[0], history: results[1] });
    }
  );
});

app.post("/addtask", (req, res) => {
  connection.query(
    "INSERT INTO tasks (title, description,date,status) VALUES (?,?,?,?); INSERT INTO history (title, action,date) VALUES (?,?,?)",
    [
      req.body.title,
      req.body.description,
      req.body.date,
      req.body.status,
      req.body.title,
      "add",
      req.body.date,
    ],
    (error, results) => {
      res.send({ id: results[0].insertId });
    }
  );
});

app.post("/deltask/:id", (req, res) => {
  connection.query(
    "DELETE FROM tasks WHERE id = ?;INSERT INTO history (title, action,date) VALUES (?,?,?)",
    [req.params.id, req.body.title, "delete", req.body.date],
    (error, results) => {
      res.send({});
    }
  );
});

app.post("/cleartasks", (req, res) => {
  connection.query("TRUNCATE tasks", (error, results) => {
    res.send({});
  });
});

app.post("/clearhistory", (req, res) => {
  connection.query("TRUNCATE history", (error, results) => {
    res.send({});
  });
});

app.post("/updatestatus/:id", (req, res) => {
  connection.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    (error, results) => {
      res.send({});
    }
  );
});
app.get("/retrive/:id", (req, res) => {
  connection.query(
    "SELECT * FROM tasks WHERE id=?",
    [req.params.id],
    (error, results) => {
      res.send(results[0]);
    }
  );
});

app.listen(3000);

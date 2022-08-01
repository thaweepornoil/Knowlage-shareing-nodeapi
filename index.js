const express = require("express");

const app = express();

const cors = require("cors");

const PORT = process.env.PORT || 3000;
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "schools",
  password: "root",
  port: 3306,
  connectionLimit: 10,
});

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send(200, {
    message: "Hello World!",
  });
});

app.get("/students", (req, res) => {
  let query = `Select * from students`;

  connection.query(query, (err, result) => {
    if (err) throw err;
    res.send(200, {
      result: result,
    });
  });
});

app.get("/student/:userId", (req, res) => {
  let { userId } = req.params;

  let query = `Select * from students where id = ${userId}`;

  connection.query(query, (err, result) => {
    if (err) throw err;
    res.send(200, {
      result: result,
    });
  });
});

app.post("/addstudent", (req, res) => {
  let { firstname, lastname, tel, email } = req.body;

  let query = `INSERT  INTO students (firstname, 
    lastname,
     tel,
      email)
       VALUES 
       ('${firstname}',
       '${lastname}',
       '${tel}',
       '${email}'); `;
  connection.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).json({
      result: "insert student success",
    });
  });
});

app.put("/student/:userId", (req, res) => {
  let { userId } = req.params;
  let query = "UPDATE students SET ";
  last = Object.keys(req.body)[Object.keys(req.body).length - 1];
  Object.keys(req.body).forEach((key) => {
    query += `${key} = '${req.body[key]}' ${last === key ? "" : ","}`;
  });
  query += `WHERE id = ${userId}`;
   connection.query(query, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        result: "Edit student success",
      });
    });
});

app.delete("/deletestudent/:userId", (req, res) => {
    let { userId } = req.params;
    query  = `DELETE FROM students
    WHERE id = ${userId};
    `;
    connection.query(query, (err, result) => {
       if (err) throw err;
       res.status(200).json({
         result: "Delete student success",
       });
     });
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

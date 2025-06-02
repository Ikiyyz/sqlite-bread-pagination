const express = require("express");
const bodyParser = require("body-parser");
const {
  readData,
  addData,
  addForm,
  deleteData,
  editData,
  updateData,
} = require("./controllers/dataController");

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", readData);

app.get("/add", addForm);

app.post("/add", addData);

app.get("/delete/:id", deleteData);

app.get("/edit/:id", editData);

app.post("/edit/:id", updateData);

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});

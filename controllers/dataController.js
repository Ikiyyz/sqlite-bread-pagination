const Data = require("../models/data");

function readData(req, res) {
  Data.read(req.query, function (err, data, page, pages, offset) {
    if (err) return res.send("Error fetching data");
    const url = req.url == "/" ? "/?page=1" : req.url;
    res.render("data/list", {
      data: data || [],
      query: req.query,
      page,
      pages,
      offset,
      url,
    });
  });
}

function addForm(req, res) {
  res.render("data/form", {
    item: {},
    action: "/add",
    title: "Add New Data",
  });
}

function addData(req, res) {
  const input = {
    name: req.body.name,
    height: parseInt(req.body.height),
    weight: parseFloat(req.body.weight),
    birthdate: req.body.birthdate,
    married: req.body.married === "true" ? true : false,
  };
  Data.create(input, (err) => {
    if (err) return res.send("Error inserting data");
    res.redirect("/");
  });
}

function deleteData(req, res) {
  const id = req.params.id;
  Data.deleteById(id, (err) => {
    if (err) return res.send("Error deleting data");
    res.redirect("/");
  });
}

function editData(req, res) {
  const id = req.params.id;
  Data.getById(id, (err, row) => {
    if (err) return res.send("Error retrieving data");
    res.render("data/form", {
      item: row,
      action: `/edit/${id}`,
      title: "Edit Data",
    });
  });
}

function updateData(req, res) {
  const id = req.params.id;
  const updated = {
    name: req.body.name,
    height: parseInt(req.body.height),
    weight: parseFloat(req.body.weight),
    birthdate: req.body.birthdate,
    married: req.body.married === "true" ? true : false,
  };
  Data.update(id, updated, (err) => {
    if (err) return res.send("Error updating data");
    res.redirect("/");
  });
}

module.exports = {
  readData,
  addForm,
  addData,
  deleteData,
  editData,
  updateData,
};

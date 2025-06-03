const db = require("./connect");

function create(data, callback) {
  const sql = `INSERT INTO data (name, height, weight, birthdate, married) VALUES (?, ?, ?, ?, ?)`;
  db.run(
    sql,
    [data.name, data.height, data.weight, data.birthdate, data.married],
    callback
  );
}

function deleteById(id, callback) {
  db.run(`DELETE FROM data WHERE id = ?`, [id], callback);
}

function getById(id, callback) {
  db.get(`SELECT * FROM data WHERE id = ?`, [id], callback);
}

function update(id, data, callback) {
  const sql = `UPDATE data SET name = ?, height = ?, weight = ?, birthdate = ?, married = ? WHERE id = ?`;
  db.run(
    sql,
    [data.name, data.height, data.weight, data.birthdate, data.married, id],
    callback
  );
}

function read(query, callback) {
  const page = parseInt(query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM data";
  let sqlCount = "SELECT COUNT(*) as total FROM data";
  const filters = [];
  const params = [];

  // name (LIKE)
  if (query.name) {
    filters.push("name LIKE ?");
    params.push(`%${query.name}%`);
  }

  // height (=)
  if (query.height) {
    filters.push("height = ?");
    params.push(query.height);
  }

  // weight (=)
  if (query.weight) {
    filters.push("weight = ?");
    params.push(query.weight);
  }

  // birthdate (BETWEEN, >=, <=)
  const start = query.startdate;
  const end = query.enddate;
  
  if (start && end) {
    filters.push("birthdate BETWEEN ? AND ?");
    params.push(start, end);
  } else if (start) {
    filters.push("birthdate >= ?");
    params.push(start);
  } else if (end) {
    filters.push("birthdate <= ?");
    params.push(end);
  }

  // married (true/false)
  if (query.married === "true" || query.married === "false") {
    filters.push("married = ?");
    params.push(query.married === "true" ? 1 : 0);
  }

  // operator (AND / OR)
  const operator =
    query.operation && query.operation.toUpperCase() === "AND" ? "AND" : "OR";

  if (filters.length > 0) {
    const whereClause = filters.join(` ${operator} `);
    sql += ` WHERE ${whereClause}`;
    sqlCount += ` WHERE ${whereClause}`;
  }

  db.get(sqlCount, params, (err, count) => {
    if (err) return callback(err);
    const pages = Math.ceil(count.total / limit);

    sql += ` LIMIT ? OFFSET ?`;
    db.all(sql, [...params, limit, offset], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows, page, pages, offset);
    });
  });
}

module.exports = {
  read,
  create,
  deleteById,
  getById,
  update,
};

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbpath = path.join(__dirname, '..', 'db', 'data.db');

const db = new sqlite3.Database(dbpath);

module.exports = db;
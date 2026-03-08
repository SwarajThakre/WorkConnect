const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgre@localhost:5432/users");

module.exports = db;


const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "root",
  database: "registro_ubicacion",
});

module.exports = pool;

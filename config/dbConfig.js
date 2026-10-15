const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  port: Number(process.env.MYSQL_ADDON_PORT),
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
});

module.exports = connection;    
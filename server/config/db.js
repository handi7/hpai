const mysql2 = require("mysql2");

require("dotenv").config();

const db = mysql2.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "database",
  port: 3306,
  multipleStatements: true,
});

db.connect((error) => {
  if (error) return console.error(`error: ${error.message}`);
  console.log("Connected to database.");
});

module.exports = db.promise();

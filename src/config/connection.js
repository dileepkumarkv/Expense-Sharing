var mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "expense",
});
con.connect(function (err) {
  if (err) {
    throw err;
  }

  console.log("connected");
});
module.exports = con;

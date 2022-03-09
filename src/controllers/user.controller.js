let con = require("../config/connection");
const createUser = async function (req, res) {
  console.log("name", req.body);
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  let sql = `INSERT INTO users 
  (
      name,email,phone
  )
  VALUES
  (
      ?,?,?
  )`;

  con.query(sql, [name, email, phone], function (err, data) {
    if (err) {
      throw err;
      // some error occured
    } else {
      res.status(200).json({
        code: 1001,
        id: data.insertId,
        message: "Account has been successfully created",
      });
      console.log("inserted to db");
      // successfully inserted into db
    }
  });
};

module.exports = {
  createUser,
};

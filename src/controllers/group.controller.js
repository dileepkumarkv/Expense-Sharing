let con = require("../config/connection");
const createGroup = async function (req, res) {
  const name = req.body.name;
  const members = req.body.members;
  let sql = `INSERT INTO group_name 
  (
      name
  )
  VALUES
  (
      ?
  )`;

  con.query(sql, [name], function (err, data) {
    if (err) {
      throw err;
      // some error occured
    } else {
      members.forEach((member, index) => {
        let sql = `INSERT INTO group_members
  (
      group_member_id,group_id
  )
  VALUES
  (
      ?,?
  )`;
        con.query(sql, [member, data.insertId], function (err, result) {
          if (err) {
            throw err;
            // some error occured
          } else {
            if (index == members.length - 1) {
              res.status(200).json({
                code: 1001,
                id: data.insertId,
                message: "Group has been successfully created",
              });
              console.log("inserted to db");
              // successfully inserted into db
            }
          }
        });
      });
    }
  });
};

module.exports = {
  createGroup,
};

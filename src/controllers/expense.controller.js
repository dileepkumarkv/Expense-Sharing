let con = require("../config/connection");
const createExpense = async function (req, res) {
  console.log("name", req.body);
  const name = req.body.name;
  const amount = req.body.amount;
  const paidBy = req.body.paid_by;
  const sharedType = req.body.shared_type;
  let members = [];
  let groupId = "";
  if (sharedType == "1") {
    members = req.body.members;
    let sql = `INSERT INTO expenses 
    (
        name,amount,paid_by,shared_type
    )
    VALUES
    (
        ?,?,?,?
    )`;

    con.query(sql, [name, amount, paidBy, sharedType], function (err, data) {
      if (err) {
        throw err;
        // some error occured
      } else {
        members.forEach((member, index) => {
          let sql = `INSERT INTO expense_split_up
        (
            member_id,amount,paid_by
        )
        VALUES
        (
            ?,?,?
        )`;
          con.query(
            sql,
            [member, (parseFloat(amount) / members.length).toString(), paidBy],
            function (err, result) {
              if (err) {
                throw err;
                // some error occured
              } else {
                if (index == members.length - 1) {
                  res.status(200).json({
                    code: 1001,
                    id: data.insertId,
                    message: "Expense has been successfully created",
                  });
                  console.log("inserted to db");
                  // successfully inserted into db
                }
              }
            },
          );
        });
      }
    });
  } else {
    groupId = req.body.group_id;
    con.query(
      "SELECT * FROM group_members WHERE group_id = ?",
      [groupId],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          members = result.map((data) => data.group_member_id);
          console.log("members", members);
          let sql = `INSERT INTO expenses 
  (
      name,amount,paid_by,shared_type
  )
  VALUES
  (
      ?,?,?,?
  )`;

          con.query(
            sql,
            [name, amount, paidBy, sharedType],
            function (err, data) {
              if (err) {
                throw err;
                // some error occured
              } else {
                members.forEach((member, index) => {
                  let sql = `INSERT INTO expense_split_up
      (
          member_id,amount,paid_by
      )
      VALUES
      (
          ?,?,?
      )`;
                  con.query(
                    sql,
                    [
                      member,
                      (parseFloat(amount) / members.length).toString(),
                      paidBy,
                    ],
                    function (err, result) {
                      if (err) {
                        throw err;
                        // some error occured
                      } else {
                        if (index == members.length - 1) {
                          res.status(200).json({
                            code: 1001,
                            id: data.insertId,
                            message: "Expense has been successfully created",
                          });
                          console.log("inserted to db");
                          // successfully inserted into db
                        }
                      }
                    },
                  );
                });
              }
            },
          );
        }
      },
    );
  }
};

const getExpense = (req, res) => {
  const id = req.params.id;

  con.query(
    "SELECT SUM(amount) as amount ,paid_by FROM expense_split_up WHERE member_id=? AND paid_by!=? GROUP BY paid_by",
    [id, id],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        let memberList = [id];
        result.forEach((data, index) => {
          memberList.push(data.paid_by);
          con.query(
            "SELECT SUM(amount) as amount ,paid_by FROM expense_split_up WHERE member_id=? AND paid_by=? GROUP BY paid_by",
            [data.paid_by, id],
            function (err, result1) {
              if (err) {
                console.log(err);
              } else {
                if (result1.length > 0) {
                  data.amount = data.amount - result1[0].amount;
                }
                if (index == result.length - 1) {
                  const finalResult = result.map((Element) => {
                    const key =
                      Element.amount > 0 ? "Amount To Give" : "Amount To Get";
                    const obj = {};
                    obj[key] = Math.abs(Element.amount);
                    obj["user"] = Element.paid_by;
                    return obj;
                  });
                  const memberList1 = new Array(memberList.length)
                    .fill("?")
                    .join(",");
                  con.query(
                    "SELECT DISTINCT member_id FROM expense_split_up WHERE paid_by = ? AND member_id NOT IN (" +
                      memberList1 +
                      ")",
                    [id, ...memberList],
                    function (err, result2) {
                      if (err) {
                        console.log(err);
                      } else {
                        if (result2.length > 0) {
                          result2.forEach((data2, index2) => {
                            con.query(
                              "SELECT SUM(amount) as amount ,paid_by FROM expense_split_up WHERE member_id=? AND paid_by=? GROUP BY paid_by",
                              [data2.member_id, id],
                              function (err, result3) {
                                if (err) {
                                  console.log(err);
                                } else {
                                  if (result3.length > 0) {
                                    const key = "Amount To Get";
                                    const obj = {};
                                    obj[key] = Math.abs(result3[0].amount);
                                    obj["user"] = data2.member_id;
                                    finalResult.push(obj);
                                    if (index2 == result2.length - 1) {
                                      res.status(200).json({
                                        result: finalResult,
                                      });
                                    }
                                  }
                                }
                              },
                            );
                          });
                        } else {
                          res.status(200).json({
                            result: finalResult,
                          });
                        }
                      }
                    },
                  );
                }
              }
            },
          );
        });
      }
    },
  );
};

module.exports = {
  createExpense,
  getExpense,
};

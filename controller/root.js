const con = require("../config");
module.exports = {
  getRoot: () => {
    return new Promise((resolve, rejected) => {
      con.query(`select * from user where uid like  '2001%' `, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
};

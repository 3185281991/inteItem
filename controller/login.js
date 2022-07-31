const con = require("../config");
module.exports = {
  hasUsername: (username) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `select username from user where username='${username}'`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getLogin: (username, pwd) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `select username,avatar,pwd,uid from user where username='${username}'and pwd='${pwd}'`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  setNewPwd: (username, email, pwd) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `update user set pwd='${pwd}'  where username='${username}'and email='${email}'`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  register: (uid, username, email, pwd, time, avatar) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `insert into  user(uid,username,email,pwd,time,avatar) values('${uid}','${username}','${email}','${pwd}','${time}','${avatar}')`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
};

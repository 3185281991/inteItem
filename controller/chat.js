const con = require("../config");
module.exports = {
  updateChat: (uid, ruid, info) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `update chatinfo set info=concat(info,'${info}') where uid=${uid} and ruid=${ruid}`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  //这是不存在的两者的聊天信息才创建记录
  createChat: (uid, ruid, info) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `insert into chatinfo values(${uid},${ruid},'${info}')`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getChatlist: (uid, ruid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `select * from chatinfo where uid=${uid} and ruid=${ruid}`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getChatlog: (uid, ruid, isshow) => {
    let sql = null;
    if (ruid != 0) {
      if (isshow) {
        sql = `select * from chatlog where uid=${uid} and ruid='${ruid}' and isshow=${isshow} order by time desc  `;
      } else {
        sql = `select * from chatlog where uid=${uid} and ruid='${ruid}' order by time desc  `;
      }
    } else {
      if (isshow) {
        sql = `select * from chatlog where uid=${uid}  and isshow=${isshow} order by time desc  `;
      } else {
        sql = `select * from chatlog where uid=${uid}  order by time desc  `;
      }
    }
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  addChatlog: (uid, ruid, rname, ravatar, isshow, time) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `insert into chatlog values(${uid},${ruid},'${rname}','${ravatar}',${isshow},${time})`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  updateShow: (uid, ruid, isshow) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `update chatLog set isshow=${isshow} where uid=${uid} and ruid=${ruid}`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
};

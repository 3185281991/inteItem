const con = require("../config");
module.exports = {
  getBasicUser: (uid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select uid,username,avatar,introduce,time from user where uid=${uid} `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getAccept: (uid, cuid = "") => {
    let sql = null;
    if (cuid == "") {
      sql = ` select cuid,cusername,cavatar,time from accept where uid=${uid} `;
    } else {
      sql = ` select cuid,cusername,cavatar,time from accept where uid=${uid} and cuid='${cuid}'`;
    }
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  addAccept: (uid, username, avatar, cuid, cusername, cavatar, time) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` insert into accept values(${uid},'${username}','${avatar}',${cuid},'${cusername}','${cavatar}','${time}') `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  deleteAccept: (uid, cuid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` delete   from accept where uid='${uid}' and cuid=${cuid} `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getisAccepted: (uid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select uid,username,avatar,time from accept where cuid=${uid} `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getLtag: (uid, tag) => {
    let sql = null;
    if (tag != "") {
      sql = ` select * from ltag where uid=${uid} and tag='${tag}' `;
    } else {
      sql = ` select * from ltag where uid=${uid} `;
    }
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  addLtag: (uid, tag) => {
    return new Promise((resolve, rejected) => {
      con.query(` insert into ltag values(${uid},'${tag}')`, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  deleteLtag: (uid, tag) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` delete from ltag where uid=${uid} and tag='${tag}'`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getLikeText: (uid, lbid) => {
    let sql = null;
    if (lbid) {
      sql = ` select * from likeBlog where uid='${uid}' and lbid=${lbid} `;
    } else {
      sql = ` select * from likeBlog where uid='${uid}'  `;
    }
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  addLikeText: (uid, lbid, luid, time) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` insert into likeBlog values(${uid},${lbid},${luid},${time}) `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getUserInfo: (uid) => {
    return new Promise((resolve, rejected) => {
      con.query(` select * from user where uid=${uid} `, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  getExpireInfo: (uid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select uid,sum(lauds) as allLauds,sum(view) as allViews,sum(comment) as allComments,sum(hot) as allHot from blog where uid=${uid} group by uid `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getAllblog: (uid, type = "time") => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select * from blog where uid=${uid} order by ${type} desc `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  updateUserInfo: (uid, username, email, pwd, introduce, avatar) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` update user set username='${username}',email='${email}',pwd='${pwd}',introduce='${introduce}',avatar='${avatar}' where uid=${uid}`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getUserSearch: (page = 0, content) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select uid,username,email,pwd,introduce,time,avatar from user where uid like '%${content}%' or username like '%${content}%' or introduce like '%${content}%' limit ${start}, 10 `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getAlluser: (page = 0) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select uid,username,email,pwd,introduce,time,avatar from user  limit ${start}, 10 `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getuserTotal: (type, content) => {
    let sql = null;
    if (type == 0) {
      sql = `select count(*) as total from user `;
    } else {
      sql = `select count(*) as total from user where uid like '%${content}%' or username like '%${content}%' or introduce like '%${content}%' `;
    }
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  deleteUser: (uid) => {
    return new Promise((resolve, rejected) => {
      con.query(`delete  from user where uid=${uid} `, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  backUpdateUser: (uid, username, pwd, email, introduce) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` update user set username='${username}',email='${email}',pwd='${pwd}',introduce='${introduce}' where uid=${uid}`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
};

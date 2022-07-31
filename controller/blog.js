const con = require("../config");
module.exports = {
  getSearch: (content, page = 0) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select * from blog where bid like '%${content}%' or  uid like '%${content}%' or username like '%${content}%' or  title  like '%${content}%'
       or content like '%${content}%' or label like '%${content}%' limit ${start},10 `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getText: (bid) => {
    return new Promise((resolve, rejected) => {
      con.query(` select * from blog where bid=${bid} `, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  getCommentById: (bid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select * from comment where bid=${bid} order by time desc `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getReplyById: (bid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select * from reply where bid=${bid}  order by time desc`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  addComment: (
    bid,
    uid,
    username,
    avatar,
    ccontent,
    time,
    cuid,
    cusername,
    cavatar
  ) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `insert into comment values(${bid},${uid},'${username}','${avatar}','${ccontent}',${time},${cuid},'${cusername}','${cavatar}')`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  addReply: (
    bid,
    fuid,
    fusername,
    favatar,
    ftime,
    rcontent,
    time,
    ruid,
    rusername,
    ravatar
  ) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `insert into reply values(${bid},${fuid},'${fusername}','${favatar}',${ftime},'${rcontent}',${time},${ruid},'${rusername}','${ravatar}')`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  addLauds: (bid, uid, islauds) => {
    return new Promise((resolve, rejected) => {
      con.query(
        `insert into lauds values(${bid},${uid},${islauds})`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getLauds: (bid, uid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` select  islauds  from lauds where bid=${bid} and uid=${uid}`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  blogInfoIncrement: (type, bid) => {
    let sql = null;
    if (type == 1) {
      sql = ` update  blog set lauds=lauds+1 where bid=${bid} `;
    }
    if (type == 2) {
      sql = ` update  blog set view=view+1 where bid=${bid} `;
    }
    if (type == 3) {
      sql = ` update  blog set comment=comment+1 where bid=${bid} `;
    }
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  addHot: (num, bid) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` update  blog set hot=hot+ ${num} where bid=${bid} `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  deleteBlog: (bid) => {
    return new Promise((resolve, rejected) => {
      con.query(` delete  from blog where bid=${bid} `, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  addBlog: (bid, username, uid, title, label, content, time, img) => {
    return new Promise((resolve, rejected) => {
      con.query(
        ` insert into blog(bid,username,uid,title,label,content,time,img) values(${bid},'${username}','${uid}','${title}','${label}','${content}','${time}','${img}')  `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getBlog: (page) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select bid,uid,username,label,title,time,img,hot,lauds,comment,view from blog  limit ${start}, 10 `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getTotal: (type, content) => {
    let sql = null;
    if (type == 0) {
      sql = `select count(*) as total from blog `;
    } else {
      sql = `select count(*) as total from blog where bid like '%${content}%' or  uid like '%${content}%' or username like '%${content}%' or  title  like '%${content}%'
        or content like '%${content}%' or label like '%${content}%' `;
    }
    return new Promise((resolve, rejected) => {
      con.query(`select count(*) as total from blog `, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
  getToday: () => {
    const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const todayEndTime = new Date(
      new Date().setHours(23, 59, 59, 999)
    ).getTime();
    return new Promise((resolve, rejected) => {
      con.query(
        `select bid,title,username,uid,time from blog where time>=${todayStartTime} and time <= ${todayEndTime} `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getPhByType: (type) => {
    let sql = `select bid,title,username,uid,time from blog order by ${type} desc limit 20`;
    return new Promise((resolve, rejected) => {
      con.query(sql, (err, rs) => {
        err ? rejected(err) : resolve(rs);
      });
    });
  },
};

const con = require("../config");
module.exports = {
  //针对数据进行分页处理

  getRecommend: (page) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select bid,uid,username,label,title,substring(content,1,50) as content,time,img,hot,lauds,comment,view from blog order by rand()   limit ${start}, 10 `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getNew: (page) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select bid,uid,username,label,title,substring(content,1,50) as content,time,img,hot,lauds,comment,view from blog order by  time  desc limit ${start}, 10 `,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
  getHot: (page) => {
    let start = page * 10;
    return new Promise((resolve, rejected) => {
      con.query(
        `select bid,uid,username,label,title,substring(content,1,50) as content,time,img,hot,lauds,comment,view from blog order by  hot  desc limit ${start},10`,
        (err, rs) => {
          err ? rejected(err) : resolve(rs);
        }
      );
    });
  },
};

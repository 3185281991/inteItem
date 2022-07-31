const { sign } = require("jsonwebtoken");
const loginControlle = require("../controller/login.js");
const userController = require("../controller/user.js");
const chatController = require("../controller/chat.js");
const rootController = require("../controller/root.js");
module.exports = (route) => {
  route.get("/free/hasUsername", async (ctx) => {
    let username = ctx.request.query.username;
    let data = await loginControlle.hasUsername(username);
    if (data.length != 0) {
      ctx.body = {
        message: "用户名已存在，换一个吧！",
        flag: 1,
      };
    } else {
      ctx.body = {
        flag: 0,
      };
    }
  });
  route.get("/free/getLogin", async (ctx) => {
    let { username, pwd } = ctx.request.query;
    let data = await loginControlle.getLogin(username, pwd);
    //如果获取的行数长度为一。那么登录成功,同时保存信息返回token
    if (data.length == 1) {
      let token = sign({ uid: data[0].uid }, "simple", { expiresIn: "1d" });
      let tokenExpire = new Date().getTime();
      ctx.body = {
        staus: 200,
        message: "登陆成功",
        avatar: data[0]?.avatar,
        flag: 1,
        uid: data[0].uid,
        token,
        tokenExpire,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "登陆失败",
        flag: 0,
      };
    }
  });
  route.get("/getToken", async (ctx) => {
    let uid = ctx.state.user.uid;
    let data = await userController.getBasicUser(uid);
    ctx.body = data;
  });
  route.post("/free/setNewPwd", async (ctx) => {
    let { username, email, pwd } = ctx.request.body;
    let data = await loginControlle.setNewPwd(username, email, pwd);
    if (data.changedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "修改密码成功。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "暂无该用户信息。",
        flag: 0,
      };
    }
  });
  route.post("/free/register", async (ctx) => {
    let { uid, username, email, pwd, time } = ctx.request.body;
    let avatar =
      "https://pimg-1310724460.cos.ap-nanjing.myqcloud.com/front/avatar/default.jpg";
    let data = await loginControlle.register(
      uid,
      username,
      email,
      pwd,
      time,
      avatar
    );
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "注册成功",
        flag: 1,
      };
      //注册成功这里需要添加默认聊天记录
      let gl = await rootController.getRoot();
      try {
        await chatController.addChatlog(
          uid,
          gl[0].uid,
          gl[0].username,
          gl[0].avatar,
          1,
          Date.now()
        );
        await chatController.addChatlog(
          gl[0].uid,
          uid,
          username,
          avatar,
          1,
          Date.now()
        );
        let info = `uid=${
          gl[0].uid
        };ruid=${uid};info=欢迎你的加入,快来开启新世界吧。;time=${Date.now()};&`;
        await chatController.createChat(gl[0].uid, uid, info);
      } catch (err) {
        console.log(err);
      }
    } else {
      ctx.body = {
        staus: 200,
        message: "服务器错误！",
        flag: 0,
      };
    }
  });
};

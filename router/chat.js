const chatController = require("../controller/chat");
module.exports = (route) => {
  route.post("/createChat", async (ctx) => {
    let { uid, ruid, info } = ctx.request.body;
    try {
      await chatController.createChat(uid, ruid, info);
    } catch (error) {
      console.log(error);
    }
  });
  route.post("/updateChat", async (ctx) => {
    let { uid, ruid, info } = ctx.request.body;
    try {
      await chatController.updateChat(uid, ruid, info);
    } catch (error) {
      console.log(error);
    }
  });
  route.post("/addChatlog", async (ctx) => {
    let { uid, ruid, rname, ravatar, isshow, time } = ctx.request.body;
    let data = await chatController.addChatlog(
      uid,
      ruid,
      rname,
      ravatar,
      isshow,
      time
    );
    if (data.affectedRows == 1) {
      ctx.body = {
        code: 200,
        message: "添加聊天记录成功",
        flag: 1,
      };
    } else {
      ctx.body = {
        code: 200,
        message: "服务器内部错误",
        flag: 0,
      };
    }
  });
  route.get("/getChatlist", async (ctx) => {
    let { uid, ruid } = ctx.request.query;
    let data = await chatController.getChatlist(uid, ruid);
    ctx.body = data;
  });
  route.get("/getChatlog", async (ctx) => {
    let { uid, ruid, isshow } = ctx.request.query;
    let data = await chatController.getChatlog(uid, ruid, isshow);
    ctx.body = data;
  });
  route.post("/updateShow", async (ctx) => {
    let { uid, ruid, isshow } = ctx.request.body;
    let data = await chatController.updateShow(uid, ruid, isshow);
    if (data.affectedRows == 1) {
      ctx.body = {
        code: 200,
        message: "修改成功",
        flag: 1,
      };
    } else {
      ctx.body = {
        code: 200,
        message: "修改失败",
        flag: 0,
      };
    }
  });
};

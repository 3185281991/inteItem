const { sign } = require("jsonwebtoken");
module.exports = (route) => {
  route.get("/free/backRoute", async (ctx) => {
    let { type } = ctx.request.query;
    if (type == 0) {
      ctx.body = {
        flag: 1,
        message: "普通管理员",
        routes: [
          {
            route: "/basic",
            icon: "List",
            info: "情况概览",
            children: [
              { route: "/blogInfo", icon: "Collection", info: "帖子情况" },
              // { route: "/userInfo", icon: "UserFilled", info: "用户情况" },
            ],
          },
          {
            route: "/blogList",
            icon: "Promotion",
            info: "全部帖子",
          },
          {
            route: "/userList",
            icon: "Avatar",
            info: "全部用户",
          },
          {
            route: "/messageList",
            icon: "ChatLineSquare",
            info: "回复信息",
          },
        ],
      };
    } else {
      ctx.body = {
        flag: 0,
        message: "身份类型错误",
      };
    }
  });
};

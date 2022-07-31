const homeController = require("../controller/home.js");
module.exports = (route) => {
  route.get("/free/getRecommend", async (ctx) => {
    let { page } = ctx.request.query;
    let data = await homeController.getRecommend(page ?? 0);
    ctx.body = data;
  });
  route.get("/free/getNew", async (ctx, next) => {
    let { page } = ctx.request.query;
    let data = await homeController.getNew(page ?? 0);
    ctx.body = data;
  });
  route.get("/free/getHot", async (ctx, next) => {
    let { page } = ctx.request.query;
    let data = await homeController.getHot(page ?? 0);
    ctx.body = data;
  });
};

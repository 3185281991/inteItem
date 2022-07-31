const Router = require("koa-router");

const homeRoute = require("./home.js");
const loginRoute = require("./login.js");
const UserRoute = require("./user.js");
const blogRoute = require("./blog.js");
const chatRoute = require("./chat.js");
const rootRoute = require("./root.js");

const route = new Router();

module.exports = (app) => {
  homeRoute(route);
  loginRoute(route);
  UserRoute(route);
  blogRoute(route);
  chatRoute(route);
  rootRoute(route);
  app.use(route.routes()).use(route.allowedMethods());
};

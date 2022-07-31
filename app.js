const koa = require("koa");
const route = require("./router");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const path = require("path");
const nunjucks = require("koa-nunjucks-2");
const body = require("koa-body");
const jwt = require("koa-jwt");
const socket = require("./socket/index.js");
const http = require("http");
const app = new koa();

app.use(async (ctx, next) => {
  let allowCros = ["http://服务器地址:86", "http://服务器地址:88"];
  let index = ctx.header.referer.indexOf("/", 8);
  let url = ctx.header.referer.substr(0, index);
  if (allowCros.includes(url)) {
    ctx.set("Access-Control-Allow-Origin", url);
  }
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});
app.use(
  body({
    formidable: {
      maxFileSize: 6 * 1024 * 1024,
    },
    multipart: true,
  })
);
app.use(static(path.join(__dirname, "./")));
app.use(
  nunjucks({
    ext: "html",
    path: path.join(__dirname, "view"),
    nunjucksConfig: {
      trimBlocks: true,
    },
  })
);
app.use(jwt({ secret: "simple" }).unless({ path: [/^\/free\/*/] }));
app.use(bodyParser());
route(app);

const server = http.createServer(app.callback());

socket(server);
server.listen(9999, () => {
  console.log("本地服务在9999端口运行成功。");
});

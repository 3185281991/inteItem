const blogController = require("../controller/blog.js");
const fs = require("fs");
const cros = require("../cros/index");
const uuid = require("node-uuid");

module.exports = (route) => {
  route.get("/free/getSearch", async (ctx) => {
    let { content, page } = ctx.request.query;
    let data = await blogController.getSearch(content, page ?? 0);
    ctx.body = data;
  });
  route.get("/free/getTextById", async (ctx) => {
    let { bid } = ctx.request.query;
    let data = await blogController.getText(bid);
    ctx.body = data;
  });
  route.get("/free/getCommentById", async (ctx) => {
    let { bid } = ctx.request.query;
    let data = await blogController.getCommentById(bid);
    ctx.body = data;
  });
  route.get("/free/getReplyById", async (ctx) => {
    let { bid } = ctx.request.query;
    let data = await blogController.getReplyById(bid);
    ctx.body = data;
  });
  //删除对象存储中的图片
  route.post("/deleteBlog", async (ctx) => {
    let { bid, img } = ctx.request.body;
    let data = await blogController.deleteBlog(bid);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "信息已删除",
        flag: 1,
      };
      if (img) {
        let key = img.slice(img.lastIndexOf("/") + 1);
        cros.deletObject({ type: "blog", filename: key }, (err, data) => {
          if (err) console.log(err);
        });
      }
    } else {
      ctx.body = {
        staus: 200,
        message: "服务器错误，删除帖子失败",
        flag: 0,
      };
    }
  });
  route.post("/addComment", async (ctx) => {
    let {
      bid,
      uid,
      username,
      avatar,
      ccontent,
      time,
      cuid,
      cusername,
      cavatar,
    } = ctx.request.body;
    let data = await blogController.addComment(
      bid,
      uid,
      username,
      avatar,
      ccontent,
      time,
      cuid,
      cusername,
      cavatar
    );
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "评论成功。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "评论失败。",
        flag: 0,
      };
    }
  });
  route.post("/addReply", async (ctx) => {
    let {
      bid,
      fuid,
      fusername,
      favatar,
      ftime,
      rcontent,
      time,
      ruid,
      rusername,
      ravatar,
    } = ctx.request.body;
    let data = await blogController.addReply(
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
    );
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "回复成功。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "回复失败。",
        flag: 0,
      };
    }
  });
  route.post("/addLauds", async (ctx) => {
    let { bid, uid, islauds } = ctx.request.body;
    let data = await blogController.addLauds(bid, uid, islauds);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "添加点赞记录成功。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "添加点赞记录失败。",
        flag: 0,
      };
    }
  });
  route.get("/free/getLauds", async (ctx) => {
    let { bid, uid } = ctx.request.query;
    let data = await blogController.getLauds(bid, uid);
    if (data.length == 0) {
      ctx.body = {
        message: "未点赞",
        flag: 0,
      };
    } else {
      ctx.body = {
        message: "已点赞",
        flag: 1,
      };
    }
  });
  route.post("/free/blogInfoIncrement", async (ctx) => {
    let { type, bid } = ctx.request.body;
    let data = await blogController.blogInfoIncrement(type, bid);
    if (data.changedRows == 1) {
      ctx.body = {
        message: "已修改",
        flag: 1,
      };
    } else {
      ctx.body = {
        message: "未修改",
        flag: 0,
      };
    }
  });
  route.post("/free/addHot", async (ctx) => {
    let { num, bid } = ctx.request.body;
    let data = await blogController.addHot(num, bid);
    if (data.affectedRows == 1) {
      ctx.body = {
        message: "已修改",
        flag: 1,
      };
    } else {
      ctx.body = {
        message: "未修改",
        flag: 0,
      };
    }
  });
  route.post("/addBlog", async (ctx) => {
    let { bid, username, uid, title, label, content, time } = ctx.request.body;
    // 前端传单个的话则为对象，若多个File的话则为File数组
    const img = ctx.request.files.img;
    let imgPath = "";
    let filename = "";
    let zx = null;
    if (img) {
      //先更改文件名称，再放入指定目录，然后获取完整路径，保存数据库
      let index = img.originalFilename.lastIndexOf(".");
      filename = uuid.v1() + img.originalFilename.substring(index);
      // let upload = "../static/upload/";
      // //保存文件
      // var readStream = fs.createReadStream(img.filepath);
      // var writeStream = fs.createWriteStream(
      //   path.join(__dirname, upload) + filename
      // );
      // readStream.pipe(writeStream);
      // readStream.on("end", function () {
      //   fs.unlinkSync(img.filepath);
      // });
      //  imgPath = "http://localhost:9999/static/upload/" + filename;

      //上传对象仅支持可读流，buffer，string,这里需要将图片路径转换为流
      zx = await new Promise((resolve, rejected) => {
        cros.putObject(
          { filename, img: fs.createReadStream(img.filepath), type: "blog" },
          (err, rs) => {
            if (rs) {
              resolve({ info: 1, imgPath: "https://" + rs.Location });
            } else {
              rejected({ info: 0, err });
            }
          }
        );
      });
    }
    if (zx && zx.info == 1) {
      imgPath = zx.imgPath;
    }
    if (zx && zx.info == 0) {
      ctx.body = {
        message: "图片未添加cros成功",
        flag: 0,
      };
    } else {
      let data = await blogController.addBlog(
        bid,
        username,
        uid,
        title,
        label,
        content,
        time,
        imgPath
      );
      if (data.affectedRows == 1) {
        ctx.body = {
          message: "已添加信息",
          flag: 1,
        };
      } else {
        ctx.body = {
          message: "添加信息失败",
          flag: 0,
        };
      }
    }
  });
  route.get("/getBlog", async (ctx) => {
    let { page } = ctx.request.query;
    let data = await blogController.getBlog(page ?? 0);
    ctx.body = data;
  });
  route.get("/getTotal", async (ctx) => {
    let { type, content } = ctx.request.query;
    let data = await blogController.getTotal(type ?? 0, content);
    ctx.body = data;
  });
  route.get("/getToday", async (ctx) => {
    let data = await blogController.getToday();
    ctx.body = data;
  });
  route.get("/getPhByType", async (ctx) => {
    let { type } = ctx.request.query;
    let data = await blogController.getPhByType(type);
    ctx.body = data;
  });
};

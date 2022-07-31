const userController = require("../controller/user.js");
const fs = require("fs");
const cros = require("../cros/index");
const uuid = require("node-uuid");

module.exports = (route) => {
  route.get("/free/getBasicUser", async (ctx) => {
    let { uid } = ctx.request.query;
    let data = await userController.getBasicUser(uid);
    ctx.body = data;
  });
  route.get("/getUserInfo", async (ctx) => {
    let { uid } = ctx.request.query;
    let data = await userController.getUserInfo(uid);
    ctx.body = data;
  });
  route.get("/getAccept", async (ctx) => {
    let { uid, cuid } = ctx.request.query;
    if (!cuid) {
      let data = await userController.getAccept(uid);
      ctx.body = data;
    } else {
      let data = await userController.getAccept(uid, cuid);
      ctx.body = data;
    }
  });
  route.post("/addAccept", async (ctx) => {
    let { uid, username, avatar, cuid, cusername, cavatar, time } =
      ctx.request.body;
    let data = await userController.addAccept(
      uid,
      username,
      avatar,
      cuid,
      cusername,
      cavatar,
      time
    );
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "关注成功",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "服务器错误",
        flag: 0,
      };
    }
  });
  route.get("/getisAccepted", async (ctx) => {
    let { uid } = ctx.request.query;
    let data = await userController.getisAccepted(uid);
    ctx.body = data;
  });
  route.post("/deleteAccept", async (ctx) => {
    let { uid, cuid } = ctx.request.body;
    let data = await userController.deleteAccept(uid, cuid);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "取关成功",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "服务器错误",
        flag: 0,
      };
    }
  });
  route.get("/free/getLikeText", async (ctx) => {
    let { uid, lbid } = ctx.request.query;
    let data = await userController.getLikeText(uid, lbid ?? 0);
    ctx.body = data;
  });
  route.post("/addLikeText", async (ctx) => {
    let { uid, lbid, luid, time } = ctx.request.body;
    let data = await userController.addLikeText(uid, lbid, luid, time);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "已收藏文章。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "服务器错误",
        flag: 0,
      };
    }
  });
  route.post("/addLtag", async (ctx) => {
    let { uid, tag } = ctx.request.body;
    let data = await userController.addLtag(uid, tag);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "已收藏该标签。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "收藏标签失败。",
        flag: 0,
      };
    }
  });
  route.get("/free/getLtag", async (ctx) => {
    let { uid, tag } = ctx.request.query;
    let data = await userController.getLtag(uid, tag);
    ctx.body = data;
  });
  route.post("/deleteLtag", async (ctx) => {
    let { uid, tag } = ctx.request.body;
    let data = await userController.deleteLtag(uid, tag);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "已移除标签。",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "移除标签失败。",
        flag: 0,
      };
    }
  });
  route.get("/free/getExpireInfo", async (ctx) => {
    let { uid } = ctx.request.query;
    let data = await userController.getExpireInfo(uid);
    ctx.body = data;
  });
  route.post("/updateUserInfo", async (ctx) => {
    let { uid, username, email, pwd, introduce, oImg } = ctx.request.body;
    const img = ctx.request.files.img;
    let avatar = null;
    let filename = "";
    let zx = null;
    if (img) {
      //先更改文件名称，再放入指定目录，然后获取完整路径，保存数据库,同时删除旧的头像图片
      let index = img.originalFilename.lastIndexOf(".");
      filename = uuid.v1() + img.originalFilename.substring(index);
      //上传对象仅支持可读流，buffer，string,这里需要将图片路径转换为流
      zx = await new Promise((resolve, rejected) => {
        cros.putObject(
          { filename, img: fs.createReadStream(img.filepath), type: "avatar" },
          (err, rs) => {
            if (rs) {
              resolve({ info: 1, imgPath: "https://" + rs.Location });
            } else {
              rejected({ info: 0, err });
            }
          }
        );
      });
      let key = oImg.slice(oImg.lastIndexOf("/") + 1);
      //默认头像不删除
      if (key !== "default.jpg") {
        cros.deletObject({ type: "avatar", filename: key }, (err, data) => {
          if (err) console.log(err);
        });
      }
    }
    if (zx && zx.info == 1) {
      avatar = zx.imgPath;
    }
    if (zx && zx.info == 0) {
      ctx.body = {
        message: "修改头像失败",
        flag: 0,
      };
    } else {
      let data = await userController.updateUserInfo(
        uid,
        username,
        email,
        pwd,
        introduce,
        avatar ?? oImg
      );
      if (data.changedRows == 1) {
        ctx.body = {
          message: "已修改信息",
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
  route.get("/getUserSearch", async (ctx) => {
    let { page, content } = ctx.request.query;
    let data = await userController.getUserSearch(page ?? 0, content);
    ctx.body = data;
  });
  route.get("/getAllblog", async (ctx) => {
    let { uid, type } = ctx.request.query;
    let data = await userController.getAllblog(uid, type);
    ctx.body = data;
  });
  route.get("/getAlluser", async (ctx) => {
    let { page } = ctx.request.query;
    let data = await userController.getAlluser(page ?? 0);
    ctx.body = data;
  });
  route.get("/getuserTotal", async (ctx) => {
    let { type, content } = ctx.request.query;
    let data = await userController.getuserTotal(type ?? 0, content);
    ctx.body = data;
  });
  //删除用户信息的同时需要删除对象存储中的信息
  route.post("/deleteUser", async (ctx) => {
    let { uid, avatar } = ctx.request.body;
    let data = await userController.deleteUser(uid);
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "已删除用户信息",
        flag: 1,
      };
      let key = avatar.slice(avatar.lastIndexOf("/") + 1);
      //默认头像不删除
      if (key !== "default.jpg") {
        cros.deletObject({ type: "avatar", filename: key }, (err, data) => {
          if (err) console.log(err);
        });
      }
    } else {
      ctx.body = {
        staus: 200,
        message: "删除失败，服务器错误",
        flag: 0,
      };
    }
  });
  route.post("/backUpdateUser", async (ctx) => {
    let { uid, username, pwd, email, introduce } = ctx.request.body;
    let data = await userController.backUpdateUser(
      uid,
      username,
      pwd,
      email,
      introduce
    );
    if (data.affectedRows == 1) {
      ctx.body = {
        staus: 200,
        message: "已更改用户信息",
        flag: 1,
      };
    } else {
      ctx.body = {
        staus: 200,
        message: "更改失败，服务器错误",
        flag: 0,
      };
    }
  });
};

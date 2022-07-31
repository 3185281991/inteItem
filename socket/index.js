const chatController = require("../controller/chat");
const utils = require("../utils/index.js");
const socket = require("socket.io");
module.exports = (server) => {
  let io = socket(server, {
    allowEIO3: true,
    cors: {
      origin: ["http://124.221.69.31:86", "http://124.221.69.31:88"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  let allUid = []; //已连接上来的所有uid用户，唯一
  //{str1:[{}],str2:[{},{}]}
  let allInfo = {}; //保存所有用户之间的聊天信息
  // 监听链接
  io.on("connection", (socket) => {
    //socket是每一连接上来的实例对象
    socket.on("login", (uid) => {
      socket.name = uid;
      //保存好用户id和socket实例,同时为对应用户创建好所有信息中的位置
      if (!allUid.includes(uid)) {
        allUid.push(uid);
      }
    });
    socket.on("send", (msg) => {
      //发送双方信息保存同一对象，uid+ruid:【{}，{}，。。。】,固定前小后大
      let str = [msg.uid, msg.ruid]
        .sort((a, b) => parseInt(a) - parseInt(b))
        .join("+");
      if (Object.keys(allInfo).includes(str)) {
        allInfo[str].push(msg);
      } else {
        allInfo[str] = [msg];
      }
      let flag = false;
      // //遍历所有已连接的客户端，找到需要接收消息的那个客户端，发送消息
      io.sockets.sockets.forEach(async (item) => {
        if (item.name == msg.ruid) {
          io.to(item.id).emit("receive", msg);
          flag = true;
        }
      });
      //用户不在线
      if (!flag) {
        save(str, allInfo);
        allInfo[str].pop();
      }
    });
    //监听用户离开,获取当前的socket.name,将其删除
    socket.on("disconnect", async () => {
      let index = allUid.findIndex((item) => item == socket.name);
      allUid.splice(index, 1);
      //这里还需要将断开连接用户的信息移除，存入数据库
      let de = [];
      for (let i of Object.keys(allInfo)) {
        if (i.includes(socket.name)) {
          //取出对应uid，ruid和聊天对象，存入数据库，同时将数据删除
          //先判断数据库中是否存在，如果存在就添加尾部，如果不存在，就创建信息记录了
          de.push(i);
          save(i, allInfo);
        }
      }
      for (let i = 0; i < de.length; i++) {
        delete allInfo[de[i]];
      }
    });
  });
};

let save = async (str, allInfo) => {
  let [uid, ruid] = str.split("+");
  try {
    //将对象进行转化字符串，
    let info = utils.chatInfoChange(allInfo[str]);
    let data = await chatController.getChatlist(uid, ruid);
    if (data.length !== 0) {
      await chatController.updateChat(uid, ruid, info);
    } else {
      await chatController.createChat(uid, ruid, info);
    }
  } catch (error) {
    console.log(error);
  }
};

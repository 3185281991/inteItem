import { createStore } from "vuex";
import { blogInfoIncrement, addHot } from "@/api/blog";
import { getBasicUser } from "@/api/user";
import { getChatList, updateShow } from "@/api/chat";
import { concatChatInfo } from "@/utils/index";
import eventHub from "@/utils/eventBus";
export default createStore({
  state: {
    uid: null,
    name: null,
    avatar: null,
    hrShow: false,
    isLogin: false,
    activeUserIndex: 0,
    isgetInfo: false,
    //所有关于我显示的聊天信息
    chatList: {},
  },
  getters: {},
  mutations: {
    saveUserInfo(state, payload) {
      this.commit("dataSave", payload);
      this.commit("localSave", payload);

      if (payload.check) {
        //本地保存账号信息
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            uid: payload.uid,
            name: payload.name,
            pass: payload.pass,
            avatar: payload.avatar,
            isLogin: payload.isLogin,
          })
        );
      } else {
        localStorage.getItem("userInfo")
          ? localStorage.removeItem("userInfo")
          : "";
      }
    },
    localSave(state, payload) {
      let token = payload.token;
      let tokenExpire = payload.tokenExpire;
      localStorage.setItem(
        "simpleToken",
        JSON.stringify({ token, tokenExpire })
      );
    },
    dataSave(state, payload) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: payload.name,
          uid: payload.uid,
          isLogin: payload.isLogin,
          avatar: payload.avatar,
        })
      );
      state.name = payload.name;
      state.avatar = payload.avatar;
      state.uid = payload.uid;
      state.isLogin = payload.isLogin;
    },
    exit(state, payload) {
      payload.socket.io.close();
      state.name = null;
      state.avatar = null;
      state.isLogin = false;
      state.uid = null;
      state.chatList = {};
      sessionStorage.removeItem("chatLog");
      sessionStorage.removeItem("user");
    },
    addChat(state, payload) {
      let uid = Object.keys(payload)[0];
      state.chatList[uid] = payload[uid];
    },
    addLog(state, payload) {
      state.chatList[payload.uid] = [];
    },
    deleteChat(state, ruid) {
      delete state.chatList[ruid];
    },
    getchatlist(state, payload) {
      state.chatList = payload;
    },
    //添加我自己的发送的信息
    addMyInfo(state, payload) {
      let ruid = payload.ruid;
      if (state.chatList == {}) {
        state.chatList[ruid] = [payload];
      } else {
        //如果存在聊天信息，放入其聊天数组中
        if (Object.keys(state.chatList).includes(ruid)) {
          state.chatList[ruid].push(payload);
        } else {
          state.chatList[ruid] = [payload];
        }
      }
      sessionStorage.setItem(
        "chatLog",
        JSON.stringify({ chat: state.chatList })
      );
      state.isgetInfo = true;
    },
    //我接收的消息，那么发送人就是我的聊天对象
    async SOCKET_receive(state, payload) {
      let uid = payload.uid;
      if (state.chatList == {}) {
        state.chatList[uid] = [payload];
      } else {
        //如果存在聊天信息，放入其聊天数组中,如果不存在那么就是别人发给我的信息
        if (Object.keys(state.chatList).includes(uid)) {
          state.chatList[uid].push(payload);
        } else {
          state.chatList[uid] = [];
          let rs = {};
          let res = await getChatList(state.uid, uid);
          if (res.data.length != 0) {
            rs[uid] = concatChatInfo(res.data[0].info);
          } else {
            let res2 = await getChatList(uid, state.uid);
            if (res2.data[0]) {
              rs[uid] = concatChatInfo(res2.data[0].info);
            }
          }
          if (Object.keys(rs).length != 0) {
            state.chatList[uid] = rs[Object.keys(rs)[0]];
            await updateShow(state.uid, uid, 1);
          }
          //可能是新用户，也可能是消息被关闭，通知聊天界面创建新的聊天对象
          state.chatList[uid].push(payload);
          let data = await getBasicUser(uid);
          let chat = {
            ruid: uid,
            rname: data.data[0].username,
            ravatar: data.data[0].avatar,
            uid: state.uid,
          };
          eventHub.$emit("addLog", chat);
        }
      }
      sessionStorage.setItem(
        "chatLog",
        JSON.stringify({ chat: state.chatList })
      );
      state.isgetInfo = true;
    },
    async addView(state, payload) {
      let res = await blogInfoIncrement(2, payload);
      let res1 = await addHot(2, payload);
      if (res.data.flag == 0 || res1.data.flag == 0) {
        console.error("服务器错误");
      }
    },
    changeHr(state, payload) {
      state.hrShow = payload;
    },
  },
  actions: {
    addView(context, payload) {
      context.commit("addView", payload);
    },
  },
  modules: {},
});

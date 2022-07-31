import { createStore } from "vuex";
import router from "../router";
import { getBasicUser, getChatList, updateShow } from "@/api/home";
import { concatChatInfo } from "@/utils/index";
import eventHub from "@/utils/eventBus";
export default createStore({
  state: {
    username: null,
    routes: null,
    uid: null,
    avatar: null,
    isgetInfo: false,
    chatList: {},
  },
  getters: {},
  mutations: {
    saveRootInfo(state, payload) {
      state.username = payload.username;
      state.uid = payload.uid;
      state.avatar = payload.avatar;
      if (!sessionStorage.getItem("root")) {
        sessionStorage.setItem(
          "root",
          JSON.stringify({
            username: payload.username,
            uid: payload.uid,
            avatar: payload.avatar,
          })
        );
      }
    },
    saveRoute(state, payload) {
      state.routes = payload;
      this.commit("addRoute", payload);
      let allRoute = sessionStorage.getItem("allRoute");
      if (!allRoute) {
        sessionStorage.setItem("allRoute", JSON.stringify(payload));
      }
    },
    addRoute(state, payload) {
      payload.forEach((element) => {
        if (element.children) {
          element.children.forEach((route) => {
            router.addRoute("home", {
              path: route.route,
              name: route.route.slice(1),
              component: () => import(`@/views/${route.route.slice(1)}`),
              meta: {
                title: route.info,
              },
            });
          });
        } else {
          router.addRoute("home", {
            path: element.route,
            name: element.route.slice(1),
            component: () => import(`@/views/${element.route.slice(1)}`),
            meta: {
              title: element.info,
            },
          });
        }
      });
      router.push(location.pathname);
    },
    removeRoutes(state, payload) {
      state.routes.forEach((element) => {
        if (element.children) {
          element.children.forEach((route) => {
            router.removeRoute(route.route.slice(1));
          });
        } else {
          router.removeRoute(element.route.slice(1));
        }
      });
    },

    exit(state, payload) {
      payload.socket.io.close();
      this.commit("removeRoutes");
      state.username = null;
      state.routes = null;
      state.uid = null;
      state.avatar = null;
      state.isgetInfo = false;
      state.chatList = {};
      sessionStorage.removeItem("allRoute");
      sessionStorage.removeItem("root");
      router.push("/login");
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
        //如果存在聊天信息，放入其聊天数组中
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
  },
  actions: {},
  modules: {},
});

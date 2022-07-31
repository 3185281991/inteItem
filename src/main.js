import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";

import "amfe-flexible";
import "@/assets/css/iconfont.css";

const app = createApp(App);

import eventHub from "@/utils/eventBus";
app.config.globalProperties.eventHub = eventHub;
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import VueSocketIO from "vue-socket.io";
app.config.globalProperties.socket = new VueSocketIO({
  debug: false, // debug调试，生产建议关闭
  connection: "http://124.221.69.31:9999",
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_",
  },
  options: {
    //Optional options,
    autoConnect: false, //关闭自动连接，在用户登录后在连接。
  },
});
app.use(store).use(router).mount("#app");

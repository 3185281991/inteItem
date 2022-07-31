import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";

let app = createApp(App);
import eventHub from "@/utils/eventBus";
app.config.globalProperties.eventHub = eventHub;
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
// 统一导入 element 图标
import * as Icons from "@element-plus/icons-vue";

// 注册全局 element-icons 组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
app.use(store).use(router).use(ElementPlus).mount("#app");

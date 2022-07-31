<template>
  <div>
    <navTop
      :isFixed="isFixed"
      v-if="$route.path !== '/404' && $route.path !== '/login'"
    />
    <main>
      <router-view v-if="isRouteAlive" v-slot="{ Component }">
        <transition name="fade-transform">
          <keep-alive exclude="textView">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
  </div>
</template>
<script setup>
import navTop from "@/components/private/nav/navTop.vue";
import { throttle } from "@/utils/index.js";
import { ref, onBeforeMount, getCurrentInstance, nextTick, provide } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

const { eventHub } = getCurrentInstance().proxy;
let route = useRoute();
let isRouteAlive = ref(true);
let reload = () => {
  isRouteAlive.value = false;
  nextTick(() => {
    isRouteAlive.value = true;
  });
};
provide("reload", reload);
let isFixed = ref(false);
let store = useStore();
let router = useRouter();
let judgeFiexd = function () {
  let scroll =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  let windowH =
    document.documentElement.clientHeight || document.body.clientHeight; //网页可视区域高度
  let documentH =
    document.documentElement.offsetHeight || document.body.offsetHeight; //元素在屏幕上所用的所有可见区域的高度
  let scrollH = document.documentElement.scrollTop || document.body.scrollTop; //  获取或设置一个元素的内容垂直滚动的像素数
  if (windowH + scrollH + 20 >= documentH && route.path == "/home") {
    //通知首页进行下拉加载更多博客
    throttle(() => {
      eventHub.$emit("scrollButtom");
    }, 1500)();
  }
  if (scroll > 40) {
    isFixed.value = true;
  } else {
    isFixed.value = false;
  }
  if (scroll > 740) {
    store.commit("changeHr", true);
  } else {
    store.commit("changeHr", false);
  }
};
onBeforeMount(async () => {
  window.onscroll = throttle(judgeFiexd, 10);

  let user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    store.commit("dataSave", {
      name: user.name,
      uid: user.uid,
      isLogin: user.isLogin,
      avatar: user.avatar,
    });
  }

  let chatList = JSON.parse(sessionStorage.getItem("chatLog"));
  if (chatList) {
    store.state.chatList = chatList.chat;
  }
});
</script>
<style lang="scss" scoped>
@import "assets/css/base.css";

div {
  background-color: #f4f5f5;
}
</style>

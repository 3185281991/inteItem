<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade-transform">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
let store = useStore();
let routes = JSON.parse(sessionStorage.getItem("allRoute"));
if (routes) {
  store.commit("saveRoute", routes);
}

let root = JSON.parse(sessionStorage.getItem("root"));
if (root) {
  store.commit("saveRootInfo", {
    username: root.username,
    uid: root.uid,
    avatar: root.avatar,
  });
}
</script>
<style lang="scss">
@import url("./assets/css/base.css");
</style>

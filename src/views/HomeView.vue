<template>
  <div class="home">
    <el-row :span="24">
      <div class="topInfo">
        <img src="@/assets/img/theme.jpg" alt="" />
      </div>
    </el-row>
    <div class="main">
      <el-row>
        <el-col :span="isCollapse ? 1 : 4" class="nav">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#rgba(255, 255, 255, 0.5)"
            :collapse="isCollapse"
            :router="true"
          >
            <div class="top">
              <div :class="{ text: isCollapse == true }">控制台</div>
              <el-icon
                @click="changeCollapse"
                :class="{ icon: isCollapse == true }"
                ><Expand
              /></el-icon>
            </div>

            <div v-for="item in routes" :key="item.icon">
              <el-sub-menu :index="item.route" v-if="item.children">
                <template #title>
                  <component
                    :is="item.icon"
                    style="
                      width: 1.5em;
                      height: 1.5em;
                      margin-right: 8px;
                      color: #123456;
                    "
                  >
                  </component>
                  <span :class="{ none: isCollapse ? true : false }">{{
                    item.info
                  }}</span>
                </template>
                <el-menu-item
                  :index="itemc.route"
                  v-for="itemc in item.children"
                  :key="itemc.icon"
                >
                  <template #title>
                    <component
                      :is="itemc.icon"
                      style="
                        width: 1.5em;
                        height: 1.5em;
                        margin-right: 8px;
                        color: #123456;
                      "
                    >
                    </component
                    ><span>{{ itemc.info }}</span></template
                  >
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item :index="item.route" v-else>
                <component
                  :is="item.icon"
                  style="
                    width: 1.5em;
                    height: 1.5em;
                    margin-right: 8px;
                    color: #123456;
                  "
                >
                </component>
                <template #title>{{ item.info }}</template>
              </el-menu-item>
            </div>
          </el-menu>
        </el-col>
        <el-col :span="isCollapse ? 23 : 20" class="content">
          <el-row>
            <el-col class="breadcrumb">
              <el-breadcrumb separator=">">
                <el-breadcrumb-item v-for="item in navList" :key="item">{{
                  item
                }}</el-breadcrumb-item>
              </el-breadcrumb>
              <div class="userInfo">
                <el-dropdown>
                  <img :src="avatar" alt="" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="exit"
                        >退出登录</el-dropdown-item
                      >
                      <el-dropdown-item>其他</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <span>{{ rootname }}</span>
              </div>
            </el-col>
          </el-row>
          <router-view v-slot="{ Component }">
            <transition name="fade-transform">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition> </router-view
        ></el-col>
      </el-row>
      <div></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import router from "@/router";
let store = useStore();
let route = useRoute();
let routes = computed(() => store.state.routes);
let rootname = computed(() => store.state.username);
let avatar = computed(() => store.state.avatar);
let socket = getCurrentInstance().appContext.config.globalProperties.socket;
let addbreadcrumb = (routes, path) => {
  let rs = [];
  routes?.forEach((element) => {
    if (element.children) {
      element.children.forEach((item) => {
        if (item.route == route.path) {
          rs.push(element.info);
          rs.push(item.info);
        }
      });
    } else {
      if (element.route == route.path) {
        rs.push(element.info);
      }
    }
  });
  return rs;
};
let navList = computed(() => {
  return addbreadcrumb(routes.value, route.path);
});
let exit = () => {
  store.commit("exit", { socket });
};
const isCollapse = ref(false);
let changeCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>
<style scoped>
.home {
  background: url("@/assets/img/login.jpg") no-repeat;
  background-size: cover;
}
.topInfo {
  height: 50px;
  width: 100%;
  background-color: #fff;
  position: fixed;
  z-index: 10;
  display: flex;
  justify-content: center;
}
.topInfo img {
  max-width: 100%;
  height: 50px;
}
.main {
  margin-top: 50px;
}
.top {
  height: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  position: relative;
}
.top div {
  position: absolute;
  left: 50%;
  width: 60px;
  transform: translateX(-30px);
  text-align: center;
  font-size: 18px;
  opacity: 1;
}
.top .text {
  opacity: 0;
}
.top .el-icon {
  font-size: 22px;
  position: absolute;
  right: 20px;
}
.top .icon {
  margin-left: 20px;
}
.nav {
  height: calc(100vh - 50px);
  background-color: rgba(255, 255, 255, 0.5);
  position: sticky;
  top: 50px;
}
.content {
  background-color: rgba(255, 255, 255, 0.5);
  min-height: 100vh;
}
.breadcrumb {
  height: 60px;
  background-color: rgba(255, 255, 255, 0.5);
}
.el-breadcrumb {
  float: left;
  width: 200px;
  line-height: 60px;
  margin-left: 20px;
}

.userInfo {
  float: right;
  width: 180px;
  height: 100%;
}
.userInfo img {
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 10px;
  cursor: pointer;
}
.userInfo span {
  font-size: 16px;
  margin-top: 20px;
  display: inline-block;
  margin-left: 10px;
}
.none {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>

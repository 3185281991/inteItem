import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/home/HomeView.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/LoginView.vue"),
    meta: {
      title: "用户登录-Simple Tools",
    },
  },
  {
    path: "/addtext",
    name: "addtext",
    component: () => import("../views/user/addText.vue"),
    meta: {
      title: "发布文章",
    },
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/user/userView.vue"),
    meta: {
      title: "用户个人主页",
    },
    children: [
      {
        path: "tiezi",
        name: "tiezi",
        component: () => import("../views/user/tieziView.vue"),
        meta: {
          title: "我的帖子",
        },
      },
      {
        path: "message",
        name: "message",
        component: () => import("../views/user/messageView.vue"),
        meta: {
          title: "我的消息",
        },
      },
      {
        path: "info",
        name: "info",
        component: () => import("../views/user/ziliaoView.vue"),
        meta: {
          title: "我的基本信息",
        },
      },
      {
        path: "accept",
        name: "accept",
        component: () => import("../views/user/guanzhuView.vue"),
        meta: {
          title: "我的关注",
        },
      },
      {
        path: "like",
        name: "like",
        component: () => import("../views/user/shoucangView.vue"),
        meta: {
          title: "我的收藏",
        },
      },
    ],
  },
  {
    path: "/runtimehot",
    name: "runtime",
    component: () => import("../views/external/runTimeHot.vue"),
    meta: {
      title: "实时热点信息",
    },
  },
  {
    path: "/daybg",
    name: "daybg",
    component: () => import("../views/external/dayBg.vue"),
    meta: {
      title: "每日壁纸",
    },
  },
  {
    path: "/text/:bid",
    name: "text",
    component: () => import("../views/text/textView.vue"),
    meta: {
      title: "文章信息",
    },
  },
  {
    path: "/search/:content",
    name: "search",
    component: () => import("../views/search/searchView.vue"),
    meta: {
      title: "搜索结果",
    },
  },
  {
    path: "/brief/:uid",
    name: "brief",
    component: () => import("../views/user/briefView.vue"),
    meta: {
      title: "用户简介",
    },
  },

  {
    path: "/404",
    name: "404",
    component: () => import("../views/notFound.vue"),
    meta: {
      title: "出错了",
    },
  },
  {
    path: "/:pathmatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.name == "text") {
    //没进入一次文章页面，浏览数量+1
    store.dispatch("addView", to.params.bid);
  }
  let simpleToken = JSON.parse(localStorage.getItem("simpleToken"));
  if (simpleToken) {
    if (new Date().getTime() - simpleToken.tokenExpire > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("simpleToken");
      next("/login");
    } else {
      if (!store.state.isLogin) {
        if (to.path.includes("user")) {
          next("/home");
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } else {
    if (to.path.includes("user")) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;

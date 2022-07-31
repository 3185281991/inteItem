import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/loginView.vue"),
    meta: {
      title: "管理员登录",
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "/text/:bid",
        name: "txet",
        component: () => import("@/views/textView.vue"),
        meta: {
          title: "帖子详情",
        },
      },
    ],
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
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  let token = JSON.parse(localStorage.getItem("backToken"));
  if (token) {
    if (store.state.uid) {
      next();
    } else {
      if (to.path == "/login") next();
      else {
        next({ path: "/login" });
      }
    }
  } else {
    if (to.path == "/login") next();
    else {
      next({ path: "/login" });
    }
  }
});
export default router;

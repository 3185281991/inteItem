<template>
  <div class="navx" :class="{ topFixed: isFixed === true }">
    <div class="left">
      <a href="javascript:void(0);">
        <img src="@/assets/img/theme.jpg" alt=""
      /></a>
      <div class="city" v-if="tq.city">
        {{ tq.city }}
        <div class="ctq">
          <div class="tqinfo">
            <span v-for="(key, value) in tq.info" :key="key" :class="value">{{
              key
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <nav class="mainNav">
      <ul class="first">
        <li
          v-for="(key, value) in navInfo"
          :key="value"
          @click="jumpNav(value)"
        >
          {{ key }}
        </li>
      </ul>
    </nav>
    <div class="search">
      <i class="iconfont icon-sousuo"></i>
      <input
        type="text"
        placeholder="搜索帖子"
        v-model="scontent"
        @keyup.enter="jumpSr"
      />
    </div>

    <div class="right">
      <div class="user" v-if="isLogin">
        <div class="rt">
          <img :src="getAvatar" alt="" v-show="getAvatar" />
          <div class="username">{{ getName }}</div>
        </div>

        <div class="cv">
          <div
            class="tiezi"
            v-for="(item, index) in useri"
            :key="item[index]"
            @click="$router.push(`/user/${index}`)"
          >
            {{ item }}
          </div>
          <div class="exit" @click="exit">退出登录</div>
        </div>
      </div>

      <span
        v-if="!isLogin"
        class="iconfont icon-morentouxiang"
        title="注册/登录"
        @click="$router.push('/login')"
      ></span>
    </div>
  </div>
</template>
0

<script>
import { getTianqi } from "@/api/external";
import {
  computed,
  onMounted,
  ref,
  getCurrentInstance,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "navTop",
  props: {
    isFixed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let socket = getCurrentInstance().appContext.config.globalProperties.socket;
    const { eventHub } = getCurrentInstance().proxy;
    let router = useRouter();
    let store = useStore();

    let uid = computed(() => store.state.uid);
    let getName = computed(() => store.state.name);
    let getAvatar = computed(() => store.state.avatar);
    let isLogin = computed(() => store.state.isLogin);
    let navInfo = {
      home: "首页",
      runtimehot: "实时热点",
      daybg: "壁纸概览",
    };
    let useri = {
      info: "我的资料",
      tiezi: "我的帖子",
      accept: "我的关注",
      like: "我的收藏",
      message: "我的消息",
    };
    let scontent = ref("");
    let tq = ref({});
    let jumpSr = (e) => {
      if (scontent.value !== "") {
        router.push(`/search/${scontent.value}`);
      }
      scontent.value = "";
      e.srcElement.blur();
    };
    let exit = () => {
      store.commit("exit", { socket });
      router.push("/login");
      eventHub.$emit("reload");
    };
    let jumpNav = (value) => {
      router.push(`/${value}`);
    };
    onMounted(async () => {
      // let id=guestInfo.
      try {
        let info = await getTianqi();
        tq.value = info?.data;
      } catch (err) {
        console.log(err);
      }
    });
    return {
      tq,
      getName,
      exit,
      navInfo,
      jumpNav,
      jumpSr,
      getAvatar,
      uid,
      useri,
      scontent,
      isLogin,
    };
  },
};
</script>
<style scoped lang="scss">
.topFixed {
  position: fixed !important;
  top: 0;
}
.navx {
  z-index: 10;
  width: 100%;
  height: 0.3125rem;
  background-color: #fff;
  position: relative;
  transition: 1s;
  .left {
    position: absolute;
    height: 0.3125rem;
    width: 1.5625rem;
    left: 0.5208rem;
    img {
      max-width: 0.7813rem;
      min-height: 100%;
    }
    .city {
      width: 0.625rem;
      float: right;
      font-size: 0.1042rem;
      line-height: 0.3125rem;
      cursor: pointer;
      text-align: center;
      height: 0.3125rem;
    }

    .ctq {
      display: none;
      width: 1.3021rem;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
      left: 0.625rem;
      border-radius: 0.0521rem;
      min-height: 1.0417rem;
      backdrop-filter: blur(5px);

      .tqinfo {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        span {
          font-size: 0.0885rem;
          display: inline-block;
          height: 0.2083rem;
          line-height: 0.2083rem;
          width: 35%;
          color: black;
        }
        .tip {
          width: 85%;
          line-height: 0.1563rem;
          font-size: 0.0833rem;
          display: block;
        }
      }
    }
    .city:hover {
      color: coral;
    }
    //可控制同级相邻元素：使用符号“+”拼接
    //可控制同级不相邻元素：使用符号“~”拼接
    .city:hover .ctq {
      display: block;
    }
  }

  .mainNav {
    position: absolute;
    left: 2.3438rem;
    .first {
      height: 0.3125rem;
      li:first-child {
        margin-left: 0;
      }
      li {
        width: 0.625rem;
        text-align: center;
        float: left;
        font-size: 0.1042rem;
        line-height: 0.3125rem;
        transition: 0.3s;
        cursor: pointer;
      }
      li:hover {
        background-color: #ccc;
        color: #fff;
        border-radius: 1px;
      }
      .last {
        .other {
          display: none;
          li {
            width: 0.625rem;
            height: 0.2083rem;
            line-height: 0.2083rem;
            background-color: #fff;
          }
        }
      }
      .last:hover {
        .other {
          display: block;
          li:hover {
            color: #ff9966;
          }
        }
      }
    }
  }
  .search {
    position: absolute;
    right: 2.8646rem;
    i {
      position: absolute;
      right: 0.1302rem;
      margin-top: 0.0781rem;
      height: 0.2083rem;
      line-height: 0.1563rem;
    }
    input {
      display: inline-block;
      margin-top: 0.0625rem;
      border: 2px solid #ccc;
      width: 1.5625rem;
      height: 0.1563rem;
      text-indent: 0.1042rem;
      border-radius: 0.0104rem;
    }
    input:focus {
      outline: 2px solid #ccffff;
    }
  }
  .right {
    position: absolute;
    right: 0.7813rem;
    span {
      cursor: pointer;
      line-height: 0.3125rem;
      font-size: 0.2604rem;
    }
    .user {
      cursor: pointer;
      width: 0.8333rem;
      margin-top: 0.0521rem;
      height: 0.2083rem;
      position: relative;
      .rt {
        height: 0.2083rem;
        margin-left: 0.0521rem;
        img {
          max-width: 0.2083rem;
          height: 0.2083rem;
          border-radius: 50%;
        }
        .username {
          position: absolute;
          top: 0;
          font-size: 0.0938rem;
          line-height: 0.2083rem;
          display: inline-block;
          margin-left: 0.026rem;
          width: 0.625rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .cv {
        display: none;
        width: 0.625rem;
        background-color: rgba(255, 255, 255, 0.5);
        div {
          width: 100%;
          height: 0.2083rem;
          font-size: 0.0938rem;
          line-height: 0.2083rem;
          text-align: center;
        }
        div:hover {
          color: coral;
        }
      }
    }
  }
  .right:hover {
    .cv {
      display: block;
    }
  }
}
</style>

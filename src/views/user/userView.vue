<template>
  <div class="user">
    <main>
      <div class="uleft">
        <div class="utop">
          <ul>
            <li
              v-for="item in Object.entries(arr)"
              :key="item"
              @click="$router.push(`/user/${item[0]}`)"
            >
              {{ item[1] }}
            </li>
          </ul>
        </div>
        <div class="ubi">
          <router-view v-slot="{ Component }">
            <transition>
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>
      <div class="uright"></div>
    </main>
  </div>
</template>

<script>
export default {
  name: "userView",
  setup() {
    let arr = {
      info: "资料",
      accept: "关注",
      like: "收藏",
      tiezi: "帖子",
      message: "消息",
    };

    return {
      arr,
    };
  },
};
</script>
<style scoped lang="scss">
.user {
  width: 100%;
  min-height: 110vh;
}
main {
  width: 65vw;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.uleft {
  width: 70%;
  background-color: #fff;
}

.utop {
  width: 100%;
  height: 0.3125rem;
  ul {
    width: 100%;
    li {
      cursor: pointer;
      float: left;
      height: 0.3125rem;
      line-height: 0.3125rem;
      font-size: 0.1042rem;
      width: 0.5208rem;
      text-align: center;
      color: rgb(33, 30, 30);
    }
  }
}
</style>

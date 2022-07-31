<template>
  <div class="home">
    <div class="titl">
      <div>
        <span class="iconfont icon-gonggao"></span>
        <p>
          <span class="ycin" :title="wyycom">{{ wyycom }}</span>
        </p>
      </div>
    </div>

    <main>
      <div class="hleft">
        <div class="kind">
          <span
            v-for="(item, index) in topInfo"
            :key="index"
            :class="{ active: activeIndex == index }"
            @click="changeIndex(index)"
            >{{ item }}</span
          >
          <div
            class="recommend"
            v-for="(item, key, index) in list"
            v-show="activeIndex == index"
            :key="index"
          >
            <div v-for="itemr in item.data" :key="itemr.bid">
              <itemInfo :item="itemr" />
            </div>
            <div class="propt" v-show="!item.more">
              <p>暂无更多数据</p>
            </div>
          </div>
        </div>
      </div>
      <div class="hright">
        <div class="showTop">
          <div class="rtop">
            <div class="rb">
              <keep-alive>
                <slideClock />
              </keep-alive>
            </div>
          </div>
          <div class="tool">
            <ul>
              <li
                v-for="(item, index) in rightChoose"
                :key="index"
                @click="rightC(index)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="daily zx">
            <h2>每日一言</h2>
            <p class="zh">{{ day.zh }}</p>
            <p class="en">
              {{ day.en }}
            </p>
            <img v-if="day.pic" class="bg" :src="day.pic" alt="" />
          </div>
        </div>
        <div
          class="hiddenTop"
          ref="hidden"
          :class="{ showHidden: isshow }"
        ></div>
      </div>
    </main>
    <div class="mct" v-show="mctShow">
      <span
        @click="
          mctShow = false;
          codeContent = '';
        "
        class="iconfont icon-guanbi"
      ></span>
      <input
        type="text"
        v-model="codeContent"
        @keyup.enter="getCode"
        placeholder="请输入二维码内容"
      />
      <div><img :src="codeUrl" alt="" /></div>
    </div>
  </div>
</template>

<script setup>
// @ is an alias to /src
import slideClock from "@/components/public/clock/slideClock.vue";
import itemInfo from "@/components/private/itemInfo/itemInfo.vue";

import { computed, ref, getCurrentInstance, reactive } from "vue";
import { getWyyHot, getFish } from "@/api/external";
import { getRecommend, getNew, getHot } from "@/api/home";
import { getDayWord } from "@/api/external";
import { useStore } from "vuex";

let Store = useStore();
const { eventHub } = getCurrentInstance().proxy;

let topInfo = ref(["推荐", "最新", "最热"]);
let rightChoose = ["摸鱼日历", "二维码生成"];
let activeIndex = ref(0);
let hidden = ref(null);
let isshow = computed(() => {
  return Store.state.hrShow;
});
let day = ref({});
let list = reactive({
  rec: { page: 0, data: [], more: true },
  hot: { page: 0, data: [], more: true },
  new: { page: 0, data: [], more: true },
});

let codeUrl = ref("http://124.221.69.31:86/img/login.6616288a.jpg");
let codeContent = ref("");
let wyycom = ref("");
let fishurl = ref("");
let mctShow = ref(false);

let changeIndex = (index) => {
  activeIndex.value = index;
};
let gRecommend = async (page) => {
  if (list.rec.more) {
    let res = await getRecommend(page);
    if (res.data.length != 0) {
      list.rec.data = list.rec.data.concat(res.data);
      list.rec.page++;
    } else {
      list.rec.more = false;
    }
  }
};
let gNew = async (page) => {
  if (list.new.more) {
    let res = await getNew(page);
    if (res.data.length != 0) {
      list.new.data = list.new.data.concat(res.data);
      list.new.page++;
    } else {
      list.new.more = false;
    }
  }
};
let gHot = async (page) => {
  if (list.hot.more) {
    let res = await getHot(page);
    if (res.data.length != 0) {
      list.hot.data = list.hot.data.concat(res.data);
      list.hot.page++;
    } else {
      list.hot.more = false;
    }
  }
};
let getDay = async () => {
  try {
    let res = await getDayWord();
    day.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
};
getDay();
let getCode = async () => {
  codeUrl.value = `https://api.vvhan.com/api/qr?text=${codeContent.value}`;
  codeContent.value = "";
};
let rightC = async (index) => {
  if (index == 0) {
    let res = await getFish();
    fishurl.value = res.data;
    window.open(fishurl.value.url);
  }
  if (index == 1) {
    mctShow.value = true;
  }
};
let rest = () => {
  list.rec = { page: 0, data: [], more: true };
  list.hot = { page: 0, data: [], more: true };
  list.new = { page: 0, data: [], more: true };
};
let start = async () => {
  let dt2 = await getWyyHot();
  wyycom.value = dt2.data[0].wangyiyunreping;
  await gRecommend(list.rec.page);
  await gNew(list.new.page);
  await gHot(list.hot.page);
};

start();
eventHub.$on("freshBlog", () => {
  //手动刷新的前提是还有数据，才会添加到数组中，之前没有数据会被设置为false
  activeIndex.value = 0;
  rest();
  start();
});
eventHub.$on("scrollButtom", async () => {
  switch (activeIndex.value) {
    case 0: {
      let page = list.rec.page;
      await gRecommend(page);
      break;
    }
    case 1: {
      let page = list.new.page;
      await gNew(page);
      break;
    }
    case 2: {
      let page = list.hot.page;
      await gHot(page);
      break;
    }
  }
});
</script>
<style scoped lang="scss">
.home {
  overflow: hidden;
  position: relative;
  margin-top: 0.0521rem;
}
.titl {
  width: 30%;
  position: relative;
  height: 0.2083rem;
  left: 52%;
  z-index: 20;
  text-align: right;
  div {
    float: right;
    width: 2.3438rem;
    height: 0.2083rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  span.icon-gonggao {
    width: 0.2083rem;
    text-align: center;
    line-height: 0.2083rem;
    font-size: 0.1042rem;
    display: block;
  }
  p {
    flex: 1;
    overflow: hidden;
    height: 0.2083rem;
    position: relative;

    .ycin {
      width: auto;
      white-space: nowrap;
      line-height: 0.2083rem;
      font-size: 0.0938rem;
      position: absolute;
      animation: flow 20s infinite linear;
    }
  }

  @keyframes flow {
    0% {
      left: 0;
    }
    50% {
      left: -50%;
    }
    100% {
      left: -100%;
    }
  }
}
main {
  width: 65vw;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  min-height: calc(100vh + 00.1302rem);
}
.hleft {
  width: 70%;
  background-color: #fff;
  .kind {
    text-indent: 0.0521rem;
    span {
      font-size: 0.1042rem;
      height: 0.2083rem;
      line-height: 0.2083rem;
      margin-left: 0.0521rem;
      cursor: pointer;
    }
    span:hover {
      color: #ff6666;
    }
    .active {
      color: #ff6666;
    }
  }
  .propt {
    width: 100%;
    height: 0.4167rem;
    margin-top: 0.1042rem;
    p {
      width: 100%;
      display: inline-block;
      height: 0.4167rem;
      line-height: 0.4167rem;
      font-size: 0.1094rem;
      text-align: center;
    }
  }
}
.hright {
  width: 27%;
  background-color: transparent;
  position: relative;
  .showTop {
    .rtop {
      background-color: #fff;
      .rb {
        height: 0.4167rem;
      }
    }
    .tool {
      margin-top: 0.0781rem;
      background-color: #fff;
      padding: 0.0521rem 0;
      ul {
        width: 100%;
        li {
          height: 0.2083rem;
          line-height: 0.2083rem;
          font-size: 0.0938rem;
          text-align: center;
          cursor: pointer;
        }
      }
    }
    .zx {
      margin-top: 0.0781rem;
      background-color: #fff;
      overflow: hidden;
      padding-bottom: 0.0781rem;
      h2 {
        margin-top: 0.026rem;
        font-size: 0.0938rem;
        text-align: center;
      }
    }

    .daily {
      p {
        margin-top: 0.0521rem;
        text-indent: 0.0521rem;
        padding-left: 0.026rem;
        line-height: 0.1563rem;
      }
      .zh {
        font-size: 0.0938rem;
      }
      .en {
        font-size: 0.0885rem;
      }
      .bg {
        margin: 0.0521rem 2%;
        max-width: 96%;
        height: 100%;
      }
    }
  }
  .hiddenTop {
    display: none;
    height: 3.9063rem;
    transition: 0.5s;
    img {
      max-width: 100%;
      height: 100%;
    }
  }
  .showHidden {
    width: 1.7448rem;
    display: block;
    position: fixed;
    top: 0.5208rem;
  }
}
.mct {
  position: fixed;
  width: 2.0833rem;
  background-color: rgba(0, 0, 0, 0.2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  span {
    position: absolute;
    right: 0.026rem;
    top: 0.0521rem;
    font-size: 0.1302rem;
    cursor: pointer;
  }
  input {
    display: block;
    width: 70%;
    margin: 0.0521rem auto;
    height: 0.1563rem;
    line-height: 0.1563rem;
    padding-left: 0.1042rem;
  }
  input:focus {
    outline: 1px deepskyblue solid;
  }
  div {
    width: 100%;
    padding-bottom: 0.0781rem;
    img {
      max-width: 1.3021rem;
      height: 1.3021rem;
      margin-left: 0.3646rem;
      border-radius: 0.0781rem;
    }
  }
}
</style>

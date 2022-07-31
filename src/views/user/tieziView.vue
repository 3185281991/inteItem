<template>
  <div class="tz">
    <div class="tztop">
      <span
        v-for="(item, index) in data"
        :key="index"
        @click="change(index)"
        :class="{ isActive: activeIndex == index }"
        >{{ item }}</span
      >
      <span @click="$router.push('/addtext')">发布帖子</span>
    </div>
    <div v-if="bloglist[0]?.length !== 0">
      <div
        class="aitem"
        v-for="(item, index) in bloglist"
        :key="index"
        v-show="activeIndex == index"
      >
        <div class="item" v-for="itemx in item" :key="itemx.bid">
          <div class="ltop" @click="$router.push(`/text/${itemx.bid}`)">
            <div class="tauthor">
              <img :src="itemx.img" alt="" />
            </div>
            <div class="lright">
              <span class="ttl">{{ itemx.title }}</span>
              <div class="pcon" v-html="itemx.content"></div>
            </div>
          </div>

          <div class="comment">
            <span class="iconfont icon-icon">{{ itemx.hot }}</span>
            <span class="iconfont icon-dianzan">{{ itemx.lauds }}</span
            ><span class="iconfont icon-icon-">{{ itemx.view }}</span>
            <span class="iconfont icon-chakantiezihuifu">{{
              itemx.comment
            }}</span>
          </div>
          <div class="cnx">
            <div class="cntag">
              <i
                v-for="(itemc, indexz) in (itemx.label || '').split(';')"
                :key="indexz"
                >{{ itemc }}</i
              >
            </div>
            <span class="btime">{{ changeSecondToTime(itemx.time) }}</span>
            <span class="deblog" @click="deleteB(itemx.bid, itemx.img)"
              >删除</span
            >
          </div>
        </div>
        <div class="laud" v-show="false"><div class="item"></div></div>
        <div class="view" v-show="false"><div class="item"></div></div>
      </div>
    </div>
    <div v-else class="disappear"><p>暂无信息</p></div>
  </div>
</template>

<script setup>
import { getAllblog } from "@/api/user";
import { useStore } from "vuex";
import { computed, ref, getCurrentInstance } from "@vue/runtime-core";
import { changeSecondToTime, throttle } from "@/utils";
import { deleteBlog } from "@/api/blog";
const { eventHub } = getCurrentInstance().proxy;
let store = useStore();
let bloglist = ref([]);
let activeIndex = ref(0);
let data = ["时间顺序", "获赞数量", "浏览数量"];

let myuid = computed(() => store.state.uid).value;

let change = (index) => {
  activeIndex.value = index;
};
let start = async () => {
  bloglist.value = [];
  let res = await getAllblog(myuid, "time");
  bloglist.value.push(res.data);
  let res1 = await getAllblog(myuid, "lauds");
  bloglist.value.push(res1.data);
  let res2 = await getAllblog(myuid, "view");
  bloglist.value.push(res2.data);
};
start();
eventHub.$on("freshBlog", () => {
  activeIndex.value = 0;
  start();
});
let deleteB = async (bid, img) => {
  let res = await deleteBlog(bid, img);
  if (res.data.flag == 1) {
    eventHub.$emit("freshBlog");
  }
  alert(res.data.message);
};
</script>
<style scoped lang="scss">
.tz {
  width: 100%;
  min-height: 4.4271rem;
  overflow: hidden;
}
.tztop {
  margin-top: 0.0521rem;
  width: 100%;
  height: 0.2083rem;
  line-height: 0.2083rem;
  span {
    height: 0.2083rem;
    font-size: 0.0938rem;
    margin-left: 0.2083rem;
    cursor: pointer;
  }
  span:last-child {
    margin-left: 0.2083rem;
  }
}
.aitem {
  width: 100%;
  min-height: 2.5rem;
}
.item {
  width: 100%;
  min-height: 0.8333rem;
  margin-top: 0.1042rem;
  .ltop {
    width: 100%;
    height: 0.7813rem;
    background-color: aliceblue;
    display: flex;
    cursor: pointer;
  }
  .tauthor {
    height: 100%;
    width: 20%;
    display: table-cell;
    img {
      margin-left: 0.2083rem;
      margin-top: 0.1042rem;
      max-width: 0.5208rem;
      height: 0.5208rem;
    }
  }
  .lright {
    height: 100%;
    width: 80%;
    .ttl {
      display: block;
      width: 100%;
      text-align: center;
      height: 0.2083rem;
      line-height: 0.2083rem;
      font-size: 0.0938rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .pcon {
      height: 0.5208rem;
      line-height: 0.1667rem;
      font-size: 0.0885rem;
      padding: 0.0104rem 0.026rem;
      text-indent: 2em;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  }

  .comment {
    height: 0.2083rem;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    span {
      display: block;
      height: 0.1563rem;
      line-height: 0.1563rem;
      width: 25%;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }
    span:before {
      margin-right: 0.0521rem;
    }
  }
  .cnx {
    width: 100%;
    height: 0.2083rem;
    display: flex;
    position: relative;
    .cntag {
      display: flex;
      margin-left: 0.1042rem;
      i {
        margin-left: 0.0521rem;
        display: block;
        height: 0.1563rem;
        line-height: 0.1563rem;
        padding: 0.0104rem 0.026rem;
        font-size: 0.0938rem;
        background: dodgerblue;
        border-color: #e5e6eb;
        border-radius: 0.0208rem;
        min-width: 0.3125rem;
        text-align: center;
      }
    }
  }
  .btime {
    position: absolute;
    left: 2.0833rem;
    width: 0.7292rem;
    height: 0.1563rem;
    text-align: center;
    line-height: 0.1563rem;
    background-color: antiquewhite;
  }
  .deblog {
    width: 0.5208rem;
    height: 0.1563rem;
    line-height: 0.1563rem;
    text-align: center;
    background-color: dodgerblue;
    font-size: 0.0938rem;
    color: #fff;
    position: absolute;
    right: 0.1042rem;
    cursor: pointer;
  }
}

.isActive {
  border-bottom: 4px solid dodgerblue;
}
.disappear {
  margin-top: 0.0521rem;
  width: 100%;
  height: 0.4167rem;
  p {
    font-size: 0.1302rem;
    padding-left: 0.1042rem;
    height: 0.3125rem;
    line-height: 0.3125rem;
  }
}
</style>

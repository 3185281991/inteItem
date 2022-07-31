<template>
  <div class="like" v-if="textList.length !== 0">
    <div class="litem" v-for="(item, index) in textList" :key="item.luid">
      <div class="ltop">
        <div class="tauthor" @click="$router.push(`/author/${item.uid}`)">
          <span>{{ item.username }}</span>
        </div>
        <div class="lright" @click="$router.push(`/text/${item.bid}`)">
          <span class="ttl">{{ item.title }}</span>
          <div class="pcon" v-html="item.content"></div>
        </div>
      </div>

      <div class="comment">
        <span
          class="iconfont icon-dianzan"
          :class="{ active: laudList[index] == 1 }"
          >{{ item.lauds }}</span
        ><span
          class="iconfont icon-chakantiezihuifu"
          @click="changeIndex(index)"
          >{{ item.view }}</span
        >
      </div>
      <div class="reply" v-show="isShow == true && rplindex == index">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="发表评论 Ctrl Enter
          "
          v-model="ccontent"
          @keyup.ctrl.enter="addComm(item)"
        ></textarea>
      </div>
    </div>
  </div>
  <div v-else class="disappear"><p>暂无信息</p></div>
</template>

<script setup>
import { getLikeText } from "@/api/user";
import {
  getTextById,
  getLauds,
  addComment,
  blogInfoIncrement,
  addHot,
} from "@/api/blog";
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";

let store = useStore();
let uid = computed(() => store.state.uid);
let likeList = ref([]);
let textList = ref([]);
let laudList = ref([]);
let rplindex = ref(-1);
let isShow = ref(false);
let ccontent = ref("");

let myuid = computed(() => store.state.uid).value;
let myusername = computed(() => store.state.name).value;
let myavatar = computed(() => store.state.avatar).value;

let changeIndex = (index) => {
  if (rplindex !== index) {
    ccontent.value = "";
  }
  rplindex.value = index;
  isShow.value = !isShow.value;
};
let start = async () => {
  let res = await getLikeText(uid.value);
  likeList.value = res.data;
  if (res.data.length != 0) {
    res.data.forEach(async (element) => {
      let res1 = await getTextById(element.lbid);

      if (res1.data.length != 0) {
        textList.value.push(res1.data[0]);
        let res2 = await getLauds(res1.data[0].bid, uid.value);
        res2.data.flag == 1 ? laudList.value.push(1) : laudList.value.push(0);
      }
    });
  }
};
start();
let addComm = async (item) => {
  let bid = item.bid;
  let uid = item.uid;
  let avatar = item.avatar;
  let username = item.username;
  let time = new Date().getTime();
  if (ccontent.value !== "") {
    try {
      let res = await addComment(
        bid,
        uid,
        username,
        avatar,
        ccontent.value,
        time,
        myuid,
        myusername,
        myavatar
      );
      ccontent.value = "";
      if (res.data.flag == 1) {
        let res2 = await blogInfoIncrement(3, bid);
        let res3 = await addHot(20, bid);
        if (res2.data.flag == 0 || res3.data.flag == 0) {
          console.error("服务器错误");
        }
      }
      alert("评论成功");
    } catch (error) {
      alert("服务器错误。");
    }
  }
};
</script>
<style scoped lang="scss">
.like {
  width: 96%;
  min-height: 80vh;
  margin: 0.1042rem auto;
}
.litem {
  width: 100%;
  min-height: 0.8333rem;
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
    padding-top: 0.3125rem;

    display: table-cell;
    span {
      display: block;
      width: 100%;
      height: 0.1563rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 0.1042rem;
      font-weight: bold;
      text-align: center;
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
      text-indent: 2em;
      padding: 0.0104rem 0.026rem;
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
      width: 50%;
      text-align: center;
      border: 1px solid #ccc;
      cursor: pointer;
      user-select: none;
    }
    span:before {
      margin-right: 0.0521rem;
    }
  }
  .reply {
    textarea {
      width: 4.3229rem;
      padding: 0.0208rem 0.026rem;
      height: 0.3125rem;
      line-height: 0.1563rem;
      font-size: 0.0938rem;
      background-color: #ccc;
      resize: vertical;
    }
    textarea:focus {
      border: 1px solid #00a4ff;
      background-color: #fff;
    }
  }
}
.active:before {
  color: aquamarine;
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

<template>
  <div class="accept">
    <div class="aclabel">
      <span class="atag">关注标签</span>
      <div v-if="tagList.length !== 0">
        <div class="lshow">
          <i v-for="(item, index) in tagList" :key="index">{{ item.tag }}</i>
        </div>
      </div>
      <div v-else class="disappear"><p>暂无信息</p></div>
    </div>
    <div class="myacc">
      <span class="atag">关注者</span>
      <div v-if="acceptList.length !== 0">
        <div class="item" v-for="item in acceptList" :key="item.cuid">
          <img
            :src="item.cavatar"
            alt=""
            @click="$router.push(`/brief/${item.cuid}`)"
          />
          <span class="aname">{{ item.cusername }}</span>
          <span class="atime">{{ changeSecondToTime(item.time, 0) }}</span>
        </div>
      </div>
      <div v-else class="disappear"><p>暂无信息</p></div>
    </div>
    <div class="myacc">
      <span class="atag">我的关注</span>
      <div v-if="acceptedList.length !== 0">
        <div class="item" v-for="itemx in acceptedList" :key="itemx.uid">
          <img
            :src="itemx.avatar"
            alt=""
            @click="$router.push(`/author/${itemx.uid}`)"
          />
          <span class="aname">{{ itemx.username }}</span>
          <span class="atime">{{ changeSecondToTime(itemx.time, 0) }}</span>
          <span class="action" @click="change($event, itemx.uid)">已关注</span>
        </div>
      </div>
      <div v-else class="disappear"><p>暂无信息</p></div>
    </div>
  </div>
</template>

<script setup>
import { getAccept, getisAccepted, getLtag, deleteAccept } from "@/api/user";
import { useStore } from "vuex";
import { computed, onDeactivated, ref } from "vue";
import { changeSecondToTime } from "@/utils/index";

let store = useStore();
let tagList = ref([]);
let acceptList = ref([]);
let acceptedList = ref([]);
let deleteList = ref({});
let uid = computed(() => store.state.uid).value;
let start = async () => {
  let res = await getLtag(uid);
  tagList.value = res.data;
  let res1 = await getAccept(uid);
  acceptList.value = res1.data;
  let res2 = await getisAccepted(uid);
  acceptedList.value = res2.data;
};
start();
let change = (e, uid) => {
  let content = e.target.innerText;
  if (content == "已关注") {
    deleteList.value[uid] = false;
    e.target.innerText = "关注";
  } else {
    deleteList.value[uid] = true;
    e.target.innerText = "已关注";
  }
};
onDeactivated(async () => {
  //遍历数组，找出为取消关注的uid，删除
  for (let i of Object.keys(deleteList.value)) {
    if (!deleteList.value[i]) {
      let res = await deleteAccept(i, uid);
      if (res.data.flag == 0) {
        console.error("服务器错误");
      }
    }
  }
});
</script>
<style scoped lang="scss">
.accept {
  width: 96%;
  min-height: 80vh;
  margin: 0.1042rem auto;
}
.atag {
  display: block;
  width: 100px;
  height: 0.2083rem;
  line-height: 0.2083rem;
  margin-top: 0.1042rem;
  font-size: 0.1042rem;
  margin-left: 0.1042rem;
  font-weight: bold;
}
.aclabel {
  width: 100%;
  min-height: 0.5208rem;

  .lshow {
    width: 95%;
    margin: 0.0521rem auto;
    display: flex;
    flex-wrap: wrap;
    i {
      display: block;
      height: 0.1563rem;
      line-height: 0.1563rem;
      padding: 0.0104rem 0.026rem;
      font-size: 0.0938rem;
      margin-left: 0.1042rem;
      margin-top: 0.0521rem;
      background: #e5e6eb;
      border-color: #e5e6eb;
      border-radius: 0.0208rem;
      min-width: 0.3125rem;
      text-align: center;
    }
  }
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
.myacc {
  margin-top: 0.1042rem;
  width: 100%;
  padding-bottom: 0.1042rem;
  background: #e5e6eb;
  overflow: hidden;
  .item {
    width: 95%;
    margin: 0.0781rem auto;
    display: flex;
    align-items: center;
    height: 0.4167rem;
    img {
      max-width: 0.4167rem;
      height: 0.4167rem;
      border-radius: 50%;
      cursor: pointer;
    }
    span {
      display: block;
      font-size: 0.1042rem;
      height: 0.2083rem;
      line-height: 0.2083rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: 0.2083rem;
      text-align: center;
    }
    .aname {
      width: 0.7813rem;
    }
    .atime {
      width: 1.3021rem;
    }
  }
}
.action {
  cursor: pointer;
  width: 0.5208rem;
  height: 0.1563rem;
  line-height: 0.1563rem;
  background-color: dodgerblue;
  color: #fff;
  margin-left: 0.5208rem !important;
  transition: 0.3s all;
  user-select: none;
}
.delete {
  background-color: #fff;
  color: black;
}
</style>

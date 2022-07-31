<template>
  <div class="text">
    <el-row :gutter="20">
      <el-col :span="14" :offset="1">
        <div class="tleft">
          <p class="tcv">{{ text.title }}</p>
          <div class="subinfo">
            <div class="uimg">
              <img :src="user.avatar" alt="" />
            </div>
            <div class="nm">
              <div>{{ text.username }}</div>
              <div>
                <span>{{ changeSecondToTime(text.time, 2) }}</span>
                <span>阅读 {{ text.view }}</span>
                <span>评论 {{ text.comment }}</span>
                <span>热度 {{ text.hot }}</span>
                <span>点赞 {{ text.lauds }}</span>
              </div>
            </div>
          </div>
          <div class="bnm" v-if="text.img == ''">
            <img :src="text.img" alt="" />
          </div>
          <div class="tcon ql-editor" v-html="text.content"></div>

          <div class="tbn">
            <span>标签</span>
            <span
              class="lv"
              v-for="(item, index) in text.label?.split(';')"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div></el-col
      >
      <el-col :span="8"
        ><div class="right">
          <comment :replyList="replyList" :fcommentList="fcommentList" /></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import "@/assets/css/vue-quill.core.css";
import comment from "@/components/private/comment/comment.vue";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";
import {
  getTextById,
  getCommentById,
  getReplyById,
  getBasicUser,
} from "@/api/home";
import { changeSecondToTime } from "@/utils";
import Comment from "../components/private/comment/comment.vue";
export default {
  name: "textView",
  component: { comment },
  setup(props) {
    let route = useRoute();
    let bid = ref(0);
    let text = ref({});
    let user = ref({});
    let expireInfo = ref({});
    let fcommentList = ref([]);
    let replyList = ref([]);
    let start = async (bid) => {
      let res = await getTextById(bid);
      let res2 = await getBasicUser(res.data[0].uid);
      let res4 = await getCommentById(bid);
      let res5 = await getReplyById(bid);
      text.value = res.data[0];
      user.value = res2.data[0];
      fcommentList.value = res4.data;
      replyList.value = res5.data;
    };
    if (bid.value !== 0) {
      start(bid.value);
    }
    watchEffect(() => {
      bid.value = route.params.bid;
      //这里跳出路由也会监听到undefied导致报错
      if (bid.value) {
        start(bid.value);
      }
    });
    return {
      text,
      user,
      fcommentList,
      replyList,
      changeSecondToTime,
    };
  },
  components: { Comment },
};
</script>
<style scoped>
.text {
  background-color: #fff;
  height: 120vh;
  width: 100%;
}
.el-row {
  width: 100%;
  margin-top: 20px;
}

.tleft {
  margin-top: 20px;
  width: 100%;
}
.tleft p {
  display: block;
  width: 90%;
  margin: 10px auto;
  font-size: 18px;
}
.tleft .subinfo {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.uimg {
  width: 80px;
  margin-left: 20px;
}
.uimg img {
  max-width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
}
.nm {
  width: 100%;
  height: 100%;
}
.nm div:nth-child(1) {
  margin-top: 25px;
  font-size: 18px;
  font-weight: bold;
}
.nm div:nth-child(2) {
  font-size: 18px;
  margin-top: 10px;
}
.nm div:nth-child(2) span {
  margin-left: 20px;
  font-size: 13px;
}
.nm div:nth-child(2) span:nth-child(1) {
  font-size: 14px;
  margin-left: 0;
}

.tleft .bnm {
  width: auto;
  margin: 10px auto;
}
.tleft .bnm img {
  width: 100%;
  max-height: 450px;
}
.tleft .tcon {
  min-height: 0;
  width: 98%;
  margin: 10px auto;
  line-height: 30px;
  text-indent: 2em;
}
.tleft .tbn {
  width: 90%;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
}
.tleft .tbn span:nth-child(1) {
  font-size: 15px;
  margin-left: 0.2083rem;
  color: #ccc;
}
.tleft .tbn span.lv {
  text-align: center;
  min-width: 60px;
  font-size: 10px;
  margin-left: 20px;
  height: 30px;
  line-height: 30px;
  color: #1e80ff;
  background: rgba(30, 128, 255, 0.05);
  border: 1px solid rgba(30, 128, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
}
</style>

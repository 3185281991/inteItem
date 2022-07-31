<template>
  <div class="text" v-show="Object.keys(text).length !== 0">
    <div class="icon">
      <a href="#commo">
        <span class="iconfont icon-huifu"
          ><i>{{ text.comment }}</i></span
        ></a
      >
      <span
        class="iconfont icon-dianzan_kuai"
        :class="{ islauds: isLauds }"
        @click="clickLaud"
        ><i>{{ text.lauds }}</i></span
      >
      <span class="iconfont icon-icon-"
        ><i>{{ text.view }} </i></span
      >
      <span
        class="iconfont icon-shoucang"
        :class="{ islauds: islike }"
        @click="clickLike"
      ></span>
    </div>
    <main>
      <div class="tleft">
        <div class="bmx">
          <p class="tcv">{{ text.title }}</p>
          <div class="subinfo">
            <div class="uimg">
              <img
                :src="user.avatar"
                alt=""
                @click="$router.push(`/brief/${user.uid}`)"
              />
            </div>
            <div class="nm">
              <div>{{ text.username }}</div>
              <div>
                <span>{{ changeSecondToTime(text.time, 0) }}</span>
                <span>阅读 {{ text.view }}</span>
              </div>
            </div>
            <div class="zx" @click="addAcc">
              <span>+</span>
              <span>{{ isAccept == false ? "关注" : "已关注" }}</span>
            </div>
          </div>
          <div class="bnm">
            <img :src="text.img" alt="" />
          </div>
          <div class="tcon ql-editor" v-html="text.content"></div>

          <div class="tbn">
            <span>标签</span>
            <span
              class="lv"
              v-for="(item, index) in text.label?.split(';')"
              @click="$router.push(`/search/${item}`)"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
        <comment
          :myAvatar="myavatar"
          :replyList="replyList"
          :fcommentList="fcommentList"
          @addCom="addCom"
          @addReply="addRply"
        />
      </div>
      <div class="tright">
        <div class="simpleInfo">
          <div class="sbtop">
            <img
              :src="user.avatar"
              alt=""
              @click="$router.push(`/user/${user.uid}`)"
            />
            <span>{{ text.username }}</span>
          </div>
          <div class="sbtn">
            <div class="exitem">
              <span class="iconfont icon-dianzan"></span
              ><span>总点赞数 {{ expireInfo.allLauds }}</span>
            </div>

            <div class="exitem">
              <span class="iconfont icon-icon-"></span
              ><span>总阅读量 {{ expireInfo.allViews }}</span>
            </div>
            <div class="exitem">
              <span class="iconfont icon-chakantiezihuifu"> </span
              ><span>总浏览量 {{ expireInfo.allComments }}</span>
            </div>
          </div>
        </div>
        <div class="labelinfo" v-if="myuid">
          <ul>
            <li v-for="(key, value, index) in map" :key="index">
              <span>{{ value }}</span
              ><span @click="addtag(value, $event)"
                >{{ key ? "已收藏" : "收藏" }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import comment from "@/components/private/comment/comment.vue";

import {
  getTextById,
  getCommentById,
  getReplyById,
  addComment,
  addReply,
  addLauds,
  getLauds,
  blogInfoIncrement,
  addHot,
} from "@/api/blog";
import {
  getBasicUser,
  getExpireInfo,
  addAccept,
  getAccept,
  getLikeText,
  getLtag,
  addLikeText,
  addLtag,
  deleteLtag,
} from "@/api/user";

import { useRoute } from "vue-router";
import { ref, computed, onBeforeUnmount } from "vue";
import { changeSecondToTime } from "@/utils";

import { useStore } from "vuex";
export default {
  name: "textView",
  components: { comment },
  setup() {
    let route = useRoute();
    let store = useStore();

    let bid = ref("");
    bid.value = route.params.bid;

    let isLogin = computed(() => store.state.isLogin).value;
    let myuid = computed(() => store.state.uid).value;
    let myusername = computed(() => store.state.name).value;
    let myavatar = computed(() => store.state.avatar).value;

    let isLauds = ref(false);
    let isAccept = ref(false);
    let islike = ref(false);

    let text = ref({});
    let user = ref({});
    let expireInfo = ref({});

    let fcommentList = ref([]);
    let replyList = ref([]);
    let map = ref({});
    let tagJudge = async () => {
      let tags = text.value.label?.split(";");
      for (let i in tags) {
        let res = await getLtag(myuid, tags[i]).then();
        if (res.data.length == 0) {
          map.value[tags[i]] = false;
        } else {
          map.value[tags[i]] = true;
        }
      }
    };
    let start = async () => {
      let res = await getTextById(bid.value);
      let res2 = await getBasicUser(res.data[0].uid);
      let res3 = await getExpireInfo(res.data[0].uid);
      let res4 = await getCommentById(bid.value);
      let res5 = await getReplyById(bid.value);

      text.value = res.data[0];
      if (myuid) {
        tagJudge(text.value);
      }
      user.value = res2.data[0];
      expireInfo.value = res3.data[0];
      fcommentList.value = res4.data;
      replyList.value = res5.data;
      if (isLogin.value) {
        let res6 = await getAccept(user.value.uid, myuid);
        if (res6.data.length !== 0) {
          isAccept.value = true;
        }
      }
    };
    start();

    let addCom = async (ccontent) => {
      if (isLogin) {
        let uid = user.value.uid;
        let avatar = user.value.avatar;
        let username = user.value.username;
        let time = new Date().getTime();
        let res = await addComment(
          bid.value,
          uid,
          username,
          avatar,
          ccontent,
          time,
          myuid,
          myusername,
          myavatar
        );
        if (res.data.flag == 1) {
          let res1 = await getCommentById(bid.value);
          fcommentList.value = res1.data;
          let res2 = await blogInfoIncrement(3, bid.value);
          let res3 = await addHot(20, bid.value);
          if (res2.data.flag == 0 || res3.data.flag == 0) {
            console.error("服务器错误");
          }
        }
      } else {
        alert("请先登陆再来评论吧。");
      }
    };
    let addRply = async (obj) => {
      let fuid = obj.item.cuid;
      let favatar = obj.item.cavatar;
      let fusername = obj.item.cusername;
      let rcontent = obj.value;
      let ftime = obj.item.time;
      let time = new Date().getTime() / 1000;
      if (isLogin) {
        let res = await addReply(
          bid.value,
          fuid,
          fusername,
          favatar,
          ftime,
          rcontent,
          time,
          myuid,
          myusername,
          myavatar
        );
        if (res.data.flag == 1) {
          let res1 = await getReplyById(bid.value);
          replyList.value = res1.data;
          let res2 = await blogInfoIncrement(3, bid.value);
          let res3 = await addHot(20, bid.value);
          if (res2.data.flag == 0 || res3.data.flag == 0) {
            console.error("服务器错误");
          }
        }
      } else {
        alert("请先登陆再来评论吧。");
      }
    };
    let addAcc = async () => {
      if (isLogin) {
        if (!isAccept.value) {
          let time = new Date().getTime();
          let res = await addAccept(
            user.value.uid,
            user.value.username,
            user.value.avatar,
            myuid,
            myusername,
            myavatar,
            time
          );
          if (res.data.flag == 1) {
            isAccept.value = true;
            let res2 = await blogInfoIncrement(1, bid.value);
            let res3 = await addHot(30, bid.value);
            if (res2.data.flag == 0 || res3.data.flag == 0) {
              console.error("服务器错误");
            }
          }
        }
      } else {
        isAccept.value = !isAccept.value;
      }
    };
    let clickLike = async () => {
      if (isLogin) {
        if (!islike.value) {
          let time = new Date().getTime();
          let res = await addLikeText(myuid, bid.value, user.value.uid, time);
          if (res.data.flag == 1) {
            islike.value = true;
            let res2 = await blogInfoIncrement(1, bid.value);
            let res3 = await addHot(30, bid.value);
            if (res2.data.flag == 0 || res3.data.flag == 0) {
              console.error("服务器错误");
            }
          }
        }
      } else {
        islike.value = !islike.value;
      }
    };
    let clickLaud = async () => {
      if (isLogin) {
        if (!isLauds.value) {
          let res = await addLauds(bid.value, myuid, 1);
          if (res.data.flag == 1) {
            isLauds.value = true;
            let res2 = await blogInfoIncrement(1, bid.value);
            let res3 = await addHot(30, bid.value);
            if (res2.data.flag == 0 || res3.data.flag == 0) {
              console.error("服务器错误");
            }
          }
        }
      } else {
        isLauds.value = !isLauds.value;
      }
    };
    let judge = async () => {
      let res = await getLauds(bid.value, myuid);
      if (res.data.flag == 1) {
        isLauds.value = true;
      }
      let res1 = await getLikeText(myuid, bid.value);
      if (res1.data.length !== 0) {
        islike.value = true;
      }
    };

    let myTag = ref({});
    let addtag = async (tag, e) => {
      let tar = e.target.innerText;
      if (tar === "已收藏") {
        myTag.value[tag] = false;
        e.target.innerText = "收藏";
      } else {
        myTag.value[tag] = true;
        e.target.innerText = "已收藏";
      }
    };
    if (isLogin) {
      judge();
    }

    onBeforeUnmount(async () => {
      if (isLogin) {
        for (let i of Object.keys(map.value)) {
          if (map.value[i]) {
            if (Object.keys(myTag.value).includes(i) && !myTag.value[i]) {
              let res = await deleteLtag(myuid, i);
              if (res.data.flag == 0) {
                alert("取消失败");
              }
            }
          } else {
            if (Object.keys(myTag.value).includes(i) && myTag.value[i]) {
              let res = await addLtag(myuid, i);
              if (res.data.flag == 0) {
                alert("收藏失败");
              }
            }
          }
        }
      }
    });
    return {
      text,
      myuid,
      changeSecondToTime,
      user,
      myavatar,
      expireInfo,
      fcommentList,
      replyList,
      addCom,
      addRply,
      clickLaud,
      isLauds,
      addAcc,
      isAccept,
      clickLike,
      islike,
      addtag,
      tagJudge,
      map,
    };
  },
};
</script>
<style scoped>
.text {
  width: 100%;
  min-height: 150vh;
}
.icon {
  position: fixed;
  width: 0.4167rem;
  left: 1.0417rem;
  top: 0.4688rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon .iconfont {
  display: block;
  width: 0.3125rem;
  height: 0.3125rem;
  border-radius: 50%;
  font-size: 0.1563rem;
  background-color: #fff;
  color: #ccc;
  margin-top: 0.1042rem;
  cursor: pointer;
}
.icon .islauds {
  color: #1e80ff;
}
.icon i {
  position: relative;
  width: 0.4167rem;
  height: 0.4167rem;
  border-radius: 50%;
  background-color: #d8dbde;
  font-size: 0.0938rem;
  text-align: center;
  color: coral;
  right: -0.2604rem;
  top: -0.1042rem;
  user-select: none;
}
.icon .iconfont::before {
  position: absolute;
  margin-top: 14%;
  margin-left: 18%;
}
main {
  width: 65vw;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.tleft {
  width: 70%;
}
.tleft .bmx {
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 0.2083rem;
}
.tleft p {
  display: block;
  width: 95%;
  margin: 0.1042rem auto;
  font-size: 0.2083rem;
}
.tleft .subinfo {
  width: 4.5rem;
  height: 0.5208rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.uimg {
  width: 0.4167rem;
  margin-left: 0.1042rem;
}
.uimg img {
  max-width: 0.3125rem;
  height: 0.3125rem;
  border-radius: 50%;
  cursor: pointer;
}
.nm {
  width: 4.1667rem;
  height: 100%;
}
.nm div:nth-child(1) {
  margin-top: 0.1042rem;
  font-size: 0.099rem;
  font-weight: bold;
}
.nm div:nth-child(2) {
  font-size: 0.1042rem;
  margin-top: 0.0521rem;
}
.nm div:nth-child(2) span:nth-child(2) {
  margin-left: 0.1042rem;
}

.zx {
  width: 0.625rem;
  height: 0.2083rem;
  font-size: 14px;
  color: #1e80ff;
  background: rgba(30, 128, 255, 0.05);
  border: 1px solid rgba(30, 128, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  user-select: none;
}
.zx span {
  font-size: 0.1042rem;
}
.tleft .bnm {
  width: auto;
  margin: 10px auto;
}
.tleft .bnm img {
  width: 100%;
  max-height: 2.3438rem;
}
.tleft .tcon {
  min-height: 0.625rem;
  width: 98%;
  margin: 0.0521rem auto;
  line-height: 0.2083rem;
  text-indent: 2em;
}
.tleft .tbn {
  width: 100%;
  height: 0.3125rem;
  display: flex;
  align-items: center;
}
.tleft .tbn span:nth-child(1) {
  font-size: 0.1042rem;
  margin-left: 0.2083rem;
  color: #ccc;
}
.tleft .tbn span.lv {
  text-align: center;
  min-width: 0.3125rem;
  font-size: 0.0938rem;
  margin-left: 0.1042rem;
  height: 0.1563rem;
  line-height: 0.1563rem;
  color: #1e80ff;
  background: rgba(30, 128, 255, 0.05);
  border: 1px solid rgba(30, 128, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
}
.tright {
  top: 0.3646rem;
  width: 1.7708rem;
  right: 1.6667rem;
  overflow: hidden;
  position: fixed;
}
.simpleInfo {
  height: 1.4583rem;
  width: 100%;
  background-color: #fff;
}

.simpleInfo .sbtop {
  width: 80%;
  margin: 0.1042rem auto;
  display: flex;
  justify-content: flex-start;
  height: 0.4167rem;
}
.simpleInfo .sbtop img {
  max-width: 0.4167rem;
  height: 0.4167rem;
  border-radius: 50%;
}
.simpleInfo .sbtop span {
  font-size: 0.1042rem;
  line-height: 0.4167rem;
  margin-left: 0.1042rem;
}
.simpleInfo .sbtn {
  border-top: 2px solid #ccc;
  width: 95%;
  margin: 0 auto;
}
.simpleInfo .sbtn .exitem {
  width: 80%;
  margin: 0.026rem auto;
  height: 0.2083rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.simpleInfo .sbtn .exitem .iconfont {
  color: #1e80ff;
}
.simpleInfo .sbtn .exitem span:last-child {
  margin-left: 0.1042rem;
  font-size: 0.1042rem;
  height: 0.2083rem;
  line-height: 0.2083rem;
  word-spacing: 0.0521rem;
}
.labelinfo {
  margin-top: 0.1042rem;
  background-color: #fff;
  padding: 0.0781rem 0;
}
.labelinfo ul {
  width: 100%;
}
.labelinfo li {
  width: 100%;
  height: 0.1563rem;
  line-height: 0.1563rem;
  margin-top: 0.0521rem;
  display: flex;
  justify-content: space-between;
}
.labelinfo li span:nth-of-type(1) {
  font-size: 0.1302rem;
  font-weight: bold;
  text-align: center;
  margin-left: 0.1042rem;
  max-width: 0.625rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.labelinfo li span:nth-of-type(2) {
  cursor: pointer;
  display: inline-block;
  margin-right: 0.0521rem;
  width: 0.3646rem;
  font-size: 0.1094rem;
  height: 0.1563rem;
  line-height: 0.1563rem;
  background-color: dodgerblue;
  color: #fff;
  user-select: none;
  text-align: center;
}
</style>

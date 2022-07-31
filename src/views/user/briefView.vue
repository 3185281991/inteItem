<template>
  <div class="brief">
    <main>
      <div class="bleft">
        <div class="buif">
          <div class="buleft"><img :src="user.avatar" alt="" /></div>
          <div class="buright">
            <div class="title">
              {{ user.username }}
            </div>
            <p>
              {{
                user.introduce == ""
                  ? "此用户还未添加个性签名。"
                  : user.introduce
              }}
            </p>
            <span class="action" @click="jumpToChat" v-if="myuid != user.uid">
              私聊</span
            >
            <span class="action" @click="like" v-if="myuid != user.uid">{{
              isoperate ? "已关注" : "关注"
            }}</span>
          </div>
        </div>
        <div class="bum">
          <div class="bnav">
            <ul>
              <li
                v-for="(item, index) in nlist"
                :key="index"
                :class="{ active: activeindex == index }"
                @click="changeIndex(index)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="bcontent">
            <div v-show="activeindex == 0" @click="changeIndex(0)">
              <div v-if="blogList.length !== 0">
                <div v-for="(item, index) in blogList" :key="index">
                  <ItemInfo :item="item" />
                </div>
              </div>
              <div v-else class="disappear"><p>暂无信息</p></div>
            </div>
            <div v-show="activeindex == 1" @click="changeIndex(1)">
              <div v-if="acceptList.length !== 0">
                <div
                  class="baitem"
                  v-for="item in acceptList"
                  :key="item.cuid"
                  @click="$router.push(`/brief/${item.cuid}`)"
                >
                  <img :src="item.cavatar" alt="" />
                  <span class="aname">{{ item.cusername }}</span>
                  <span class="atime">{{
                    changeSecondToTime(item.time, 0)
                  }}</span>
                </div>
              </div>
              <div v-else class="disappear"><p>暂无信息</p></div>
            </div>
            <div v-show="activeindex == 2" @click="changeIndex(2)">
              <div v-if="acceptedList.length !== 0">
                <div
                  class="baitem"
                  v-for="itemx in acceptedList"
                  :key="itemx.uid"
                  @click="$router.push(`/brief/${itemx.uid}`)"
                >
                  <img
                    :src="itemx.avatar"
                    alt=""
                    @click="$router.push(`/brief/${itemx.uid}`)"
                  />
                  <span class="aname">{{ itemx.username }}</span>
                  <span class="atime">{{
                    changeSecondToTime(itemx.time, 0)
                  }}</span>
                </div>
              </div>
              <div v-else class="disappear"><p>暂无信息</p></div>
            </div>

            <div v-show="activeindex == 3" @click="changeIndex(3)">
              <div v-if="tag.length !== 0">
                <div class="bltag">
                  <i
                    v-for="(item, index) in tag"
                    :key="index"
                    @click="$router.push(`/search/${item}`)"
                    >{{ item.tag }}</i
                  >
                </div>
              </div>
              <div v-else class="disappear"><p>暂无信息</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bright">
        <div class="topinfo">
          <div><span>个人成就</span></div>
          <ul>
            <li>
              <span class="iconfont icon-icon"></span
              ><span>总点赞数 {{ expireInfo.allLauds }}</span>
            </li>
            <li>
              <span class="iconfont icon-icon"></span
              ><span>总阅览数 {{ expireInfo.allViews }}</span>
            </li>
            <li>
              <span class="iconfont icon-icon"></span
              ><span>总留言数 {{ expireInfo.allComments }}</span>
            </li>
            <li>
              <span class="iconfont icon-icon"></span
              ><span>热力值 {{ expireInfo.allHot }}</span>
            </li>
          </ul>
        </div>
        <div class="buttomInfo">
          <div class="blike">
            <div @click="changeIndex(1)">
              <span>关注了</span><span>{{ acceptList.length }}</span>
            </div>
            <div @click="changeIndex(2)">
              <span>关注者</span><span>{{ acceptedList.length }}</span>
            </div>
          </div>
          <div class="bother">
            <div @click="changeIndex(3)">
              <span>收藏标签</span><span>{{ tag.length }}</span>
            </div>
            <div>
              <span>加入于</span
              ><span>{{ changeSecondToTime(user.time) }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ItemInfo from "@/components/private/itemInfo/itemInfo.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watchEffect, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { throttle } from "@/utils/index";
import {
  addChatlog,
  getChatlog,
  createChat,
  updateShow,
  getChatList,
} from "@/api/chat";
import {
  getAllblog,
  getExpireInfo,
  getBasicUser,
  getLtag,
  getisAccepted,
  getAccept,
  addAccept,
  deleteAccept,
} from "@/api/user";
import { changeSecondToTime } from "@/utils/index";
import router from "@/router";
export default {
  name: "briefView",
  components: { ItemInfo },
  setup() {
    const { eventHub } = getCurrentInstance().proxy;
    let route = useRoute();
    let router = useRouter();
    let store = useStore();
    let uid = ref("");
    let nlist = ["帖子", "关注", "粉丝", "收藏标签"];

    let isLogin = computed(() => store.state.isLogin).value;
    let myuid = computed(() => store.state.uid).value;
    let myusername = computed(() => store.state.name).value;
    let myavatar = computed(() => store.state.avatar).value;

    let activeindex = ref(0);
    let isAccept = ref(false);
    let isoperate = ref(false);

    let blogList = ref([]);
    let expireInfo = ref([]);
    let user = ref([]);
    let tag = ref([]);
    let acceptList = ref([]);
    let acceptedList = ref([]);

    let changeIndex = (index) => {
      activeindex.value = index;
    };

    let start = async (uid) => {
      let res1 = await getAllblog(uid);
      blogList.value = res1.data;

      let res2 = await getBasicUser(uid);
      user.value = res2.data[0];
      let res3 = await getExpireInfo(uid);
      expireInfo.value = res3.data[0];

      let res4 = await getLtag(uid);
      tag.value = res4.data;
      let res5 = await getAccept(uid);
      acceptList.value = res5.data;
      let res6 = await getisAccepted(uid);
      acceptedList.value = res6.data;

      if (isLogin) {
        let res7 = await getAccept(uid, myuid);
        if (res7.data.length !== 0) {
          isAccept.value = true;
          isoperate.value = true;
        }
      }
    };
    watchEffect(() => {
      uid.value = route.params.uid;
      if (uid.value) {
        start(uid.value);
      }
    });
    let accpetOpe = throttle(async () => {
      if (isLogin) {
        if (!isAccept.value && isoperate.value) {
          let time = new Date().getTime();
          // 它添加粉丝，我添加关注
          let res0 = await addAccept(
            myuid,
            myusername,
            myavatar,
            user.value.uid,
            user.value.username,
            user.value.avatar,
            time
          );
          let res = await addAccept(
            user.value.uid,
            user.value.username,
            user.value.avatar,
            myuid,
            myusername,
            myavatar,
            time
          );
          isAccept.value = true;
          if (res.data.flag == 1 && res0.data == 1) {
            let res2 = await blogInfoIncrement(1, user.value.uid);
            let res3 = await addHot(30, user.value.uid);
            if (res2.data.flag == 0 || res3.data.flag == 0) {
              console.error("服务器内部错误");
            }
          }
        }
        if (isAccept.value && !isoperate.value) {
          //取消关注
          let res = await deleteAccept(myuid, user.value.uid);
          isAccept.value = false;
          let res1 = await deleteAccept(user.value.uid, myuid);
          if (res.data.flag == 0 || res1.data.flag == 0) {
            console.error("服务器内部错误");
          }
        }
      }
    }, 2000);
    let like = async () => {
      isoperate.value = !isoperate.value;
      accpetOpe();
    };
    let jumpToChat = async () => {
      if (isLogin) {
        //不能是自己
        if (myuid != user.value.uid) {
          //先查看是否存在在聊天记录,这里要同时增加两条聊天记录，分别为自身
          let res0 = await getChatlog(myuid, user.value.uid);
          if (res0.data.length == 0) {
            let res1 = await addChatlog(
              myuid,
              user.value.uid,
              user.value.username,
              user.value.avatar,
              1,
              Date.now()
            );
            let res2 = await addChatlog(
              user.value.uid,
              myuid,
              myusername,
              myavatar,
              1,
              Date.now()
            );

            if (res1.data.flag == 1 && res2.data.flag == 1) {
              eventHub.$emit("addLog", {
                ruid: user.value.uid,
                rname: user.value.username,
                ravatar: user.value.avatar,
                isShow: 1,
                uid: myuid,
              });
              store.commit("addLog", { uid: user.value.uid });
              try {
                await createChat(myuid, user.value.uid);
              } catch (err) {
                console.log(err);
              }
              router.push(`/user/message`);
            } else {
              alert("服务器出错了");
            }
          } else {
            //如果存在，需要事件发送当前这个用户的uid
            if (res0.data[0].isshow == 0) {
              await updateShow(myuid, user.value.uid, 1);
              let rs = {};
              let res = await getChatList(myuid, user.value.uid);
              if (res.data.length != 0) {
                rs[user.value.uid] = concatChatInfo(res.data[0].info);
              } else {
                let res2 = await getChatList(user.value.uid, myuid);
                if (res2.data[0]) {
                  rs[user.value.uid] = concatChatInfo(res2.data[0].info);
                }
              }
              store.commit("addChat", rs);
            } else {
              store.commit("addLog", { uid: user.value.uid });
            }
            eventHub.$emit("addLog", {
              ruid: user.value.uid,
              rname: user.value.username,
              ravatar: user.value.avatar,
              isShow: 1,
              uid: myuid,
            });
            eventHub.$emit("jumpTochat", user.value.uid);
            router.push(`/user/message`);
          }
        }
      } else {
        router.push("/login");
      }
    };

    return {
      myuid,
      nlist,
      activeindex,
      blogList,
      changeIndex,
      user,
      expireInfo,
      changeSecondToTime,
      tag,
      acceptList,
      acceptedList,
      isoperate,
      like,
      jumpToChat,
    };
  },
};
</script>
<style scoped lang="scss">
.brief {
  width: 100%;
  min-height: 120vh;
}
main {
  width: 60vw;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.bleft {
  width: 72%;
  .buif {
    width: 100%;
    height: 1.0417rem;
    background-color: #fff;
    .buleft {
      width: 20%;
      height: 100%;
      float: left;
      img {
        display: block;
        position: relative;
        left: 0;
        right: 0;
        top: 0.1042rem;
        bottom: 0;
        margin: auto;
        max-width: 0.625rem;
        height: 0.625rem;
        border-radius: 50%;
      }
      img:hover {
        transform: rotate(666turn);
        transition: all 59s cubic-bezier(0.34, 0, 0.84, 1) 1s;
        cursor: pointer;
      }
    }
    .buright {
      float: right;
      width: 80%;
      height: 100%;
      position: relative;
      color: #72777b;
      .title {
        width: 100%;
        margin-top: 0.1302rem;
        padding-left: 0.026rem;
        height: 0.2083rem;
        line-height: 0.2083rem;
        font-size: 0.1042rem;
      }

      p {
        display: -webkit-box;
        margin-top: 0.0521rem;
        padding: 0.026rem 0.026rem;
        height: 0.5208rem;
        width: 95%;
        font-size: 0.099rem;
        line-height: 0.1771rem;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .action {
        position: absolute;

        cursor: pointer;
        width: 0.5208rem;
        height: 0.2083rem;
        line-height: 0.2083rem;
        background-color: dodgerblue;
        color: #fff;
        text-align: center;
        user-select: none;
        font-size: 0.1042rem;
      }
      .action:nth-of-type(1) {
        top: 0.1302rem;
        right: 0.9375rem;
      }
      .action:nth-of-type(2) {
        top: 0.1302rem;
        right: 0.2083rem;
      }
    }
  }
  .bum {
    width: 100%;
    margin-top: 0.1042rem;
    background-color: #fff;
    min-height: 2.3438rem;
    .bnav {
      width: 100%;
      height: 0.2083rem;
      border-bottom: 2px solid #ccc;
      ul {
        height: 100%;
        width: 100%;
        li {
          float: left;
          height: 0.2083rem;
          line-height: 0.2083rem;
          width: 0.4688rem;
          font-size: 0.1042rem;
          text-align: center;
          cursor: pointer;
        }
        .active {
          border-bottom: 3px solid dodgerblue;
        }
      }
    }
    .bcontent {
      .baitem {
        width: 95%;
        margin: 0.0781rem auto;
        display: flex;
        align-items: center;
        height: 0.4167rem;
        cursor: pointer;

        img {
          max-width: 0.4167rem;
          height: 0.4167rem;
          border-radius: 50%;
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
      .bltag {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-flow: wrap;
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
          cursor: pointer;
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
    }
  }
}
.bright {
  position: fixed;
  right: 1.9271rem;
  height: 3.3854rem;
  width: 1.5625rem;
  top: 0.4688rem;
  .topinfo {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    div {
      margin-top: 0.0521rem;
      width: 100%;
      border-bottom: 2px solid#ccc;
      span {
        height: 0.3125rem;
        line-height: 0.3125rem;
        font-size: 0.1042rem;
        font-weight: bold;
        margin-left: 0.1042rem;
      }
    }
    ul {
      width: 100%;
      margin-top: 0.0521rem;
      padding-bottom: 0.2083rem;
      li {
        margin-top: 0.1042rem;
        height: 0.2083rem;
        line-height: 0.2083rem;
        font-size: 0.1042rem;
        display: flex;
        justify-content: flex-start;
        span {
          height: 0.2083rem;
          line-height: 0.2083rem;
        }
        .iconfont {
          font-size: 0.1823rem;
          display: table-cell;
          vertical-align: middle;
          text-align: center;
          margin-left: 0.1563rem;
          background-color: dodgerblue;
          border-radius: 50%;
        }
        span:last-child {
          padding-left: 0.0521rem;
          font-size: 0.099rem;
          margin-left: 0.0521rem;
        }
      }
    }
  }
  .buttomInfo {
    width: 100%;
    margin-top: 0.1042rem;
    height: 0.9375rem;
    .blike {
      background-color: #fff;
      display: flex;
      div {
        width: 50%;
        height: 0.625rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        span {
          height: 0.2083rem;
          line-height: 0.2083rem;
        }
        span:nth-child(1) {
          font-size: 0.1094rem;
          font-weight: bold;
        }
        span:last-child {
          display: inline-block;
          width: 100%;
          font-size: 0.099rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
        }
      }
    }
    .bother {
      background-color: transparent;
      overflow: hidden;
      div {
        margin-top: 0.1563rem;
        height: 0.2083rem;
        padding: 0 0.0521rem;
        span {
          font-size: 0.0938rem;
        }
        span:nth-child(1) {
          float: left;
        }
        span:nth-child(2) {
          float: right;
        }
      }
      div:nth-of-type(1) {
        cursor: pointer;
      }
    }
  }
}
</style>

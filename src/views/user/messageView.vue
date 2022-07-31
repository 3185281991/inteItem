<template>
  <div class="message">
    <div class="ileft">
      <ul v-if="chatObj.length !== 0">
        <li
          v-for="(item, index) in chatObj"
          :key="item.ruid"
          :class="{ active: activeIndex == index }"
        >
          <img
            @click="choose(index)"
            :src="item.ravatar"
            alt=""
            class="imguser"
          /><span>{{ item.rname }}</span>
          <i
            class="chatClose"
            @click="closeChat(index, item.ruid)"
            v-show="
              activeIndex == index && !item.ruid.toString().startsWith('2001')
            "
            >关闭</i
          >
        </li>
      </ul>
    </div>
    <div class="iright">
      <div class="topname">{{ activeName }}</div>
      <!-- 根据左侧人数渲染出对应的聊天记录 -->
      <ul
        v-for="(item, key) in rsinfo"
        :key="key"
        v-show="key == chatObj[activeIndex]?.ruid"
        ref="ulcontent"
      >
        <li v-for="infoList in item" :key="infoList.time">
          <img
            :src="
              infoList.uid == myuid ? myavatar : chatObj[activeIndex]?.ravatar
            "
            alt=""
            @click="$router.push(`/brief/${infoList.uid}`)"
            :class="infoList.uid == myuid ? 'imgr' : 'imgl'"
          /><span :class="infoList.uid == myuid ? 'textr' : 'textl'">{{
            infoList.info
          }}</span>
        </li>
      </ul>
      <div class="setinfo">
        <input
          class="info"
          type="text"
          name=""
          placeholder="请输入信息"
          id=""
          v-model="info"
          @change.enter="send"
        />
        <span @click="send">发送</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "@vue/runtime-core";
import { getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { concatChatInfo } from "@/utils/index";
import { getChatList, getChatlog, updateShow } from "@/api/chat";

let info = ref("");
//socket实例
let socket = getCurrentInstance().appContext.config.globalProperties.socket;
const { eventHub } = getCurrentInstance().proxy;
let store = useStore();
let myuid = computed(() => store.state.uid).value;
let myavatar = computed(() => store.state.avatar).value;
let isgetInfo = computed(() => store.state.isgetInfo);
//聊天信息
let rsinfo = computed(() => store.state.chatList);
//左侧聊天人物列表
let chatObj = ref([]);

//ul实例元素
let ulcontent = ref(null);
let activeIndex = ref(0);
let activeName = ref("");

//监听是否获取到了新的数据，进行滚动
watch(
  () => isgetInfo.value,
  (newvalue, oldValue) => {
    if (newvalue) {
      cScroll();
      store.state.isgetInfo = false;
    }
  }
);

let choose = (index) => {
  activeIndex.value = index;
  activeName.value = chatObj.value[index]?.rname;
  cScroll();
};
let send = () => {
  if (info.value != "") {
    //开始发送信息,左边为接受者，flag=0，右边为发送者，falg=1，
    let content = {
      uid: myuid,
      ruid: chatObj.value[activeIndex.value].ruid,
      info: info.value,
      time: Date.now(),
    };
    socket.io.emit("send", content);
    info.value = "";
    store.commit("addMyInfo", content);
  }
};
let cScroll = () => {
  setTimeout(() => {
    try {
      let actvieul = ulcontent.value[activeIndex.value];
      let ulHeight = actvieul.scrollHeight;
      if (ulHeight > 500) {
        actvieul.scrollTo({ top: ulHeight + 80, behavior: "smooth" });
      }
    } catch (err) {}
  }, 50);
};
let start = async () => {
  let res1 = await getChatlog(myuid, 0, 1);
  chatObj.value = res1.data;
  activeName.value = chatObj.value[0]?.rname;
  let rs = {};
  for (let i = 0; i < res1.data.length; i++) {
    let ruid = res1.data[i].ruid;
    //由于数据库知识单独存了发送双方的共同信息，所以初始数据如果不存在
    //，需要交换一下双方id位置，
    let res = await getChatList(myuid, ruid);
    if (res.data.length != 0) {
      rs[ruid] = concatChatInfo(res.data[0].info);
    } else {
      let res2 = await getChatList(ruid, myuid);
      if (res2.data[0]) {
        rs[ruid] = concatChatInfo(res2.data[0].info);
      }
    }
  }
  store.commit("getchatlist", rs);
};
let closeChat = async (index, ruid) => {
  if (index != 0) {
    activeIndex.value = index - 1;
    activeName.value = chatObj.value[activeIndex.value]?.rname;
  }
  chatObj.value.splice(index, 1);
  store.commit("deleteChat", ruid);
  let data = await updateShow(myuid, ruid, 0);
  if (data.data.flag == 0) {
    alert("服务器出错了");
  }
};
if (myuid) {
  socket.io.connect();
  socket.io.emit("login", myuid);
  start();
}
onMounted(() => {
  eventHub.$on("addLog", (chat) => {
    chatObj.value.unshift(chat);
    activeIndex.value = 0;
    activeName.value = chatObj.value[0]?.rname;
  });
  eventHub.$on("jumpTochat", (uid) => {
    let index = chatObj.value.findIndex((item) => item.ruid == uid);
    activeIndex.value = index;
    activeName.value = chatObj.value[index]?.rname;
  });
  cScroll();
});
</script>
<style scoped lang="scss">
.message {
  width: 100%;
  height: 3.6458rem;
  display: flex;
  background: url("@/assets/img/login.jpg") no-repeat;
  background-size: cover;

  .ileft {
    width: 25%;
    height: 3.6458rem;
    overflow-y: scroll;
    background-color: rgba(255, 255, 255, 0.5);
    ul {
      width: 100%;
      margin-top: 0.0521rem;
      height: 3.5417rem;
      padding-bottom: 0.0521rem;
      overflow-y: scroll;
      li {
        width: 100%;
        height: 0.3125rem;
        display: flex;
        align-items: center;
        margin-top: 0.026rem;
        cursor: pointer;
        .imguser {
          max-width: 0.3125rem;
          height: 0.3125rem;
          border-radius: 50%;
        }
        span {
          font-size: 0.0885rem;
          margin-left: 0.0521rem;
          display: inline-block;
          width: 0.5208rem;
          height: 0.1563rem;
          line-height: 0.1563rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .chatClose {
          width: 40px;
          font-size: 13px;
          margin-right: 2px;
        }
      }
    }
  }
  .iright {
    width: 74%;
    height: 3.6458rem;
    position: relative;
    .topname {
      width: 100%;
      height: 0.2083rem;
      line-height: 0.2083rem;
      text-align: center;
      font-size: 0.1042rem;
      border-bottom: 2px solid #ccc;
      border-top: 2px solid #ccc;
    }
    ul {
      width: 100%;
      height: 2.8125rem;
      padding-bottom: 0.2604rem;
      overflow-y: scroll;

      li {
        position: relative;
        min-height: 0.4167rem;
        width: 100%;
        margin-top: 0.1042rem;
        img {
          max-width: 0.3125rem;
          height: 0.3125rem;
          border-radius: 50%;
          user-select: none;
        }
        span {
          font-size: 0.0938rem;
          display: inline-block;
          max-width: 1.4583rem;
          line-height: 0.1563rem;
          margin-left: 0.1042rem;
          word-break: break-all;
        }
      }
    }
    .setinfo {
      width: 100%;
      height: 0.3125rem;
      position: absolute;
      bottom: 0;
      input {
        position: absolute;
        width: 1.8229rem;
        height: 0.1563rem;
        line-height: 0.1563rem;
        top: 0.0781rem;
        left: 0.5208rem;
        padding-left: 0.026rem;
        background-color: #ccc;
      }
      input:focus {
        border: 1px solid dodgerblue;
        background-color: #fff;
      }
      span {
        position: absolute;
        display: inline-block;
        right: 0.7813rem;
        top: 0.0781rem;
        height: 0.1563rem;
        line-height: 0.1563rem;
        padding: 0 0.0781rem;
        background-color: dodgerblue;
        color: #fff;
        transition: 0.3s all;
        user-select: none;
        cursor: pointer;
      }
    }
  }
}

//侧边滚动条设置
::-webkit-scrollbar {
  //滚动条的基本设置.宽度是竖垂直方向宽度
  width: 8px;
}
//滚动条滚动部分样式
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ccffcc;
  box-shadow: none;
}

.imgl {
  position: absolute;
  top: 0.0521rem;
  left: 0.1042rem;
}
.textl {
  position: absolute;
  top: 0.1302rem;
  left: 0.4167rem;
}
.imgr {
  position: absolute;
  top: 0.0521rem;
  right: 0.0521rem;
}
.textr {
  position: absolute;
  top: 0.1302rem;
  right: 0.4427rem;
}
.active {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

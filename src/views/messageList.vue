<template>
  <div class="message">
    <el-row>
      <el-col :span="4" :offset="3">
        <div class="ileft">
          <ul v-if="chatObj.length !== 0">
            <li
              v-for="(item, index) in chatObj"
              :key="item.ruid"
              :class="{ active: activeIndex == index }"
            >
              <img
                :src="item.ravatar"
                alt=""
                class="imguser"
                @click="choose(index)"
              /><span>{{ item.rname }}</span>
              <i
                class="chatClose"
                @click="closeChat(index, item.ruid)"
                v-show="activeIndex == index"
                >关闭</i
              >
            </li>
          </ul>
        </div></el-col
      >
      <el-col :span="14">
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
                  infoList.uid == myuid
                    ? myavatar
                    : chatObj[activeIndex]?.ravatar
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
            <el-input
              v-model="info"
              @change.enter="send"
              placeholder="请输入聊天信息"
              clearable
            />

            <el-button type="primary" @click="send">发送</el-button>
          </div>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { concatChatInfo } from "@/utils/index";
import { getChatList, getChatlog, updateShow } from "@/api/home";
import { ElMessage } from "element-plus";

let info = ref("");
//socket实例
let socket = getCurrentInstance().appContext.config.globalProperties.socket;
const { eventHub } = getCurrentInstance().proxy;
let store = useStore();
let myuid = computed(() => store.state.uid).value;
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
  activeName.value = chatObj.value[index].rname;
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
    } catch (err) {
      console.log(err);
    }
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
if (myuid) {
  socket.io.connect();
  socket.io.emit("login", myuid);
  start();
}
let closeChat = async (index, ruid) => {
  if (index != 0) {
    activeIndex.value = index - 1;
    activeName.value = chatObj.value[activeIndex.value]?.rname;
  }
  chatObj.value.splice(index, 1);
  store.commit("deleteChat", ruid);
  let data = await updateShow(myuid, ruid, 0);
  if (data.data.flag == 0) {
    ElMessage({
      type: "error",
      message: "服务器出错了",
    });
  }
};
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
//向服务器发送我的身份
</script>
<style scoped lang="scss">
.el-row {
  width: 100%;
}
.message {
  width: 100%;
  height: 700px;
  display: flex;

  .ileft {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background-color: rgba(255, 255, 255, 0.5);
    ul {
      width: 100%;
      margin-top: 10px;
      height: 680px;
      padding-bottom: 10px;
      overflow-y: scroll;
      li {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        margin-top: 5px;
        cursor: pointer;
        .imguser {
          max-width: 50px;
          min-width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-left: 5px;
        }
        span {
          font-size: 16px;
          margin-left: 10px;
          display: inline-block;
          width: 100px;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .chatClose {
          width: 40px;
          font-size: 14px;
          margin-right: 10px;
        }
      }
    }
  }
  .iright {
    width: 100%;
    height: 700px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.5);
    .topname {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      border-bottom: 2px solid #ccc;
      border-top: 2px solid #ccc;
    }
    ul {
      width: 100%;
      height: 500px;
      padding-bottom: 50px;
      overflow-y: scroll;
      li {
        position: relative;
        min-height: 80px;
        width: 100%;
        margin-top: 20px;
        img {
          max-width: 60px;
          min-width: 60px;
          height: 60px;
          border-radius: 50%;
          user-select: none;
        }
        span {
          font-size: 17px;
          display: inline-block;
          max-width: 280px;
          line-height: 30px;
          margin-left: 20px;
          word-break: break-all;
        }
      }
    }
    .setinfo {
      border-top: 2px solid #ccc;
      width: 100%;
      height: 100px;
      position: absolute;
      bottom: 0;
      .el-input {
        width: 350px;
        margin-left: 160px;
        margin-top: 30px;
      }
      .el-button {
        margin-left: 40px;
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
  top: 10px;
  left: 20px;
}
.textl {
  position: absolute;
  top: 25px;
  left: 80px;
}
.imgr {
  position: absolute;
  top: 10px;
  right: 10px;
}
.textr {
  position: absolute;
  top: 25px;
  right: 85px;
}
.active {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

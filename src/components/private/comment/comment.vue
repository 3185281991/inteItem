<template>
  <div class="tcom" id="commo">
    <div class="tctop">
      <div class="tcti">评论</div>
      <div class="tm">
        <img :src="myAvatar" alt="" />
        <div class="cinfo">
          <textarea
            name=""
            id=""
            placeholder="发表评论"
            v-model="commentContent"
          ></textarea>
          <div class="xxz">
            <span>Ctrl Enter</span
            ><span class="zbtn" @click="eimtAddCom">发表评论</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tcbt">
      <div class="tcti">
        全部评论 {{ fcommentList.length + replyList.length }}
      </div>
      <div
        class="citem"
        v-show="true"
        v-for="(item, index) in fcommentList"
        :key="item.cuid"
      >
        <img :src="item.cavatar" alt="" />
        <div class="itr">
          <div class="ittip">
            <span>{{ item.cusername }}</span
            ><span>1月前</span>
          </div>
          <div class="fcon">
            <span>{{ item.ccontent }}</span
            ><span class="zbtn" @click="changeIndex(index)">回复</span>
          </div>
          <div class="rcom">
            <div v-show="activeIndex == index && isShow == true" class="rmain">
              <textarea
                name=""
                id=""
                :placeholder="'回复' + item.cusername"
                v-model="replyContent"
              ></textarea>
              <div class="xxz">
                <span>Ctrl Enter</span
                ><span class="zbtn" @click="emitAddRly(item)">发布</span>
              </div>
            </div>
            <div
              class="reply"
              v-for="ritem in getConcreteReplys(
                replyList,
                item.cuid,
                item.time
              )"
              :key="ritem.time"
            >
              <img class="rimg" :src="ritem.ravatar" alt="" />
              <div class="ruser">
                <div class="ittip">
                  <span>{{ ritem.rusername }}</span
                  ><span>5月前</span>
                </div>
                <p>{{ ritem.rcontent }}</p>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "comment",
  props: {
    myAvatar: {
      type: String,
      default: "",
    },
    fcommentList: {
      type: Array,
      default: [],
    },
    replyList: {
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    let activeIndex = ref(-1);
    let isShow = ref(false);
    let getConcreteReplys = (arr, cuid, time) => {
      let data = [];
      arr.forEach((item) => {
        return item.fuid == cuid && item.ftime == time ? data.push(item) : "";
      });
      return data;
    };
    let commentContent = ref("");
    let replyContent = ref("");
    let changeIndex = (index) => {
      activeIndex.value = index;
      isShow.value = !isShow.value;
    };
    let eimtAddCom = () => {
      if (commentContent.value != "") {
        context.emit("addCom", commentContent.value);
        commentContent.value = "";
      }
    };
    let emitAddRly = (item) => {
      if (replyContent.value != "") {
        let value = replyContent.value;
        context.emit("addReply", { item, value });
        replyContent.value = "";
      }
    };
    return {
      isShow,
      activeIndex,
      commentContent,
      replyContent,
      changeIndex,
      getConcreteReplys,
      eimtAddCom,
      emitAddRly,
    };
  },
};
</script>
<style scoped lang="scss">
.tcom {
  background-color: #fff;
  padding-bottom: 0.2083rem;
}
.tctop {
  width: 4.5833rem;
  margin: 0 auto;
  min-height: 1.1979rem;
  overflow: hidden;
  .tm {
    display: flex;
    margin-top: 0.3125rem;
    .cinfo {
      width: 80%;
      min-height: 0.4167rem;
      margin-left: 0.0521rem;
      margin-top: -0.1302rem;
    }
  }
}
.xxz {
  margin-top: 0.026rem;
  float: right;
  span:first-child {
    font-size: 0.0938rem;
    color: #ccc;
    margin-right: 0.0521rem;
  }
}
.zbtn {
  display: inline-block;
  font-size: 0.099rem;
  background-color: #1d7dfa;
  color: #fff;
  padding: 0.026rem;
  cursor: pointer;
  width: 0.5208rem;
  text-align: center;
  line-height: 0.1042rem;
  height: 0.1042rem;
}
textarea {
  width: 100%;
  background-color: #e4e6eb;
  margin-bottom: 0.0521rem;
  padding: 0.0417rem 0.0625rem;
  color: #252933;
  outline: none;
  min-height: 0.3125rem;
  box-sizing: border-box;
  line-height: 0.1563rem;
  font-size: 0.0938rem;
  resize: vertical;
  overflow: hidden;
}
textarea:focus {
  border: 2px solid #00a4ff;
  background-color: #fff;
}
img {
  max-width: 0.3646rem;
  height: 0.3646rem;
  display: block;
  margin-left: 0.2083rem;
  margin-top: -0.1042rem;
  border-radius: 50%;
}
.tcti {
  height: 0.2083rem;
  line-height: 0.2083rem;
  font-size: 0.1302rem;
  padding-left: 0.2083rem;
  font-weight: bold;
  margin-top: 0.0521rem;
}
.ittip {
  width: 100%;
  margin-top: -0.1042rem;
  display: flex;
  justify-content: space-between;
  span {
    font-size: 0.1042rem;
  }
  span:first-child {
    display: block;
    width: 0.7813rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span:last-child {
    margin-right: 0.1042rem;
  }
}
.tcbt {
  width: 4.5833rem;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;
  .citem {
    width: 100%;
    margin-top: 0.2604rem;
    display: flex;

    .itr {
      min-height: 0.4167rem;
      margin-left: 0.1042rem;
      padding-bottom: 0.2083rem;

      .fcon {
        width: 3.6198rem;
        height: 0.2083rem;
        line-height: 0.2083rem;
        display: flex;
        justify-content: space-between;
        margin-top: 0.0521rem;
        span {
          font-size: 0.0938rem;
        }
      }
      .rcom {
        position: relative;
        top: 0.2083rem;
        width: 3.6198rem;
        .rmain {
          width: 100%;
          position: relative;
          margin-bottom: 0.026rem;
          .xxz {
            margin-top: -0.0521rem;
          }
        }
        .reply {
          width: 100%;
          margin: 0 auto;
          min-height: 0.4167rem;
          display: flex;
          background: rgba(247, 248, 250, 0.7);
          img {
            max-width: 0.2604rem;
            height: 0.2604rem;
            border-radius: 50%;
            margin-top: 0.0521rem;
            margin-left: 0.0521rem;
          }
          .ruser {
            width: 100%;
            margin-top: 0.0521rem;
            margin-left: 0.0521rem;
            .ittip {
              margin-top: 0;
              width: 100%;
              span:first-child {
                font-size: 0.0833rem;
              }
            }
            p {
              width: 100%;
              font-size: 0.0938rem;
            }
          }
        }
      }
    }
  }
}
</style>

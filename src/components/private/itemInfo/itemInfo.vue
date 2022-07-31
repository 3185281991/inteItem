<template>
  <div class="item">
    <div class="itop">
      <span class="ituser" @click="$router.push(`/brief/${item.uid}`)">{{
        item.username
      }}</span
      ><span
        class="label"
        v-for="(itemx, index) in (item.label || '').split(';')"
        @click="$router.push(`/search/${itemx}`)"
        :key="index"
        >{{ itemx }}</span
      >
      <span class="time">{{ changeSecondToTime(item.time) }}</span>
    </div>
    <div class="ibotn" @click="$router.push(`/text/${item.bid}`)">
      <div class="zleft" href="">
        <div class="title">
          {{ item.title }}
        </div>
        <a class="content">
          {{ deleteReg(item.content) }}
        </a>
        <div class="iconlist">
          <span class="iconfont icon-icon-">{{ item.view }}</span
          ><span class="iconfont icon-dianzan">{{ item.ladus }}</span
          ><span class="iconfont icon-chakantiezihuifu">{{
            item.comment
          }}</span>
        </div>
      </div>
      <div class="zright">
        <img :src="item.img" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { changeSecondToTime } from "@/utils/index";
export default {
  name: "itemInfo",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup() {
    let deleteReg = (str) => {
      //将html文本中的所有<>标签全部替换掉
      let rs = str.replace(/(<[^>]+>)/g, "");
      return rs;
    };
    return { changeSecondToTime, deleteReg };
  },
};
</script>
<style scoped lang="scss">
.item {
  border-top: 3px solid #f5f5f7;
  width: 100%;
  text-indent: 0.1042rem;
  .itop {
    width: 100%;
    height: 0.2083rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      font-size: 0.0938rem;
      line-height: 0.2083rem;
      cursor: pointer;
    }
    .label {
      margin-left: 0.0521rem;
    }
    .time {
      margin-left: 0.1042rem;
    }
    .ituser:hover,
    .label:hover {
      color: coral;
    }
  }
  .ibotn {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  .zleft {
    width: 3.2292rem;
    .title {
      width: 100%;
      height: 0.2083rem;
      line-height: 0.2083rem;
      font-size: 0.1042rem;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .content {
      display: block;
      width: 100%;
      height: 0.2083rem;
      line-height: 0.2083rem;
      font-size: 0.0885rem;
      color: #ccc;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .iconlist {
      height: 0.2083rem;
      line-height: 0.2083rem;
      span {
        font-size: 0.0938rem;
      }
      span:nth-child(2),
      span:nth-child(3) {
        margin-left: 0.1042rem;
      }
      .iconfont:before {
        padding-right: 0.0521rem;
      }
    }
  }
  .zright {
    width: 0.8333rem;
    height: 0.5208rem;
    margin-right: 0.1823rem;
  }
  img {
    float: left;
    max-width: 100%;
    height: 100%;
  }
}
.item:hover {
  background-color: #f1f1f1;
}
</style>

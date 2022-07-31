<template>
  <div class="card" v-if="Object.keys(data).length !== 0">
    <div class="catop">
      <span>{{ all.title }}</span
      ><span>{{ all.subtitle }}</span>
    </div>
    <ul class="concard">
      <li v-for="(item, index) in all.data" :key="item.title">
        <span
          class="icon"
          :class="{ icon1: index == 0, icon2: index == 1, icon3: index == 2 }"
          >{{ index + 1 }}</span
        >
        <a :href="item.url" target="_blank">{{ item.title }}</a>
        <span class="hot">{{ item.hot }}</span>
      </li>
    </ul>
    <span class="iconfont icon-shuaxin" @click="refresh(name)"></span>
  </div>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { getPtHot } from "@/api/external.js";
export default {
  name: "newCard",
  props: {
    data: {
      type: Object,
      default: {},
    },
    name: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    let info = ref({});
    info.value = props.data;
    let refresh = async (name) => {
      let data = await getPtHot(name);
      info.value = data.data;
    };
    let all = computed(() => {
      return info.value;
    });
    return { all, refresh };
  },
};
</script>
<style scoped lang="scss">
.card {
  margin-top: 0.1042rem;
  width: 2.3438rem;
  height: 1.8229rem;
  background-color: #fff;
  border-radius: 0.0521rem;
  margin-left: 0.2604rem;

  .catop {
    height: 0.2083rem;
    width: 100%;
    span:nth-child(1) {
      float: left;
      margin-left: 0.1042rem;
      font-size: 0.1042rem;
      line-height: 0.2083rem;
    }
    span:nth-child(2) {
      font-size: 0.0833rem;
      float: right;
      margin-right: 0.1302rem;
      line-height: 0.2083rem;
    }
  }
  ul {
    height: 1.4583rem;
    width: 100%;
    overflow-y: hidden;
    li {
      margin-top: 0.0521rem;
      display: flex;
      justify-content: space-between;
      align-content: center;
      overflow: hidden;
      a {
        display: block;
        color: black;
        width: 70%;
        font-size: 0.0885rem;
        line-height: 0.1302rem;
      }
      a:hover {
        color: #99ccff;
        cursor: pointer;
      }
      span.icon {
        margin-top: 0.0156rem;
        width: 0.1302rem;
        margin-left: 0.0521rem;
        text-align: center;
        background: #ccc;
        height: 0.1302rem;
        color: black;
        padding-top: 0.026rem;
      }
      span.icon1 {
        color: #fff;
        background: #f1404b;
      }
      span.icon2 {
        color: #fff;
        background: #c56831;
      }
      span.icon3 {
        color: #fff;
        background: #b89e2c;
      }
      span.hot {
        width: 20%;
        text-align: center;
        height: 0.1302rem;
        line-height: 0.1302rem;
        font-size: 0.0885rem;
      }
    }
  }
  ul:hover {
    overflow-y: scroll;
  }
  .icon-shuaxin {
    font-size: 0.1563rem;
    float: right;
    margin-right: 0.0781rem;
    line-height: 0.1302rem;
    cursor: pointer;
  }
}

//侧边滚动条设置
::-webkit-scrollbar {
  //滚动条的基本设置.宽度是竖垂直方向宽度
  width: 10px;
}
//滚动条滚动部分样式
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ccffcc;
  box-shadow: none;
}
//滚动留下的痕迹
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: coral;
  box-shadow: none;
}
</style>

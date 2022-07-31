<template>
  <div class="runtime">
    <main>
      <card
        v-for="(item, index) in rs"
        :key="item.title"
        :data="item"
        :name="hotItem[index]"
      ></card>
    </main>
  </div>
</template>

<script>
import { reactive } from "vue";
import card from "@/components/public/card/newCard.vue";
import { getPtHot } from "@/api/external.js";
export default {
  name: "runTimeHot",
  components: {
    card,
  },
  setup() {
    //这里使用循环直接将需要的平台热点1通过数组全部发送请求，最后合并数据返回结果
    let hotItem = [
      "huPu",
      "zhihuHot",
      "36Ke",
      "baiduRD",
      "bili",
      "history",
      "baiduRY",
      "wbHot",
      "douyinHot",
      "wxHot",
      "wxKeJi",
      "itInfo",
      "douban",
    ];
    let rs = reactive([]);

    let start = async () => {
      for (let index = 0; index < 12; index++) {
        try {
          let data = await getPtHot(hotItem[index]);
          rs.push(data.data);
        } catch (error) {
          continue;
        }
      }
    };
    start();
    return { rs, hotItem };
  },
};
</script>
<style scoped lang="scss">
.runtime {
  overflow: hidden;
  min-height: calc(100vh - 0.3125rem);
  padding-bottom: 0.2083rem;
}
main {
  width: 80vw;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>

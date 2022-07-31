<template>
  <div class="search">
    <main>
      <div class="sleft">
        <div v-if="bloglist.length !== 0">
          <div v-for="itemn in bloglist" :key="itemn.bid">
            <itemInfo :item="itemn" />
          </div>
          <div class="propt">
            <p>{{ !isMore ? "暂无更多数据" : "" }}</p>
          </div>
        </div>
        <div class="dedis" v-else>
          <img src="	https://v.api.aa1.cn/api/ip-img/index.php " alt="" />
          <div class="propt">
            <p>暂时没有找到相匹配的信息，试试其他的关键字吧。</p>
          </div>
        </div>
      </div>
      <div class="sright"></div>
    </main>
  </div>
</template>

<script>
import { getSearch } from "@/api/blog";
import { useRoute } from "vue-router";
import { getCurrentInstance, ref, watchEffect } from "vue";
import itemInfo from "@/components/private/itemInfo/itemInfo.vue";
export default {
  name: "searchView",
  components: { itemInfo },
  setup() {
    const { eventHub } = getCurrentInstance().proxy;
    let route = useRoute();
    let sValue = ref("");
    let bloglist = ref([]);
    let page = ref(0);
    let isMore = ref(true);
    let start = async (sValue) => {
      let res = await getSearch(sValue, page.value);
      bloglist.value = res.data;
    };
    watchEffect(() => {
      sValue.value = route.params.content;
      if (sValue.value) {
        start(sValue.value);
      }
    });
    eventHub.$on("scrollButtom", async () => {
      //下拉加载
      if (isMore.value) {
        let pagec = page.value + 1;
        try {
          let res = await getSearch(sValue.value, pagec);
          if (res.data.length != 0) {
            bloglist.value = bloglist.value.concat(res.data);
            page.value++;
          } else {
            isMore.value = false;
          }
        } catch (error) {
          console.log(err);
        }
      }
    });
    return { bloglist, isMore };
  },
};
</script>
<style scoped lang="scss">
.search {
  width: 100%;
}
main {
  min-height: 120vh;
  width: 65vw;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  .sleft {
    width: 70%;
    background-color: #fff;
    .propt {
      width: 100%;
      height: 0.4167rem;
      margin-top: 0.1042rem;
      p {
        width: 100%;
        display: inline-block;
        height: 0.4167rem;
        line-height: 0.4167rem;
        font-size: 0.1094rem;
        text-align: center;
      }
    }
    .dedis {
      width: 100%;
      img {
        margin-left: 15%;
      }
      p {
        color: coral;
      }
    }
  }
  .sright {
    width: 27%;
  }
}
</style>

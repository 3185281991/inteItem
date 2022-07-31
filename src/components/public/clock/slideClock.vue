<template>
  <div class="clock">
    <span>{{ dt }}</span>
    <span>{{ time }}</span>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
export default {
  name: "slideClock",
  setup() {
    let dt = ref(null);
    let time = ref(null);
    let timer = null;
    let update = () => {
      let date = new Date();
      let years = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      dt.value = years + "/" + month + "/" + day;
      time.value = hours + ":" + minute + ":" + second;
    };
    onMounted(() => {
      timer = setInterval(() => {
        update();
      }, 1000);
    });
    onUnmounted(() => {
      clearInterval(timer);
      timer = null;
    });
    return { dt, time };
  },
};
</script>
<style scoped lang="scss">
.clock {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: nowrap;
  span {
    margin-top: 0.0521rem;
    display: block;
    float: left;
    height: 0.3125rem;
    line-height: 0.3125rem;
    font-size: 0.1823rem;
  }
}
</style>

<template>
  <div class="imgupload">
    <div class="il">
      <div class="iz">+</div>
      <img :src="imgSrc" alt="" />
      <input type="file" accept="image/*" ref="img" @change="getFile" />
    </div>

    <div class="promt">
      <span>{{ imgInfo }}</span>
      <span @click="deleteimg">清除</span>
    </div>
  </div>
</template>

<script>
import { getObjectURL } from "@/utils/index";
import { ref, watch } from "vue";
export default {
  name: "",
  props: ["info"],
  setup(props, context) {
    watch(
      () => props.info,
      (newv, oldV) => {
        if (newv == 1) {
          deleteimg();
        }
      }
    );
    let img = ref(null);
    let imgSrc = ref("");
    let imgInfo = ref("");
    let getFile = () => {
      let file = img.value.files[0];
      imgInfo.value = file.name;
      imgSrc.value = getObjectURL(file);
      context.emit("changeImg", file);
    };
    let deleteimg = () => {
      img.value = null;
      imgSrc.value = "";
      imgInfo.value = "";
      context.emit("changeImg", null);
    };
    return { img, imgSrc, getFile, imgInfo, deleteimg };
  },
};
</script>
<style scoped>
.imgupload {
  height: 0.625rem;
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(0, 255, 255, 0.1);
}
.il {
  width: inherit;
  height: inherit;
}
.iz {
  font-size: 0.1563rem;
  min-width: 0.625rem;
  overflow: hidden;
  height: 0.625rem;
  /* background-color: antiquewhite; */
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}
input[type="file"] {
  position: absolute;
  top: 0.1823rem;
  opacity: 0;
  z-index: 999;
  width: 0.625rem;
}
img {
  background-color: transparent;
  position: absolute;
  top: 0;
  width: 100%;
  height: 0.625rem;
}
.promt {
  margin-top: 0.0521rem;
  min-width: 0.8333rem;
  height: 0.2083rem;
  line-height: 0.2083rem;
}
.promt span {
  font-size: 0.0938rem;
}
.promt span:last-child {
  cursor: pointer;
  margin-left: 0.0521rem;
}
</style>

<template>
  <div class="addtext">
    <div class="fitem">
      <span>标题</span><input type="text" v-model="title" />
    </div>
    <div class="fitem">
      <span>标签</span><input type="text" v-model="label" />
    </div>
    <div class="fitem ftext">
      <span>内容</span>
      <div class="zceditor">
        <quilEditor />
      </div>
    </div>
    <div class="fitem upload">
      <span class="upt">选择图片</span>
      <div class="imgcon">
        <upload :info="imgD" @changeImg="getFile" />
      </div>
    </div>
    <div class="fbtn">
      <span @click="submitForm">确定</span><span @click="resetForm">重置</span>
    </div>
  </div>
</template>

<script>
import quilEditor from "@/components/public/editor/quilEditor.vue";
import upload from "@/components/public/upload/upload.vue";
import { addBlog } from "@/api/blog";
import { getBid, throttle } from "@/utils/index";
import { useStore } from "vuex";
import { computed, ref, reactive, getCurrentInstance } from "@vue/runtime-core";
import { useRouter } from "vue-router";
export default {
  name: "",
  components: { quilEditor, upload },
  setup() {
    const { eventHub } = getCurrentInstance().proxy;
    let store = useStore();
    let router = useRouter();
    let myuid = computed(() => store.state.uid).value;
    let myusername = computed(() => store.state.name).value;
    let myavatar = computed(() => store.state.avatar).value;

    let fileimg = reactive({ img: null });
    let imgD = ref(0);
    let title = ref("");
    let label = ref("");
    let content = ref("");
    let getFile = (file) => {
      fileimg.img = file;
    };

    let submitForm = throttle(async () => {
      //获取富文本编辑器的信息
      eventHub.$emit("getContent", (econtent) => {
        content.value = econtent;
      });
      let formData = new FormData();
      if (
        title.value !== "" &&
        label.value != "" &&
        content.value.length > 20
      ) {
        let imgErr = false;
        formData.append("bid", getBid());
        formData.append("username", myusername);
        formData.append("uid", myuid);
        formData.append("avatar", myavatar);
        formData.append("title", title.value);
        formData.append("label", label.value);
        formData.append("content", content.value);
        formData.append("time", new Date().getTime());
        if (fileimg.img != null) {
          if (fileimg.img.size < 5 * 1024 * 1024) {
            formData.append("img", fileimg.img);
          } else {
            imgErr = true;
            alert("头像大小不得大于5MB");
          }
        }
        if (!imgErr) {
          let res = await addBlog(formData);
          if (res.data.flag == 1) {
            resetForm();
            eventHub.$emit("freshBlog");
            router.push("/home");
          } else {
            alert("服务器内部错误。");
          }
        }
      } else {
        alert("条件不符合");
      }
    }, 1000);
    let resetForm = () => {
      eventHub.$emit("clear");
      title.value = "";
      label.value = "";
      content.value = "";
      fileimg.img = null;
      imgD.value = 1;
      setTimeout(() => (imgD.value = 0), 10);
    };
    return {
      getFile,
      title,
      label,
      content,
      submitForm,
      resetForm,
      imgD,
    };
  },
};
</script>
<style scoped lang="scss">
.addtext {
  width: 70vw;
  background-color: #fff;
  padding: 0 0 0.4167rem 0;
  overflow: hidden;
  margin: 0.1042rem auto;
}
.fitem {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-top: 0.2083rem;
  span {
    display: inline-block;
    width: 0.8333rem;
    text-align: center;
    font-size: 0.1042rem;
    line-height: 0.2083rem;
    margin-left: 0.1042rem;
  }
  input {
    background: #e5e6eb;
    border-color: #e5e6eb;
    font-size: 0.0938rem;
    width: 1.5625rem;
    height: 0.2083rem;
    line-height: 0.2083rem;
    padding-left: 0.0521rem;
    margin-left: 0.2083rem;
  }
}
.ftext {
  overflow: hidden;
  .zceditor {
    margin-left: 0.2083rem;
    height: 2.3438rem;
    width: 86%;
    margin-left: 0.1042rem;
  }
}
.upload {
  margin-top: 0.2083rem;
  display: flex;
  height: 0.625rem;
  align-items: center;
  .upt {
    font-size: 0.1042rem;
    height: 0.2083rem;
    line-height: 0.2083rem;
    margin-left: 0.1563rem;
  }
  .imgcon {
    width: 0.625rem;
    height: 0.625rem;
    margin-left: 0.1042rem;
  }
}
input:focus {
  border: 1px solid dodgerblue;
  background-color: #fff;
}
.fbtn {
  display: flex;
  height: 0.2083rem;
  align-items: cener;
  margin-top: 0.2083rem;
  span {
    display: block;
    cursor: pointer;
    width: 0.5208rem;
    height: 0.2083rem;
    line-height: 0.2083rem;
    background-color: dodgerblue;
    text-align: center;
    font-size: 0.1042rem;
    color: #fff;
    margin-left: 0.4583rem;
    user-select: none;
  }
  span:nth-of-type(1) {
    margin-left: 1.0938rem;
  }
}
</style>

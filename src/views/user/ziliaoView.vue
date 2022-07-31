<template>
  <div class="ziliao">
    <div class="main">
      <div class="infoItem first">
        <span>唯一ID</span>
        <input type="text" readonly v-model="uid" />
      </div>
      <div class="infoItem">
        <span>用户名</span>
        <input type="text" v-model="username" />
      </div>
      <div class="infoItem">
        <span>电子邮箱</span>
        <input type="email" v-model="email" />
      </div>
      <div class="infoItem">
        <span>密码</span>
        <input type="text" v-model="pwd" />
      </div>
      <div class="infoItem last">
        <span>个人介绍</span>
        <textarea type="text" v-model="introduce" />
      </div>
      <div class="infobtn">
        <span @click="submit">提交修改</span><span @click="clear">取消</span>
      </div>
    </div>
    <div class="ava">
      <input
        type="file"
        name="avatar"
        id=""
        accept="image/*"
        @change="showImg"
        ref="file"
      />
      <span>更换头像</span>
      <img :src="imgSrc" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watchEffect } from "@vue/runtime-core";
import { useStore } from "vuex";
import { getUserInfo, updateUserInfo } from "@/api/user";
import { getObjectURL } from "@/utils/index";

let store = useStore();
let info = ref({});
let username = ref("");
let pwd = ref("");
let email = ref("");
let introduce = ref("");
let imgSrc = ref("");
let oImg = ref("");
let fileimg = reactive({ img: null });
let uid = computed(() => store.state.uid);
let getInfo = async () => {
  let res = await getUserInfo(uid.value);
  info.value = res.data[0];
  store.commit("dataSave", {
    name: info.value.username,
    avatar: info.value.avatar,
    uid: uid.value,
    isLogin: true,
  });
  fillInfo(info.value);
};
getInfo();
let fillInfo = (obj) => {
  username.value = obj.username;
  pwd.value = obj.pwd;
  email.value = obj.email;
  introduce.value = obj.introduce;
  imgSrc.value = obj.avatar;
  oImg.value = obj.avatar;
};

let file = ref(null);
let showImg = () => {
  //获取上传的文件信息,上传file即可
  let img = file.value.files[0];
  fileimg.img = img;
  imgSrc.value = getObjectURL(img);
};
let index = ref(0);
watchEffect(() => {
  let name = username.value;
  let pass = pwd.value;
  let em = email.value;
  let intro = introduce.value;
  let img = fileimg.img;
  index.value++;
});
let submit = async () => {
  if (
    username.value.length > 0 &&
    username.value.length < 13 &&
    /^\w{6,10}$/.test(pwd.value) &&
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email.value)
  ) {
    if (index.value > 2) {
      let imgErr = false;
      let formdata = new FormData();
      formdata.append("uid", uid.value);
      formdata.append("username", username.value);
      formdata.append("email", email.value);
      formdata.append("pwd", pwd.value);
      formdata.append("introduce", introduce.value);
      formdata.append("oImg", oImg.value);

      if (fileimg.img != null) {
        if (fileimg.img.size < 5 * 1024 * 1024) {
          formdata.append("img", fileimg.img);
        } else {
          alert("头像大小不得大于5MB");
          imgErr = true;
        }
      }
      if (!imgErr) {
        let res = await updateUserInfo(formdata);
        if (res.data.flag == 1) {
          getInfo();
          alert("信息修改成功");
        } else {
          alert("信息修改失败");
        }
        index.value = 1;
      }
    } else {
      alert("请修改具体的值。");
    }
  } else {
    alert("修改条件不符合");
  }
};
let clear = () => {
  fillInfo(info.value);
  index.value = 1;
};
</script>
<style scoped lang="scss">
.ziliao {
  width: 96%;
  height: 3.6458rem;
  margin: 0.1042rem auto;
  display: flex;
  justify-content: space-around;
}
.main {
  width: 80%;
  height: 100%;
  padding-bottom: 0.2083rem;
  overflow: hidden;
  .infoItem {
    width: 85%;
    margin: 0 auto;
    height: 0.4167rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-top: 1px solid #e4e6eb;
    span {
      font-size: 0.1042rem;
      display: block;
      width: 0.625rem;
      text-align: center;
    }
    input {
      background: #e5e6eb;
      border-color: #e5e6eb;
      font-size: 0.0938rem;
      width: 2.0833rem;
      height: 0.1563rem;
      line-height: 0.1563rem;
      padding-left: 0.0521rem;
    }
  }
  .first {
    margin-top: 0.2083rem;
  }
  .last {
    height: 1.0417rem;
    align-items: flex-start;
    padding-top: 0.1042rem;
    textarea {
      width: 2.0833rem;
      background: #e5e6eb;
      border-color: #e5e6eb;
      height: 0.7292rem;
      resize: vertical;
      max-height: 100%;
      font-size: 0.0938rem;
      padding-top: 0.0208rem;
      padding-left: 0.0781rem;
    }
  }
  textarea:focus,
  input:focus {
    border: 1px solid #00a4ff;
    background-color: #fff;
  }
  .infobtn {
    span:nth-child(1) {
      margin-left: 1.3021rem;
    }
    span {
      display: inline-block;
      font-size: 0.099rem;
      background-color: #1d7dfa;
      color: #fff;
      padding: 0.026rem;
      cursor: pointer;
      width: 0.5208rem;
      text-align: center;
      line-height: 0.1563rem;
      height: 0.1563rem;
      margin-left: 0.5208rem;
    }
  }
}
.ava {
  width: 15%;
  margin-top: 0.3646rem;
  position: relative;
  img {
    max-width: 0.4167rem;
    height: 0.4167rem;
    border-radius: 50%;
    cursor: pointer;
  }
  input {
    position: absolute;
    top: 0.5208rem;
    opacity: 0;
    z-index: 10;
  }
  span {
    display: block;
    position: absolute;
    left: 0.026rem;
    top: 0.5208rem;
    opacity: 1;
    cursor: pointer;
    background-color: #00a4ff;
    width: 0.4167rem;
    font-size: 0.0938rem;
    text-align: center;
    color: #fff;
  }
}
</style>

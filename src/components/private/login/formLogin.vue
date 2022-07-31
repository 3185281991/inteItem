<template>
  <div class="formLogin">
    <div class="flogin" v-show="activeChoose == 1">
      <span class="zc">欢迎回来</span>
      <span class="prompt">{{ prompt1 }}</span>
      <input
        class="username"
        v-model="username"
        type="text"
        placeholder="请输入用户名"
      />
      <input class="pwd" type="text" v-model="pwd" placeholder="请输入密码" />
      <label for="rem"
        ><input
          type="checkbox"
          name="check"
          id="rem"
          v-model="remChk"
          checked
        />记住我的登录信息</label
      >
      <span class="fb same left" @click="submitForm(1)">登录</span>
      <span class="fb same right" @click="$router.push('/home')">首页</span>
      <div class="for text">
        <span>没有账号？</span><span @click="changeChoose(3)">注册</span
        ><span>/</span><span @click="changeChoose(2)">找回密码</span>
      </div>
    </div>
    <div class="forget" v-show="activeChoose == 2">
      <span class="zc">忘记密码</span>
      <span class="prompt">{{ prompt2 }}</span>
      <input
        class="faccount"
        type="text"
        v-model="faccount"
        placeholder="请输入用户名"
      />
      <input
        class="femail"
        type="email"
        v-model="femail"
        placeholder="请输入正确邮箱格式"
      />
      <input
        class="fpwd"
        type="password"
        v-model="fpwd"
        placeholder="新密码6-10位"
      />
      <span class="fob same left" @click="submitForm(2)">确认</span>
      <span class="fob same right" @click="$router.push('/home')">首页</span>
      <div class="fgfor text">
        <span @click="changeChoose(1)">登录</span><span>|</span
        ><span @click="changeChoose(3)">注册</span>
      </div>
    </div>
    <div class="register" v-show="activeChoose == 3">
      <span class="zc">用户注册</span>
      <span class="prompt">{{ prompt3 }}</span>
      <input
        class="rname"
        type="text"
        v-model="rname"
        placeholder="用户名长度1-15"
      />
      <input
        class="remail"
        type="email"
        v-model="remail"
        placeholder="请输入正确邮箱格式"
      />
      <input
        class="rpwd"
        type="password"
        v-model="rpwd"
        placeholder="密码6-10位"
      />
      <input
        class="rmpwd"
        type="password"
        v-model="rmpwd"
        placeholder="确认密码"
      />
      <span class="rob same left" @click="submitForm(3)">注册</span>
      <span class="rob same right" @click="$router.push('/home')">首页</span>
      <div class="rfor text"><span @click="changeChoose(1)">登录</span></div>
    </div>
  </div>
</template>

<script>
import { onActivated, ref } from "vue";
import { getLogin, setNewPwd, register, hasUsername } from "@/api/login.js";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getUid } from "@/utils/index.js";
export default {
  name: "formLogin",
  setup() {
    let router = useRouter();
    let store = useStore();

    let activeChoose = ref(1);
    let prompt1 = ref("");
    let prompt2 = ref("");
    let prompt3 = ref("");

    let username = ref("");
    let pwd = ref("");
    let remChk = ref(true);

    let faccount = ref("");
    let femail = ref("");
    let fpwd = ref("");

    let rname = ref("");
    let remail = ref("");
    let rpwd = ref("");
    let rmpwd = ref("");

    let changeChoose = (index) => {
      activeChoose.value = index;
    };
    let submitForm = async (index) => {
      //登录部分
      if (index == 1) {
        let name = username.value;
        let pass = pwd.value;
        let check = remChk.value;
        let rs = await getLogin(name, pass);
        if (rs.data.flag == 1) {
          //登陆成功,跳转首页，同时将账号信息保存在store中
          let avatar = rs.data.avatar;
          let uid = rs.data.uid;
          let isLogin = true;
          let token = rs.data.token;
          let tokenExpire = rs.data.tokenExpire;
          let obj = {
            name,
            pass,
            check,
            avatar,
            uid,
            isLogin,
            token,
            tokenExpire,
          };
          store.commit("saveUserInfo", obj);
          router.push("/home");
          username.value = "";
          pwd.value = "";
          prompt1.value = "";
        } else {
          //登陆失败
          username.value = "";
          pwd.value = "";
          prompt1.value = "账号信息错误！";
        }
      }
      //忘记密码部分
      if (index == 2) {
        let username = faccount.value;
        let email = femail.value;
        let pwd = fpwd.value;
        //先设置好密码格式
        if (/^\w{5,17}$/.test(pwd)) {
          let rs = await setNewPwd(username, email, pwd);
          if (rs.data.flag == 1) {
            prompt1.value = "密码修改成功。";
            activeChoose.value = 1;
          } else {
            prompt2.value = rs.data.message;
          }
          faccount.value = "";
          femail.value = "";
          fpwd.value = "";
        } else {
          prompt2.value = "密码6-10位";
        }
      }
      if (index == 3) {
        let rusername = rname.value;
        let email = remail.value;
        let rpass = rpwd.value;
        let mpwd = rmpwd.value;
        if (
          /^[\u4E00-\u9FA5A-Za-z0-9_]{1,14}$/.test(rusername) &&
          /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) &&
          rpass == mpwd &&
          /^\w{6,10}$/.test(rpass)
        ) {
          //判断用户是否已经存在
          let judgeName = await hasUsername(rusername);
          if (judgeName.data.flag == 1) {
            prompt3.value = judgeName.data.message;
            rname.value = "";
          } else {
            //生成uid，以及当前的注册时间
            let time = new Date().getTime();
            let uid = getUid();
            let rs = await register(uid, rusername, email, rpass, time);
            if (rs.data.flag == 1) {
              prompt1.value = "用户注册成功。";
              activeChoose.value = 1;
              username.value = rusername;
              pwd.value = "";
            } else {
              prompt3.value = rs.data.message;
            }
            rname.value = "";
            remail.value = "";
            rpwd.value = "";
            rmpwd.value = "";
          }
        } else {
          prompt3.value = "请确保对应字段格式以及密码正确！";
        }
      }
    };
    onActivated(() => {
      let data = JSON.parse(localStorage.getItem("userInfo"));
      if (data) {
        username.value = data.name;
        pwd.value = data.pass;
      }
    });
    return {
      activeChoose,
      changeChoose,
      submitForm,
      username,
      pwd,
      remChk,
      faccount,
      femail,
      fpwd,
      rname,
      remail,
      rpwd,
      rmpwd,
      prompt1,
      prompt2,
      prompt3,
    };
  },
};
</script>
<style scoped lang="scss">
.formLogin {
  width: 100%;
  height: 100%;
  position: relative;
  .zc {
    position: absolute;
    top: 0.2604rem;
    left: 0.3125rem;
    font-size: 0.1563rem;
  }
  .prompt {
    position: absolute;
    top: 0.5729rem;
    left: 0.3125rem;
    font-size: 0.1042rem;
    color: #ff6666;
  }
  input {
    position: absolute;
    height: 0.2083rem;
    line-height: 0.2083rem;
    border-bottom: 2px solid#ccc;
    width: 1.8229rem;
    left: 0.3125rem;
    font-size: 0.1042rem;
  }
  .same {
    width: 0.8333rem;
    text-align: center;
    cursor: pointer;
    position: absolute;
    height: 0.2083rem;
    line-height: 0.2083rem;
    bottom: 1.0417rem;
    font-size: 0.1302rem;
    border-radius: 0.026rem;
    border: 1px solid #66ccff;
    transition: 0.5s;
  }
  .left {
    left: 0.3125rem;
    background-color: #66ccff;
    color: #fff;
    box-shadow: #ccc 2px 2px 2px;
  }
  .left:hover {
    background-color: black;
    color: white;
  }
  .right {
    left: 1.25rem;
    background-color: #fff;
    color: #66ccff;
  }
  .right:hover {
    background-color: #66ccff;
    color: white;
    box-shadow: #ccc 2px 2px 2px;
  }
  .text {
    width: 1.3021rem;
    position: absolute;
    height: 0.2083rem;
    line-height: 0.2083rem;
    bottom: 0.7292rem;
    font-size: 0.1302rem;
    left: 0.3125rem;
  }
  .flogin {
    .username {
      top: 0.7813rem;
    }
    .pwd {
      top: 1.25rem;
    }
    label {
      left: 0.5729rem;
      position: absolute;
      top: 1.7188rem;
      width: 1.3021rem;
      font-size: 0.1042rem;
      input {
        position: absolute;
        left: -0.2344rem;
        top: 0;
        width: 0.1302rem;
        height: 0.1302rem;
        outline: 2px solid coral;
      }
    }
    .fb {
      bottom: 1.0417rem;
    }

    .for {
      span {
        font-size: 0.0938rem;
      }
      span:nth-child(2),
      span:nth-child(4) {
        color: coral;
        cursor: pointer;
      }
    }
  }
  .forget {
    .faccount {
      top: 0.7813rem;
    }
    .femail {
      top: 1.1979rem;
    }
    .fpwd {
      top: 1.6146rem;
    }

    .fob {
      bottom: 1.0417rem;
    }
    .fgfor {
      span {
        font-size: 0.0938rem;
        margin-left: 0.0521rem;
      }
      span:nth-child(1),
      span:nth-child(3) {
        color: coral;
        cursor: pointer;
      }
    }
  }
  .register {
    .rname {
      top: 0.7813rem;
    }
    .remail {
      top: 1.1458rem;
    }
    .rpwd {
      top: 1.5104rem;
    }
    .rmpwd {
      top: 1.875rem;
    }

    .rob {
      bottom: 0.8333rem;
    }
    .rfor {
      bottom: 0.5208rem;
      span {
        font-size: 0.0938rem;
        margin-left: 0.0521rem;
        color: coral;
        cursor: pointer;
      }
    }
  }
}
</style>

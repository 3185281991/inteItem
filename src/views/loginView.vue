<template>
  <div class="login">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">管理员登录</div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="ruleForm.username"
            type="username"
            autocomplete="on"
          />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" />
        </el-form-item>
        <el-form-item class="last">
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >Submit</el-button
          >
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getLogin } from "@/api/login.js";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { getBackRoute } from "@/api/home";

let router = useRouter();
let store = useStore();
const ruleFormRef = ref();
const ruleForm = reactive({
  username: "",
  pass: "",
});

const rules = reactive({
  username: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 1, max: 18, message: "Length should be 1 to 18", trigger: "blur" },
  ],
  pass: [
    {
      required: true,
      message: "Please input correct password",
      trigger: "blur",
    },
    { min: 6, max: 18, message: "Length should be 6 to 18", trigger: "blur" },
  ],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res = await getLogin(ruleForm.username, ruleForm.pass);
      if (res.data.flag == 1) {
        store.commit("saveRootInfo", {
          username: ruleForm.username,
          uid: res.data.uid,
          avatar: res.data.avatar,
        });
        localStorage.setItem(
          "backToken",
          JSON.stringify({
            token: res.data.token,
            tokenExpire: res.data.tokenExpire,
            uid: res.data.uid,
            username: ruleForm.username,
            avatar: res.data.avatar,
          })
        );
        ElMessage({
          message: "登陆成功.",
          type: "success",
        });
        let res1 = await getBackRoute(0);
        if (res1.data.flag == 1) {
          store.commit("saveRoute", res1.data.routes);
        }
        formEl.resetFields();
        setTimeout(() => {
          router.push("/blogInfo");
        }, 500);
      } else {
        ElMessage({
          message: res.data.message,
          type: "error",
        });
      }
    } else {
      ElMessage({
        message: "信息输入错误",
        type: "warning",
      });
    }
  });
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
let autoLogin = () => {
  //进入登录页面判断是否存在token，自动登录,
  let token = JSON.parse(localStorage.getItem("backToken"));
  if (token) {
    if (Date.now() - token.tokenExpire < 60 * 60 * 24 * 1000) {
      ElMessage({
        message: "信息已自动验证成功.",
        type: "success",
      });
      store.commit("saveRootInfo", {
        username: token.username,
        uid: token.uid,
        avatar: token.avatar,
      });
      getBackRoute(0).then((res) => {
        if (res.data.flag == 1) {
          store.commit("saveRoute", res.data.routes);
        }
      });
      setTimeout(() => {
        router.push("/blogInfo");
      }, 500);
    } else {
      localStorage.removeItem("backToken");
      ElMessage({
        message: "身份信息已过期，请重新登录.",
        type: "warn",
      });
    }
  }
};
autoLogin();
</script>
<style scoped>
.login {
  width: 100%;
  height: 100vh;
  background: url("@/assets/img/login.jpg") center center no-repeat;
  background-size: cover;
  position: relative;
}
.box-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 280px;
}
.card-header {
  font-size: 16px;
  text-align: center;
  padding: 0 0;
}

.el-form {
  width: 98%;
  height: 200px;
  overflow: hidden;
}
.el-form-item {
  margin-top: 0.5208rem;
  margin-bottom: 2.6042rem;
}
.el-input {
  width: 80%;
}
.el-button {
  margin-left: 3.2rem;
}
</style>

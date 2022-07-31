<template>
  <div class="login">
    <div class="bg">
      <img src="@/assets/img/login.jpg" alt="" />
    </div>
    <div class="info">
      <p>Simple Tools</p>
      <p>收集那些有用的工具</p>
    </div>
    <div class="form">
      <formLogin />
    </div>
    <div class="bou">Copyright @ Simple Tools</div>
  </div>
</template>

<script>
import formLogin from "@/components/private/login/formLogin.vue";
import { getCurrentInstance } from "vue";
export default {
  name: "LoginView",
  components: { formLogin },
  setup() {
    const { eventHub } = getCurrentInstance().proxy;
    eventHub.$on("reload", () => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });
  },
};
</script>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    66.75919826946586deg,
    rgba(136, 219, 242, 1) 3.2355142508943877%,
    rgba(136, 219, 242, 1) 4.257242801702685%,
    rgba(186, 217, 232, 1) 100.09538086752096%
  );
  position: relative;
  .bg {
    width: 5.2083rem;
    height: 4.0625rem;
    position: absolute;
    left: 1.4583rem;
    top: 0.2083rem;
    img {
      max-width: 100%;
      height: 100%;
      border-radius: 0.1042rem;
    }
  }
  .info {
    height: 0.4167rem;
    position: absolute;
    top: 0.6771rem;
    left: 1.8229rem;
    p {
      color: #66ccff;
    }
    P:nth-child(1) {
      font-size: 0.2083rem;
    }
    P:nth-child(2) {
      margin-top: 0.0781rem;
      font-size: 0.099rem;
    }
  }
  .form {
    position: absolute;
    width: 2.4479rem;
    height: 3.3333rem;
    background-color: #fff;
    top: 0.5208rem;
    right: 1.4063rem;
    border-radius: 0.0781rem;
  }
  .bou {
    position: absolute;
    transform: translateX(40vw);
    bottom: 0.2083rem;
    font-size: 0.1042rem;
    text-align: center;
    color: #fff;
  }
}
</style>

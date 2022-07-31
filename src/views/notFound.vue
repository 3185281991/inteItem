<template>
  <div class="notice_page">
    <div class="notice_404_p"></div>
    <div class="home_page">
      <a class="notice_retun" href="javascript:history.go(-1);">返回上一页</a
      ><a class="notice_home" href="/home">返回首页</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "notFound",
  setup() {},
};
</script>
<style scoped>
div.notice_page {
  width: 100vw;
  height: 100vh;
  position: relative;
}

div.notice_page .notice_404_p {
  height: 100%;
  width: 100%;
  background: url("@/assets/img/404_02.png") center center no-repeat;
  background-size: cover;
}

div.notice_page .home_page {
  position: absolute;
  bottom: 0.625rem;
  left: 38%;
  height: 40px;
  width: 300px;
  padding-left: 82px;
}

div.notice_page .home_page .notice_retun {
  background: #e8e8e8 url("@/assets/img/404_return.png") no-repeat 5px center;
  margin-right: 20px;
}

div.notice_page .home_page a {
  display: block;
  padding: 5px 5px 5px 30px;
  color: #676767;
  float: left;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 3px;
}

div.notice_page .home_page .notice_home {
  background: #e8e8e8 url("@/assets/img/404_home.png") no-repeat 5px center;
}
</style>

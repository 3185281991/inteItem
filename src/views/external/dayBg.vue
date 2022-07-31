<template>
  <div class="daybg">
    <iframe
      src="https://v.api.aa1.cn/api/api-meiribizhi/index.php"
      frameborder="0"
      sandbox="allow-scripts allow-same-origin allow-popups"
    ></iframe>
  </div>
</template>

<script></script>
<style scoped lang="scss">
.daybg {
  width: 80vw;
  margin: 0 auto;
  .perform {
    width: 80vw;
    height: 0.2083rem;
    background-color: aqua;
  }
  iframe {
    width: 100%;
    height: calc(100vh - 0.3125rem);
  }
  .ptitle {
    margin-top: 0.0521rem;
    width: 100%;
    height: 0.1563rem;
    line-height: 0.1563rem;
    font-size: 0.1302rem;
    padding-left: 0.1042rem;
  }
  .imglist {
    display: flex;
    flex-wrap: wrap;
    a {
      margin-top: 0.0781rem;
      display: block;
      width: 2.6042rem;
      height: 1.8229rem;
      margin-left: 0.0417rem;
      img {
        max-width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

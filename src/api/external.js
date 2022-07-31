import cApi from "./cacheApi";
//韩小韩
//各平台热点
export function getPtHot(type) {
  return cApi.cacheRequest({
    url: "/hxh/hotlist",
    params: {
      type,
    },
  });
}
//访客终端信息
export function guestInfo() {
  return cApi.cacheRequest("/hxh/visitor.info?skey=774740085");
}
//天气信息
export function getTianqi() {
  return cApi.cacheRequest({
    url: "/hxh/weather",
  });
}
//豆瓣电影排行
export function getDbpaihang() {
  return cApi.cacheRequest("/hxh/douban");
}
//每日一句
export function getDayWord() {
  return cApi.cacheRequest("/hxh/en?type=en");
}
//秒读60s
export function secondRead() {
  return cApi.cacheRequest("/hxh/60s?type=json");
}
export function getFish() {
  return cApi.cacheRequest("/hxh/moyu?type=json");
}
//免费api
//网易云热评
export function getWyyHot() {
  return cApi.cacheRequest(
    "/freex/api-wenan-wangyiyunreping/index.php?aa1=json"
  );
}
//每日壁纸
export function getDayBiZhi() {
  return cApi.cacheRequest({ url: "/freex/api-meiribizhi/api.php" });
}

export function getNowIp() {
  return cApi.cacheRequest({
    url: "/freex/myip/index.php?aa1=json",
  });
}

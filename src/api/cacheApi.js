import request from ".";

//仅缓存get请求
class cacheApi {
  constructor(time) {
    this.limitTime = time || 1000;
    this.fetchCache = new Map();
    this.dataCache = new Map();
  }
  cacheRequest(config) {
    let url = config.url ?? config;
    let params = config.params ? getStr(config.params) : "";
    //由于请求路径可能一样但参数不一样，因此这里要加上参数，保证url唯一
    let saveurl = url + params;
    let curFetch = this.fetchCache.get(saveurl);
    //有相同的url请求，并且没有超过限定时间，则直接返回
    if (curFetch && new Date().getTime() - curFetch < this.limitTime) {
      return this.dataCache.get(saveurl) || null;
    } else {
      this.fetchCache.set(saveurl, new Date().getTime());
    }
    return request(config)
      .then((res) => {
        let resultData = res;
        this.dataCache.set(saveurl, resultData); //缓存接口数据，给下次重复请求使用
        this.fetchCache.delete(saveurl); //本次已经请求完成，删除缓存
        return resultData;
      })
      .catch((error) => {
        this.fetchCache.delete(saveurl);
      });
  }
}
function getStr(obj) {
  let str = "?";
  let arr = Object.keys(obj);
  for (let i = 0; i < arr.length; i++) {
    str += arr[i] + "=" + obj[arr[i]];
  }
  return str;
}
const cApi = new cacheApi(10000);

export default cApi;

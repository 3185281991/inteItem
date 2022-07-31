import cApi from "./cacheApi";

export function getRecommend(page) {
  return cApi.cacheRequest({
    url: "/apix/free/getRecommend",
    params: { page },
  });
}
export function getHot(page) {
  return cApi.cacheRequest({ url: "/apix/free/getHot", params: { page } });
}
export function getNew(page) {
  return cApi.cacheRequest({ url: "/apix/free/getNew", params: { page } });
}

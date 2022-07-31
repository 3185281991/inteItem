import cApi from "./cacheApi";
import request from ".";

export function getSearch(content, page = 0) {
  return cApi.cacheRequest({
    url: "/apix/free/getSearch",
    params: { content, page },
  });
}
export function getTextById(bid) {
  return cApi.cacheRequest({ url: "/apix/free/getTextById", params: { bid } });
}
export function deleteBlog(bid, img) {
  return request({
    url: "/apix/deleteBlog",
    method: "post",
    data: {
      bid,
      img,
    },
  });
}
export function getCommentById(bid) {
  return cApi.cacheRequest({
    url: "/apix/free/getCommentById",
    params: {
      bid,
    },
  });
}
export function getReplyById(bid) {
  return cApi.cacheRequest({
    url: "/apix/free/getReplyById",
    params: {
      bid,
    },
  });
}
export function addComment(
  bid,
  uid,
  username,
  avatar,
  ccontent,
  time,
  cuid,
  cusername,
  cavatar
) {
  return request({
    url: "/apix/addComment",
    method: "post",
    data: {
      bid,
      uid,
      username,
      avatar,
      ccontent,
      time,
      cuid,
      cusername,
      cavatar,
    },
  });
}
export function addReply(
  bid,
  fuid,
  fusername,
  favatar,
  ftime,
  rcontent,
  time,
  ruid,
  rusername,
  ravatar
) {
  return request({
    url: "/apix/addReply",
    method: "post",
    data: {
      bid,
      fuid,
      fusername,
      favatar,
      ftime,
      rcontent,
      time,
      ruid,
      rusername,
      ravatar,
    },
  });
}
export function getLauds(bid, uid) {
  return cApi.cacheRequest({
    url: "/apix/free/getLauds",
    params: {
      bid,
      uid,
    },
  });
}
export function addLauds(bid, uid, islauds) {
  return request({
    url: "/apix/addLauds",
    method: "post",
    data: {
      bid,
      uid,
      islauds,
    },
  });
}
export function blogInfoIncrement(type, bid) {
  return request({
    url: "/apix/free/blogInfoIncrement",
    method: "post",
    data: {
      type,
      bid,
    },
  });
}
export function addHot(num = 10, bid) {
  return request({
    url: "/apix/free/addHot",
    method: "post",
    data: {
      num,
      bid,
    },
  });
}
export function addBlog(FormData) {
  return request({
    url: "/apix/addBlog",
    method: "post",
    // data: qs.stringify(FormData),
    data: FormData,
  });
}

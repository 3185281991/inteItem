import cApi from "./cacheApi";
import request from ".";
export function getBasicUser(uid) {
  return cApi.cacheRequest({
    url: "/apix/free/getBasicUser",
    params: {
      uid,
    },
  });
}
export function getExpireInfo(uid) {
  return cApi.cacheRequest({
    url: "/apix/free/getExpireInfo",
    params: {
      uid,
    },
  });
}
export function getAccept(uid, cuid = "") {
  return cApi.cacheRequest({
    url: "/apix/getAccept",
    params: {
      uid,
      cuid,
    },
  });
}
export function getisAccepted(uid) {
  return cApi.cacheRequest({
    url: "/apix/getisAccepted",
    params: {
      uid,
    },
  });
}
export function getLtag(uid, tag = "") {
  return cApi.cacheRequest({
    url: "/apix/free/getLtag",
    params: {
      uid,
      tag,
    },
  });
}
export function addLtag(uid, tag) {
  return request({
    url: "/apix/addLtag",
    method: "post",
    data: {
      uid,
      tag,
    },
  });
}
export function deleteLtag(uid, tag) {
  return request({
    url: "/apix/deleteLtag",
    method: "post",
    data: {
      uid,
      tag,
    },
  });
}
export function getLikeText(uid, lbid = "") {
  return cApi.cacheRequest({
    url: "/apix/free/getLikeText",
    params: {
      uid,
      lbid,
    },
  });
}

export function getUserInfo(uid) {
  return cApi.cacheRequest({
    url: "/apix/getUserInfo",
    params: {
      uid,
    },
  });
}

export function updateUserInfo(formData) {
  return request({
    url: "/apix/updateUserInfo",
    method: "post",
    data: formData,
  });
}
export function deleteAccept(uid, cuid) {
  return request({
    url: "/apix/deleteAccept",
    method: "post",
    data: {
      uid,
      cuid,
    },
  });
}
export function addAccept(
  uid,
  username,
  avatar,
  cuid,
  cusername,
  cavatar,
  time
) {
  return request({
    url: "/apix/addAccept",
    method: "post",
    data: {
      uid,
      username,
      avatar,
      cuid,
      cusername,
      cavatar,
      time,
    },
  });
}
export function addLikeText(uid, lbid, luid, time) {
  return request({
    url: "/apix/addLikeText",
    method: "post",
    data: {
      uid,
      lbid,
      luid,
      time,
    },
  });
}
export function getAllblog(uid, type = "time") {
  return cApi.cacheRequest({
    url: "/apix/getAllblog",
    params: {
      uid,
      type,
    },
  });
}

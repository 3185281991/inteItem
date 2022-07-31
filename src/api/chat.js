import cApi from "./cacheApi";
import request from ".";
export function getChatList(uid, ruid) {
  return cApi.cacheRequest({
    url: "/apix/getChatlist",
    params: {
      uid,
      ruid,
    },
  });
}
export function getChatlog(uid, ruid = 0, isshow = "") {
  return cApi.cacheRequest({
    url: "/apix/getChatlog",
    params: {
      uid,
      ruid,
      isshow,
    },
  });
}
export function addChatlog(uid, ruid, rname, ravatar, isshow = 1, time) {
  return request({
    url: "/apix/addChatlog",
    method: "post",
    data: {
      uid,
      ruid,
      rname,
      ravatar,
      isshow,
      time,
    },
  });
}
export function createChat(uid, ruid, info = "") {
  return request({
    url: "/apix/createChat",
    method: "post",
    data: {
      uid,
      ruid,
      info,
    },
  });
}
export function updateShow(uid, ruid, isshow) {
  return request({
    url: "/apix/updateShow",
    method: "post",
    data: {
      uid,
      ruid,
      isshow,
    },
  });
}

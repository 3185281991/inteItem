import request from ".";

export function getBackRoute(type = 0) {
  return request({
    url: "/free/backRoute",
    params: {
      type,
    },
  });
}
export function getBlog(page = 0) {
  return request({
    url: "/getBlog",
    params: {
      page,
    },
  });
}
export function deleteBlog(bid, img) {
  return request({
    url: "/deleteBlog",
    method: "post",
    data: {
      bid,
      img,
    },
  });
}
export function getTotal(type = 0, content) {
  return request({
    url: "/getTotal",
    params: {
      type,
      content,
    },
  });
}
export function getSearch(content, page) {
  return request({
    url: "/free/getSearch",
    params: {
      page,
      content,
    },
  });
}

export function getAlluser(page = 0) {
  return request({
    url: "/getAlluser",
    params: {
      page,
    },
  });
}
export function getuserTotal(type = 0, content) {
  return request({
    url: "/getuserTotal",
    params: {
      type,
      content,
    },
  });
}
export function getUserSearch(content, page) {
  return request({
    url: "/getUserSearch",
    params: {
      page,
      content,
    },
  });
}
export function deleteUser(uid, avatar) {
  return request({
    url: "/deleteUser",
    method: "post",
    data: {
      uid,
      avatar,
    },
  });
}
export function getBasicUser(uid) {
  return request({
    url: "/free/getBasicUser",
    params: {
      uid,
    },
  });
}
export function getExpireInfo(uid) {
  return request({
    url: "/free/getExpireInfo",
    params: {
      uid,
    },
  });
}
export function backUpdateUser(uid, username, pwd, email, introduce) {
  return request({
    url: "/backUpdateUser",
    method: "post",
    data: {
      uid,
      username,
      pwd,
      email,
      introduce,
    },
  });
}
export function getTextById(bid) {
  return request({ url: "/free/getTextById", params: { bid } });
}
export function getCommentById(bid) {
  return request({
    url: "/free/getCommentById",
    params: {
      bid,
    },
  });
}
export function getReplyById(bid) {
  return request({
    url: "/free/getReplyById",
    params: {
      bid,
    },
  });
}
export function getChatList(uid, ruid) {
  return request({
    url: "/getChatlist",
    params: {
      uid,
      ruid,
    },
  });
}
export function getChatlog(uid, ruid = 0, isshow = "") {
  return request({
    url: "/getChatlog",
    params: {
      uid,
      ruid,
      isshow,
    },
  });
}
export function getToday() {
  return request({
    url: "/getToday",
  });
}
export function getPhByType(type = "lauds") {
  return request({
    url: "/getPhByType",
    params: {
      type,
    },
  });
}

export function addChatlog(uid, ruid, rname, ravatar, isshow = 1, time) {
  return request({
    url: "/addChatlog",
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
    url: "/createChat",
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
    url: "/updateShow",
    method: "post",
    data: {
      uid,
      ruid,
      isshow,
    },
  });
}

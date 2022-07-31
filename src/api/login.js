import request from "./index.js";
export function hasUsername(username) {
  return request({
    url: "/apix/free/hasUsername",
    params: {
      username,
    },
  });
}
export function getLogin(username, pwd) {
  return request({
    url: "/apix/free/getLogin",
    params: {
      username,
      pwd,
    },
  });
}
export function setNewPwd(username, email, pwd) {
  return request({
    url: "/apix/free/setNewPwd",
    method: "post",
    data: {
      username,
      email,
      pwd,
    },
  });
}
export function register(uid, username, email, pwd, time) {
  return request({
    url: "/apix/free/register",
    method: "post",
    data: {
      uid,
      username,
      email,
      pwd,
      time,
    },
  });
}

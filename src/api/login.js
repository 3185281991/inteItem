import request from ".";
export function getLogin(username, pwd) {
  return request({
    url: "/free/getLogin",
    params: {
      username,
      pwd,
    },
  });
}

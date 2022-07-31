export function throttle(fn, delay = 500) {
  let flag = true;
  return function () {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.call(this, arguments);
      flag = true;
    }, delay);
  };
}
export function debounce(fn, delay = 500) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, arguments);
    }, delay);
  };
}
export function changeSecondToTime(second, type = 1) {
  let date = new Date(1 * second);
  let years = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minute = date.getMinutes();
  switch (type) {
    case 1: {
      return years + "年" + month + "月" + day + "日";
    }
    case 2: {
      return (
        years +
        "年" +
        month +
        "月" +
        day +
        "日" +
        hours +
        ":" +
        (minute > 9 ? minute.toString() : "0" + minute.toString())
      );
    }
    default: {
      return (
        hours + ":" + (minute > 9 ? minute.toString() : "0" + minute.toString())
      );
    }
  }
}
//拼接聊天信息
export function concatChatInfo(str) {
  let rs = [];
  let arr1 = str.split("&");
  for (let i = 0; i < arr1.length - 1; i++) {
    let arr2 = arr1[i].split(";");
    let obj = {};
    for (let j = 0; j < arr2.length - 1; j++) {
      let arr3 = arr2[j].split("=");
      obj[arr3[0]] = arr3[1];
      // rs.push(item);
    }
    rs.push(obj);
  }
  return rs;
}

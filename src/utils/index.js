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

//生成帖子唯一id 11位 年份+时分秒+1随机
export function getBid() {
  let date = new Date();
  let years = date.getFullYear();
  let hours = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return (
    years.toString() +
    z(hours) +
    z(minute) +
    z(second) +
    (Math.random() * 10).toFixed(0)
  );
}

//生成用户唯一uid，22070316431 11位
export function getUid() {
  let date = new Date();
  let years = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  return (
    years.toString().slice(2) +
    z(month) +
    z(day) +
    z(minute) +
    z(second) +
    (Math.random() * 10).toFixed(0)
  );
}

function z(num) {
  return num > 9 ? num.toString() : "0" + num.toString();
}

export function changeSecondToTime(second, type = 1) {
  let date = new Date(1 * second);
  let years = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minute = date.getMinutes();
  return type == 1
    ? years + "年" + month + "月" + day + "日"
    : years + "年" + month + "月" + day + "日" + " " + hours + ":" + z(minute);
}
//传入文件获取文件的本地地址
export function getObjectURL(file) {
  let url = null;
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  }
  return url;
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

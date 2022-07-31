module.exports = {
  chatInfoChange: (arr) => {
    let str = "";
    if (arr.length == 0) return "";
    for (let i = 0; i < arr.length; i++) {
      if (Object.prototype.toString.apply(arr[i]) == "[object Object]") {
        for (let j of Object.keys(arr[i])) {
          str += j + "=" + arr[i][j] + ";";
        }
      }
      str += "&";
    }
    return str;
  },
};

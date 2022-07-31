const cros = require("cos-nodejs-sdk-v5");
let { SecretId, SecretKey, Bucket, Region } = require("./conf");
let client = new cros({ SecretId, SecretKey });

module.exports = {
  putObject: (config, callback) => {
    let prefix = config.type == "blog" ? "front/blogimg/" : "front/avatar/";
    client.putObject(
      {
        Bucket,
        Region,
        StorageClass: "STANDARD",
        Key: prefix + config.filename, //添加前缀作为存储桶子集目录
        Body: config.img,
        Headers: {
          "x-cos-traffic-limit": 838860800, // 限速值设置范围为819200 - 838860800，即100KB/s - 100MB/s，如果超出该范围将返回400错误。
        },
        //上传进度
        // onProgress: function (progressData) {
        //   console.log(JSON.stringify(progressData));
        // },
      },
      callback
    );
  },
  deletObject: (config, callback) => {
    let prefix = config.type == "blog" ? "/front/blogimg/" : "/front/avatar/";
    client.deleteObject(
      {
        Bucket,
        Region,
        Key: prefix + config.filename, //添加前缀作为存储桶子集目录
      },
      callback
    );
  },
};

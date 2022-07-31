const mysql = require("mysql");
const config = require("./config.js");
const connection = mysql.createConnection(config);
connection.connect(() => {
  console.log("mysql连接" + config.database + "数据库成功。");
});
module.exports = connection;

const mysql = require('mysql');
const {MYSQL_CONF} = require("../config/db");

// 创建链接对象。
const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  port: "3306",
  database: "myblog"
});

// 开始链接
con.connect();

// 统一执行sql函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    // 这里不需要关闭链接， 类似于单例模式
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return;
      }
      resolve(result);
    })
  })
  return promise;
}
module.exports = {
  exec
}
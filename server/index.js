// 引入编写好的API
const api = require('./api')
// 文件模块
const fs = require('fs')
// 处理路径模块
const path = require('path')
// 处理post数据模块
const bodyParser = require('body-parser')
// 引入express
const express = require('express')
const app = express()
const session = require('express-session')

// 跨域设置
app.use('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
//res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
  if (req.method == 'OPTIONS') {
    res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  }
  else {
    next();
  }
})

app.use(bodyParser.json())
//当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({extended: false}))
app.use(api)

// 访问静态资源文件 --> 所有dist目录下的静态资源文件
// app.use(express.static(path.resolve(__dirname, '../dist')))
// 单页应用 --> 所有请求走/dist/index.html
// app.get('*', function (req, res) {
//   const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
//   res.send(html)
// })
// 监听8088端口
app.listen(8088)
console.log('success listen!')
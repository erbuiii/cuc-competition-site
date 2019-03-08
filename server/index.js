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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(api)

// 访问静态资源文件 --> 所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../dist')))
// 单页应用 --> 所有请求走/dist/index.html
app.get('*', function (req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  res.send(html)
})
// 监听8088端口
app.listen(8088)
console.log('success listen!')
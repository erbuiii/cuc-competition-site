// 使用mongoose中间件连接mongoDB
const mongoose = require('mongoose')
// 连接数据库 如果没有创建 默认数据库会自动生成
mongoose.connect('mongodb://127.0.0.1:27017/cuc-competition', {useNewUrlParser:true})

// 为本次连接绑定事件
const db = mongoose.connection
db.once('error', () => {
  console.log('Mongo connection error!')
})
db.once('open', () => {
  console.log('Mongo connection succeed!')
})

// 定义模式schema
const loginSchema = mongoose.Schema({
  account: String,
  password: String
}, {collection: 'accounts'})

// 定义模型model
const Models = {
  Login: mongoose.model('Login', loginSchema)
}

module.exports = Models

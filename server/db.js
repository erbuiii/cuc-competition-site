// 使用mongoose中间件连接mongoDB
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// 连接数据库 如果没有创建 默认数据库会自动生成
mongoose.connect('mongodb://localhost/cuc-competition', {useNewUrlParser:true})

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

// 用户
const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,   //不可重复
    require: true   //不可为空
  },
  password: {
    type: String,
    require: true
  },
  token: {
    type: String
  },
  role: {
    type: String
  }
}, {collection: 'users'})

// 定义模型model
const Models = {
  Login: mongoose.model('Login', loginSchema),
  User: mongoose.model('User', userSchema)
}

module.exports = Models

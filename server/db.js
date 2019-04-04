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

// 学生注册信息
const studenInfoSchema = mongoose.Schema({
  stu_name: String,
  sex: String,
  department: String,
  institute: String,
  specialty: String,
  student_id: {
    type: String,
    unique: true,
    require: true
  },
  contact_info: String
}, {collection: 'students_info'})

// 新闻
const newsSchema = mongoose.Schema({
  title: String,
  create_date: String,
  content: String
}, {collection: 'news'})

// 竞赛信息
const compInfoSchema = mongoose.Schema({
  comp_name: String,
  organizer: String,
  level: String,
  status: Number
}, {collection: 'competitions_info'})

const awardRecordSchema = mongoose.Schema({
  department: String,
  institute: String,
  comp_name: String,
  award_time: String,
  stu_name: String,
  specialty: String,
  grade: String,
  guide_teacher: String,
  award_name: String,
  level: String,
  organizer: String,
}, {collection: 'awards_record'})

// 定义模型model
const Models = {
  Login: mongoose.model('Login', loginSchema),
  User: mongoose.model('User', userSchema),
  StudentInfo: mongoose.model('StudentInfo', studenInfoSchema),
  News: mongoose.model('News', newsSchema),
  CompInfo: mongoose.model('CompInfo', compInfoSchema),
  AwardRecord: mongoose.model('AwardRecord', awardRecordSchema)
}

module.exports = Models

"use strict"
const models = require('./db')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')

// 创建账号接口
router.post('/api/login/createAccount', (req, res) => {
  let newAccount = new models.User({
    name: req.body.name,
    password: req.body.password,
    role: 'student'
  })

  //保存newAccount数据进MongoDB
  newAccount.save((err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send({ 'status': 0, 'msg': 'create account succeed' })
    }
  })
})

// 获取已有账号接口
router.get('/api/login/getAccount', (req, res) => {
  // 通过模型去查找数据库
  models.Login.find((err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})

// 登录
router.post('/api/admin/login', (req, res) => {
  // console.log(req.body)
  models.User.find({ name: req.body.name }, (err, docs) => {
    if (err) {
      res.send(err)
      return
    }
    if (docs.length) {
      models.User.find({ name: req.body.name, password: req.body.password }, (err, docs) => {
        if (err) {
          res.send(err)
          return;
        }
        if (docs.length) {
          const _user = docs[0]
          models.User(_user).save(function (err) {
            if (err) {
              res.status(500).send()
              return
            }
            
            // 生成token
            let content = { name: req.body.name }   // 要生成token的主题信息
            let secretKey = "123456"
            let token = jwt.sign(content, secretKey, {
              expiresIn: 60*60*24   // 24小时过期
            })
            
            // _user.token = token
            models.User.updateOne({ name: req.body.name }, { $set:{ token: token } }, (err, res) => {
              if (err) {
                console.log('update error: ', err)
              } else {
                console.log('update: ', res)
              }
            })
            // 登录成功
            res.send({
              'status': 0,
              'msg': '登录成功',
              'data': {
                'token': token,
                'user_name': _user.name,
                'role': _user.role
              }
            })
          })
          
        } else {
          res.send({ 'status:': -2, 'msg': '登录失败！密码错误' })
        }
      })

    } else {
      res.send({ 'status': -1, 'msg': '登录失败！该用户不存在', data: req.body })
    }
  })
})

// 登出
router.post('/api/admin/logout', (req, res) => {
  models.User.find({ name: req.body.name, token: req.body.token }, (err, docs) => {
    if (err) {
      res.send(err)
      return
    }
    if (docs.length > 0) {
      const _user = docs[0]
      _user.token = ''
      models.User.save(function (err) {
        if (err) {
          res.status(500).send()
          return
        }
        res.send({ 'status': 0, 'msg': '退出成功' })
      })
    } else {
      res.send({ 'status': -1, 'msg': '退出失败' })
    }
  })
})

// 学生信息注册 -- 新建
router.post('/api/student/register', (req, res) => {
  // let data = req.body
  let { stu_name,sex,department,institute,specialty,student_id,contact_info } = req.body
  let stuInfo = {
    stu_name: stu_name,
    sex: sex,
    department: department,
    institute: institute,
    specialty: specialty,
    student_id: student_id,
    contact_info: contact_info
  }
  
  models.StudentInfo.updateOne({ student_id: student_id }, { $set: stuInfo }, { upsert:true }, (err, res) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    } 
  })

  res.send({ 'status': 0, 'msg': '注册成功！' })
})

// 学生信息注册 -- 显示
router.get('/api/student/showinfo/:id', (req, res) => {
  models.StudentInfo.find({ student_id: req.params.id }, (err, docs) => {
    if (err) {
      res.send(err)
      return
    }
    if (docs.length) {
      let stuInfo = docs[0]
      res.send({ 
        'status': 0, 
        'msg': '',
        'data': {
          'regis_status': 1,
          'stu_name': stuInfo.stu_name,
          'sex': stuInfo.sex,
          'department': stuInfo.department,
          'institute': stuInfo.institute,
          'specialty': stuInfo.specialty,
          'student_id': stuInfo.student_id,
          'contact_info': stuInfo.contact_info
        }
      })
    } else {
      res.send({ 'status': -1, 'msg': '该学生还未注册', 'data': { 'regis_status': 0 } })
    }
  })
})

// 竞赛信息
router.get('/api/competition/info', (req, res) => {
  let currentPage = parseInt(req.query.currentPage)  // 当前页码
  let pageSize = parseInt(req.query.pageSize)        // 每页大小
  let skip = (currentPage - 1) * pageSize            // 实现分割查询的skip
  let compInfoModel = models.CompInfo.find({}).skip(skip).limit(pageSize)
  compInfoModel.exec((err, data) => {
    if (err) {
      res.send(err)
      return
    }

    // 获取数据总长度
    models.CompInfo.find({}, (err, docs) => {
      if (err) {
        res.send(err)
        return
      }

      let total = docs.length
      if (total) {
        res.send({ 
          'status': 0, 
          'msg': '',
          'data': {
            list: data,
            total: total
          }
        })
      } else {
        res.send({ 'status': -1, 'msg': '竞赛信息列表为空！'})
      }
    }) 
  })
})
router.post('/api/competition/info/add', (req, res) => {
  // let data = req.body
  let { comp_name,organizer,level,status } = req.body
  let newCompInfo = new models.CompInfo({
    comp_name: comp_name,
    organizer: organizer,
    level: level,
    status: status,
  })
  
  newCompInfo.save((err) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    } else {
      res.send({ 'status': 0, 'msg': '保存成功' })
    }
  })
})
router.post('/api/competition/info/delete', (req, res) => {
  models.CompInfo.remove({ _id: req.body._id }, (err) => {
    if (err) {
        res.status(500).send()
        return
    }
    res.send({ 'status': 0, 'msg': '删除成功' })
  })
})

// 获奖信息
router.get('/api/awards', (req, res, next) => {
  let currentPage = parseInt(req.query.currentPage)  // 当前页码
  let pageSize = parseInt(req.query.pageSize)        // 每页大小
  let skip = (currentPage - 1) * pageSize               // 实现分割查询的skip
  let awardRecordModel = models.AwardRecord.find({}).skip(skip).limit(pageSize)
  awardRecordModel.exec((err, data) => {
    if (err) {
      res.send(err)
      return
    }

    // 获取数据总长度
    models.AwardRecord.find({}, (err, docs) => {
      if (err) {
        res.send(err)
        return
      }

      let total = docs.length
      if (total) {
        res.send({ 
          'status': 0, 
          'msg': '',
          'data': {
            list: data,
            total: total
          }
        })
      } else {
        res.send({ 'status': -1, 'msg': '获奖信息列表为空！'})
      }
    }) 
  })
})

// 新闻公告
router.get('/api/news', (req, res) => {
  let currentPage = parseInt(req.query.currentPage)  // 当前页码
  let pageSize = parseInt(req.query.pageSize)        // 每页大小
  let skip = (currentPage - 1) * pageSize            // 实现分割查询的skip
  let newsModel = models.News.find({}).skip(skip).limit(pageSize)
  newsModel.exec((err, data) => {
    if (err) {
      res.send(err)
      return
    }

    // 获取数据总长度
    models.News.find({}, (err, docs) => {
      if (err) {
        res.send(err)
        return
      }

      let total = docs.length
      if (total) {
        res.send({ 
          'status': 0, 
          'msg': '',
          'data': {
            list: data,
            total: total
          }
        })
      } else {
        res.send({ 'status': -1, 'msg': '竞赛信息列表为空！'})
      }
    }) 
  })
})
router.post('/api/news/add', (req, res) => {
  let { title, create_date, content } = req.body
  let news = new models.News({
    title: title,
    create_date: create_date,
    content: content,
  })
  
  news.save((err) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    } else {
      res.send({ 'status': 0, 'msg': '创建成功' })
    }
  })
})
router.post('/api/news/delete', (req, res) => {
  models.News.remove({ _id: req.body._id }, (err) => {
    if (err) {
        res.status(500).send()
        return
    }
    res.send({ 'status': 0, 'msg': '删除成功' })
  })
})
router.post('/api/news/edit', (req, res) => {
  let { _id, title, create_date, content } = req.body
  let news = {
    title: title,
    create_date: create_date,
    content: content
  }
  models.News.updateOne({ _id: _id }, { $set: news }, { upsert:true }, (err, res) => {
    if (err) {
      res.status(500).send()
      return
    } 
    res.send({ 'status': 0, 'msg': '编辑成功' })    
  })
})

module.exports = router
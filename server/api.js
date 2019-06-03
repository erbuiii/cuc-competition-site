"use strict"
const models = require('./db')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const formidable = require('formidable')
const fs = require('fs')

// 账号
router.post('/api/account/add', (req, res) => {
  let newAccount = new models.User({
    name: req.body.name,
    password: req.body.password,
    role: req.body.role
  })

  //保存newAccount数据进MongoDB
  newAccount.save((err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send({ 'status': 0, 'msg': '注册成功' })
    }
  })
})
router.post('/api/account/reset', (req, res) => {
  let { _id, role, resetPass } = req.body
  let account = { role: role }
  if (resetPass) {
    account.password = '123456'
  }

  models.User.updateOne({ _id: _id }, { $set: account }, { upsert: true }, (err, res) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    } 
  })
  res.send({ 'status': 0, 'msg': '重置成功' })
})
router.get('/api/account', (req, res) => {
  let currentPage = parseInt(req.query.currentPage)  // 当前页码
  let pageSize = parseInt(req.query.pageSize)        // 每页大小
  let skip = (currentPage - 1) * pageSize            // 实现分割查询的skip
  let userModel = models.User.find({}).skip(skip).limit(pageSize)
  userModel.exec((err, data) => {
    if (err) {
      res.send(err)
      return
    }

    // 获取数据总长度
    models.User.find({}, (err, docs) => {
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
        res.send({ 'status': -1, 'msg': '用户列表为空！'})
      }
    }) 
  })
})
router.post('/api/account/delete', (req, res) => {
  models.User.remove({ _id: req.body.id }, (err) => {
    if (err) {
        res.status(500).send()
        return
    }
    res.send({ 'status': 0, 'msg': '删除成功' })
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
router.get('/api/competition/query', (req, res) => {
  const { keyword } = req.query
  const reg = new RegExp(keyword, 'i')  //不区分大小写
  let currentPage = parseInt(req.query.currentPage)  // 当前页码
  let pageSize = parseInt(req.query.pageSize)        // 每页大小
  let skip = (currentPage - 1) * pageSize
  let compQueryModel = models.CompInfo.find(
    {
      $or: [
        {comp_name: { $regex: reg }},
        {organizer: { $regex: reg }},
        {teacher: { $regex: reg }}
      ]
    }
  )
  compQueryModel.exec((err, docs) => {
    if (err) {
      res.send(err)
      return
    }
    let total = docs.length
    if (total) {
      compQueryModel.skip(skip).limit(pageSize).exec((err, data) => {
        if (err) {
          res.send(err)
          return
        }
        res.send({ 
          'status': 0, 
          'msg': '', 
          'data': {
            list: data,
            total: total
          } 
        })
      })
    } else {
      res.send({ 'status': -1, 'msg': '没有符合条件的记录' })      
    }
  })
})
router.post('/api/competition/info/add', (req, res) => {
  // let data = req.body
  let { comp_name,organizer,level,status,desc,teacher } = req.body
  let newCompInfo = new models.CompInfo({
    comp_name: comp_name,
    organizer: organizer,
    level: level,
    status: status,
    desc: desc,
    teacher: teacher
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
// 竞赛申请
router.post('/api/competition/apply/:id', (req, res) => {
  let compId = req.params.id
  let { stuId, stuName } = req.body
  let list = {
    stu_id: stuId,
    stu_name: stuName,
    status: false
  }
  models.CompInfo.updateOne({ _id: compId }, { $addToSet: { apply_list: list } }, (err) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    } 
    res.send({ 'status': 0, 'msg': '提交申请成功' })
  })
})
// 通过申请
router.post('/api/competition/apply/agree/:id', (req, res) => {
  let compId = req.params.id
  let { stuId } = req.body.params
  models.CompInfo.updateOne({_id: compId, "apply_list.stu_id": stuId}, { $set: { "apply_list.$.status": true } }, (err, docs) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    }
    if (docs.n && docs.nModified) {
      res.send({ status: 0, msg: '通过审核' })
    } else {
      res.send({ status: -1, msg: '已通过审核' })
    }
  })
})
// 驳回申请
router.post('/api/competition/apply/reject/:id', (req, res) => {
  let compId = req.params.id
  let { stuId, rejectMsg } = req.body.params
  models.CompInfo.updateOne({_id: compId, "apply_list.stu_id": stuId}, { $set: { "apply_list.$.status": false, "apply_list.$.rejectMsg": rejectMsg } }, (err, docs) => {
    if (err) {
      res.status(500).send()
      console.log(err)
      return
    }
    console.log(docs)
    if (docs.n && docs.nModified) {
      res.send({ status: 0, msg: '驳回申请' })
    } else {
      res.send({ status: -1, msg: '失败' })
    }
  })
})
router.post('/api/competition/info/delete', (req, res) => {
  let { stuId, compId } = req.body
  models.CompInfo
    .find({ _id: compId })
    .lean()
    .exec((err, docs) => {
      if (err) {
          res.status(500).send()
          return
      }
      if (docs.length) {
        let arr = docs.join_stu_id
        let index = arr.indexOf(stuId)
        if (index > -1) {
          arr.splice(index, 1)
          res.send({ 'status': 0, 'msg': '删除成功' })
        }
      }
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
router.get('/api/awards/query', (req, res) => {
  const { keyword } = req.query
  const reg = new RegExp(keyword, 'i')  //不区分大小写
  let currentPage = parseInt(req.query.currentPage)  // 当前页码
  let pageSize = parseInt(req.query.pageSize)        // 每页大小
  let skip = (currentPage - 1) * pageSize
  let awardQueryModel = models.AwardRecord.find(
    {
      $or: [
        {department: { $regex: reg }},
        {institute: { $regex: reg }},
        {comp_name: { $regex: reg }},
        {award_time: { $regex: reg }},
        {stu_name: { $regex: reg }},
        {specialty: { $regex: reg }},
        {grade: { $regex: reg }},
        {guide_teacher: { $regex: reg }},
        {award_name: { $regex: reg }},
        {level: { $regex: reg }},
        {organizer: { $regex: reg }}
      ]
    }
  )
  awardQueryModel.exec((err, docs) => {
    if (err) {
      res.send(err)
      return
    }
    let total = docs.length
    if (total) {
      awardQueryModel.skip(skip).limit(pageSize).exec((err, data) => {
        if (err) {
          res.send(err)
          return
        }
        res.send({ 
          'status': 0, 
          'msg': '', 
          'data': {
            list: data,
            total: total
          } 
        })
      })
    } else {
      res.send({ 'status': -1, 'msg': '没有符合条件的记录' })      
    }
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
router.get('/api/news/:id', (req, res) => {
  models.News.find({ _id: req.params.id }, (err, docs) => {
    if (err) {
      res.send(err)
      return
    }
    if (docs.length) {
      let news = docs[0]
      res.send({ 
        'status': 0, 
        'msg': '',
        'data': news
      })
    } else {
      res.send({ 'status': -1, 'msg': '未找到该记录' })
    }
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

// 上传图片
router.post('/api/upload', (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.encoding = 'utf-8' // 编码
  form.keepExtensions = true // 保留扩展名
  form.uploadDir = path.join(__dirname, '../static/imgs/competition/') //文件存储路径 最后要注意加 '/' 否则会被存在public下
  form.parse(req, (err, fields ,files) => { // 解析 formData 数据
    if(err) return next(err) 
    let { date, comp_name, comp_id } = fields
    let oldPath = files.file.path //获取文件路径 ~/public/images/<随机生成的文件名>.<扩展名>
    let originName = files.file.name //前台上传时的文件名 也就是文件原本的名字
    let imgName = originName.replace(/[^.]+/, comp_name + date) //把扩展名前的文件名给替换掉
    //为了方便存储 统一将文件名改为 <竞赛名+时间>.jpg
    let newPath = path.join(path.dirname(oldPath), imgName) 
    fs.rename(oldPath, newPath, (err) => {
      if(err) return next(err)
      models.CompInfo.updateOne({ _id: comp_id }, { $set: { img_name: imgName } }, { upsert: true }, (err) => {
          if(err) return next(err)
          res.send({ 
            'status': 0, 
            'msg': '上传成功', 
            'data': {
              imgName: imgName
            } 
          }) 
        })
      })
  })
})



module.exports = router
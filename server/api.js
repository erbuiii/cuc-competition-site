"use strict"
const models = require('./db')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')

// 创建账号接口
router.post('/api/login/createAccount', (req, res) => {
  let newAccount = new models.Login({
    account: req.body.account,
    password: req.body.password
  })

  //保存newAccount数据进MongoDB
  newAccount.save((err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send('create account succeed')
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
module.exports = router
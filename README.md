# cuc-competition-site

> A subject competition website for CUC.

## 环境配置
``` bash
## 安装Node.js
下载地址：http://nodejs.cn/download/
安装配置指南：https://www.runoob.com/nodejs/nodejs-install-setup.html

## 包管理工具 NPM --> 命令行安装依赖
安装npm（由于现在版本的nodejs已经集成npm所以无需安装，可以用npm -v 查看版本）
参考文档：https://www.npmjs.com.cn/
npm有时候有时候需要翻墙，下载速度较慢，可采用淘宝镜像cnpm：https://www.runoob.com/nodejs/nodejs-npm.html#taobaonpm

## 安装Vue.js
npm安装：npm install vue

## 安装MongoDB
```

## 快速开始
> 在项目目录下打开终端，输入命令行进行操作

``` bash
# 安装依赖
npm install

# 本地运行（默认localhost:8080）
npm run dev

# 打包静态资源
npm run build

```
## 项目技术栈

``` bash
# 前端框架
Vue.js 组件化开发框架 数据双向绑定
采用官方脚手架Vue Cli（2.x.x版本）进行快速构建
采用Webpack对文件进行打包处理（https://www.webpackjs.com/concepts/）
参考文档：https://cn.vuejs.org/v2/guide/

ElementUI 前端组件库
参考文档：https://element.eleme.cn/#/zh-CN/component/installation

Express.js 基于Node.js的Web开发框架 用于处理网络请求
参考文档：http://www.expressjs.com.cn/

Mongoose 提供数据库操作的API
参考文档：http://mongoosejs.net/

MongoDB 基于分布式文件存储的非关系型数据库
参考文档：https://www.mongodb.org.cn/
```

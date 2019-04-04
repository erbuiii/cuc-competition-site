/**
 * 拷贝对象，新对象不影响原对象
 * @param {Object} obj 
 */
const cloneObject = obj => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 取整数百分比
 * @param {Number} n 
 * @param {Number} total 
 */
const toPercent = (n, total) => {
  let res = Math.floor(n / total * 100)
  if (res < 0) res = 0
  return res > 100 ? '100%' : `${res}%`
}

/**
 * 路由跳转
 * @param {String} path 
 */
const navToPath = path => {
  this.$router.push(path)
}

/**
 * 日期格式化
 * @param {Date} date 
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  cloneObject: cloneObject,
  toPercent: toPercent,
  formatTime: formatTime,
  navToPath: navToPath
}
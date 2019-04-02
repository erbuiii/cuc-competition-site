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

module.exports = {
  cloneObject: cloneObject,
  toPercent: toPercent,
  navToPath: navToPath
}
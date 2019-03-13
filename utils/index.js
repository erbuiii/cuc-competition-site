/**
 * 拷贝对象，新对象不影响原对象
 * @param {Object} obj 
 */
const cloneObject = obj => {
  return JSON.parse(JSON.stringify(obj))
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
  navToPath: navToPath
}
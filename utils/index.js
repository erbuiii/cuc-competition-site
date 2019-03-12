/**
 * 拷贝对象，新对象不影响原对象
 * @param {Object} obj 
 */
const cloneObject = obj => {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = {
  cloneObject: cloneObject
}
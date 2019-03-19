/**
 * 缓存工具类
 * @author sachuangwei@ygsoft.com
 * @version 2018-05-02
 */

const CACHE_PREFIX = 'EASYWORK_'

/**
 * 写缓存信息
 * @param { String } key
 * @param { Object } value
 */
function set (key, value) {
  let tempValue = value
  if (tempValue) {
    tempValue = JSON.stringify(value)
  }
  window.localStorage.setItem(CACHE_PREFIX + key, tempValue)
}

/**
 * 读缓存信息
 * @param { String } key
 */
function get (key, defaultValue) {
  if (!key) {
    return defaultValue
  }
  let value = window.localStorage.getItem(CACHE_PREFIX + key)
  if (value && value !== 'undefined' && value !== 'null') {
    return JSON.parse(value)
  }
  return defaultValue
}

/**
 * 根据关键字清除缓存信息
 * @param { String } key
 */
function remove (key) {
  window.localStorage.removeItem(CACHE_PREFIX + key)
}

/**
 * 清空本地缓存信息
 */
function clear () {
  window.localStorage.clear()
}

export default {
  get,
  set,
  remove,
  clear
}

import pathToRegexp from 'path-to-regexp'

const getSessionKey = (key, defaultValue) => {
  const item = window.sessionStorage.getItem(key)
  if (item === undefined && defaultValue !== undefined) {
    return defaultValue
  }
  return item
}

const getBaseUrl = (url) => {
  var reg = /^((\w+):\/\/([^\\/:]*)(?::(\d+))?)(.*)/
  reg.exec(url)
  return RegExp.$1
}

const keyMirror = (obj) => {
  let key
  let mirrored = {}
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        mirrored[ key ] = key
      }
    }
  }
  return mirrored
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = array.map(item => ({ ...item }))
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[ data[ index ][ id ] ] = data[ index ]
  })

  data.forEach((item) => {
    let hashVP = hash[ item[ pid ] ]
    if (hashVP) {
      !hashVP[ children ] && (hashVP[ children ] = [])
      hashVP[ children ].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

const getCascadeValue = (treeData, id) => {
  let result = []
  let data = findFromTree(treeData, id)
  result.push(data.id)
  while (data.pid) {
    data = findFromTree(treeData, data.pid)
    result.push(data.id)
  }
  return result.reverse()
}

const getMaxId = (dataList) => {
  let maxId = 0
  for (let i = 0, len = dataList.length; i < len; i++) {
    if (dataList[i].id > maxId) {
      maxId = dataList[i].id
    }
  }
  return maxId + 1
}

const findFromTree = (treeArray, id, idPropName = 'id', childrenPropName = 'children') => {
  if (!treeArray || treeArray == null || treeArray.length <= 0) return null
  for (var i = 0; i < treeArray.length; i++) {
    if (treeArray[i][idPropName] === id) {
      return treeArray[i]
    } else {
      let result = findFromTree(treeArray[i][childrenPropName], id, idPropName, childrenPropName)
      if (result != null) {
        return result
      }
    }
  }
  return null
}

function getCurrentMenu (location, arrayMenu) {
  if (arrayMenu) {
    let current = []
    for (let i = 0; i < arrayMenu.length; i++) {
      const e = arrayMenu[ i ]
      const child = getCurrentMenu(location, e.children)
      if (!!child && child.length > 0) {
        child.push({ ...e, children: null })
        return child
      }
      if (e.href && pathToRegexp(e.href).exec(location)) {
        current.push({ ...e, children: null })
        return current
      }
    }
    return current
  }
  return null
}

function merge (target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i] || {}
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}

const dataFormatter = (dataList, valueArr) => {
  if (valueArr) {
    let datas = []
    for (let i = 0, len = dataList.length; i < len; i++) {
      if (contains(valueArr, dataList[i].id)) {
        datas.push(dataList[i])
      }
    }
    var names = ''
    for (var i = 0; i < datas.length; i++) {
      if (i !== datas.length - 1) {
        names += (datas[i].name + ',')
      } else {
        names += datas[i].name
      }
    }
    return names
  } else {
    return ''
  }
}

/**
 * 判断数组中是否包含对象
 * @param {数组} arr
 * @param {查找的对象} obj
 */
function contains (arr, obj) {
  var i = arr.length
  while (i--) {
    if (arr[i] === obj) {
      return true
    }
  }
  return false
}

const appendTreeNode = (treeArray, item, idPropName = 'id', parentPropName = 'parentId', childrenPropName = 'children') => {
  if (treeArray == null || treeArray.length <= 0) return
  if (!item[parentPropName] || item[parentPropName] == null) {
    let i = treeArray.findIndex(p => p.sort > item.sort)
    if (i === -1) {
      i = treeArray.length
    }
    treeArray.splice(i, 0, item)
    return
  }
  for (var j = 0; j < treeArray.length; j++) {
    var value = treeArray[j]
    if (item[parentPropName] === value[idPropName]) {
      if (value[childrenPropName] && value[childrenPropName].length > 0) {
        let i = value[childrenPropName].findIndex(p => p.sort > item.sort)
        if (i === -1) {
          i = value[childrenPropName].length
        }
        value[childrenPropName].splice(i, 0, item)
      } else {
        value[childrenPropName] = []
        value[childrenPropName].push(item)
      }
    } else {
      appendTreeNode(value[childrenPropName], item, idPropName, parentPropName, childrenPropName)
    }
  }
}

/**
 * 格式化金额显示
 * @param {*金额} s
 * @param {*保留位数} n
 */
const formatMoney = (s, n) => {
  if (s === undefined) return ''
  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\\.-]/g, '')).toFixed(n) + ''
  let l = s.split('.')[0].split('').reverse()
  let r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  return t.split('').reverse().join('') + '.' + r
}

const getClientHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

/**
 * 按保留位数补0
 * @param {*数值} number
 * @param {*保留位数} digits
 */
const fillZero = (number, digits) => {
  number = String(number)
  var length = number.length
  if (number.length < digits) {
    for (var i = 0; i < digits - length; i++) {
      number = '0' + number
    }
  }
  return number
}

/**
 * 格式化日期
 * @param {*日期毫秒} date
 */
const formatDate = (date) => {
  if (!date) {
    return ''
  }
  // 获取js 时间戳
  let curDate = new Date()
  // 存储转换值
  let s
  let date1 = new Date(date)

  if (date1.getFullYear() === curDate.getFullYear()) {
    s = fillZero(date1.getMonth() + 1, 2) + '-' + fillZero(date1.getDate(), 2)
  } else {
    // 其他年超过一天
    s = String(date1.getFullYear()).substr(2) + '-' + fillZero(date1.getMonth() + 1, 2) + '-' + fillZero(date1.getDate(), 2)
  }
  return s
}

/**
 * 格式化日期时间
 * @param {*日期毫秒} dateNum
 * @param {*日期显示格式} fmt "yyyy-MM-dd hh:mm:ss"或 "yyyy-MM-dd"
 */
const formatDateTime = (dateNum, fmt) => {
  var date = new Date(dateNum)
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

const userFormatter = (value, userList) => {
  let result = ''
  for (let i = 0, len = userList.length; i < len; i++) {
    if (userList[i].email === value) {
      result = userList[i].userName
    }
  }
  return result
}

/**
 * 对象深度复制
 * @param {*对象数组} source
 */
const deepCopy = (source) => {
  var sourceCopy = source instanceof Array ? [] : {}
  for (var item in source) {
    // typeof null 会返回 "object"，防止有属性为null时被复制为[object, object]
    if (source[item] == null) {
      sourceCopy[item] = source[item]
    } else {
      sourceCopy[item] = typeof source[item] === 'object' ? deepCopy(source[item]) : source[item]
    }
  }
  return sourceCopy
}

const subDate = (sDate, dDate) => {
  return (sDate.getTime() - dDate.getTime()) / 1000 / 60 / 60 / 24
}

/**
 * 计算开始结束时间范围的工作日天数
 * @param {开始时间} startDate
 * @param {结束时间} endDate
 */
const subWorkDate = (startDate, endDate) => {
  let misDay = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
  console.log(misDay)
  let [year, month, day] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]
  let tmpDay, tmpDate
  let result = 0
  for (let i = 0; i <= misDay; i++) {
    tmpDay = day + i
    tmpDate = new Date(year, month, tmpDay)
    // 排除周日
    if ((tmpDate.getDay() !== 0) && (tmpDate.getDay() !== 6)) {
      result += 1
    }
  }
  return result
}

/**
 * 判断同一天
 * @param {*} a
 * @param {*} b
 */
const eqDate = (a, b) => {
  let [start, end] = [new Date(a), new Date(b)]
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return (start - end) === 0
}

/**
 * a日期小于b日期（到天）
 * @param {*} a
 * @param {*} b
 */
const ltDate = (a, b) => {
  let [start, end] = [new Date(a), new Date(b)]
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return (end - start) > 0
}

/**
 * a日期大于b日期（到天）
 * @param {*} a
 * @param {*} b
 */
const gtDate = (a, b) => {
  let [start, end] = [new Date(a), new Date(b)]
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return (start - end) > 0
}

/**
 * a日期小于等于b日期（到天）
 * @param {*} a
 * @param {*} b
 */
const lteDate = (a, b) => {
  let [start, end] = [new Date(a), new Date(b)]
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return (end - start) >= 0
}

/**
 * a日期大于等于b日期（到天）
 * @param {*} a
 * @param {*} b
 */
const gteDate = (a, b) => {
  let [start, end] = [new Date(a), new Date(b)]
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return (start - end) >= 0
}

export default {
  getSessionKey,
  getBaseUrl,
  keyMirror,
  arrayToTree,
  appendTreeNode,
  getCascadeValue,
  getMaxId,
  getCurrentMenu,
  merge,
  dataFormatter,
  formatMoney,
  getClientHeight,
  fillZero,
  formatDate,
  formatDateTime,
  deepCopy,
  userFormatter,
  subDate,
  eqDate,
  ltDate,
  gtDate,
  lteDate,
  gteDate,
  subWorkDate
}

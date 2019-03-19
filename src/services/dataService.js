import Vue from 'vue'
// const base64js = require('base64-js')

const thisVue = Vue

let DataService = function () {
  this.dataCache = []
}

DataService.prototype.sendMessage = function (message) {
  return new Promise((resolve, reject) => {
    if (message.url) {
      thisVue.http.post('/message/remindUrl', message).then((res) => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    } else {
      message.content = '【Easywork提醒】' + message.content
      thisVue.http.post('/message/sendMessage', message).then((res) => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

/**
 * 获取序列下一个值
 * @param {序列关键字} key
 */
DataService.prototype.getSequence = function (key) {
  return new Promise((resolve, reject) => {
    thisVue.http.get('/data/counter/' + key).then((res) => {
      if (res && res.data) {
        resolve(res.data.value)
      } else {
        reject(new Error())
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 分组查询
 * @param {序列关键字} key
 */
DataService.prototype.group = function (url, condition) {
  return new Promise((resolve, reject) => {
    thisVue.http.post(url, condition).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      } else {
        reject(new Error())
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * @param {*参数名} csName
 */
DataService.prototype.getXtcs = function (csName) {
  let cacheKey = csName
  return new Promise((resolve, reject) => {
    if (cacheKey && this.dataCache[cacheKey]) {
      resolve(this.dataCache[cacheKey])
    } else {
      let condition = {
        csName: csName
      }
      thisVue.http.post(thisVue.apiUrl.SYS_FIND_XTCS, condition).then((res) => {
        if (res && res.data && (res.data.length === 1)) {
          resolve(res.data[0])
          this.dataCache[cacheKey] = res.data[0]
        } else {
          resolve()
          alert('请配置系统参数(' + csName + ')')
        }
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    }
  })
}

/**
 * 查询数据.
 * @param {*请求URL} url
 * @param {*查询条件，可不传} condition
 * @param {*是否需要缓存，默认缓存} isCahce
 */
DataService.prototype.find = function (url, condition, isCache = false) {
  let srcKey = '12345678'
  if (condition) {
    srcKey = JSON.stringify(condition).split('').reverse().join('')
  }
  let cacheKey = thisVue.encrypt.encrypt(url, srcKey)
  return new Promise((resolve, reject) => {
    if (cacheKey && this.dataCache[cacheKey] && isCache) {
      resolve(this.dataCache[cacheKey])
    } else {
      if ((condition === null) || (condition === undefined)) {
        thisVue.http.get(url).then((res) => {
          if (res && res.data) {
            if (cacheKey && isCache) {
              this.dataCache[cacheKey] = res.data
            }
            resolve(res.data)
          } else {
            resolve()
          }
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      } else {
        thisVue.http.post(url, condition).then((res) => {
          if (res && res.data) {
            if (cacheKey && isCache) {
              this.dataCache[cacheKey] = res.data
            }
            resolve(res.data)
          } else {
            resolve()
          }
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      }
    }
  })
}

/**
 * 保存数据.
 * @param {*请求URL} url
 * @param {*保存数据，支持单个和数组} doc
 */
DataService.prototype.save = function (url, doc, opt = {}) {
  return new Promise((resolve, reject) => {
    thisVue.http.post(url, doc, opt).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 通过_id删除单条记录.
 * @param {*请求URL} url
 */
DataService.prototype.deleteById = function (url) {
  return new Promise((resolve, reject) => {
    thisVue.http.get(url).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 通过条件批量删除.
 * @param {*请求URL} url
 * @param {*删除条件} condition
 */
DataService.prototype.delete = function (url, condition) {
  return new Promise((resolve, reject) => {
    thisVue.http.post(url, condition).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 通过_id更新数据.
 * @param {*请求URL} url
 * @param {*新数据} doc
 */
DataService.prototype.update = function (url, doc) {
  return new Promise((resolve, reject) => {
    thisVue.http.post(url, doc).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 获取图片.
 * @param {*请求URL} url
 */
DataService.prototype.getImage = function (url) {
  return new Promise((resolve, reject) => {
    thisVue.http.get(url).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 查询总数.
 * @param {*表名} tableName
 * @param {*条件} condition
 */
DataService.prototype.findCount = function (tableName, condition) {
  return new Promise((resolve, reject) => {
    thisVue.http.post('/data/findCount/' + tableName, condition).then((res) => {
      if (res && res.data) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

export default new DataService()

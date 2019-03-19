import Vue from 'vue'

let Enums = function () {
  // 缓存枚举类型
  this.enumTypeCache = []

  // 缓存枚举
  this.enumCache = []
}

Enums.prototype.getEnumType = function (key) {
  return new Promise((resolve, reject) => {
    if (this.enumTypeCache[key]) {
      resolve(this.enumTypeCache[key])
    } else {
      let conditions = {
        'key': key
      }
      Vue.http.post('/data/find/enumTypes', conditions).then((res) => {
        if (res && res.data && (res.data.length === 1)) {
          this.enumTypeCache[key] = res.data[0]
          resolve(this.enumTypeCache[key])
        }
      }, (err) => {
        reject(err)
      })
    }
  })
}

Enums.prototype.getEnum = function (key) {
  return new Promise((resolve, reject) => {
    if (this.enumCache[key]) {
      resolve(this.enumCache[key])
    } else {
      let conditions = {
        key: key
      }
      Vue.http.post('/data/find/enumTypes', conditions).then((res) => {
        if (res && res.data && (res.data.length === 1)) {
          this.enumTypeCache[key] = res.data[0]
          let conditions = {
            enumTypeId: this.enumTypeCache[key].id
          }
          Vue.http.post('/data/find/enums', conditions).then((res) => {
            if (res && res.data) {
              this.enumCache[key] = res.data
              resolve(this.enumCache[key])
            }
          }, (err) => {
            reject(err)
          })
        } else {
          resolve([])
        }
      })
    }
  })
}

Enums.prototype.enumFormat = function (key, id) {
  let result = ''
  if (this.enumCache[key]) {
    for (let i = 0, len = this.enumCache[key].length; i < len; i++) {
      if (Number(id) === this.enumCache[key][i].id) {
        result = this.enumCache[key][i].name
      }
    }
  } else {
    this.getEnum(key).then(() => {
      for (let i = 0, len = this.enumCache[key].length; i < len; i++) {
        if (Number(id) === this.enumCache[key][i].id) {
          result = this.enumCache[key][i].name
        }
      }
    })
  }
  return result
}

Enums.prototype.enumReFormat = function (key, name) {
  let data = this.enumCache[key].find((item) => item.name === name)
  if (data) {
    return data.id
  } else {
    return ''
  }
}

export default new Enums()

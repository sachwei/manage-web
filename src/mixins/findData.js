/*
 * 通用方法
 * @Author: 490232365@qq.com
 * @Date: 2018-05-23 17:32:30
 */

export default {
  methods: {
    findAllUser () {
      return new Promise((resolve, reject) => {
        return this.$dataService.find(this.$apiUrl.SYS_ALL_USER).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    findAllMenu () {
      return new Promise((resolve, reject) => {
        this.$dataService.find(this.$apiUrl.SYS_ALL_MENU).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    findAllOrg () {
      return new Promise((resolve, reject) => {
        return this.$dataService.find(this.$apiUrl.SYS_ALL_ORG).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    findAllRole () {
      return new Promise((resolve, reject) => {
        return this.$dataService.find(this.$apiUrl.SYS_ALL_ROLE).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  }
}

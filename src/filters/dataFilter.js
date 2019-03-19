/*
 * @Author: sachuangwei@ygsoft.com
 * @Date: 2018-04-28 17:26:23
 */
import Vue from 'vue'

export default {
  filters: {
    enumFilter: (value, key) => {
      return Vue.enumService.enumFormat(key, value)
    },
    userFilter: (value, userList) => {
      for (let i = 0, len = userList.length; i < len; i++) {
        if (userList[i].email === value) {
          return userList[i].userName
        }
      }
      return ''
    },
    /**
     * 格式化日期时间
     * @param {*日期毫秒} dateNum
     * @param {*日期显示格式} fmt "yyyy-MM-dd hh:mm:ss"或 "yyyy-MM-dd"
     */
    dateFilter: (value, fmt) => {
      if (!value) {
        return ''
      }
      var date = new Date(value)
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
  }
}

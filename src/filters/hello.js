/*
 * @Author: sachuangwei@ygsoft.com
 * @Date: 2018-04-28 17:26:23
 */

export default {
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  data () {
    return {
      msg: 'hello world'
    }
  }
}

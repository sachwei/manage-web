/**
 * 初始化vue全局插件
 * @author 490232365@qq.com
 * @version 2018-04-29
 */

import httpService from '../services/httpService'
import localStore from '../utils/localStore'
import encrypt from '../utils/encrypt'

import Element from 'element-ui'
import VueProgressBar from 'vue-progressbar'
import myPanel from '../components/panel'
import checkboxGroup from '../components/checkbox-group'
import radioGroup from '../components/radio-group'
import vueDrag from 'vue-dragging'
import Overdrive from 'vue-overdrive'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import apiUrl from '../services/sysApi'
import dataService from '../services/dataService'
import enumService from '../services/enumService'
import messageService from '../services/messageService'
import utils from '../utils/utils'

// 解决所有兼容性问题
import 'babel-polyfill'

// element-ui默认主题样式
import 'element-ui/lib/theme-chalk/index.css'

// 公用动画
import 'animate.css'

// 图标库
import 'font-awesome/css/font-awesome.css'

// mutation-types
import mutationTypes from '../store/mutation-types'

// mixins
import common from '../mixins/common'
import findData from '../mixins/findData'
import manage from '../mixins/manage'

// filters
import dataFilter from '../filters/dataFilter'

/**
 * 定义实例方法
 * @param { Object } Vue
 */
function initVuePrototype (Vue) {
  Vue.prototype.$encrypt = encrypt
  Vue.prototype.$http = httpService.getAxios
  Vue.prototype.$httpService = httpService
  Vue.prototype.$localStore = localStore
  Vue.prototype.$mutationTypes = mutationTypes
  Vue.prototype.$apiUrl = apiUrl
  Vue.prototype.$dataService = dataService
  Vue.prototype.$utils = utils
  Vue.prototype.$enumService = enumService
  Vue.prototype.$messageService = messageService
}

/**
 * 定义全局方法
 * @param { Object } Vue
 */
function initVueGlobalMethods (Vue) {
  Vue.http = httpService.getAxios
  Vue.httpService = httpService
  Vue.localStore = localStore
  Vue.dataService = dataService
  Vue.mutationTypes = mutationTypes
  Vue.encrypt = encrypt
  Vue.enumService = enumService
  Vue.messageService = messageService
  Vue.apiUrl = apiUrl
  Vue.utils = utils
}
/**
 * 注入组件
 * @param { Object } Vue
 */
function initVueMixins (Vue) {
  Vue.mixin(common)
  Vue.mixin(findData)
  Vue.mixin(manage)
  Vue.mixin(dataFilter)
}

/**
 * 添加全局资源，包括组件、指令、过滤器
 * @param { Object } Vue
 */
function initVueResources (Vue) {
  // 组件
  Vue.use(Element)
  Vue.use(VueProgressBar, {
    color: 'rgb(0, 100, 175)',
    failedColor: 'red',
    height: '2px'
  })
  Vue.use(myPanel)
  Vue.use(checkboxGroup)
  Vue.use(radioGroup)
  Vue.use(vueDrag)
  Vue.use(Overdrive)
}

const plugin = {
  install (Vue, options) {
    if (options) {
      console.log('options:' + JSON.stringify(options))
    }
    // 添加全局方法或者属性
    initVueGlobalMethods(Vue)
    // 配置全局工具类
    initVuePrototype(Vue)
    // 注入组件
    initVueMixins(Vue)
    // 添加全局资源
    initVueResources(Vue)
  }
}

export default plugin
export const install = plugin.install

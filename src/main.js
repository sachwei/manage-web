// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'
import globalPlugins from './plugins/globalPlugins'

Vue.config.productionTip = false

// 插件注册
Vue.use(globalPlugins)

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  vuex,
  components: { App },
  template: '<App/>'
})

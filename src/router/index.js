import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import encrypt from '../utils/encrypt'

Vue.use(Router)

let router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'backlogView') {
    next()
  }
  logincc().then(() => {
    console.log('cici登录')
    next()
  }).catch(() => {
    next()
  })
})

function getRequestParam (paramName) {
  let params = (window.location.href.split('?')[1]).split('&')
  let param
  for (let i = 0; i < params.length; i++) {
    if (params[i].indexOf(paramName) !== -1) {
      param = params[i]
      break
    }
  }
  return param.split('=')[1]
}

function logincc () {
  return new Promise((resolve, reject) => {
    initContext().then((loginInfo) => {
      console.log(loginInfo)
      const userName = encodeURIComponent(loginInfo.userName)
      const password = encodeURIComponent(encrypt.encrypt(loginInfo.password, loginInfo.userName))
      const param = `userName=${userName}&password=${password}&loginCode=&loginType=1&deviceId=00%3A15%3A5d%3A04%3A0f%3A00`
      Vue.http.post('/user/login', {key: param}).then((response) => {
        if (response && response.data) {
          Vue.localStore.set('userInfo', response.data)
          resolve()
        } else {
          reject(new Error())
        }
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

function initContext () {
  return new Promise((resolve, reject) => {
    let loginInfo = {}
    var parentScope = null
    if (window.parent.angular) {
      var topicItemId = getRequestParam('topicItemId')
      console.log(topicItemId)
      if (topicItemId) {
        parentScope = window.parent.angular.element('#h5_' + topicItemId).scope()
        console.log(parentScope)
        console.log(parentScope.localFunc)
        if (parentScope && parentScope.localFunc) {
          console.log(parentScope.localFunc.currentUser())
          var currentUser = parentScope.localFunc.currentUser()
          loginInfo.userName = currentUser.email
          console.log(parentScope.localFunc.getLoginPassword())
          if (parentScope.localFunc.getLoginPassword) {
            loginInfo.password = parentScope.localFunc.getLoginPassword()
            resolve(loginInfo)
          }
        }
      }
    }
    reject(new Error())
  })
}

export default router

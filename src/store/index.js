import Vue from 'vue'
import Vuex from 'vuex'
import mutationTypes from './mutation-types'
import sprint from '../modules/sprint/store/index'
import backlog from '../modules/backlog/store/index'
import bug from '../modules/bug/store/index'
import rushJob from '../modules/rushjob/store/index'
import bugAnalysize from '../modules/analysize/store/index'
import learn from '../modules/learn/store/index'
import test from '../modules/test/store/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    sprint: sprint,
    backlog: backlog,
    bug: bug,
    rushJob: rushJob,
    bugAnalysize: bugAnalysize,
    learn: learn,
    test: test
  },
  state: {
    menuList: {},
    curMenu: '',
    sidebar: {
      collapsed: false
    },
    headerVisible: false,
    device: {
      isMobile: false
    },
    user: {},
    userList: []
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {
    getUser (state) {
      return state.user
    },
    getSameRoleUser (state) {
      return state.userList.filter(item => {
        return (item.roleIds.filter(v => state.user.roleIds.includes(v))).length > 0
      })
    }
  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    [mutationTypes.SET_USER_INFO] (state, payload) {
      state.user = payload
    },

    [mutationTypes.TOGGLE_SIDEBAR] (state, payload) {
      if (payload !== undefined) {
        state.sidebar.collapsed = payload
      } else {
        state.sidebar.collapsed = !state.sidebar.collapsed
      }
    },

    [mutationTypes.TOGGLE_HEADER] (state, payload) {
      if (payload !== undefined) {
        state.headerVisible = payload
      } else {
        state.headerVisible = !state.headerVisible
      }
    },

    setUserList (state, payload) {
      state.userList = payload
    },

    setCurMenu (state, payload) {
      state.curMenu = payload
    }
  },

  actions: {
    getUserList ({commit, state}, orgId) {
      let condition = {
        orgId: orgId
      }
      Vue.dataService.save(Vue.apiUrl.BASE_FIND + 'users', condition).then((data) => {
        commit('setUserList', data)
      })
    }
  }
})

export default store

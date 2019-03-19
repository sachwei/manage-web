import Vue from 'vue'

const learn = {
  state: {
    shareList: [],
    types: [],
    total: 0
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {
    getShare: (state) => (id) => {
      return state.shareList.find(item => item.id === id)
    },
    filterShareList: (state) => (type) => {
      return state.shareList.filter(item => item.type === type)
    }
  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    setTypes (state, payload) {
      state.types = payload
    },
    setShareList (state, payload) {
      state.shareList = payload.content
      state.total = payload.total
    },
    addShare (state, payload) {
      state.shareList.splice(0, 0, payload)
    },
    deleteShare (state, payload) {
      state.shareList = state.shareList.filter(item => item._id !== payload._id)
    },
    updateShare (state, payload) {
      for (let i = 0, len = state.shareList.length; i < len; i++) {
        if (state.shareList[i]._id === payload._id) {
          state.shareList[i] = payload
        }
      }
    }
  },

  actions: {
    findShareListWithPage ({commit, state}, options) {
      return new Promise((resolve, reject) => {
        let queryParam = {
          conditions: {
            type: { '$in': state.types }
          },
          options: options
        }
        if (state.types.length === 0) {
          delete queryParam.conditions.type
        }
        Vue.dataService.find(Vue.apiUrl.BASE_FIND_PAGE + 'shareCourses', queryParam).then((data) => {
          commit('setShareList', data)
          resolve(data)
        })
      })
    }
  }
}

export default learn

import Vue from 'vue'

const sprint = {
  state: {
    product: {},
    sprintId: undefined,
    backlogList: []
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {
    todoBacklogList: (state) => {
      return state.backlogList.filter(item => {
        return !item.sprintId || (item.sprintId === '')
      })
    },
    getBacklog: (state) => (id) => {
      return state.backlogList.find(item => item.id === id)
    }
  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    setProduct (state, payload) {
      state.product = payload
    },
    setSprintId (state, payload) {
      state.sprintId = payload
    },
    setBacklogList (state, payload) {
      state.backlogList = payload
    },
    addBacklog (state, payload) {
      state.backlogList.push(payload)
    },
    updateBacklog (state, payload) {
      for (let i = 0, len = state.backlogList.length; i < len; i++) {
        if (state.backlogList[i]._id === payload._id) {
          state.backlogList[i] = payload
        }
      }
    },
    deleteBacklog (state, payload) {
      state.backlogList = state.backlogList.filter(item => item._id !== payload)
    }
  },

  actions: {
    switchProduct ({commit, state}, product) {
      commit('setProduct', product)

      let condition = {
        'productId': product.id,
        'sprintId': ''
      }
      Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'backlogs', condition).then((data) => {
        commit('setBacklogList', data)
      })
    },
    findSprintBacklogs ({commit, state}, sprintId) {
      commit('setSprintId', sprintId)

      let condition = {
        'sprintId': sprintId
      }

      return new Promise((resolve, reject) => {
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'backlogs', condition).then((data) => {
          commit('setBacklogList', data)
          resolve()
        })
      })
    },
    newBacklog ({commit, state}, backlog) {
      return new Promise((resolve, reject) => {
        backlog.productId = state.product.id
        Vue.dataService.save(Vue.apiUrl.BASE_SAVE + 'backlogs', backlog).then((data) => {
          commit('addBacklog', data)
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  }
}

export default sprint

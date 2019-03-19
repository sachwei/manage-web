import Vue from 'vue'

const sprint = {
  state: {
    product: {},
    sprintList: [],
    curSprint: {},
    backlogList: []
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {
    getSprint: (state) => (id) => {
      return state.sprintList.find(item => item.id === id)
    },
    getBacklogList: (state) => (backlogState) => {
      return state.backlogList.filter(item => item.state === backlogState)
    },
    getBacklogCount: (state) => (backlogState) => {
      return state.backlogList.filter(item => item.state === backlogState).length
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
    setSprintList (state, payload) {
      state.sprintList = payload
    },
    addSprint (state, payload) {
      state.sprintList.push(payload)
    },
    updateSprint (state, payload) {
      for (let i = 0, len = state.sprintList.length; i < len; i++) {
        if (state.sprintList[i]._id === payload._id) {
          state.sprintList[i] = payload
        }
      }
    },
    deleteSprint (state, payload) {
      state.sprintList = state.sprintList.filter(item => item._id !== payload)
    },
    setCurSprint (state, payload) {
      state.curSprint = payload
    },
    setBacklogList (state, payload) {
      state.backlogList = payload
    },
    removeBacklog (state, payload) {
      state.backlogList = state.backlogList.filter(item => item._id !== payload._id)
    }
  },

  actions: {
    switchProduct ({commit, state}, product) {
      commit('setProduct', product)

      let condition = {
        'productId': product.id
      }
      Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'sprints', condition).then((data) => {
        let d = data.sort((b, a) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        })
        commit('setSprintList', d)
      })
    },
    switchSprint ({commit, state}, sprint) {
      return new Promise((resolve, reject) => {
        let condition = {
          sprintId: sprint.id
        }
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'backlogs', condition).then((data) => {
          commit('setBacklogList', data)
          commit('setCurSprint', sprint)
          resolve()
        })
      })
    },
    findBacklogList ({commit, state}, sprintId) {
      return new Promise((resolve, reject) => {
        let condition = {
          'sprintId': sprintId
        }
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'backlogs', condition).then((data) => {
          resolve(data)
        })
      })
    },
    newSprint ({commit, state}, sprint) {
      return new Promise((resolve, reject) => {
        sprint.productId = state.product.id
        Vue.dataService.save(Vue.apiUrl.BASE_SAVE + 'sprints', sprint).then((data) => {
          commit('addSprint', data)
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    removeBacklog ({commit, state}, backlog) {
      let updateData = {
        sprintId: ''
      }
      Vue.dataService.update(Vue.apiUrl.BASE_UPDATE + 'backlogs/' + backlog._id, updateData).then((data) => {
        commit('removeBacklog', backlog)
      })
    }
  }
}

export default sprint

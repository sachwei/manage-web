import Vue from 'vue'

const rushJob = {
  state: {
    rushJobs: []
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {

  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    setRushJobs (state, payload) {
      state.rushJobs = payload
    },
    addRushJob (state, payload) {
      state.rushJobs.push(payload)
    },
    deleteRushJob (state, payload) {
      state.rushJobs = state.rushJobs.filter(item => {
        return item._id !== payload._id
      })
    },
    updateRushJob (state, payload) {
      state.rushJobs.forEach(item => {
        if (item._id === payload._id) {
          item = payload
        }
      })
    }
  },

  actions: {
    findRushJobs ({ commit }, userId) {
      let t = new Date(new Date().getFullYear(), 1, 1)
      let condition = {
        startTime: { '$gt': t },
        userId: userId
      }
      Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'rushJobs', condition).then((data) => {
        let dataList = data.sort((a, b) => {
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        })
        commit('setRushJobs', dataList)
      })
    }
  }
}

export default rushJob

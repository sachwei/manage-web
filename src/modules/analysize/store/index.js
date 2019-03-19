import Vue from 'vue'

const bugAnalysize = {
  state: {
    dateRange: []
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {

  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    setDateRange (state, payload) {
      state.dateRange = payload
    }
  },

  actions: {
    findBacklogList ({ commit, state, rootState }) {
      let [startDate, endDate] = [...state.dateRange]
      let t = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
      let e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      let condition = {
        '$or': [
          { 'tasks.endDate': { '$gte': t, '$lte': e } },
          { 'endTestDate': { '$gte': t, '$lte': e } }
        ]
      }
      return new Promise((resolve, reject) => {
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'backlogs', condition).then((data) => {
          commit('setBacklogList', data)
          resolve()
        })
      })
    }
  }
}

export default bugAnalysize

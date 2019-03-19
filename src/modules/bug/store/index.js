import Vue from 'vue'

const sprint = {
  state: {
    bugList: [],
    curSprintId: 0,
    filterText: '',
    isTodo: 'todo'
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {
    getBug: (state) => (id) => {
      return state.bugList.find(item => item.id === id)
    },
    filterBugList: (state) => {
      return state.bugList.filter(item => {
        return (item.sprintId === state.curSprintId) && ((item.name.indexOf(state.filterText) !== -1) || (item.id.indexOf(state.filterText) !== -1))
      })
    }
  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    setBugList (state, payload) {
      state.bugList = payload
    },
    setFilterText (state, payload) {
      state.filterText = payload
    },
    addBug (state, payload) {
      state.bugList.push(payload)
    },
    deleteBug (state, payload) {
      state.bugList = state.bugList.filter(item => item._id !== payload)
    },
    setCurSprintId (state, payload) {
      state.curSprintId = payload
    },
    setIsTodo (state, payload) {
      state.isTodo = payload
    }
  },

  actions: {
    findBugList ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.isTodo === 'todo') {
          dispatch('findTodoBug').then((data) => {
            commit('setBugList', data)
            resolve()
          })
        } else {
          dispatch('findDoneBug').then((data) => {
            commit('setBugList', data)
            resolve()
          })
        }
      })
    },
    findTodoBug ({commit, state, rootState}) {
      let condition = {
        curUserId: rootState.user.email,
        state: { '$ne': 5 }
      }
      return new Promise((resolve, reject) => {
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'bugs', condition).then((data) => {
          resolve(data)
        })
      })
    },
    findDoneBug ({commit, state, rootState}) {
      // 查询三月内
      let t = new Date()
      t.setMonth(t.getMonth() - 3)
      let condition = {
        'orbits.optUserId': rootState.user.email,
        'orbits.optTime': { '$gt': t }
      }
      return new Promise((resolve, reject) => {
        let data = []
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'bugs', condition).then((dataList) => {
          for (let i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].curUserId !== rootState.user.email) {
              data.push(dataList[i])
            }
          }
          resolve(data)
        })
      })
    },
    findBugById ({commit, state}, id) {
      let condition = {
        id: id
      }
      return new Promise((resolve, reject) => {
        Vue.dataService.find(Vue.apiUrl.BASE_FIND + 'bugs', condition).then((data) => {
          if (data && (data.length === 1)) {
            resolve(data[0])
          }
        })
      })
    },
    updateBug ({commit, state, rootState}, payload) {
      for (let i = 0, len = state.bugList.length; i < len; i++) {
        if (state.bugList[i] && (state.bugList[i]._id === payload._id)) {
          state.bugList[i] = payload
          if ((state.isTodo === 'todo') && payload.curUserId !== rootState.user.email) {
            commit('deleteBug', payload._id)
          }
        }
      }
    }
  }
}

export default sprint

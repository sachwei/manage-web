const testcase = {
  state: {
    dataList: [],
    filterText: ''
  },

  // 时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
  getters: {
    getCase: (state) => (id) => {
      return state.dataList.find(item => item.id === id)
    },
    filterDataList: (state) => {
      return state.dataList.filter(item => {
        return (item.name.indexOf(state.filterText) !== -1) || (String(item.id).indexOf(state.filterText) !== -1)
      })
    }
  },

  /**
   * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
   * 一条重要的原则就是要记住 mutation 必须是同步函数
   */
  mutations: {
    setFilterText (state, payload) {
      state.filterText = payload
    },
    setDataList (state, payload) {
      state.dataList = payload
    },
    addCase (state, payload) {
      state.dataList.push(payload)
    },
    deleteCase (state, payload) {
      state.dataList = state.dataList.filter(item => item._id !== payload)
    }
  },

  actions: {
  }
}

export default testcase

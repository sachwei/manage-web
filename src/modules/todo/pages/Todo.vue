<template>
  <panel>
    <div class="todo-wrapper">
      <div class="todo-toolbar">
        <div class="todo-toolbar-left">
          <el-radio-group v-model="isTodo" size="small">
            <el-radio-button label="todo">待办</el-radio-button>
            <el-radio-button label="done">已办</el-radio-button>
          </el-radio-group>
          <radio-group class="margin-left-10" :list="sprintList" v-model="curSprint"></radio-group>
        </div>
        <div class="todo-toolbar-right">
          <el-input
            placeholder="编码 / 摘要"
            class="search-input margin-left-10"
            prefix-icon="el-icon-search"
            size="small"
            v-model="searchText">
          </el-input>
          <add-button @onClick="onNewBug"></add-button>
          <el-button @click="onRefresh" class="btn-refresh" icon="el-icon-refresh" circle></el-button>
        </div>
      </div>
      <bug-list class="todo-table"></bug-list>
      <transition mode="out-in" name="fade" appear>
        <router-view></router-view>
      </transition>
    </div>
  </panel>
</template>

<script>
import bugList from '../../bug/components/bug-list'
import addButton from '../../../components/add-button/add-button'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: {
    bugList,
    addButton
  },
  data () {
    return {
      sprintList: [],
      isTodo: 'todo',
      curSprint: {},
      searchText: '',
      condition: {}
    }
  },
  watch: {
    curSprint () {
      if (this.curSprint && this.curSprint.id) {
        this.setCurSprintId(this.curSprint.id)
      }
    },
    isTodo () {
      this.setIsTodo(this.isTodo)
      this.initData()
    },
    searchText () {
      this.setFilterText(this.searchText)
    }
  },
  computed: {
    bugList () {
      return this.$store.state.bug.bugList
    }
  },
  methods: {
    initParam () {
      this.setBugList([])
      this.setIsTodo(this.isTodo)
    },
    initData () {
      setTimeout(() => {
        this.findBugList().then(() => {
          this.findSprint()
        })
      }, 500)
    },
    onNewBug () {
      this.$router.push({ path: 'list/detail' })
    },
    onRefresh () {
      this.initData()
    },
    findSprint () {
      this.findDataByOrgId('sprints').then((data) => {
        this.filterSprint(data)
      })
    },
    filterSprint (data) {
      this.sprintList = data.filter(item => {
        if (this.bugList.find(bug => bug.sprintId === item.id)) {
          return item
        }
      })
      this.curSprint = this.sprintList[0]
    },
    ...mapMutations(['setCurSprintId', 'setIsTodo', 'setFilterText', 'setBugList']),
    ...mapActions(['findBugList'])
  }
}
</script>

<style>
  .el-table--border::after, .el-table--group::after, .el-table::before{
    z-index: inherit;
  }

  .el-tabs__nav{
    z-index: inherit;
  }
</style>

<style scoped lang="scss">
  .todo-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .todo-toolbar{
      flex: 0 0 50px;
      display: flex;
      align-items: center;

      .todo-toolbar-left{
        flex: 1 1 200px;
        display: flex;
        align-items: center;
      }

      .todo-toolbar-right{
        .search-input{
          width: 240px;
        }

        .btn-refresh{
          margin-left: 5px !important;
        }
      }
    }

    .todo-table{
      flex: 1 1 200px;
    }
  }

  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

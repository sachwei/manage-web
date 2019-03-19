<template>
  <panel>
    <div class="sprint-board-wrapper">
      <div class="board-bar">
        <radio-group class="sprint-radio-group" :list="sprintList" v-model="curSprint"></radio-group>
        <div class="board-toolbar">
          <i class="fa fa-arrows-alt" @click="onExpand"></i>
          <i class="fa fa-refresh" @click="onRefresh"></i>
          <i class="fa fa-line-chart" @click="onViewChart"></i>
        </div>
        <radio-group class="sprint-filter-type" enumTypeId="BOARD_FILTER_TYPE" v-model="filterType"></radio-group>
      </div>
      <div class="sprint-board">
        <el-col :span="todoSpan">
          <drag-list :editable="editable" :state="0" :filterType="filterType" title="todo"></drag-list>
        </el-col>
        <el-col :span="doingSpan">
          <drag-list :editable="editable" :state="1" :filterType="filterType" title="doing"></drag-list>
        </el-col>
        <el-col :span="vertifySpan">
          <drag-list :editable="editable" :state="2" :filterType="filterType" title="vertify"></drag-list>
        </el-col>
      </div>
    </div>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import mutationTypes from '../../../store/mutation-types'
import dragList from '../components/drag-list'

export default {
  components: {
    dragList
  },
  data () {
    return {
      curSprint: {},
      filterType: {},
      sprintList: [],
      editable: false
    }
  },
  computed: {
    backlogCount () {
      return this.$store.state.sprint.backlogList.length
    },
    todoCount () {
      return this.$store.getters.getBacklogCount(0)
    },
    doingCount () {
      return this.$store.getters.getBacklogCount(1)
    },
    vertifyCount () {
      return this.$store.getters.getBacklogCount(2)
    },
    todoSpan () {
      if (this.todoCount === 0) {
        if ((this.doingCount === 0) && (this.vertifyCount === 0)) {
          return 8
        } else {
          return 2
        }
      } else {
        if ((this.doingCount === 0) && (this.vertifyCount !== 0)) {
          return 11
        } else if ((this.doingCount !== 0) && (this.vertifyCount === 0)) {
          return 11
        } else if ((this.doingCount !== 0) && (this.vertifyCount !== 0)) {
          return 8
        } else if ((this.doingCount === 0) && (this.vertifyCount === 0)) {
          return 20
        }
      }
    },
    doingSpan () {
      if (this.doingCount === 0) {
        if ((this.todoCount === 0) && (this.vertifyCount === 0)) {
          return 8
        } else {
          return 2
        }
      } else {
        if ((this.todoCount === 0) && (this.vertifyCount !== 0)) {
          return 11
        } else if ((this.todoCount !== 0) && (this.vertifyCount === 0)) {
          return 11
        } else if ((this.todoCount !== 0) && (this.vertifyCount !== 0)) {
          return 8
        } else if ((this.todoCount === 0) && (this.vertifyCount === 0)) {
          return 20
        }
      }
    },
    vertifySpan () {
      if (this.vertifyCount === 0) {
        if ((this.todoCount === 0) && (this.doingCount === 0)) {
          return 8
        } else {
          return 2
        }
      } else {
        if ((this.doingCount === 0) && (this.todoCount !== 0)) {
          return 11
        } else if ((this.doingCount !== 0) && (this.todoCount === 0)) {
          return 11
        } else if ((this.doingCount !== 0) && (this.todoCount !== 0)) {
          return 8
        } else if ((this.doingCount === 0) && (this.todoCount === 0)) {
          return 20
        }
      }
    }
  },
  beforeDestroy () {
    this.$localStore.set('boardSprint', this.curSprint)
  },
  watch: {
    curSprint () {
      this.switchSprint(this.curSprint)
      this.editable = this.user.email === this.curSprint.sm
    }
  },
  methods: {
    initParam () {
      let boardSprint = this.$localStore.get('boardSprint')
      if (boardSprint) {
        this.curSprint = boardSprint
      }
    },
    initData () {
      this.findCurSprint()
    },
    onExpand () {
      this.toggleSidebar()
      this.toogleHeader()
    },
    onViewChart () {
      this.$router.push({ name: 'sprintChart' })
    },
    onRefresh () {
      this.switchSprint(this.curSprint)
    },
    findCurSprint () {
      let condition = {
        state: 1,
        orgId: this.user.orgId[0] || -1
      }
      this.$dataService.find(this.$apiUrl.BASE_FIND + 'sprints', condition).then((data) => {
        this.sprintList = data
        if (this.sprintList.length > 0) {
          this.sprintList.sort((a, b) => {
            return this.$utils.ltDate(a.startDate, b.startDate)
          })
          if (!this.curSprint.id) {
            this.curSprint = this.sprintList[0]
          }
        }
      })
    },
    ...mapMutations({
      toggleSidebar: mutationTypes.TOGGLE_SIDEBAR,
      toogleHeader: mutationTypes.TOGGLE_HEADER
    }),
    ...mapActions(['switchSprint'])
  }
}
</script>

<style scoped lang="scss">

  .sprint-board-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .board-bar{
      flex: 0 0 50px;
      display: flex;

      .sprint-radio-group{
        flex: 1 1 auto;
        display: flex;
        align-items: center;
      }

      .sprint-filter-type{
        flex: 0 0 260px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .board-toolbar{
        flex: 0 0 60px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #aaa;

        .fa{
          margin-left: 10px;
          cursor: pointer;
        }

        .fa:hover{
          color: #555;
        }
      }
    }
    .sprint-board{
      flex: 1 1 200px;

      .el-col{
        height: 100%;
      }
    }
  }
  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

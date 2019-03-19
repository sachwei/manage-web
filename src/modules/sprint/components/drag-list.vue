<template>
  <div class="drag-list-wrapper">
    <span class="list-group-title">{{ title }}</span>
    <draggable
      class="draggable"
      v-model="dataList"
      :options="dragOptions"
      @change="onChoose"
      @start="isDragging=true"
      @end="isDragging=false"
    >
      <transition-group name="flip-list" class="list-group" :key="1">
        <task-item :backlog="item" v-for="item in dataList" :key="item._id"></task-item>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import taskItem from './task-item'
export default {
  name: 'drag-list',
  data () {
    return {
      isDragging: false,
      delayedDragging: false,
      tableName: 'backlogs',
      dataList: []
    }
  },
  props: [
    'state',
    'title',
    'filterType',
    'editable'
  ],
  components: {
    draggable,
    taskItem
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    backlogList () {
      return this.$store.getters.getBacklogList(this.state)
    },
    filterBacklog () {
      if (this.filterType.id) {
        return this.backlogList.filter(item => {
          switch (this.filterType.id) {
            case 1: return this.filterMy(item)
            case 2: return this.filterTodo(item)
            case 3: return this.filterDelay(item)
            default:
              return true
          }
        })
      } else {
        return this.backlogList
      }
    }
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    },
    filterBacklog () {
      this.dataList = this.filterBacklog
      this.dataList.sort((a, b) => a.id - b.id)
    }
  },
  methods: {
    onChoose (evt) {
      if (evt.added) {
        this.curData = evt.added.element
        this.curData.state = this.state
        this.doUpdate().then(() => {
          if (this.state === 2) {
            this.$dataService.sendMessage({
              toEmail: this.curData.createUserId,
              content: `故事${this.curData.id}已研发完成，请验收`
            })
            this.$dataService.sendMessage({
              toEmail: this.curData.uiUserId,
              content: `故事${this.curData.id}已测试完成，请验收`
            })
            this.$dataService.sendMessage({
              toEmail: this.curData.testUserId,
              content: `故事${this.curData.id}已开发完成，可以开始测试了`
            })
          }
        })
      }
    },
    filterMy (item) {
      return item.tasks.find(task => task.userId === this.user.email) || (item.testUserId === this.user.email)
    },
    filterTodo (item) {
      return item.tasks.find(task => task.userId === undefined)
    },
    filterDelay (item) {
      return item.tasks.find(task => {
        if (task.startDate && !task.endDate) {
          // 计算延迟工作量
          let delayDay = this.getWorkDayCount(task.startDate, new Date().getTime()) - task.estimate
          if (delayDay > 0) {
            return true
          }
        }
      })
    },
    getWorkDayCount (start, end) {
      let [startDate, endDate] = [new Date(start), new Date(end)]
      let workDayCount = 0
      let misDay = Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24)
      let [year, month, day] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]
      let tmpDay, tmpDate

      for (let i = 0; i <= misDay; i++) {
        tmpDay = day + i
        tmpDate = new Date(year, month, tmpDay)
        // 不计算周末
        if ((tmpDate.getDay() !== 0) && (tmpDate.getDay() !== 6)) {
          workDayCount = workDayCount + 1
        }
      }
      return workDayCount
    }
  }
}
</script>

<style scoped lang="scss">
  .drag-list-wrapper{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .list-group-title{
    flex: 0 0 50px;
    text-align: center;
    line-height: 50px;
    font-size: 24px;
    font-weight: bold;
    border: 1px solid #ddd;
    border-right: none;
    color: #333;
  }

  .draggable{
    height: 200px;
    flex: 1 1 200px;
    overflow: auto;
    border: 1px solid #ddd;
    border-right: none;
    border-top: none;
  }

  .list-group {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    padding-top: 10px;
  }

  .flip-list-move {
    transition: transform .5s;
  }

  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }
</style>

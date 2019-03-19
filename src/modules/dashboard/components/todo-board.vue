<template>
  <div class="todo-board">
    <span v-if="bugCount" @click="onLink('/todo/list')">
      待办缺陷（<b>{{ bugCount }}</b>）
    </span>
    <span v-if="taskCount" @click="onLink('/sprint/board')">
      待办任务（<b>{{ taskCount }}</b>）
    </span>
    <span v-if="uiTaskCount" @click="onLink('/product/backlog')">
      设计任务（<b>{{ uiTaskCount }}</b>）
    </span>
    <span v-if="testBacklogCount" @click="onLink('/sprint/board')">
      测试任务（<b>{{ testBacklogCount }}</b>）
    </span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      bugCount: 0,
      taskCount: 0,
      uiTaskCount: 0,
      testBacklogCount: 0
    }
  },
  methods: {
    initData () {
      this.findBugCount()
      this.findTaskCount()
    },
    findBugCount () {
      let condition = {
        curUserId: this.user.email,
        state: { '$ne': 5 }
      }
      this.$dataService.findCount('bugs', condition).then((data) => {
        this.bugCount = data
      })
    },
    findTaskCount () {
      let condition = {
        'tasks.userId': this.user.email,
        'state': { '$ne': 3 }
      }
      this.$dataService.find(this.$apiUrl.BASE_FIND + 'backlogs', condition).then((data) => {
        if (data && data.length > 0) {
          data.forEach(item => {
            item.tasks.forEach(task => {
              if (!task.endDate && (task.userId === this.user.email)) {
                this.taskCount = this.taskCount + 1
              }
            })
          })
        }
      })
    },
    findUiTaskCount () {
      let condition = {
        uiUserId: this.user.email,
        state: { '$in': [1, 2] }
      }
      this.$dataService.findCount('backlogs', condition).then((data) => {
        this.uiTaskCount = data
      })
    },
    findTestCount () {
      let condition = {
        testUserId: this.user.email,
        endTestDate: { '$exists': false }
      }
      this.$dataService.findCount('backlogs', condition).then((data) => {
        this.testBacklogCount = data
      })
    },
    onLink (link) {
      this.setCurMenu(link)
      this.$router.push({ path: link })
    },
    ...mapMutations(['setCurMenu'])
  }
}
</script>

<style scoped lang="scss">
  .todo-board{
    display: flex;

    span{
      font-size: 14px;
      margin-right: 10px;
    }

    b{
      color: red;
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>

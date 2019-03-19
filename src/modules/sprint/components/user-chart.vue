<template>
  <div class="user-chart-wrapper">
    <ul>
      <li>
        <span class="user-name-title">姓名</span>
        <span class="user-number-title">认领</span>
        <span class="user-number-title">完成</span>
        <span class="user-number-title">延迟</span>
        <span class="user-number-title">生产率</span>
        <span class="user-number-title">投入系数</span>
      </li>
      <li v-for="userData in userDataList" :key="userData.email">
        <img class="user-head" :src="headUrl + userData.email" alt="">
        <span class="user-name">{{ userData.email | userFilter(userList) }}</span>
        <span class="user-number">{{ userData.claimTime }}</span>
        <span class="user-number">{{ userData.doneTime }}</span>
        <span class="user-number">{{ userData.delayTime }}</span>
        <span class="user-number">{{ userData.avgRate }}</span>
        <span class="user-number">{{ userData.rate }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userDataList: []
    }
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    },
    backlogList () {
      return this.$store.state.sprint.backlogList
    },
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    initData () {
      this.userDataList = this.$utils.deepCopy(this.curSprint.teams)
      this.calcUserData()
      this.calcUserAvgRate()
    },
    calcUserData () {
      this.backlogList.forEach(backlog => {
        backlog.tasks.forEach(item => {
          this.userDataList.forEach(user => {
            // 计算已认领工作量
            if (user.email === item.userId) {
              if (user.claimTime) {
                user.claimTime += item.estimate
              } else {
                user.claimTime = item.estimate
              }

              // 计算延迟工作量
              let delayDay = this.getWorkDayCount(item.startDate, item.endDate || new Date()) - item.estimate
              if (delayDay > 0) {
                if (user.delayTime) {
                  user.delayTime += delayDay
                } else {
                  user.delayTime = delayDay
                }
              }
            }

            if (item.endDate && (user.email === item.userId)) {
              // 计算累计完成工作量
              if (user.doneTime) {
                user.doneTime += item.estimate
              } else {
                user.doneTime = item.estimate
              }
            }
          })
        })
      })
    },
    calcUserAvgRate () {
      let misDay
      if (this.curSprint.state === 3) {
        misDay = this.getWorkDayCount(this.curSprint.startDate, this.curSprint.publishDate)
      } else {
        misDay = this.getWorkDayCount(this.curSprint.startDate, new Date().getTime())
      }
      if (misDay === 0) {
        misDay = 1
      }
      this.userDataList.forEach(user => {
        user.avgRate = (user.doneTime / (misDay * user.rate)).toFixed(1)
        if (isNaN(user.avgRate)) {
          user.avgRate = 0.0
        }
      })
      this.userDataList.sort((a, b) => {
        return (b.avgRate - a.avgRate) || (b.doneTime - a.doneTime)
      })
    },
    getWorkDayCount (start, end) {
      let [startDate, endDate] = [new Date(start), new Date(end)]
      let workDayCount = 0
      let misDay = Math.floor((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24)
      let [year, month, day] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]
      let tmpDay, tmpDate

      for (let i = 0; i < misDay; i++) {
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

<style>
  .el-table th{
    padding: 10px 0 !important;
  }
</style>

<style scoped lang="scss">
  .user-chart-wrapper{
    height: 100%;
    overflow-y: auto;

    ul{
      list-style: none;
      margin: 0;
      padding: 0 10px;

      li{
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }

      .user-name-title{
        font-weight: bold;
        margin-left: 34px;
        font-size: 14px;
        width: 60px;
      }
      .user-number-title{
        font-weight: bold;
        font-size: 14px;
        width: 60px;
      }

      .user-name{
        margin-left: 8px;
        font-size: 14px;
        width: 60px;
      }
      .user-number{
        font-size: 14px;
        width: 60px;
      }
    }
  }
  .user-head{
    height: 26px;
    width: 26px;
    border-radius: 15px;
  }
</style>

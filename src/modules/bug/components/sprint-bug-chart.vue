<template>
  <div id="sprint-bug-chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      dates: [],
      newData: [],
      leaveData: []
    }
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    }
  },
  methods: {
    initParam () {
      this.onresizeDraw()
    },
    initData () {
      if (this.curSprint.id) {
        this.fingBugList().then(() => {
          this.calcData()
          this.drawChart()
        })
      }
    },
    onresizeDraw () {
      window.onresize = () => {
        return (() => {
          this.refresh()
        })()
      }
    },
    refresh () {
      try {
        this.chart.dispose()
      } catch (error) {}
      try {
        this.initData()
      } catch (error) {}
    },
    findCurSprint () {
      this.findCondition = {
        id: this.curSprintId
      }
      return new Promise((resolve, reject) => {
        this.findDataByCondition('sprints').then((data) => {
          if (data && data.length === 1) {
            this.curSprint = data[0]
            resolve()
          }
        })
      })
    },
    fingBugList () {
      this.findCondition = {
        productId: this.curSprint.productId,
        sprintId: this.curSprint.id
      }
      return this.findDataByCondition('bugs')
    },
    calcData () {
      this.dates = []
      this.newData = []
      this.leaveData = []
      let startDate = new Date(this.curSprint.startDate)
      let endDate = new Date()
      let misDay = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
      let [year, month, day] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]

      let tmpDate
      let tmpDay = 0
      for (let i = 0; i <= misDay; i++) {
        tmpDay = day + i
        tmpDate = new Date(year, month, tmpDay)
        this.dates.push(this.$utils.formatDateTime(tmpDate, 'MM-dd'))
        this.newData.push(this.findNewCount(tmpDate))
        this.leaveData.push(this.findLeaveCount(tmpDate))
      }
    },
    findNewCount (date) {
      let data = {}
      let count = 0
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        data = this.dataList[i]
        if (this.$utils.eqDate(data.createTime, date)) {
          count += 1
        }
      }
      return count
    },
    findLeaveCount (date) {
      let bug = {}
      let count = 0
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        bug = this.dataList[i]
        if (this.$utils.lteDate(bug.createTime, date)) {
          if (bug.state !== 5) {
            count += 1
          } else {
            if (this.$utils.ltDate(date, bug.orbits[bug.orbits.length - 1].optTime)) {
              count += 1
            }
          }
        }
      }
      return count
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('sprint-bug-chart'))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增', '遗留'],
          right: '4%'
        },
        grid: {
          top: 40,
          left: 0,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新增',
            type: 'line',
            data: this.newData
          },
          {
            name: '遗留',
            type: 'line',
            data: this.leaveData
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #sprint-bug-chart{
    height: 100%;
    width: 100%;
  }
</style>

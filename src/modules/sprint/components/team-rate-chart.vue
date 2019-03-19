<template>
  <div id="team-rate-chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      dateList: [],
      taskRateList: [],
      sprintRateList: [],
      rateOfDay: 0,
      chart: {}
    }
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    },
    backlogList () {
      return this.$store.state.sprint.backlogList
    }
  },
  methods: {
    initParam () {
      this.onresizeDraw()
    },
    initData () {
      if (this.curSprint.id) {
        this.calcRateOfDay()
        this.calcDateAndTime()
        this.drawChart()
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
    /**
     * 计算迭代周期和每日进度
     */
    calcDateAndTime () {
      this.sprintRateList = []
      this.taskRateList = []
      this.dateList = []
      this.rateList = []

      // 项目开始、结束时间
      let startDate = new Date(this.curSprint.startDate)
      let endDate = new Date(this.curSprint.publishDate)
      let misDay = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
      let [year, month, day] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]

      let tmpDate
      let tmpDay = 0
      for (let i = 0; i <= misDay; i++) {
        tmpDay = day + i
        tmpDate = new Date(year, month, tmpDay)
        // 排除周日
        if (tmpDate.getDay() !== 0) {
          this.dateList.push(tmpDate.getDate())

          // 生产率
          let [testDayTotal, dayTotal] = [0, 0]
          let tasks, task, backlog
          if ((new Date().getTime() - tmpDate.getTime()) > 0) {
            for (let i = 0, len = this.backlogList.length; i < len; i++) {
              backlog = this.backlogList[i]
              tasks = backlog.tasks
              for (let j = 0, len = tasks.length; j < len; j++) {
                task = tasks[j]
                if ((new Date(task.endDate).getMonth() === tmpDate.getMonth()) && (new Date(task.endDate).getDate() === tmpDate.getDate())) {
                  dayTotal += task.estimate
                }
              }

              // 测试
              if ((new Date(backlog.endTestDate).getMonth() === tmpDate.getMonth()) && (new Date(backlog.endTestDate).getDate() === tmpDate.getDate())) {
                testDayTotal += task.estimate
              }
            }
            this.taskRateList.push((dayTotal / this.rateOfDay).toFixed(1))
            this.sprintRateList.push((testDayTotal / this.rateOfDay).toFixed(1))
          }
        }
      }
    },
    calcRateOfDay () {
      this.rateOfDay = 0
      let team = this.curSprint.teams
      let count = 0
      for (let i = 0, len = team.length; i < len; i++) {
        count += team[i].rate || 1
      }
      this.rateOfDay = count
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('team-rate-chart'))
      this.chart.setOption({
        legend: {
          data: ['任务生产率', '故事生产率'],
          right: '4%'
        },
        grid: {
          top: 40,
          left: 0,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateList
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '任务生产率',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
                color: 'black'
              }
            },
            data: this.taskRateList
          },
          {
            name: '故事生产率',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
                color: 'black'
              }
            },
            data: this.sprintRateList
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #team-rate-chart{
    height: 100%;
    width: 100%;
  }
</style>

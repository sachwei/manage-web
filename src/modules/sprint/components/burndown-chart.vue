<template>
  <div id="burn-down-chart" v-loading="loading"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      chart: {},
      // x轴
      dateList: [],
      // 计划线
      planDataList: [],
      // 实际线(任务维度)
      actualDataList: [],
      // 功能测试线
      testDataList: [],
      totalTime: 0,
      rateOfDay: 0,
      loading: false
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
        this.loading = true
        this.calcTotalTime()
        this.calcRateOfDay()
        this.calcDateAndTime()
        this.drawChart()
        this.loading = false
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
    calcTotalTime () {
      this.totalTime = 0
      this.backlogList.forEach((item) => {
        this.totalTime += item.estimate
      })
    },

    /**
     * 计算迭代周期和每日进度
     */
    calcDateAndTime () {
      this.dateList = []
      this.planDataList = []
      this.actualDataList = []
      this.testDataList = []

      // 项目开始、结束时间
      let startDate = new Date(this.curSprint.startDate)
      let endDate = new Date(this.curSprint.publishDate)
      let misDay = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
      let [year, month, day] = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]

      // 标准累计完成故事点
      let planTotal = 0
      // 标准剩余故事点
      let planLeftTotal = 1
      let total = 0
      let testTotal = 0

      let tmpDate
      let tmpDay = 0
      for (let i = 0; i <= misDay; i++) {
        tmpDay = day + i
        tmpDate = new Date(year, month, tmpDay)
        // 排除周日
        if (tmpDate.getDay() !== 0) {
          this.dateList.push(tmpDate.getDate())

          // 计算标准每日完成故事点
          if (planLeftTotal > 0) {
            // 标准不计算周六
            if (tmpDate.getDay() !== 6) {
              planTotal += this.rateOfDay
            }

            planLeftTotal = this.totalTime - planTotal
            if (planLeftTotal < 0) {
              planLeftTotal = 0
            }
            this.planDataList.push(planLeftTotal.toFixed(1))
          }

          let dayTotal = 0
          let testDayTotal = 0
          let tasks, task, backlog
          if ((new Date().getTime() - tmpDate.getTime()) > 0) {
            dayTotal = 0
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
                testDayTotal += backlog.estimate
              }
            }
            total = total + dayTotal
            testTotal = testTotal + testDayTotal
            this.actualDataList.push((this.totalTime - total).toFixed(1))
            this.testDataList.push((this.totalTime - testTotal).toFixed(1))
          }
        }
      }
    },
    calcRateOfDay () {
      let team = this.curSprint.teams
      let count = 0
      for (let i = 0, len = team.length; i < len; i++) {
        count += team[i].rate || 1
      }
      this.rateOfDay = count
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('burn-down-chart'))
      this.chart.setOption({
        legend: {
          data: ['标准', '实际', '测试'],
          right: 10
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
            type: 'value',
            max: this.totalTime
          }
        ],
        series: [
          {
            name: '标准',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
                color: 'black'
              }
            },
            data: this.planDataList
          },
          {
            name: '实际',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
                color: 'black'
              }
            },
            data: this.actualDataList
          },
          {
            name: '测试',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
                color: 'black'
              }
            },
            data: this.testDataList
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #burn-down-chart{
    height: 100%;
    width: 100%;
  }
</style>

<template>
  <el-row style="height:100%;width:100%">
    <el-col :span="24" style="height: 100%">
      <div id="task-type-pie"></div>
    </el-col>
  </el-row>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      chart: {},
      legendData: [],
      todoData: [],
      doingData: [],
      doneData: []
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
        this.countType()
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
    countType () {
      this.legendData = []
      this.todoData = []
      this.doingData = []
      this.doneData = []

      let todo = []
      let doing = []
      let done = []
      let tasks = []
      let task = {}
      for (let i = 0, len = this.backlogList.length; i < len; i++) {
        tasks = this.backlogList[i].tasks
        for (let j = 0, len = tasks.length; j < len; j++) {
          task = tasks[j]
          if (todo[task.type] >= 0) {
            if (!task.startDate) {
              todo[task.type] += task.estimate
            } else if (task.startDate && !task.endDate) {
              doing[task.type] += task.estimate
            } else {
              done[task.type] += task.estimate
            }
          } else {
            todo[task.type] = 0
            doing[task.type] = 0
            done[task.type] = 0
            if (!task.startDate) {
              todo[task.type] = task.estimate
            } else if (task.startDate && !task.endDate) {
              doing[task.type] = task.estimate
            } else {
              done[task.type] = task.estimate
            }
          }
        }
      }
      for (let key in todo) {
        this.legendData.push(key)
        this.todoData.push(todo[key])
        this.doingData.push(doing[key])
        this.doneData.push(done[key])
      }
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('task-type-pie'))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['待开始', '进行中', '已完成'],
          right: 10
        },
        grid: {
          top: 40,
          left: 0,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.legendData
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          {
            name: '待开始',
            type: 'bar',
            stack: '1',
            data: this.todoData
          },
          {
            name: '进行中',
            type: 'bar',
            stack: '1',
            data: this.doingData
          },
          {
            name: '已完成',
            type: 'bar',
            stack: '1',
            data: this.doneData
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #task-type-pie{
    height: 100%;
    width: 100%;
  }
</style>

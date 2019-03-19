<template>
  <div id="bug-todo-pie"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      names: [],
      todoData: [],
      curSprint: {},
      levels: []
    }
  },
  computed: {
    curSprintId () {
      return this.$store.state.bug.curSprintId
    }
  },
  watch: {
    curSprintId () {
      this.initData()
    }
  },
  methods: {
    initParam () {
      this.onresizeDraw()
    },
    initData () {
      if (this.curSprintId) {
        this.findCurSprint().then(() => {
          return this.$enumService.getEnum('BUG_LEVEL')
        }).then((data) => {
          this.levels = data
          return this.fingBugList()
        }).then(() => {
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
        sprintId: this.curSprint.id,
        state: { '$ne': 5 }
      }
      return this.findDataByCondition('bugs')
    },
    calcData () {
      this.todoData = []
      this.names = []
      let bug, name
      let data = []
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        bug = this.dataList[i]
        if (data[bug.level]) {
          data[bug.level] += 1
        } else {
          data[bug.level] = 1
        }
      }
      for (let key in data) {
        name = this.$enumService.enumFormat('BUG_LEVEL', key)
        this.names.push(name)
        this.todoData.push({
          'value': data[key],
          'name': name
        })
      }
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('bug-todo-pie'))
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.names
        },
        series: [
          {
            name: '待办缺陷',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.todoData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                formatter: '  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#fff',
                borderColor: '#eee',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  b: {
                    fontSize: 14,
                    lineHeight: 33
                  },
                  per: {
                    color: '#333',
                    backgroundColor: '#DCDFE6',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #bug-todo-pie{
    height: 100%;
    width: 100%;
  }
</style>

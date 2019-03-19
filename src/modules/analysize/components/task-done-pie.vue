<template>
  <div id="task-done-pie"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      names: [],
      data: [],
      loading: false
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    dateRange () {
      return this.$store.state.bugAnalysize.dateRange
    }
  },
  watch: {
    dateRange () {
      this.refresh()
    }
  },
  methods: {
    initParam () {
      this.onresizeDraw()
      this.refresh()
    },
    findTaskList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        let [startDate, endDate] = [...this.dateRange]
        let t = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        let e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
        this.$http.post('/group/sumTaskDone', { sDate: t, eDate: e }).then((res) => {
          if (res && res.data) {
            resolve(res.data)
          }
        })
      })
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
        this.findTaskList().then((data) => {
          this.dataList = data
          this.calcData()
          this.drawChart()
          this.loading = false
        })
      } catch (error) {}
    },
    calcData () {
      this.names = []
      this.data = []
      let name
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        name = this.$utils.userFormatter(this.dataList[i]._id, this.userList)
        this.names.push(name)
        this.data.push({
          'value': this.dataList[i].value,
          'name': name
        })
      }
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('task-done-pie'))
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
            name: '完成任务',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.data,
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
  #task-done-pie{
    height: 100%;
    width: 100%;
  }
</style>

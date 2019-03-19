<template>
  <div id="bug-process-avg-time"></div>
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
    findCreateBugList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        let [startDate, endDate] = [...this.dateRange]
        let t = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        let e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
        this.$http.post('/group/avgBugProcessTime', { sDate: t, eDate: e }).then((res) => {
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
        this.findCreateBugList().then((data) => {
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
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        if (this.dataList[i]._id) {
          this.names.push(this.$utils.userFormatter(this.dataList[i]._id, this.userList))
          this.data.push((this.dataList[i].value).toFixed(2))
        }
      }
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('bug-process-avg-time'))
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.names
        },
        xAxis: {
          type: 'category',
          data: this.names
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.data,
          type: 'bar'
        }]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #bug-process-avg-time{
    height: 100%;
    width: 100%;
  }
</style>

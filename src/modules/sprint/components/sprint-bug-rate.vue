<template>
  <div id="sprint-bug-rate"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      chart: {},
      sprintIds: [],
      sprintData: [],
      sprintNameList: [],
      dataList: []
    }
  },
  computed: {
    curProduct () {
      return this.$store.state.sprint.product
    },
    sprintList () {
      return this.$store.state.sprint.sprintList
    }
  },
  methods: {
    initParam () {
      this.onresizeDraw()
    },
    initData () {
      if (this.curProduct.id) {
        this.calcSprint()
        this.calcSrpintIds()
        this.calcData().then(() => {
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
    calcData () {
      return new Promise((resolve, reject) => {
        this.findSprintEstimate().then(() => {
          return this.findSprintBug()
        }).then(() => {
          this.sprintData = this.sprintData.sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          })
          for (let i = 0, len = this.sprintData.length; i < len; i++) {
            this.sprintNameList.push(this.sprintData[i].name)
            if (this.sprintData[i].bugTotal && this.sprintData[i].estimateTotal) {
              this.dataList.push((this.sprintData[i].bugTotal / this.sprintData[i].estimateTotal).toFixed(2))
            } else {
              this.dataList.push(0)
            }
          }
          resolve()
        })
      })
    },
    calcSrpintIds () {
      this.sprintIds = []
      for (let i = 0, len = this.sprintList.length; i < len; i++) {
        this.sprintIds.push(this.sprintList[i].id)
      }
    },
    findSprintBug () {
      return new Promise((resolve, reject) => {
        let conditions = {
          'sprintId': { '$in': this.sprintIds }
        }
        let groupCondition = [
          { $match: conditions },
          { $group: { _id: { 'value': '$sprintId' }, count: {'$sum': 1} } }
        ]
        let groupItem, sprintItem
        this.$dataService.group(this.$apiUrl.BASE_GROUP + 'bugs', groupCondition).then((data) => {
          for (let i = 0, len = data.length; i < len; i++) {
            groupItem = data[i]
            for (let j = 0, len = this.sprintData.length; j < len; j++) {
              sprintItem = this.sprintData[j]
              if (sprintItem.id === groupItem._id.value) {
                sprintItem.bugTotal = groupItem.count
              }
            }
          }
          resolve()
        })
      })
    },
    findSprintEstimate () {
      return new Promise((resolve, reject) => {
        let conditions = {
          'sprintId': { '$in': this.sprintIds }
        }
        let groupCondition = [
          { $match: conditions },
          { $group: { _id: { 'value': '$sprintId' }, count: {'$sum': '$estimate'} } }
        ]
        let groupItem, sprintItem
        this.$dataService.group(this.$apiUrl.WORK_GROUP_BACKLOG, groupCondition).then((data) => {
          for (let i = 0, len = data.length; i < len; i++) {
            groupItem = data[i]
            for (let j = 0, len = this.sprintData.length; j < len; j++) {
              sprintItem = this.sprintData[j]
              if (sprintItem.id === groupItem._id.value) {
                sprintItem.estimateTotal = groupItem.count
              }
            }
          }
          resolve()
        })
      })
    },
    calcSprint () {
      let item
      for (let i = 0, len = this.sprintList.length; i < len; i++) {
        item = this.sprintList[i]
        this.sprintData.push({
          id: item.id,
          name: item.name,
          startDate: item.startDate
        })
      }
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('sprint-bug-rate'))
      this.chart.setOption({
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
          data: this.sprintNameList
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '平均缺陷密度',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
                color: 'black'
              }
            },
            data: this.dataList
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #sprint-bug-rate{
    height: 100%;
    width: 100%;
  }
</style>

<template>
  <div id="sprint-task-rate"></div>
</template>

<script>
import echarts from 'echarts'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      chart: {},
      team: 0,
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
        let sprintIds = []
        for (let i = 0, len = this.sprintList.length; i < len; i++) {
          sprintIds.push(this.sprintList[i].id)
        }

        let conditions = {
          'sprintId': { '$in': sprintIds }
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
          this.sprintData = this.sprintData.sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          })
          for (let i = 0, len = this.sprintData.length; i < len; i++) {
            this.sprintNameList.push(this.sprintData[i].name)
            if (this.sprintData[i].teamTotal) {
              console.log(this.sprintData[i])
              this.dataList.push((this.sprintData[i].estimateTotal / (this.sprintData[i].teamTotal * this.sprintData[i].dayTotal)).toFixed(2))
            } else {
              this.dataList.push(0)
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
        let total = 0
        for (let i = 0, len = item.teams.length; i < len; i++) {
          total += item.teams[i].rate
        }
        this.sprintData.push({
          id: item.id,
          name: item.name,
          startDate: item.startDate,
          dayTotal: this.$utils.subWorkDate(new Date(item.startDate), new Date(item.publishDate)),
          teamTotal: total
        })
      }
    },
    drawChart () {
      this.chart = echarts.init(document.getElementById('sprint-task-rate'))
      this.chart.setOption({
        grid: {
          top: 40,
          left: 0,
          right: 0,
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
            name: '平均生产率',
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
    },
    ...mapActions(['findBacklogList'])
  }
}
</script>

<style scoped lang="scss">
  #sprint-task-rate{
    height: 100%;
    width: 100%;
  }
</style>

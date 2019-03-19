<template>
  <div class="month-record-wrapper el-card">
    <div class="month-record-header">
      <span class="month-title">{{ monthData.month + '月' }}</span>
    </div>
    <div class="month-record-body">
      <div class="month-record-item" v-for="(item, index) in monthData.data" :key="index">
        <div v-if="!item.endTime" class="todo-record-tag"></div>
        <div v-else class="done-record-tag"></div>
        <div class="record-item-info">
          <div class="record-time-info">
            <span class="start-time">{{ item.startTime | dateFilter('MM-dd hh:mm') }}~</span>
            <span v-if="item.endTime" class="end-time">{{ item.endTime | dateFilter('hh:mm') }}</span>
            <span v-if="item.endTime" class="end-time">（{{ calcDuration(item.startTime, item.endTime) }}小时）</span>
            <span v-else class="end-job-btn" @click="onEndRushJob(item)">结束突击</span>
            <i class="fa fa-trash" @click="onDelete(item)"></i>
          </div>
          <span class="work-note text-ellipsis">{{ item.workNote }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: [
    'monthData'
  ],
  data () {
    return {
      tableName: 'rushJobs'
    }
  },
  methods: {
    calcDuration (startDate, endDate) {
      let startTime = new Date(startDate)
      let endTime = new Date(endDate)
      let durHours = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60
      return durHours.toFixed(1)
    },
    onEndRushJob (item) {
      this.$confirm('确认结束吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doEndRushJob(item)
      })
    },
    doEndRushJob (item) {
      this.$set(item, 'endTime', new Date())
      this.curData = item
      this.doUpdate().then((data) => {
        this.updateRushJob(item)
      })
    },
    doAfterDelete (item) {
      this.deleteRushJob(item)
    },
    ...mapMutations(['updateRushJob', 'deleteRushJob'])
  }
}
</script>

<style scoped lang="scss">
  .month-record-wrapper{
    margin: 10px 10px 0 0;
    box-shadow: 3px 5px 3px #ccc;
    width: 320px;
    height: 320px;
    display: flex;
    flex-direction: column;
    transition: all .3s;

    .month-record-header{
      flex: 0 0 40px;
      height: 40px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      align-items: center;

      .month-title{
        font-size: 16px;
        font-weight: bold;
        margin-left: 10px;
      }
    }

    .month-record-body{
      flex: 1 1 100px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;

      .month-record-item:hover{
        box-shadow: 3px 4px 4px #bbb;
      }

      .month-record-item{
        display: flex;
        align-items: center;
        min-height: 60px;
        margin: 8px 5px 0;
        background-color: white;
        border-radius: 5px;
        transition: all .3s;

        .todo-record-tag{
          width: 5px;
          height: 60px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          background-color: #F56C6C;
        }

        .done-record-tag{
          width: 5px;
          height: 60px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          background-color: #11C191;
        }

        .record-item-info{
          margin-left: 5px;
          display: flex;
          flex-direction: column;
          font-size: 13px;

          .record-time-info{
            position: relative;
            display: flex;

            .fa-trash{
              position: absolute;
              right: 0;
              color: #aaa;
              cursor: pointer;
            }
          }

          .work-note{
            width: 290px;
            line-height: 24px;
            color: #555;
            font-size: 14px;
          }

          .start-time, .end-time{
            color: #aaa;
          }

          .end-job-btn{
            margin-left: 5;
            padding: 1px 5px;
            border-radius: 4px;
            color: #F56C6C;
            font-size: 14px;
            cursor: pointer;
            text-decoration: underline;
          }

          .fa-remove{
            flex: 1 1 auto;
            justify-self: flex-end;
          }
        }
      }
    }
  }
</style>

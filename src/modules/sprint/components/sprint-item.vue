<template>
  <div class="sprint-item-wrapper">
    <div class="sprint-date">
      <i class="fa fa-calendar"></i>
      <span>{{ sprint.startDate | dateFilter('MM月') }}</span>
    </div>
    <div class="sprint-card">
      <div class="sprint-header" slot="header">
        <div class="header-left">
          <i v-if="sprint.state === 3" class="fa fa-check-circle-o fa-lg margin-right-5"></i>
          <i v-else class="fa fa-play-circle fa-lg margin-right-5"></i>
          <span class="sprint-name">{{ sprint.name }}</span>
          <div class="sprint-start-date">
            <span>{{ sprint.startDate | dateFilter('yyyy年MM月dd日')}} ~</span>
            <span>{{ sprint.publishDate | dateFilter('yyyy年MM月dd日')}}</span>
          </div>
        </div>
        <div class="header-right">
          <span>导出：</span>
          <i class="fa fa-sort-numeric-asc" @click="onExportBacklog"></i>
          <i class="fa fa-tasks" @click="onExportTask"></i>
          <i class="fa fa-bug" @click="onExportBug"></i>
        </div>
      </div>
      <div class="sprint-detail">
        <div class="sprint-value">
          <span class="sprint-title">价值：</span>
          <span>{{ sprint.value }}</span>
        </div>
        <div class="sprint-value">
          <span class="sprint-title">计划会议：</span>
          <div v-for="(item, index) in sprint.planMeetings" :key="index">
            {{ item.date | dateFilter('yyyy年MM月dd日') }}
            {{ item.note }}；
          </div>
        </div>
        <div class="sprint-value">
          <span class="sprint-title">演示会议：</span>
          <span>{{ sprint.demoMeeting | dateFilter('yyyy年MM月dd日') }}</span>
        </div>
      </div>
      <div class="sprint-footer">
        <div class="print-team footer-item" @click="onViewSprintTeam">
          <i class="fa fa-users"></i>
          <span>成员（{{ sprint.teams.length }}）</span>
        </div>
        <div class="sprint-backlog footer-item" @click="onViewBacklogList">
          <i class="fa fa-sort-numeric-asc"></i>
          <span >故事（{{ backlogCount }}）</span>
        </div>
        <div class="sprint-bug footer-item" @click="onViewSprintBug">
          <i class="fa fa-bug"></i>
          <span>缺陷（{{ bugCount }}）</span>
        </div>
        <div class="sprint-board footer-item" @click="onViewSprintBoard">
          <i class="fa fa-line-chart"></i>
          <span>冲刺看板</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formItem from '../../bug/components/form-item'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      bugCount: 0,
      backlogCount: 0
    }
  },
  components: {
    formItem
  },
  props: [
    'sprint'
  ],
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    initData () {
      this.findBugCount()
      this.findBacklogCount()
    },
    findBugCount () {
      let condition = {
        sprintId: this.sprint.id
      }
      this.$dataService.findCount('bugs', condition).then(data => {
        this.bugCount = data
      })
    },
    findBacklogCount () {
      this.findCondition = {
        sprintId: this.sprint.id
      }
      this.findDataByCondition('backlogs').then(data => {
        this.backlogCount = data.length || 0
      })
    },
    onExportBacklog () {
      let condition = {
        query: {
          productId: this.sprint.productId,
          sprintId: this.sprint.id
        },
        sort: { 'important': -1 }
      }
      this.$http.post('/excel/export/backlog/rtc', condition, { responseType: 'arraybuffer' }).then((res) => {
        if (res && res.data) {
          this.downloadExcel(res.data, this.sprint.name + 'backlog.xls')
        }
      })
    },
    onExportTask () {
      let condition = {
        query: {
          productId: this.sprint.productId,
          sprintId: this.sprint.id
        },
        sort: { 'important': -1 }
      }
      this.$http.post('/excel/export/task/rtc', condition, { responseType: 'arraybuffer' }).then((res) => {
        if (res && res.data) {
          this.downloadExcel(res.data, this.sprint.name + 'task.xls')
        }
      })
    },
    onExportBug () {
      let condition = {
        query: {
          productId: this.sprint.productId,
          sprintId: this.sprint.id
        },
        sort: { 'createTime': -1 }
      }
      this.$http.post('/excel/export/bug/rtc', condition, { responseType: 'arraybuffer' }).then((res) => {
        if (res && res.data) {
          this.downloadExcel(res.data, this.sprint.name + 'bug.xls')
        }
      })
    },
    onViewBacklogList () {
      this.$router.push({name: 'backlogList', params: {id: this.sprint.id}})
    },
    onViewSprintTeam () {
      this.$router.push({name: 'sprintTeam', params: {teams: this.sprint.teams}})
    },
    onViewSprintBug () {
      this.$router.push({name: 'sprintBugList', params: {sprint: this.sprint}})
    },
    onViewSprintBoard () {
      this.setCurMenu('/sprint/board')
      this.$router.push({ path: '/sprint/board' })
    },
    ...mapMutations(['setCurMenu'])
  }
}
</script>

<style scoped lang="scss">
  .sprint-item-wrapper{
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    display: flex;

    .sprint-date{
      flex: 0 0 100px;
      margin: 10px 0 0 10px;
    }

    .sprint-card{
      margin-right: 30px;
      width: 200px;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
    }

    .sprint-header{
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #eee;
      padding: 0 20px;

      .header-left{
        flex:  1 1 300px;
        display: flex;
        align-items: center;
      }

      .header-right{
        .fa {
          margin-right: 5px;
          color: #aaa;
          cursor: pointer;
        }

        .fa:hover {
          color: #333;
        }
      }

      .fa-check-circle-o{
        color: #409EFF;
      }

      .fa-play-circle{
        color: #67C23A;
      }

      .sprint-name{
        font-size: 16px;
      }

      .sprint-start-date{
        font-size: 14px;
        color: #aaa;
        margin-left: 10px;
      }
    }
    .sprint-detail{
      padding: 10px 20px;
      font-size: 14px;
      line-height: 26px;
      display: flex;
      flex-direction: column;

      .sprint-value{
        font-size: 14px;
        color: #444;
      }

      img{
        width: 24px;
        border-radius: 15px;
        margin-left: 5px;
      }

      .sprint-team{
        line-height: 24px;
        display: flex;
        align-items: center;
      }

      .sprint-title{
        color: #999;
      }
    }

    .sprint-footer{
      border-top: 1px solid #eee;
      display: flex;

      .footer-item{
        flex: 1 1 auto;
        line-height: 38px;
        text-align: center;
        border-right: 1px solid #eee;
        cursor: pointer;
        color: #aaa;
        font-size: 14px;
      }
    }
  }
  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

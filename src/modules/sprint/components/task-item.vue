<template>
  <div class="list-group-item" :class="{'list-item-vertigy-h': backlog.state === 2}">
    <div class="list-group-item-header">
      <el-tooltip content="查看故事点描述" placement="top">
        <el-badge v-if="backlog.commentId" is-dot class="item">
          <span class="task-id margin-left-5" @click="onBacklogView">{{ backlog.id }}</span>
        </el-badge>
        <span v-else class="task-id margin-left-5" @click="onBacklogView">{{ backlog.id }}</span>
      </el-tooltip>
      <el-tooltip :content="backlog.name" placement="top">
        <span v-if="backlog.track" @dblclick="onBacklogDetail" class="task-name margin-left-10">{{ backlog.track + '/' + backlog.name }}</span>
        <span v-else @dblclick="onBacklogDetail" class="task-name margin-left-10">{{ backlog.name }}</span>
      </el-tooltip>
      <el-dropdown @command="handleCommand">
        <span>
          <i class="fa fa-ellipsis-v task-tool margin-left-5"></i>
        </span>
        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item command="remove"><i class="fa fa-reply-all margin-right-5"></i>移除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="list-group-item-body">
      <div class="sprint-task" v-for="task in backlog.tasks" :key="task.type">
        <span class="task-type margin-left-5">{{ task.type }}</span>
        <span class="task-time margin-left-5">{{ task.estimate }}</span>
        <span v-if="!task.userId && (curSprint.sm === user.email)" @click="onOpenSelectUser(task)" class="task-btn margin-left-5">认领</span>
        <span v-else-if="!task.userId" @click="onClaimTask(task)" class="task-btn margin-left-5">认领</span>
        <span :class="{'task-user-cur': task.userId === user.email}" class="task-user margin-left-5">{{ task.userId | userFilter(userList) }}</span>
        <span v-if="task.userId && !task.startDate && ((task.userId === user.email) || (user.email === curSprint.sm))" @click="onStartTask(task)" class="task-btn margin-left-5">开始</span>
        <span class="task-startDate margin-left-5">{{ task.startDate | dateFilter('MM-dd') }}</span>
        <span v-if="task.startDate" class="margin-left-5">~</span>
        <span v-if="task.startDate && !task.endDate && ((task.userId === user.email) || (curSprint.sm === user.email))" @click="onEndTask(task)" class="task-end margin-left-5">完成</span>
        <span v-if="task.endDate" class="task-endDate margin-left-5">{{ task.endDate| dateFilter('MM-dd') }}</span>
        <span v-if="task.startDate && !task.endDate">
          <i class="fa fa-clock-o margin-left-10"></i>
        </span>
        <span v-if="task.endDate">
          <i class="fa fa-check-circle margin-left-10"></i>
        </span>
      </div>
    </div>
    <div v-if="backlog.state === 2" class="item-vertify">
      <span class="task-type"><i class="fa fa-bug" @click="onNewBug"></i></span>
      <span class="task-user margin-left-5">{{ backlog.testUserId | userFilter(userList) }}</span>
      <span v-if="!backlog.startTestDate" @click="onStartTest" class="task-btn margin-left-5">开始</span>
      <span class="task-startDate margin-left-5">{{ backlog.startTestDate | dateFilter('MM-dd') }}</span>
      <span v-if="backlog.startTestDate" class="margin-left-5">~</span>
      <span v-if="backlog.startTestDate && !backlog.endTestDate" @click="onEndTest" class="task-btn margin-left-5">完成</span>
      <span v-if="backlog.endTestDate" class="task-endDate margin-left-5">{{ backlog.endTestDate| dateFilter('MM-dd') }}</span>
      <span v-if="backlog.startTestDate && !backlog.endTestDate">
          <i class="fa fa-clock-o margin-left-10"></i>
        </span>
        <span v-if="backlog.endTestDate">
          <i class="fa fa-check-circle margin-left-10"></i>
        </span>
    </div>
    <view-html ref="viewHtml"></view-html>
    <el-dialog
      title="选择人员"
      :visible.sync="claimDialogVisible"
      width="50%">
      <radio-group keyName="email" titleName="userName" :list="devUserList" v-model="selectUser"></radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="claimDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onStandClaimTask">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ViewHtml from '../../../components/quill-editor/quillEditorView'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      claimDialogVisible: false,
      selectUser: {},
      curTask: {}
    }
  },
  props: [
    'backlog'
  ],
  components: {
    ViewHtml
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    curSprint () {
      return this.$store.state.sprint.curSprint
    },
    devUserList () {
      return this.userList.filter(item => {
        return (item.roleIds.indexOf(10) !== -1) || (item.roleIds.indexOf(4) !== -1)
      })
    }
  },
  methods: {
    onBacklogView () {
      this.$refs.viewHtml.show(this.backlog.how)
    },
    onBacklogDetail () {
      this.$router.push({ name: 'backlogDetail2', params: { id: this.backlog.id } })
    },
    confirm (infoText) {
      return this.$confirm(infoText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
    },
    onOpenSelectUser (task) {
      this.curTask = task
      this.claimDialogVisible = true
    },
    onStandClaimTask () {
      this.$set(this.curTask, 'userId', this.selectUser.email)
      this.updateBacklogTask().then(() => {
        this.claimDialogVisible = false
      })
    },
    onClaimTask (task) {
      this.confirm('确认要把这个任务据为己有吗？').then(() => {
        this.$set(task, 'userId', this.user.email)
        this.updateBacklogTask()
      })
    },
    onStartTask (task) {
      this.confirm('确认开始该任务？').then(() => {
        this.$set(task, 'startDate', new Date())
        this.updateBacklogTask()
      })
    },
    onEndTask (task) {
      this.confirm('确认已完成该任务，测试可以开始测试了吗？').then(() => {
        this.$set(task, 'endDate', new Date())
        this.updateBacklogTask()
      })
    },
    onStartTest () {
      this.confirm('确认开始测试该故事吗？').then(() => {
        this.$set(this.backlog, 'startTestDate', new Date())
        this.updateBacklog()
      })
    },
    onEndTest () {
      this.confirm('确认测试完成吗？').then(() => {
        this.$set(this.backlog, 'endTestDate', new Date())
        this.updateBacklog()
      })
    },
    updateBacklogTask () {
      let updateData = {
        tasks: this.backlog.tasks
      }
      return this.$dataService.update(this.$apiUrl.BASE_UPDATE + 'backlogs/' + this.backlog._id, updateData)
    },
    updateBacklog () {
      let updateData = {
        startTestDate: this.backlog.startTestDate,
        endTestDate: this.backlog.endTestDate
      }
      this.$dataService.update(this.$apiUrl.BASE_UPDATE + 'backlogs/' + this.backlog._id, updateData)
    },
    handleCommand (command) {
      if (command === 'remove') {
        this.doRemove()
      }
    },
    doRemove () {
      this.confirm('确认要移除该任务吗，移除后可在故事列表查看。').then(() => {
        this.removeBacklog(this.backlog)
      })
    },
    onNewBug () {
      this.$router.push({ name: 'sprintBug', params: { 'backlogId': this.backlog.id } })
    },
    ...mapActions(['removeBacklog'])
  }
}
</script>

<style scoped lang="scss">
  .list-group-item:hover{
    border: 1px solid #525d62;
    box-shadow: 2px 4px 2px #e1e1e1;
  }
  .list-item-vertigy-h{
    height: 140px !important;
  }
  .list-group-item {
    transition: all .2s;
    border: 1px solid #ddd;
    width: 260px;
    min-width: 260px;
    margin: 0 10px 10px 0;
    display: flex;
    flex-direction: column;
    height: 120px;

    .list-group-item-header{
      background-color: #EBF2F5;
      font-size: 14px;
      padding: 5px;
      height: 20px;
      flex: 0 0 20px;
      display: flex;
      align-items: center;

      .task-id{
        text-decoration: underline;
        cursor: pointer;
        flex:0 0 auto;
        font-weight: bold;
      }
      .task-name{
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space:nowrap;
        width:40px;
        flex:1 1 auto;
      }
      .task-tool{
        cursor: pointer;
        margin-right: 5px;
        width: 10px;
        text-align: center;
      }
    }

    .task-btn {
      color: white;
      cursor: pointer;
      background-color: #569be5;
      border-radius: 2px;
      line-height: 18px;
      height: 18px;
      padding: 0 5px;
    }

    .fa-clock-o{
      color: goldenrod;
      font-size: 16px;
    }

    .fa-check-circle{
      color: #11c194;
      font-size: 16px;
    }

    .list-group-item-body{
      padding: 5px;
      box-sizing: border-box;
      font-size: 14px;
      color: #333;
      height: 110px;
      overflow: auto;

      .sprint-task{
        height: 26px;
        display: flex;

        .fa{
          cursor: pointer;
        }

        .task-type{
          width: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          white-space:nowrap;
        }

        .task-time{
          width: 20px;
        }

        .task-startDate,.task-endDate {
          color: #666;
        }

        .task-user{
          width: 42px;
          color: #606266;
        }

        .task-user-cur{
          color: #11c194;
        }

        .task-end{
          color: #11c194;
          cursor: pointer;
          border: 1px solid #11c194;
          border-radius: 2px;
          line-height: 18px;
          height: 18px;
          padding: 0 5px;
        }
      }
    }
    .item-vertify{
      height: 35px;
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      box-sizing: border-box;
      padding-left: 5px;
      border-top: 1px solid #eee;

      .fa-bug{
        cursor: pointer;
        font-size: 16px;
      }
    }
  }
</style>

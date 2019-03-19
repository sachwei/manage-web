<template>
  <panel>
    <div class="estimate-wrapper">
      <radio-group :list="sprintList" v-model="curSprint"></radio-group>
      <div class="estimate-body">
        <transition-group name="flip-list">
          <task-item
            v-for="(item,index) in backlog.tasks"
            :key="index"
            :value="item"
            @change="onTaskItemChange(item)"
            @delete="onTaskItemDelete(item)"
            :userList="userList"></task-item>
        </transition-group>
        <el-button @click="onAddTask" type="success" icon="el-icon-plus" circle></el-button>
      </div>
      <div class="estimate-footer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="onSaveBack">保存</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import taskItem from '../components/task-item'
import { mapMutations } from 'vuex'
export default {
  components: {
    taskItem
  },
  data () {
    return {
      tableName: 'backlogs',
      sprintList: [],
      findCondition: {},
      curSprint: {},
      taskList: [
        { type: 'h5', estimate: 1, createDate: new Date() },
        { type: 'java', estimate: 1, createDate: new Date() },
        { type: 'web', estimate: 1, createDate: new Date() }
      ],
      backlog: {}
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    initParam () {
      this.findCondition = {
        productId: this.$store.state.backlog.product.id,
        state: 1
      }

      let backlogId = this.$route.params.id
      this.backlog = this.$store.getters.getBacklog(backlogId)
      if (this.backlog.tasks && (this.backlog.tasks.length === 0)) {
        this.backlog.tasks = this.taskList
      }
    },
    initData () {
      this.findDataByCondition('sprints').then((data) => {
        this.sprintList = data
        if (this.sprintList && this.sprintList.length > 0) {
          this.sprintList.sort((a, b) => {
            return this.$utils.ltDate(a.startDate, b.startDate)
          })
          this.curSprint = this.sprintList[0]
        }
      })
    },
    onAddTask () {
      this.backlog.tasks.push({createDate: new Date()})
    },
    validate () {
      let result = true
      if (!this.curSprint.id) {
        result = false
        this.$message('请选择所属sprint')
      }

      if (this.backlog.tasks.length === 0) {
        result = false
        this.$message('请添加至少一条估算数据。')
      }

      for (let i = 0, len = this.backlog.tasks.length; i < len; i++) {
        if (!this.backlog.tasks[i].type) {
          result = false
          this.$message('存在任务类型为空。')
          break
        }

        if (!this.backlog.tasks[i].estimate) {
          result = false
          this.$message('存在估算时间为空。')
          break
        }
      }
      return result
    },
    onSaveBack () {
      if (this.validate()) {
        this.backlog.sprintId = this.curSprint.id
        this.setEstimate()
        this.curData = this.backlog
        return this.doUpdate().then(() => {
          this.updateBacklog(this.curData)
          this.deleteBacklog(this.curData._id)
          this.goBack()
          this.$message('评估完成')
        })
      }
    },
    updateSprint (sprint) {
      let backlogs = this.curSprint.backlogs
      backlogs.push(this.backlog.id)
      let updateData = {
        backlog: backlogs
      }
      return this.$dataService.update(this.$apiUrl.BASE_UPDATE + 'sprints/' + this.curSprint._id, updateData)
    },
    onTaskItemDelete (data) {
      this.backlog.tasks = this.backlog.tasks.filter(item => item.type !== data.type)
    },
    onTaskItemChange (data) {
      let count = 0
      for (let i = 0, len = this.backlog.tasks.length; i < len; i++) {
        if (this.backlog.tasks[i].type === data.type) {
          count += 1
          if (count > 1) {
            this.$message('已存在相同的任务类型。')
            this.backlog.tasks[i].type = ''
          }
        }
      }
    },
    setEstimate () {
      let sum = 0
      for (let i = 0, len = this.backlog.tasks.length; i < len; i++) {
        sum += this.backlog.tasks[i].estimate
      }
      this.backlog.estimate = sum
    },
    ...mapMutations(['updateBacklog', 'deleteBacklog'])
  }
}
</script>

<style>
  .el-form-item__content{
    line-height: 24px;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    z-index: inherit;
  }
</style>

<style scoped lang="scss">
  .estimate-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .estimate-body{
      height: 200px;
      flex: 1 1 200px;
      margin-top: 15px;
    }

    .estimate-footer{
      flex: 0 0 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 30px;
    }
  }

  .flip-list-move {
    transition: transform 1s;
  }
</style>

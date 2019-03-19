<template>
  <panel>
    <div class="rush-job-wrapper">
      <div class="rush-job-toolbar">
        <add-button @onClick="openNewDialog"></add-button>
      </div>
      <div class="rush-job-body">
        <month-record v-for="(month, index) in months" :key="index" :monthData="month"></month-record>
      </div>
      <add-record-dialog ref="addRecord"></add-record-dialog>

      <el-dialog
        title="提示"
        :visible.sync="workNumDialog"
        width="30%">
        <el-input v-model="workNo" placeholder="你好，请先输入你的工号"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="workNumDialog=false">取 消</el-button>
          <el-button type="primary" @click="saveUser">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </panel>
</template>

<script>
import monthRecord from '../components/month-record'
import addRecordDialog from '../components/add-record'
import addButton from '../../../components/add-button/add-button'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      workNumDialog: false,
      tableName: 'rushJobs',
      workNo: undefined
    }
  },
  components: {
    monthRecord,
    addButton,
    addRecordDialog
  },
  computed: {
    months () {
      let groupMonth = []
      let month, monthData
      for (let i = 0, len = this.rushJobs.length; i < len; i++) {
        month = new Date(this.rushJobs[i].startTime).getMonth() + 1
        monthData = groupMonth[month]
        if (monthData) {
          monthData.data.push(this.rushJobs[i])
        } else {
          monthData = {
            month: month,
            data: [this.rushJobs[i]]
          }
          groupMonth[month] = monthData
        }
      }
      groupMonth = groupMonth.filter(item => {
        if (item.month) return item
      })
      groupMonth = groupMonth.sort((a, b) => {
        return b.month - a.month
      })
      return groupMonth
    },
    rushJobs () {
      return this.$store.state.rushJob.rushJobs
    }
  },
  methods: {
    initParam () {
      if (!this.user.workNo) {
        this.workNumDialog = true
      }
    },
    initData () {
      this.findRushJobs(this.user.email)
    },
    openNewDialog () {
      if (this.user.workNo) {
        this.$refs.addRecord.show()
      } else {
        this.workNumDialog = true
      }
    },
    saveUser () {
      this.curData = {
        _id: this.user._id,
        workNo: this.workNo
      }
      this.doUpdate('users')
    },
    doAfterUpdate (data) {
      this.user.workNo = this.workNo
      this.$localStore.set('user', this.user)
      this.workNumDialog = false
    },
    ...mapActions(['findRushJobs'])
  }
}
</script>

<style scoped>
  .rush-job-body{
    display: flex;
    flex-wrap: wrap;
  }
</style>

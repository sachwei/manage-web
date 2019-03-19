<template>
  <el-dialog title="新增" width="38%" @click.native="count += 1" :visible.sync="dialogFormVisible">
    <el-form
      :model="curData"
      ref="dataForm"
      :rules="dataRule">
      <el-form-item prop="startTime" v-if="count > 5">
        <el-date-picker
          v-model="jobDateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="workNote">
        <el-input type="textarea" :rows="5" v-model="curData.workNote" placeholder="输入突击内容" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="onSave">开始突击</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
const holiday2018 = ['2018-01-01', '2018-02-15', '2018-02-16', '2018-02-17', '2018-02-18', '2018-02-19', '2018-02-20', '2018-02-21', '2018-04-05', '2018-04-06', '2018-04-07', '2018-04-29', '2018-04-30', '2018-05-01', '2018-06-16', '2018-06-17', '2018-06-18', '2018-09-22', '2018-09-23', '2018-09-24', '2018-10-01', '2018-10-02', '2018-10-03', '2018-10-04', '2018-10-05', '2018-10-06', '2018-10-07']

export default {
  data () {
    return {
      dialogFormVisible: false,
      dataRule: {
        workNote: [{ required: true, trigger: 'blur' }]
      },
      tableName: 'rushJobs',
      jobDateTime: [],
      count: 0
    }
  },
  watch: {
    jobDateTime () {
      this.curData.startTime = this.jobDateTime[0]
      this.curData.endTime = this.jobDateTime[1]
    }
  },
  methods: {
    newDataForm () {
      this.curData = {
        userId: this.user.email,
        userName: this.user.userName,
        workNo: this.user.workNo,
        orgId: this.user.orgId[0],
        startTime: new Date(),
        isHoliday: this.isHoliday(new Date())
      }
    },
    isHoliday (d) {
      let holiday = false
      let date = d
      if (d) {
        date = new Date()
      }
      let dateStr = this.$utils.formatDateTime(date, 'yyy-mm-dd')
      if (holiday2018.indexOf(dateStr) !== -1) {
        holiday = true
      }

      let day = date.getDate()
      if ((day === 0) || (day === 6)) {
        holiday = true
      }
      return holiday
    },
    show () {
      this.count = 0
      this.dialogFormVisible = true
      this.newDataForm()
    },
    doAfterAdd (data) {
      this.dialogFormVisible = false
      this.addRushJob(data)
    },
    ...mapMutations(['addRushJob'])
  }
}
</script>

<style scoped lang="scss">

</style>

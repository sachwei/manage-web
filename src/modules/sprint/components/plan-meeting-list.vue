<template>
  <div class="plan-meeting-list-wrapper">
    <div class="meeting-item" v-for="(item, index) in dataList" :key="index">
      <span>{{ index + 1 }}、</span>
      <span>{{ item.date | dateFilter('yyyy年MM月dd日') }}</span>
      <span>{{ item.note }}</span>
    </div>
    <img @click="onOpenAddDialog" class="add-btn meeting-item-pic" src="../../../assets/img/icon_addpic.png" alt="">

    <el-dialog title="新增计划会议" :visible.sync="addDialogVisible">
      <el-form :model="planMeetingForm">
        <el-form-item style="margin-bottom: 22px" label="日期" label-width="80px">
          <el-date-picker
            v-model="planMeetingForm.date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 22px" label="主要内容" label-width="80px">
          <el-input type="textarea" :rows="3" v-model="planMeetingForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      planMeetingForm: {
        date: new Date()
      },
      dataList: [],
      addDialogVisible: false
    }
  },
  props: [
    'planMeetings'
  ],
  watch: {
    planMeetings () {
      this.dataList = this.planMeetings
    }
  },
  methods: {
    onOpenAddDialog () {
      this.addDialogVisible = true
    },
    onSave () {
      this.dataList.push(this.planMeetingForm)
      this.planMeetingForm = {
        date: new Date()
      }
      this.addDialogVisible = false
      this.$emit('input', this.dataList)
    }
  }
}
</script>

<style scoped lang="scss">
  .plan-meeting-list-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .meeting-item{
      margin-bottom: 10px;
      color: #333;
    }

    .meeting-item-pic{
      width: 50px;
      height: 50px;
    }

    .add-btn:hover{
      cursor: pointer;
    }
  }
</style>

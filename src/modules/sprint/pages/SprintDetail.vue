<template>
  <panel>
    <div class="sprint-detail-wrapper">
      <el-form
        class="sprint-detail-form"
        :rules="dataRule"
        :model="curData"
        ref="dataForm"
        style="width: 98%">
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">冲刺名称</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="name">
              <el-input v-model="curData.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">核心价值</div>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="value">
              <el-input type="textarea" :rows="3" v-model="curData.value" auto-complete="off" style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">开始时间</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="startDate">
              <el-date-picker
                style="width: 100%"
                v-model="curData.startDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <div class="el-form-item__label">演示会议</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="demoMeeting">
              <el-date-picker
                style="width: 100%"
                v-model="curData.demoMeeting"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">发版时间</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="publishDate">
              <el-date-picker
                style="width: 100%"
                v-model="curData.publishDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <div class="el-form-item__label">状态</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="state">
              <el-select v-model="curData.state" placeholder="选择任务分类" style="width: 100%">
                <el-option
                  v-for="item in stateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">SM</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="sm">
              <el-select v-model="curData.sm" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in userList"
                  :key="item.email"
                  :label="item.userName"
                  :value="item.email">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <div class="el-form-item__label">PO</div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="po">
              <el-select v-model="curData.po" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in userList"
                  :key="item.email"
                  :label="item.userName"
                  :value="item.email">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">团队成员</div>
          </el-col>
          <el-col :span="22">
            <user-choose :team="curData.teams"></user-choose>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2">
            <div class="el-form-item__label">计划会议</div>
          </el-col>
          <el-col :span="22">
            <plan-meeting-list :planMeetings="curData.planMeetings" v-model="curData.planMeetings"></plan-meeting-list>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="sprint-detail-footer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="danger" @click="onDelete(curData)">删除</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import userChoose from '../components/user-choose'
import planMeetingList from '../components/plan-meeting-list'
import { mapMutations, mapActions } from 'vuex'

export default {
  components: {
    userChoose,
    planMeetingList
  },
  data () {
    return {
      tableName: 'sprints',
      stateList: [],
      dataRule: {
        name: [{ required: true, trigger: 'blur' }],
        value: [{ required: true, trigger: 'blur' }],
        startDate: [{ required: true, trigger: 'change' }],
        sm: [{ required: true, trigger: 'change' }],
        po: [{ required: true, trigger: 'change' }]
      }
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    initParam () {
      let sprintId = this.$route.params.id
      if (sprintId) {
        this.curData = this.$store.getters.getSprint(sprintId)
      } else {
        this.getId().then((data) => {
          this.newDataForm(data)
        })
      }
    },
    initData () {
      this.$enumService.getEnum('SPRINT_STATE').then((data) => {
        this.stateList = data
      })
    },
    onSave () {
      this.validate().then(() => {
        if (this.curData._id) {
          this.doUpdate().then((data) => {
            this.updateSprint(this.curData)
            this.goBack()
          })
        } else {
          this.newSprint(this.curData).then((data) => {
            this.curData = data
            this.goBack()
          })
        }
      })
    },
    doAfterDelete (data) {
      this.deleteSprint(data._id)
      this.goBack()
    },
    getId () {
      return this.getSequence('sprint_key')
    },
    newDataForm (id) {
      this.curData = {
        id: id,
        name: '',
        value: '',
        sm: '',
        po: '',
        teams: [],
        startDate: new Date(),
        publishDate: new Date(),
        backlogs: [],
        planMeetings: [],
        demoMeeting: new Date(),
        state: 1,
        orgId: this.user.orgId[0]
      }
    },
    ...mapMutations(['updateSprint', 'deleteSprint']),
    ...mapActions(['newSprint'])
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

<style lang="scss" scoped>
  .sprint-detail-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .el-form-item__label{
      width:100%;
    }

    .sprint-detail-form{
      flex: 1 1 auto;
      margin-top: 10px;
      overflow: auto;
    }

    .sprint-detail-footer{
      flex: 0 0 140px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 30px;
    }

    .inline-input{
      width: 50%;
    }
  }
</style>

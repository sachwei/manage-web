<template>
  <panel>
    <div class="year-plan-wrapper">
      <div class="toolbar">
        <div class="left">
          <el-date-picker
            v-model="curYear"
            type="year"
            size="small"
            @change="onChangeYear"
            placeholder="选择年">
          </el-date-picker>
          <el-input
            size="small"
            class="margin-left-10"
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="searchText">
          </el-input>
          <el-tooltip class="item" effect="dark" content="新建" placement="top-start">
            <el-button class="add-btn" size="mini" type="success" icon="el-icon-plus" circle @click="onAddPlan"></el-button>
          </el-tooltip>
        </div>
        <div class="right">
          <checkbox-group enumTypeId="YEAR_PLAN_CLASSIFY" v-model="classifyChecks"></checkbox-group>
          <checkbox-group class="type" enumTypeId="YEAR_PLAN_TYPE" v-model="typeChecks"></checkbox-group>
        </div>
      </div>
      <hr class="lists-separator"/>
      <div class="plan">
        <div class="month-plan" v-for="month in monthList" :key="month">
          <div class="month-plan-content">
            <div class="time-item">
              <i class="fa fa-calendar"></i>
              <span>{{ month }}月</span>
            </div>
            <div class="work-item-list">
              <div
                @dblclick="onPlanEdit(plan)"
                :class="{'work-item-done': plan.state === 1}"
                class="work-item"
                :style="{backgroundColor: 'rgba(244,164,96,'+ plan.sort / 100 +')'}"
                v-for="plan in getMonthPlanList(month)"
                :key="plan.id"
              >
                <div class="left">
                  <div class="summary">{{ plan.summary }}</div>
                  <div class="classify">{{ plan.classify | enumFilter('YEAR_PLAN_CLASSIFY') }}</div>
                  <div class="note">{{ plan.note }}</div>
                </div>
                <div class="footer">
                  <i v-if="plan.state === 1" class="fa fa-dot-circle-o" @click="onChangeState(plan)"></i>
                  <i v-else class="fa fa-circle-thin" @click="onChangeState(plan)"></i>
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="plan.note">
                    <i slot="reference" v-if="plan.note" class="fa fa-info-circle"></i>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <hr class="lists-separator"/>
        </div>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="newPlanForm" label-width="80px" style="width: 98%">
        <el-form-item label="任务名称">
          <el-input v-model="newPlanForm.summary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务分类">
          <el-select v-model="newPlanForm.classify" placeholder="选择任务分类" style="width: 100%">
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="newPlanForm.type" placeholder="选择任务类型" style="width: 100%">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度">
          <el-slider v-model="newPlanForm.sort"></el-slider>
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker v-model="newPlanForm.planDate" type="date" placeholder="选择月"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newPlanForm.note" :rows="2" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="onSavePlan">保存</el-button>
      </div>
    </el-dialog>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      addDialogVisible: false,
      dialogTitle: '',
      newPlanForm: {},
      planList: [],

      classifyList: [],
      typeList: [],
      classifyChecks: [],
      typeChecks: [],
      searchText: '',
      curYear: new Date()
    }
  },
  computed: {
    filterPlanlist () {
      let [c, t] = [this.classifyChecks.join(','), this.typeChecks.join(',')]
      let s = this.searchText
      return this.planList.filter(plan => {
        if (c && t) {
          return (c.indexOf(plan.classify) !== -1) && (t.indexOf(plan.type) !== -1) && (plan.summary.indexOf(s) !== -1)
        } else if (c && !t) {
          return (c.indexOf(plan.classify) !== -1) && (plan.summary.indexOf(s) !== -1)
        } else if (!c && t) {
          return (t.indexOf(plan.type) !== -1) && (plan.summary.indexOf(s) !== -1)
        } else {
          return plan.summary.indexOf(s) !== -1
        }
      })
    },
    monthList () {
      let s = []
      for (let index = 0; index < this.planList.length; index++) {
        const element = this.planList[index]
        const month = new Date(element.planDate).getMonth() + 1
        if (!s.includes(month)) {
          s.push(month)
        }
      }
      s.sort((a, b) => {
        return a - b
      })
      return s
    }
  },
  methods: {
    initData () {
      this.initEnums()
    },
    initEnums () {
      this.$enumService.getEnum('YEAR_PLAN_CLASSIFY').then((data) => {
        this.classifyList = data
        return this.$enumService.getEnum('YEAR_PLAN_TYPE')
      }).then((data) => {
        this.typeList = data
        this.findPlanByYear()
      })
    },
    findPlanByYear () {
      let t = new Date(this.curYear.getFullYear(), 0, 1)
      let e = new Date(this.curYear.getFullYear(), 11, 31)
      this.findCondition = {
        orgId: this.user.orgId[0],
        planDate: { '$gte': t, '$lte': e }
      }
      this.findDataByCondition('plans').then(data => {
        this.planList = data
        this.planList.sort(this.planSort)
      })
    },
    onChangeYear () {
      this.findPlanByYear()
    },
    planSort (a, b) {
      return b.sort - a.sort
    },
    onChangeState (plan) {
      this.newPlanForm = plan
      plan.state = Math.abs(plan.state - 1)
      this.doUpdatePlan()
    },
    onPlanEdit (plan) {
      this.dialogTitle = '修改'
      this.newPlanForm = plan
      this.addDialogVisible = true
    },
    getMonthPlanList (month) {
      return this.filterPlanlist.filter(item => (new Date(item.planDate).getMonth() + 1) === month)
    },
    newPlan () {
      this.newPlanForm = {
        id: this.$utils.getMaxId(this.planList),
        summary: '',
        classify: '',
        type: '',
        sort: 50,
        planDate: new Date(),
        state: 0,
        userId: this.user.email,
        orgId: this.user.orgId[0]
      }
    },
    onAddPlan () {
      this.dialogTitle = '新增'
      this.newPlan()
      this.addDialogVisible = true
    },
    onSavePlan () {
      if (this.newPlanForm._id) {
        this.doUpdatePlan()
      } else {
        this.doSavePlan()
      }
    },
    doUpdatePlan () {
      this.$dataService.update(this.$apiUrl.WORK_UPDATE_PLAN + this.newPlanForm._id, this.newPlanForm).then((data) => {
        this.addDialogVisible = false
      })
    },
    doSavePlan () {
      this.$dataService.save(this.$apiUrl.WORK_SAVE_PLAN, this.newPlanForm).then((data) => {
        this.planList.push(data)
        this.addDialogVisible = false
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  .year-plan-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .toolbar{
    display: flex;
    flex: 0 0 40px;

    .left{
      display: flex;
      align-items: center;
      margin-left: 5px;
      position: relative;

      .add-btn{
        margin-left: 10px;
      }
    }
    .right{
      display: flex;
      flex: 1 1 auto;
      justify-content: flex-end;
      align-items: center;
    }
    .type{
      display: flex;
      margin-left: 20px;
    }
  }

  .plan{
    flex: 1 1 auto;
    overflow: auto;
  }

  .month-plan{
    display: flex;
    flex-direction: column;
    width: 100%;

    .month-plan-content{
      display: flex;
      width: 100%;

      .time-item{
        flex: 0 0 100px;
        margin-left: 10px;
      }

      .work-item-list{
        flex: 1 1 auto;
        display: flex;
        flex-wrap: wrap;
      }

      .work-item:hover{
        box-shadow: 2px 2px 2px rgba(150, 148, 148, 0.678);
      }

      .work-item-done{
        background-color: #EBEEF5 !important;
        color: #333 !important;
      }

      .work-item{
        margin: 5px;
        width: 220px;
        border-radius: 4px;
        padding: 5px 10px;
        display: flex;
        background-color: #EBEEF5;
        color: #333;
        animation: slideInUp .3s;
        transition: all .3s;

        .left {
          flex: 1 1 auto;
          font-size: 14px;
          display: flex;
          flex-direction: column;

          .summary{
            font-size: 14px;
            font-weight: bold;
          }

          .note{
            display: none;
          }
        }
        .footer{
          flex: 0 0 16px;
          color: #ccc;
          font-size: 16px;
          justify-content: center;

          .fa{
            margin-left: 3px;
            cursor: pointer;
            color: #909399;
          }

          .fa:hover{
            color: red;
            transform: scale(1.2)
          }
        }
      }
    }
  }

  .lists-separator{
    border: 0;
    border-top: 1px solid #ddd;
    margin:10px 0;
    transform:scaleY(0.5);
  }
</style>

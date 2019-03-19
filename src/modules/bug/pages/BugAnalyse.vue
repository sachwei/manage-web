<template>
  <panel>
    <div class="bug-analyse-wrapper">
      <div class="bug-analyse">
        <el-row :gutter="10">
          <el-col :xl="8" :lg="12">
            <ew-card title="待处理缺陷-等级" style="height:300px;margin-bottom:10px">
              <bug-todo-pie></bug-todo-pie>
            </ew-card>
          </el-col>
          <el-col :xl="8" :lg="12">
            <ew-card title="待处理缺陷-个人" style="height:300px;margin-bottom:10px">
              <bug-todo-user-pie></bug-todo-user-pie>
            </ew-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <ew-card title="缺陷趋势" style="height:400px;margin-bottom:10px">
              <sprint-bug-chart></sprint-bug-chart>
            </ew-card>
          </el-col>
        </el-row>
      </div>
      <div class="bug-analyse-footer">
        <el-button type="primary" @click="goBack">关闭</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import bugTodoUserPie from '../components/bug-todo-user-pie'
import bugTodoPie from '../components/bug-todo-pie'
import sprintBugChart from '../components/sprint-bug-chart'
export default {
  data () {
    return {

    }
  },
  components: {
    bugTodoPie,
    bugTodoUserPie,
    sprintBugChart
  },
  computed: {
    bugList () {
      return this.$store.getters.filterBugList
    }
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
  .bug-analyse-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .bug-analyse{
      flex: 1 1 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .bug-analyse-footer{
      flex: 0 0 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>

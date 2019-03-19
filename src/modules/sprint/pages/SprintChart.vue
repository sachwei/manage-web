<template>
  <panel>
    <div class="sprint-chart-wrapper">
      <div class="sprint-chart">
        <el-row :gutter="8">
          <el-col :span="12">
            <ew-card title="统计数据" style="height:300px;margin-bottom:10px">
              <sprint-task-analyse></sprint-task-analyse>
            </ew-card>
          </el-col>
          <el-col :span="12">
            <ew-card title="研发团队" style="height:300px;margin-bottom:10px">
              <user-chart></user-chart>
            </ew-card>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <ew-card title="燃尽图" style="height:400px">
              <burn-down-chart></burn-down-chart>
            </ew-card>
          </el-col>
          <el-col :span="12">
            <ew-card title="团队效率" style="height:400px">
              <team-rate-chart></team-rate-chart>
            </ew-card>
          </el-col>
        </el-row>
      </div>
      <div class="sprint-chart-footer">
        <el-button type="primary" @click="goBack">关闭</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import burnDownChart from '../components/burndown-chart'
import userChart from '../components/user-chart'
import teamRateChart from '../components/team-rate-chart'
import sprintTaskAnalyse from '../components/sprint-task-analyse'

export default {
  data () {
    return {
    }
  },
  components: {
    burnDownChart,
    userChart,
    teamRateChart,
    sprintTaskAnalyse
  }
}
</script>

<style scoped lang="scss">
  .sprint-chart-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .sprint-chart{
      flex: 1 1 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sprint-chart-footer{
      flex: 0 0 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>

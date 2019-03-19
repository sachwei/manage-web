<template>
  <panel>
    <div class="sprint-analyse-wrapper">
      <div class="sprint-analyse">
        <el-row :gutter="10">
          <el-col :span="24">
            <ew-card title="团队生产率" style="height:400px;margin-bottom:10px">
              <sprint-task-rate></sprint-task-rate>
            </ew-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <ew-card title="团队缺陷密度" style="height:400px;margin-bottom:10px">
              <sprint-bug-rate></sprint-bug-rate>
            </ew-card>
          </el-col>
        </el-row>
      </div>
      <div class="sprint-analyse-footer">
        <el-button type="primary" @click="goBack">关闭</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import sprintTaskRate from '../components/sprint-task-rate'
import sprintBugRate from '../components/sprint-bug-rate'
export default {
  data () {
    return {

    }
  },
  components: {
    sprintTaskRate,
    sprintBugRate
  },
  methods: {

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
  .sprint-analyse-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .sprint-analyse{
      flex: 1 1 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sprint-analyse-footer{
      flex: 0 0 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>

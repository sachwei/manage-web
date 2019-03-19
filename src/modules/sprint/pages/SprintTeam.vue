<template>
  <panel>
    <div class="sprint-team-wrapper">
      <el-table
        border
        :data="sprintTeams"
        :highlight-current-row="true"
        style="width: 100%"
        show-summary
        :max-height="tableHeight">
        <el-table-column
          type="index"
          width="70">
        </el-table-column>
        <el-table-column label="照片" width="80">
          <template slot-scope="scope">
            <img :src='headUrl + scope.row.email' style="height: 35px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          :formatter="userFormatter"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="rate"
          label="投入系数"
          width="110">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <div class="backlog-operator">
              <i @click="onEdit(scope.row)" class="fa fa-edit"></i>
              <i @click="onDelete(scope.row)" class="fa fa-trash"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="sprint-team-footer">
        <el-button type="primary" @click="goBack">关闭</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      sprintTeams: []
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    tableHeight () {
      return this.$utils.getClientHeight() - 120
    }
  },
  methods: {
    initData () {
      let teams = this.$route.params.teams
      if (teams) {
        this.sprintTeams = teams
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .sprint-team-wrapper{
    width: 100%;
  }
  .sprint-team-footer{
    margin-top: 10px;
    float: right;
  }
</style>

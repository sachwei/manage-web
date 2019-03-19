<template>
  <panel>
    <div class="personal-board">
      <el-row :gutter="10">
        <el-col :span="12">
          <project-deploy></project-deploy>
        </el-col>
      </el-row>
      </div>
  </panel>
</template>

<script>
import todoBoard from '../components/todo-board'
import sprintBoard from '../components/sprint-board'
import teamRateBoard from '../components/team-rate-board'
import sprintBugBoard from '../components/sprint-bug-board'
import sprintTaskBoard from '../components/sprint-task-board'
import projectDeploy from '../components/project-deploy'
export default {
  data () {
    return {
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  components: {
    todoBoard,
    sprintBoard,
    teamRateBoard,
    sprintBugBoard,
    sprintTaskBoard,
    projectDeploy
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .personal-board{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .personal-board-toolbar{
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      justify-content: flex-end;

      .todo-board{
        display: flex;
        flex: 1 1 auto;
      }
    }
  }
</style>

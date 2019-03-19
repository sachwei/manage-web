<template>
  <ew-card title="任务统计" class="margin-top-10" style="height: 350px">
    <sprint-task-analyse ref="taskAnalyse"></sprint-task-analyse>
  </ew-card>
</template>

<script>
import sprintTaskAnalyse from '../../sprint/components/sprint-task-analyse'
export default {
  data () {
    return {
    }
  },
  components: {
    sprintTaskAnalyse
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    }
  },
  watch: {
    curSprint () {
      this.$refs.taskAnalyse.refresh()
    }
  }
}
</script>

<style scoped lang="scss">

</style>

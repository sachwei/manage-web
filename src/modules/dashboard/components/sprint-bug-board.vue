<template>
  <ew-card title="缺陷趋势" class="margin-top-10" style="height: 350px">
    <sprint-bug-chart ref="bugChart"></sprint-bug-chart>
  </ew-card>
</template>

<script>
import sprintBugChart from '../../bug/components/sprint-bug-chart'
export default {
  data () {
    return {

    }
  },
  components: {
    sprintBugChart
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    }
  },
  watch: {
    curSprint () {
      this.$refs.bugChart.refresh()
    }
  }
}
</script>

<style scoped lang="scss">

</style>

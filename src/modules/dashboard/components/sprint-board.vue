<template>
  <ew-card title="项目状态" style="height: 350px">
    <sprint-burndown ref="burnDownChart"></sprint-burndown>
  </ew-card>
</template>

<script>
import sprintBurndown from '../../sprint/components/burndown-chart'
export default {
  data () {
    return {
    }
  },
  components: {
    sprintBurndown
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    }
  },
  watch: {
    curSprint () {
      this.$refs.burnDownChart.refresh()
    }
  }
}
</script>

<style scoped lang="scss">

</style>

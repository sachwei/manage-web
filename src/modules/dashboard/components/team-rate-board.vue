<template>
  <ew-card title="团队效率" class="margin-top-10" style="height: 350px">
    <team-rate-chart ref="teamRateChart"></team-rate-chart>
  </ew-card>
</template>

<script>
import teamRateChart from '../../sprint/components/team-rate-chart'
export default {
  components: {
    teamRateChart
  },
  computed: {
    curSprint () {
      return this.$store.state.sprint.curSprint
    }
  },
  watch: {
    curSprint () {
      this.$refs.teamRateChart.refresh()
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">

</style>

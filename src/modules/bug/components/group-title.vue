<template>
  <div class="group-title">
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: [
    'title'
  ]
}
</script>

<style scoped lang="scss">
  .group-title {
    border-left: 3px solid #1fa2d6;
    padding-left: 5px;
    color: #333;
    margin: 20px 0;
    font-size: 14px;
  }
</style>

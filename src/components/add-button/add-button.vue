<template>
  <el-tooltip class="item" effect="dark" content="新建" placement="top-start">
    <el-button
      type="success"
      icon="el-icon-plus"
      circle
      @click="onClick">
    </el-button>
</el-tooltip>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>

<style scoped>
  .toolbar-add-btn{
    height: 38px;
  }
</style>

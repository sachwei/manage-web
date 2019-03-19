<template>
  <el-select @change="onItemChage" clearable :filterable="true" :value="value"  placeholder="请选择" style="width:100%">
    <el-option
      v-for="item in dataList"
      :key="item.id"
      :label="item.id + '-' + item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: [
    'sprintId',
    'value'
  ],
  data () {
    return {
    }
  },
  watch: {
    sprintId () {
      this.initData()
    }
  },
  methods: {
    initData () {
      if (this.sprintId !== '') {
        this.findCondition = {
          sprintId: this.sprintId
        }
        this.findDataByCondition('backlogs')
      } else {
        this.dataList = []
      }
    },
    onItemChage (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

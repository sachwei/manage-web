<template>
  <el-select @change="onItemChage" filterable clearable :value="value" placeholder="请选择" style="width:100%">
    <el-option
      v-for="item in dataList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      tableName: 'orgs'
    }
  },
  props: [
    'value'
  ],
  methods: {
    initData () {
      this.findAllData()
    },
    onItemChage (item) {
      this.$emit('input', item)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

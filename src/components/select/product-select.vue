<template>
  <el-select @change="onItemChage" clearable :value="value" placeholder="请选择" style="width:100%">
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
    }
  },
  props: [
    'value'
  ],
  methods: {
    initData () {
      this.findDataByOrgId('products')
    },
    onItemChage (item) {
      this.$emit('input', item)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

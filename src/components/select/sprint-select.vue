<template>
  <el-select @change="onItemChage" clearable :value="value"  placeholder="请选择" style="width:100%">
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
  props: [
    'productId',
    'state',
    'value'
  ],
  data () {
    return {
    }
  },
  watch: {
    productId () {
      this.initData()
    }
  },
  methods: {
    initData () {
      this.findCondition = {
        productId: this.productId,
        state: { $in: this.state || [1, 2] }
      }
      this.findDataByCondition('sprints')
    },
    onItemChage (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

<template>
  <el-select @change="onItemChage" filterable clearable :value="defaultValue" placeholder="请选择" style="width:100%">
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
    'enumTypeKey',
    'default',
    'value'
  ],
  data () {
    return {
      defaultValue: ''
    }
  },
  watch: {
    value () {
      this.defaultValue = this.value
    }
  },
  methods: {
    initData () {
      if (this.enumTypeKey) {
        this.$enumService.getEnum(this.enumTypeKey).then((data) => {
          this.dataList = data
          this.setDefaultValue()
        })
      }
    },
    onItemChage (value) {
      this.$emit('input', value)
    },
    setDefaultValue () {
      if (!this.value && (this.default !== undefined)) {
        this.defaultValue = this.default
        setTimeout(() => {
          this.onItemChage(this.defaultValue)
        }, 300)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>

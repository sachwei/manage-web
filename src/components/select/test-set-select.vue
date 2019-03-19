<template>
  <el-cascader
    @change="onItemChage"
    clearable
    filterable
    :value="selectItem"
    :options="dataList"
    :props="props"
    change-on-select
    placeholder="请选择"
    style="width:100%">
  </el-cascader>
</template>

<script>
export default {
  data () {
    return {
      selectItem: [],
      tableName: 'testset',
      props: {
        'label': 'name',
        'value': 'id'
      }
    }
  },
  props: [
    'value'
  ],
  watch: {
    value () {
      this.initSelectItem()
    }
  },
  methods: {
    initSelectItem () {
      this.findDataByOrgId().then(() => {
        for (let i = 0, len = this.dataList.length; i < len; i++) {
          this.selectItem = []
          if (this.findNodePath(this.dataList[i], this.selectItem)) {
            break
          }
        }
      })
    },
    initData () {
      if (this.dataList.length === 0) {
        this.findDataByOrgId()
      }
    },
    onItemChage (item) {
      this.$emit('input', item[item.length - 1])
    },
    findNodePath (node, path) {
      if (node.id === this.value) {
        path.push(this.value)
        return true
      } else {
        path.push(node.id)
      }

      if (!node.children) {
        return false
      }

      for (let i = 0, len = node.children.length; i < len; i++) {
        if (this.findNodePath(node.children[i], path)) {
          return true
        } else {
          path.pop()
        }
      }

      return false
    }
  }
}
</script>

<style scoped lang="scss">

</style>

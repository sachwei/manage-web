<template>
  <el-select @change="onItemChage" filterable clearable :value="value" placeholder="请选择" style="width:100%">
    <el-option
      v-for="item in userList"
      :key="item.email"
      :label="item.userName"
      :value="item.email">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data () {
    return {
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    onItemChage (item) {
      this.$emit('input', item)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

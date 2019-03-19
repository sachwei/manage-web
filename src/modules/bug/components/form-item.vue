<template>
  <div class="form-item">
    <el-col :span="titleSpan">
      <span class="form-item-title"><span v-if="prop" class="validate-info">*</span>{{ title }}</span>
    </el-col>
    <el-col :span="itemSpan">
      <el-form-item :prop="prop">
        <slot></slot>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'prop',
    'title',
    'titleSpan',
    'itemSpan'
  ]
}
</script>

<style scoped lang="scss">
  .form-item {

    .form-item-title {
      width: 100%;
      min-width: 40px;
      display: inline-block;
      text-align: right;
      padding-right: 12px;
      box-sizing: border-box;
      color: #aaa;
      font-size: 14px;
    }

    .validate-info{
      color: red;
      margin-right: 2px;
    }
  }
</style>

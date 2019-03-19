<template>
  <div class="ew-card-wrapper">
    <div class="ew-card-header">
      <span class="header-title">{{ title }}</span>
      <div class="header-toolbar">
        <i class="fa fa-refresh margin-right-5" @click="onRefresh" v-if="refresh"></i>
        <i class="fa fa-expand margin-right-5" @click="dialogVisible = true"></i>
      </div>
    </div>
    <div class="ew-card-body">
      <slot v-if="!dialogVisible"></slot>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%">
      <div style="height: 500px;">
        <slot v-if="dialogVisible"></slot>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'refresh'
  ],
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    onRefresh () {
      this.$emit('onRefresh')
    }
  }
}
</script>

<style scoped lang="scss">
  .ew-card-wrapper{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    display: flex;
    flex-direction: column;

    .ew-card-header{
      flex: 0 0 40px;
      display: flex;
      padding: 5px 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
      align-items: center;

      .header-title{
        flex: 1 1 100px;
        font-size: 14px;
        color: #333;
      }

      .header-toolbar{
        flex: 0 0 100px;
        display: flex;
        justify-content: flex-end;

        .fa{
          color: #ddd;
          cursor: pointer;
          transition: color .3s;
        }

        .fa:hover{
          color: #aaa;
        }
      }
    }

    .ew-card-body{
      flex: 1 1 50px;
      padding: 12px;
      box-sizing: border-box;
      overflow-y: hidden;
    }
  }
</style>

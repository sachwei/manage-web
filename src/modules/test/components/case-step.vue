<template>
  <div class="case-step-wrapper">
    <el-table
      :data="dataList"
      border
      :default-sort="{prop: 'sort', order: 'ascending'}">
      <el-table-column
        prop="sort"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="summary"
        width="200"
        label="步骤描述">
      </el-table-column>
      <el-table-column
        prop="hope"
        label="预期结果">
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <i class="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"></i>
          <i class="el-icon-delete" @click="handleRemove(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-conditon">
      <el-button @click="onAdd" type="text" icon="el-icon-plus">新增操作步骤</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form :model="curData" label-width="80px" style="width:95%">
        <el-form-item label="序号">
          <el-input v-model="curData.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="步骤描述" style="margin-top:20px">
          <el-input v-model="curData.summary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="预期结果" style="margin-top:20px">
          <el-input v-model="curData.hope" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      newState: true
    }
  },
  props: [
    'value'
  ],
  watch: {
    value () {
      this.dataList = this.value
    },
    dataList () {
      this.$emit('input', this.dataList)
    }
  },
  methods: {
    onAdd () {
      this.dialogVisible = true
      this.newState = true
      this.curData = {}
    },
    handleEdit (index, data) {
      this.curData = data
      this.newState = false
      this.dialogVisible = true
    },
    handleRemove (index, data) {
      this.dataList = this.dataList.splice(index, 1)
    },
    onSubmit () {
      if (this.newState) {
        this.dataList.push(this.curData)
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .case-step-wrapper{
    .add-conditon{
      width: 100%;
      height: 45px;
      border: 1px solid #eee;
      border-top: none;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    i{
      cursor: pointer;
    }
  }
</style>

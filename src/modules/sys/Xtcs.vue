<template>
  <panel>
    <div class="xtcs-setting-view">
      <div class="toolbar">
        <div class="left">
          <el-input v-model="searchText" prefix-icon="el-icon-search" size="small" style="width: 240px" placeholder="请输入参数名或说明搜索">
          </el-input>
        </div>
        <div class="right">
          <el-button-group>
            <el-button size="small" @click="newCs" icon="el-icon-plus"></el-button>
            <el-button size="small" @click="onRefresh" icon="el-icon-refresh"></el-button>
          </el-button-group>
        </div>
      </div>
      <el-table clss="bug-table" :data="filterDataList" border style="width: 100%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="csName" label="参数名" width="280"></el-table-column>
        <el-table-column prop="csValue" label="参数值"></el-table-column>
        <el-table-column prop="csNote" label="参数说明" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="props">
            <el-button size="small" type="primary" @click="onEditCs(props.row)" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" type="danger" @click="onDeleteCs(props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="csDialog"
        width="60%">
        <el-input type="text" placeholder="请输入参数名" v-model="curCs.csName"></el-input><br/><br/>
        <el-input rows="5" type="textarea" placeholder="请输入参数值" v-model="curCs.csValue"></el-input><br/><br/>
        <el-input type="text" placeholder="请输入参数说明" v-model="curCs.csNote"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="csDialog = false">取消</el-button>
          <el-button size="mini" type="primary" @click="onSave">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      dataList: [],
      curCs: {},
      csDialog: false,
      isNew: true,
      searchText: ''
    }
  },
  computed: {
    filterDataList () {
      return this.dataList.filter(item => {
        return this.searchText.trim() === '' ? true : (item.csName.toLowerCase().indexOf(this.searchText.trim().toLowerCase()) !== -1 || item.csNote.indexOf(this.searchText.trim()) !== -1)
      })
    },
    dialogTitle () {
      return this.isNew === true ? '新增' : '修改'
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.findAllCs()
    },
    findAllCs () {
      this.$dataService.find(this.$apiUrl.SYS_ALL_XTCS).then((data) => {
        this.dataList = data
      })
    },
    onRefresh () {
      this.findAllCs()
    },
    onEditCs (row, event) {
      this.isNew = false
      this.curCs = row
      this.csDialog = true
    },
    newCs () {
      this.curCs = {
        csName: '',
        csValue: '',
        csNote: '',
        orgId: this.user.orgId[0]
      }
      this.isNew = true
      this.csDialog = true
    },
    onDeleteCs (row) {
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_XTCS + row._id).then((data) => {
        this.dataList = this.dataList.filter(item => item._id !== row._id)
      })
    },
    onSave () {
      if (this.dataCheck()) {
        if (this.isNew) {
          this.saveData()
        } else {
          this.updateData()
        }
      }
    },
    dataCheck () {
      if (!this.curCs.csName || !this.curCs.csValue) {
        return false
      }
      return true
    },
    saveData () {
      this.$dataService.save(this.$apiUrl.SYS_SAVE_XTCS, this.curCs).then((data) => {
        this.dataList.push(data)
        this.csDialog = false
      })
    },
    updateData () {
      this.$dataService.update(this.$apiUrl.SYS_UPDATE_XTCS + this.curCs._id, this.curCs).then((data) => {
        this.csDialog = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>

  .xtcs-setting-view {
    width:100%;
    height: 100%;
  }

  .toolbar {
    display: flex;
    margin-bottom: 10px;

    .left{
      flex: 0 0 400px;
    }

    .right {
      flex: 1 1 auto;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>

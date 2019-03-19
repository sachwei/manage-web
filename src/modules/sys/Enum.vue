<template>
  <panel>
    <div class="enum-setting-view">
      <div class="wrapper">
        <div class="enum-type">
          <div class="toolbar">
            <el-button @click="onOpenEnumTypeDialog" size="small" icon="el-icon-plus"></el-button>
            <el-input prefix-icon="el-icon-search" size="small" type="text" v-model="enumTypeSearch" placeholder="请输入搜索内容"></el-input>
          </div>
          <ul>
            <li v-for="(item, index) in filterEnumType" :class="{'active-li': item.id === enumTypeForm.id}" @click="onEnumTypeClick(item)" :key="index">
              <span>{{ item.id + '-' + item.name }}</span>
              <span v-if="item.key">{{ '[' + item.key + ']' }}</span>
              <i class="el-icon-edit" @click.stop="onEditEnumType(item)"></i>
              <i class="el-icon-delete" @click.stop="onDeleteEnumType(item)"></i>
            </li>
          </ul>
        </div>
        <div class="enums">
          <el-button @click="onOpenEnumDialog" size="small" icon="el-icon-plus"></el-button>
          <el-table class="enum-table" @row-dblclick='enumDbclick' :data="enumList" border style="width: 100%">
            <el-table-column prop="enumTypeId" label="类型编码" width="80"></el-table-column>
            <el-table-column prop="id" label="编码" width="80"></el-table-column>
            <el-table-column prop="name" label="枚举名称"></el-table-column>
            <el-table-column label="操作" width="100px">
              <template slot-scope="props">
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="onDeleteEnum(props.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-dialog title="新增枚举类型" :visible.sync="enumTypeDialogVisible" width="30%">
        <el-input type="text" placeholder="枚举类型名称" v-model="enumTypeForm.name"></el-input><br/><br/>
        <el-input type="text" placeholder="枚举类型Key" v-model="enumTypeForm.key"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="enumTypeDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="onEnumTypeSave">保存</el-button>
        </div>
      </el-dialog>

      <el-dialog title="新增枚举项" :visible.sync="enumDialogVisible" width="30%">
        <el-input type="text" placeholder="请输入枚举名称" v-model="enumForm.name"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="enumDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="onEnumSave">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      enumTypeDialogVisible: false,
      enumDialogVisible: false,

      enumTypeList: [],
      enumList: [],

      enumForm: {},
      enumTypeForm: {},
      enumTypeSearch: ''
    }
  },
  computed: {
    filterEnumType () {
      if (this.enumTypeSearch.trim()) {
        return this.enumTypeList.filter((item) => {
          return item.name.indexOf(this.enumTypeSearch) !== -1
        })
      } else {
        return this.enumTypeList
      }
    }
  },
  mounted () {
    this.findAllEnumType()
  },
  methods: {
    findAllEnumType () {
      this.$dataService.find(this.$apiUrl.SYS_ALL_ENUMTYPE).then((data) => {
        this.enumTypeList = data
      })
    },
    enumDbclick (row, event) {
      this.enumForm = row
      this.enumDialogVisible = true
    },
    onEnumTypeClick (item) {
      this.enumTypeForm = item
      this.findEnumByTypeId(item.id)
    },
    findEnumByTypeId (enumTypeId) {
      let condition = {
        'enumTypeId': enumTypeId
      }
      this.$dataService.find(this.$apiUrl.SYS_FIND_ENUM, condition).then((data) => {
        this.enumList = data
      })
    },
    onOpenEnumTypeDialog () {
      this.enumTypeForm = {}
      this.enumTypeDialogVisible = true
    },
    onEnumTypeSave () {
      if (this.enumTypeForm._id) {
        this.enumTypeUpdate()
      } else {
        this.enumTypeForm.id = this.$utils.getMaxId(this.enumTypeList)
        this.enumTypeAdd()
      }
    },
    enumTypeUpdate () {
      // 更新
      this.$dataService.update(this.$apiUrl.SYS_UPDATE_ENUMTYPE + this.enumTypeForm._id).then((data) => {
        this.enumTypeDialogVisible = false
      })
    },
    enumTypeAdd () {
      // 新增
      this.$dataService.save(this.$apiUrl.SYS_SAVE_ENUMTYPE, this.enumTypeForm).then((data) => {
        this.enumTypeList.push(data)
        this.enumTypeDialogVisible = false
      })
    },
    onEditEnumType (item) {
      this.enumTypeForm = item
      this.enumTypeDialogVisible = true
    },
    onDeleteEnumType (item) {
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_ENUMTYPE + item._id).then(() => {
        this.enumTypeList = this.enumTypeList.filter(enumType => enumType._id !== item._id)
      })
    },
    onOpenEnumDialog () {
      this.enumForm = {}
      this.enumDialogVisible = true
    },
    onEnumSave () {
      if (!this.enumTypeForm.id) {
        this.enumDialogVisible = false
        this.$message('请选择枚举类型')
        return
      }
      if (this.enumForm._id) {
        this.enumUpdate()
      } else {
        this.enumForm.id = this.$utils.getMaxId(this.enumList)
        this.enumForm.enumTypeId = this.enumTypeForm.id
        this.enumAdd()
      }
    },
    enumUpdate () {
      // 更新
      this.$dataService.update(this.$apiUrl.SYS_UPDATE_ENUM + this.enumForm._id).then((data) => {
        this.enumDialogVisible = false
      })
    },
    enumAdd () {
      // 新增
      this.$dataService.save(this.$apiUrl.SYS_SAVE_ENUM, this.enumForm).then((data) => {
        this.enumList.push(data)
        this.enumDialogVisible = false
      })
    },
    onDeleteEnum (item) {
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_ENUM + item._id).then(() => {
        this.enumList = this.enumList.filter(data => data._id !== item._id)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .enum-setting-view {
    width:100%;
    height: 100%;
  }

  .el-icon-edit{
    margin-right: 5px;
    margin-left: 10px;
  }

  .toolbar{
    display: flex;
    margin-bottom: 10px;

    .el-input{
      flex: 1 1 auto;
      margin-left: 10px;
      margin-right: 5px;
    }
  }

  .wrapper{
    display: flex;
    margin-top: 10px;
  }

  .enums{
    margin-left: 10px;
    flex: 1 1 auto;

    .el-table{
      margin-top: 10px;
    }
  }

  .enum-type{
    flex: 0 0 380px;

    ul{
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: auto;

      li:hover{
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
      }

      .active-li{
        background-color: #eee;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
      }

      li{
        border: 1px solid #eee;
        padding: 2px 10px;
        line-height: 40px;
        margin-bottom: 8px;
        margin-right: 5px;
        border-radius: 4px;
        display: flex;
        font-size: 14px;
        color: #333;

        span:nth-child(1){
          flex: 1 1 auto;
        }

        i{
          line-height: 40px;
          cursor: pointer;
        }
      }
    }
  }

</style>

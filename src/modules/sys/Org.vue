<template>
  <panel>
    <div class="org-wrapper">
      <div class="left">
        <div class="org-toolbar">
          <el-button @click="addOrg" size="small" type="primary" icon="el-icon-plus">新增</el-button>
        </div>
        <div class="org-list">
          <div class="org-item"
               v-for="item in orgList"
               :key="item.id"
               :class="{ activeOrg: curOrg.id === item.id }"
               @click="orgNodeClick(item)">
            <span class="org-name">{{ item.name }}</span>
            <div class="org-operator">
              <i class="el-icon-edit" @click="editOrg(item)"></i>
              <i class="el-icon-delete" @click="onDelete(item)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div v-for="user in curUserList" :key="user._id" class="user-item" :class="[user.sex === 0 ? 'woman-bg' : 'man-bg']">
          <img class="headPhoto" :src="headUrl + user.email"/>
          <div class="user-info">
            <span class="user-name">{{ user.userName }}</span>
            <span class="role-name">{{ roleFormatter(user) }}</span>
          </div>
        </div>
      </div>

      <!-- 组织编辑 -->
      <el-dialog :title="orgTitle" :visible.sync="addOrgDialog" width="40%">
        <el-form :model="orgForm" style="width:90%" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="orgForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrgDialog = false">取消</el-button>
          <el-button size="small" type="primary" @click="onSaveOrg()">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      orgParent: [],
      addOrgDialog: false,
      addOrgState: true,
      curOrg: {},
      orgList: [],
      orgForm: {},
      roleList: [],
      userList: [],
      curUserList: [],
      maxOrgId: 0
    }
  },
  computed: {
    orgTreeData () {
      return this.$utils.arrayToTree(this.orgList)
    },
    orgTitle () {
      if (this.addOrgState) {
        return '新增'
      } else {
        return '编辑'
      }
    }
  },
  methods: {
    initData () {
      this.findAllUser().then((data) => {
        this.userList = [].concat(data)
        return this.findAllOrg()
      }).then((data) => {
        this.orgList = [].concat(data)
        return this.findAllRole()
      }).then((data) => {
        this.roleList = data
      })
    },
    orgNodeClick (nodeData) {
      this.curOrg = nodeData
      this.curUserList = this.userList.filter((user) => {
        return user.orgId.indexOf(nodeData.id) !== -1
      })
    },
    onSaveOrg () {
      if (this.addOrgState) {
        this.saveOrg()
      } else {
        this.updateOrg()
      }
    },
    saveOrg () {
      this.$dataService.save(this.$apiUrl.SYS_SAVE_ORG, this.orgForm).then((data) => {
        this.orgList.push(data)
        this.addOrgDialog = false
      })
    },
    updateOrg () {
      this.$dataService.save(this.$apiUrl.SYS_UPDATE_ORG + this.orgForm._id, this.orgForm).then((data) => {
        this.addOrgDialog = false
      })
    },
    addOrg (node) {
      let orgId = this.$utils.getMaxId(this.orgList)
      this.orgForm.id = orgId
      this.addOrgState = true
      this.addOrgDialog = true
    },
    editOrg (data) {
      this.orgForm = data
      this.addOrgState = false
      this.addOrgDialog = true
    },
    doDelete (data) {
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_ORG + data._id).then(() => {
        this.orgList = this.orgList.filter(item => item._id !== data._id)
      })
    },
    roleFormatter (row) {
      return row.roleIds && this.$utils.dataFormatter(this.roleList, row.roleIds)
    }
  }
}
</script>

<style lang="scss" scoped>
  .org-wrapper{
    display: flex;
    height: 100%;
    width: 100%;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
  }

  .left{
    flex: 0 0 300px;
    width: 300px;

    .org-list {
      margin-top: 10px;
      overflow-y: auto;

      .activeOrg{
        background-color: #eee;
      }

      .org-item:hover {
        background-color: #eee;
      }

      .org-item {
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 10px;

        .org-name {
          flex: 1 1 auto;
        }

        .org-operator {
          cursor: pointer;

          i:hover {
            color: red;
          }
        }
      }
    }
  }

  .right{
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #ececec;
    overflow-y: auto;
    align-content: flex-start;
  }

  .woman-bg{
    background: url(../../assets/img/icon_usercard_woman.png);
  }

  .man-bg{
    background: url(../../assets/img/icon_usercard_man.png);
  }

  .user-item:hover{
    box-shadow: 2px 2px 2px 2px #ddd;
  }

  .user-item {
    background-color: white;
    height: 88px;
    width: 260px;
    margin: 10px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    background-position: bottom right;
    background-repeat: no-repeat;
    display: flex;
    cursor: pointer;
    transition: all .3s;

    .headPhoto{
      height: 88px;
      width: 88px;
      vertical-align: center;
    }

    .user-info{
      display: flex;
      flex-direction: column;
      text-overflow: ellipsis;

      .user-name{
        margin-top: 20px;
        margin-left: 20px;
        font-size: 14px;
        font-weight: bold;
      }

      .role-name{
        font-size: 12px;
        margin: 8px 0 0 20px;
        color: rgba(0,0,0,.7);
      }
    }
  }
</style>

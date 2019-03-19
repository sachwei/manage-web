<template>
  <panel>
    <div class="user-wrapper">
      <el-table :data="userList" :max-height="tableHeight" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="照片" width="80">
          <template slot-scope="scope">
            <img :src='headUrl + scope.row.email' style="height: 35px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="userName" width="80" label="名称"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="orgId" :formatter="orgFormatter" label="组织"></el-table-column>
        <el-table-column prop="roleIds" :formatter="roleFormatter" label="角色"></el-table-column>
        <el-table-column  label="状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.state === 1 ? '启用' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="onEditUser(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" type="danger" @click="onDelete(scope.row)">删除</el-button>
            <el-button size="small" type="danger" @click="onStopUser(scope.row)">{{ scope.row.state === 1 ? '停用' : '启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 20]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal">
      </el-pagination>

      <el-dialog title="编辑" :visible.sync="updateDialog" width="70%">
        <div class="user-edit">
          <el-card class="user-form">
            <el-form ref="form" :model="userForm" label-width="80px">
              <el-form-item label="组织">
                <org-multi-select v-model="userForm.orgId"></org-multi-select>
              </el-form-item>
              <el-form-item label="名称">
                <el-input :disabled="true" v-model="userForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input :disabled="true" v-model="userForm.email"></el-input>
              </el-form-item>
              <el-form-item label="工号">
                <el-input v-model="userForm.workNo"></el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch
                  v-model="userForm.state"
                  active-color="#13ce66"
                  inactive-color="#ddd"
                  :active-value=1
                  :inactive-value=0>
                </el-switch>
              </el-form-item>
              <el-form-item label="角色">
                <span style="color: #ccc">{{ roleFormatter(userForm) }}</span>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="role-select">
            <el-tree :data="roleTreeData"
                      ref="roleTree"
                      show-checkbox
                      :check-strictly="true"
                      :default-expand-all="true"
                      highlight-current
                      :render-content="renderContent"
                      @check-change = "roleNodeClick"
                      clearable node-key="id" :props="defaultProps">
            </el-tree>
          </el-card>
        </div>
        <div slot="footer">
          <el-button size="small" @click="updateDialog = false">取消</el-button>
          <el-button size="small" @click="onUserSave" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </panel>
</template>

<script>
import orgMultiSelect from '../../components/select/org-multi-select'
export default {
  components: {
    orgMultiSelect
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      props: {
        value: 'id',
        label: 'name'
      },
      queryParam: {},
      userList: [],
      userTotal: 0,
      updateDialog: false,
      userForm: {},
      roleList: [],
      orgList: [],
      tableName: 'users'
    }
  },
  computed: {
    roleTreeData () {
      return this.$utils.arrayToTree(this.roleList)
    },
    orgTreeData () {
      return this.$utils.arrayToTree(this.orgList)
    },
    tableHeight () {
      return this.$utils.getClientHeight() - 140
    }
  },
  methods: {
    initParam () {
      this.queryParam = {
        conditions: {
          orgId: this.user.orgId[0]
        },
        options: {
          pageSize: 20,
          page: 1
        }
      }
      if (this.user.roleIds.indexOf(1) !== -1) {
        this.queryParam.conditions = {}
      }
    },
    initData () {
      this.findPageUser()
      this.findAllRole().then((data) => {
        this.roleList = data
      })
      this.findAllOrg().then((data) => {
        this.orgList = data
      })
    },
    handleSizeChange (value) {
      this.queryParam.options.pageSize = value
      this.queryParam.options.page = 1
      this.findPageUser()
    },
    handleCurrentChange (value) {
      this.queryParam.options.page = value
      this.findPageUser()
    },
    findPageUser () {
      return new Promise((resolve, reject) => {
        this.$dataService.find(this.$apiUrl.SYS_USER_PAGE, this.queryParam).then(data => {
          this.userList = data.content
          this.userTotal = data.total
          resolve()
        })
      })
    },
    getUserCount () {
      return new Promise((resolve, reject) => {
        this.$http.post(this.$apiUrl.SYS_USER_COUNT, {}).then((res) => {
          if (res && res.data) {
            resolve(res.data)
          }
        }).catch((err) => {
          reject(err)
        })
      })
    },
    onEditUser (data) {
      this.updateDialog = true
      this.userForm = data
      this.$nextTick(() => {
        this.userForm.roleIds && this.$refs.roleTree.setCheckedKeys(this.userForm.roleIds)
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style='font-size: 14px;'><i class={data.icon}></i>&nbsp;{node.label}</span>
      )
    },
    roleNodeClick (data, check, subCheck) {
      this.userForm.roleIds = this.$refs.roleTree.getCheckedKeys()
    },
    onUserSave () {
      this.$dataService.save(this.$apiUrl.SYS_UPDATE_USER + this.userForm._id, this.userForm).then((data) => {
        this.updateDialog = false
      })
    },
    doAfterDelete (item) {
      this.userList = this.userList.filter(user => user._id !== item._id)
    },
    onStopUser (data) {
      data.state = Math.abs(data.state - 1)
      this.userForm = data
      this.onUserSave()
    },
    roleFormatter (row) {
      return row.roleIds && this.$utils.dataFormatter(this.roleList, row.roleIds)
    },
    orgFormatter (row) {
      return row.orgId && this.$utils.dataFormatter(this.orgList, row.orgId)
    }
  }
}
</script>

<style scoped lang="scss">
  .user-wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .el-pagination {
    float: right;
    margin-top: 15px;
  }

  .user-edit{
    display: flex;

    .user-form{
      flex: 1 1 300px;
      min-width: 300px;
      margin: 0 20px;
    }

    .role-select{
      flex: 0 0 300px;
      margin-right: 20px;
      max-height: 500px;
      overflow: auto;
    }
  }
</style>

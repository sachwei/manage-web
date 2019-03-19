<template>
  <panel>
    <div class="role-wrapper">
      <div class="role-content">
        <el-card class="role-tree">
          <el-button size="small" class="add-role-btn" type="primary" icon="el-icon-plus" @click="onAddRole">新增</el-button>
          <el-tree :data="roleTreeData"
                    show-checkbox
                    :default-expand-all="true"
                    :expand-on-click-node = "false"
                    highlight-current
                    @node-click="nodeClick" clearable node-key="id" :props="defaultProps">
          </el-tree>
        </el-card>

        <el-card class="box-card">
          <el-form ref="form" :model="roleForm" label-width="80px">
            <el-form-item label="父级">
              <el-cascader
                style="width:100%"
                :options="roleTreeData"
                change-on-select
                clearable
                :props="props"
                v-model="roleParent"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="roleForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch
                v-model="roleForm.state"
                active-color="#13ce66"
                inactive-color="#ddd"
                :active-value=1
                :inactive-value=0>
              </el-switch>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="roleForm.sort"></el-input-number>
            </el-form-item>
            <el-form-item>
              <div v-if="roleForm._id">
                <el-button size="small" type="primary" icon="el-icon-edit" @click="onUpdateRole">修改</el-button>
                <el-button size="small" type="success" @click="setting" icon="setting">配置资源</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="onDeleteRole">删除</el-button>
              </div>
              <el-button v-else size="small" type="primary" @click="onSaveRole">新增</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="role-tree" :class="{'wave-animation': infoSetting}">
          <el-tree :data="menuTreeData"
                    show-checkbox
                    ref="menuTree"
                    :check-strictly="true"
                    :default-expand-all="true"
                    highlight-current
                    @check-change="menuSelect" clearable node-key="id" :props="defaultProps">
          </el-tree>
        </el-card>
      </div>
    </div>
  </panel>
</template>

<script>
export default {
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
      roleList: [],
      roleId: 1,
      roleForm: {},
      roleParent: [],

      menuList: [],
      infoSetting: false,

      roleMenuList: [],
      menuCheck: [],

      roleSwitching: false
    }
  },
  computed: {
    roleTreeData () {
      return this.$utils.arrayToTree(this.roleList)
    },
    menuTreeData () {
      return this.$utils.arrayToTree(this.menuList)
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.findAllRole().then((data) => {
        this.roleList = data
        this.newRoleForm()
        return this.findAllMenu()
      }).then((data) => {
        this.menuList = data
      })
    },
    menuSelect (data, check, subCheck) {
      if (!this.roleForm._id) return
      if (this.roleSwitching) return
      if (check) {
        this.saveRoleMenu(data.id)
      } else {
        this.deleteRoleMenu(data.id)
      }
    },
    saveRoleMenu (id) {
      let roleMenu = {
        'roleId': this.roleForm.id,
        'menuId': id
      }
      if (this.findRoleMenu(id)) return
      this.$dataService.save(this.$apiUrl.SYS_SAVE_ROLEMENU, roleMenu).then((data) => {
        this.roleMenuList.push(data)
      })
    },
    findRoleMenu (menuId) {
      // 如果已存在则不保存
      for (let i = 0, len = this.roleMenuList.length; i < len; i++) {
        let item = this.roleMenuList[i]
        if ((item.roleId === this.roleForm.id) && (item.menuId === menuId)) {
          return item
        }
      }
      return null
    },
    deleteRoleMenu (id) {
      let roleMenu = this.findRoleMenu(id)
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_ROLEMENU + roleMenu._id).then(() => {
        this.roleMenuList = this.roleMenuList.filter(item => item.menuId !== id)
      })
    },
    setting () {
      this.infoSetting = true
      setTimeout(() => {
        this.infoSetting = false
      }, 1000)
    },
    getMaxRoleId () {
      let maxId = 0
      for (let i = 0, len = this.roleList.length; i < len; i++) {
        if (this.roleList[i].id > maxId) {
          maxId = this.roleList[i].id
        }
      }
      return maxId + 1
    },
    newRoleForm () {
      this.roleForm = {
        id: this.getMaxRoleId(),
        pid: null,
        name: '',
        sort: 0,
        state: 0,
        children: []
      }
    },
    getRoleMenuList (roleId) {
      let condition = {
        'roleId': roleId
      }
      return this.$dataService.find(this.$apiUrl.SYS_FIND_ROLEMENU, condition)
    },
    onUpdateRole () {
      this.roleForm.pid = this.roleParent && this.roleParent.slice(0).pop()
      this.$dataService.update(this.$apiUrl.SYS_UPDATE_ROLE + this.roleForm._id, this.roleForm).then((data) => {
        this.updateRolePid()
      })
    },
    updateRolePid () {
      this.roleList.forEach((item) => {
        if (item.id === this.roleForm.id) {
          item.pid = this.roleForm.pid
        }
      })
    },
    onDeleteRole () {
      this.deleteConfirm().then(() => {
        this.deleteRole()
      }).catch(() => {
        this.$notify({
          title: '警告',
          message: '不能删除非底层角色',
          type: 'warning'
        })
      })
    },
    deleteRole () {
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_ROLE + this.roleForm._id).then((data) => {
        this.roleList = this.roleList.filter((item) => item.id !== this.roleForm.id)
        this.roleForm = {}
        this.roleParent = []
      })
    },
    deleteConfirm () {
      return new Promise((resolve, reject) => {
        if (this.roleList.some(item => item.pid === this.roleForm.id)) {
          reject(new Error())
        } else {
          resolve()
        }
      })
    },
    onAddRole () {
      this.newRoleForm()
    },
    onSaveRole () {
      this.roleForm.pid = this.roleParent && this.roleParent.slice(0).pop()
      this.$utils.appendTreeNode(this.roleTreeData, this.$utils.merge({}, this.roleForm))
      this.$dataService.save(this.$apiUrl.SYS_SAVE_ROLE, this.roleForm).then((data) => {
        this.roleList.push(data)
        this.newRoleForm()
      })
    },
    nodeClick (data) {
      this.roleForm = data
      this.roleParent = data.pid && this.$utils.getCascadeValue(this.roleList, data.pid)
      this.getRoleMenuList(this.roleForm.id).then((data) => {
        this.roleMenuList = data
        this.setMenuCheck()
      })
    },
    setMenuCheck () {
      this.roleSwitching = true
      this.menuCheck = []
      for (let i = 0, len = this.roleMenuList.length; i < len; i++) {
        this.menuCheck.push(this.roleMenuList[i].menuId)
      }
      this.$refs.menuTree.setCheckedKeys(this.menuCheck)
      setTimeout(() => {
        this.roleSwitching = false
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  .role-wrapper{
    height: 100%;
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;

    .role-content{
      flex: 1 1 auto;
      display: flex;

      .add-role-btn{
        margin-bottom: 10px;
      }

      .role-tree{
        flex: 0 0 300px;
        overflow: auto;
      }

      .box-card{
        margin: 0 10px;
        flex: 1 1 auto;
        overflow: auto;
      }

      .wave-animation{
        animation: wobble 1s 1;
      }
    }
  }
</style>

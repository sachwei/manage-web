<template>
  <panel>
    <div class="menu-wrapper">
      <div class="menu-content">
        <el-card class="menu-tree">
          <el-tree :data="menuTreeData"
                    show-checkbox
                    :default-expand-all="true"
                    highlight-current
                    :render-content="renderContent"
                    @node-click="nodeClick" clearable node-key="id" :props="defaultProps">
          </el-tree>
        </el-card>

        <el-card class="box-card">
          <el-form ref="form" :model="newMenuForm" label-width="120px">
            <el-form-item label="父级">
              <el-cascader
                style="width:100%"
                :options="menuTreeData"
                change-on-select
                clearable
                :props="props"
                v-model="newMenuParent"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="newMenuForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="链接">
              <el-input v-model="newMenuForm.href" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-input v-model="newMenuForm.icon" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch
                v-model="newMenuForm.state"
                active-color="#13ce66"
                inactive-color="#ddd"
                active-value="1"
                inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="newMenuForm.sort"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-plus" @click="onAddMenu">新增</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="box-card">
          <el-form ref="form" :model="menuForm" label-width="120px">
            <el-form-item label="父级">
              <el-cascader
                style="width:100%"
                :options="menuTreeData"
                change-on-select
                :props="props"
                clearable
                v-model="menuParent"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="menuForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="链接">
              <el-input v-model="menuForm.href" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-input v-model="menuForm.icon" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch
                v-model="menuForm.state"
                active-color="#13ce66"
                inactive-color="#ddd"
                :active-value=1
                :inactive-value=0>
              </el-switch>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="menuForm.sort"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-edit" @click="onUpdateMenu">修改</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="onDeleteMenu">删除</el-button>
            </el-form-item>
          </el-form>
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
      menuList: [],
      menuForm: {},
      newMenuForm: {},
      props: {
        value: 'id',
        label: 'name'
      },
      newMenuParent: [],
      menuParent: []
    }
  },
  computed: {
    menuTreeData () {
      return this.$utils.arrayToTree(this.menuList)
    }
  },
  methods: {
    initData () {
      this.findAllMenu().then((data) => {
        this.menuList = data
        this.menuList.sort((a, b) => {
          return a.sort - b.sort
        })
        this.newMenu()
      })
    },
    newMenu () {
      this.newMenuForm = {
        id: this.$utils.getMaxId(this.menuList),
        pid: null,
        name: '',
        sort: 0,
        icon: '',
        href: '',
        state: 0,
        children: []
      }
    },
    onUpdateMenu () {
      this.menuForm.pid = this.menuParent && this.menuParent.slice(0).pop()
      this.$dataService.update(this.$apiUrl.SYS_UPDATE_MENU + this.menuForm._id, this.menuForm).then((data) => {
        this.updateMenuPid()
      })
    },
    updateMenuPid () {
      this.menuList.forEach((item) => {
        if (item.id === this.menuForm.id) {
          item.pid = this.menuForm.pid
        }
      })
    },
    onDeleteMenu () {
      this.deleteConfirm().then(() => {
        this.deleteMenu()
      }).catch(() => {
        this.$notify({
          title: '警告',
          message: '不能删除非底层菜单',
          type: 'warning'
        })
      })
    },
    deleteMenu () {
      this.$dataService.deleteById(this.$apiUrl.SYS_DELETE_MENU + this.menuForm._id).then((data) => {
        this.menuList = this.menuList.filter((item) => item.id !== this.menuForm.id)
        this.menuForm = {}
        this.newMenuParent = []
        this.menuParent = []
      })
    },
    deleteConfirm () {
      return new Promise((resolve, reject) => {
        if (this.menuList.some(item => item.pid === this.menuForm.id)) {
          reject(new Error())
        } else {
          resolve()
        }
      })
    },
    onAddMenu () {
      this.newMenuForm.pid = this.newMenuParent.slice(0).pop()
      this.$utils.appendTreeNode(this.menuTreeData, this.$utils.merge({}, this.newMenuForm))
      this.$dataService.save(this.$apiUrl.SYS_SAVE_MENU, this.newMenuForm).then((data) => {
        this.menuList.push(data)
        this.newMenu()
      })
    },
    nodeClick (data) {
      this.newMenuParent = this.$utils.getCascadeValue(this.menuList, data.id)

      this.menuForm = data
      this.menuParent = data.pid && this.$utils.getCascadeValue(this.menuList, data.pid)
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style='font-size: 14px;'><i class={data.icon}></i>&nbsp;{node.label}</span>
      )
    }
  }
}
</script>

<style scoped lang="scss">
  .menu-wrapper{
    height: 100%;
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;

    .menu-content{
      flex: 1 1 auto;
      display: flex;

      .menu-tree{
        flex: 0 0 240px;
        overflow: auto;
      }

      .box-card{
        margin-left: 10px;
        flex: 1 1 auto;
      }
    }
  }
</style>

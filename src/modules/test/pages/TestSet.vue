<template>
  <panel>
    <div class="menu-wrapper">
      <div class="menu-content">
        <el-card class="menu-tree">
          <el-tree :data="dataList"
                   :default-expand-all="true"
                   highlight-current
                   :expand-on-click-node="false"
                    @node-click="onNodeClick"
                    :render-content="renderContent"
                   :props="defaultProps">
          </el-tree>
        </el-card>

        <el-card class="box-card">
          <el-form ref="form" :model="newForm" label-width="120px">
            <el-form-item label="所属用例集">
              <el-cascader
                style="width:100%"
                :options="[curData]"
                change-on-select
                clearable
                :props="props"
                v-model="newFormParent"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="用例集名称">
              <el-input v-model="newForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="newForm.sort"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-plus" @click="onSave">新增</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="box-card">
          <el-form ref="form" :model="curNode" label-width="120px">
            <el-form-item label="父级">
              <el-cascader
                :disabled="true"
                style="width:100%"
                :options="[curData]"
                change-on-select
                :props="props"
                clearable
                v-model="newFormParent"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="curNode.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="curNode.sort"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button @click="onEdit" size="small" type="primary" icon="el-icon-edit">修改</el-button>
              <el-button @click="onRemove" size="small" type="danger" icon="el-icon-delete">删除</el-button>
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
      props: {
        value: 'id',
        label: 'name'
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      newForm: {},
      newFormParent: [],
      nodeParent: [],
      curNode: {},
      tableName: 'testset'
    }
  },
  methods: {
    initData () {
      this.findDataByOrgId().then((data) => {
        this.initTopSet()
      })
    },
    initTopSet () {
      let condition = {
        orgId: { $in: [this.user.orgId[0]] }
      }
      this.$dataService.find(this.$apiUrl.BASE_FIND + 'products', condition).then(data => {
        let productList = []
        let flag = true
        for (let i = 0, len = data.length; i < len; i++) {
          flag = true
          for (let j = 0, le = this.dataList.length; j < le; j++) {
            if (data[i].name === this.dataList[j].name) {
              flag = false
            }
          }
          if (flag) {
            productList.push(data[i])
          }
        }
        if (productList.length > 0) {
          let promises = productList.map(() => {
            return this.getSequence('testset_key')
          })
          Promise.all(promises).then(values => {
            let initData = []
            for (let i = 0, len = productList.length; i < len; i++) {
              initData.push({
                id: values[i],
                orgId: this.user.orgId[0],
                name: productList[i].name,
                sort: i + 1,
                productId: productList[i].id,
                children: []
              })
            }
            this.$dataService.save(this.$apiUrl.BASE_SAVE_DOCS + this.tableName, initData).then(data => {
              this.dataList = this.dataList.concat(data.ops)
            })
          })
        }
      })
    },
    doSaveBefore () {
      return new Promise((resolve, reject) => {
        this.getSequence('testset_key').then(id => {
          this.newForm.id = id
          this.newForm.orgId = this.user.orgId[0]
          if (this.newFormParent.length === 0) {
            this.curData = this.newForm
          } else {
            if (this.curNode.children && this.curNode.children.length > 0) {
              this.curNode.children.push(Object.assign({}, this.newForm))
            } else {
              this.$set(this.curNode, 'children', [Object.assign({}, this.newForm)])
            }
          }
          resolve()
        })
      })
    },
    doAfterAdd (data) {
      this.newForm = {}
      this.newFormParent = []
    },
    onNodeClick (data, node) {
      this.newFormParent = []
      this.newFormParent.push(data.id)
      let tmpNode = node
      while (tmpNode.level > 1) {
        tmpNode = tmpNode.parent
        this.newFormParent.push(tmpNode.data.id)
      }
      this.curNode = data
      this.newFormParent = this.newFormParent.reverse()
      this.curData = tmpNode.data
    },
    onEdit () {
      this.doUpdate()
    },
    onRemove () {
      if (this.curNode._id) {
        this.onDelete(this.curNode)
      } else {
        this.removeCurNode(this.curData, this.curNode)
        this.doUpdate()
      }
    },
    doAfterDelete () {
      this.dataList = this.dataList.filter(item => item._id !== this.curNode._id)
    },
    removeCurNode (c, n) {
      if (!c.children) {
        return
      }
      for (let i = 0, len = c.children.length; i < len; i++) {
        if (c.children[i].id === n.id) {
          c.children.splice(i, 1)
          return
        } else {
          this.removeCurNode(c.children[i], n)
        }
      }
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style='font-size: 14px;'>{ node.data.id + '-' + node.label}</span>
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

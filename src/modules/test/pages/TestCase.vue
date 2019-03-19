<template>
  <panel>
    <div class="test-case-wrapper">
      <div class="test-case-toolbar">
        <el-input
          v-model="searchText"
          suffix-icon="el-icon-search"
          style="width:300px"
          placeholder="请输入搜索内容"></el-input>
      </div>
      <div class="test-case-content">
        <div class="test-case-set">
          <el-tree :data="testSet"
                   :default-expand-all="true"
                   highlight-current
                   :expand-on-click-node="false"
                    @node-click="onSetClick"
                    :render-content="renderContent"
                   :props="defaultProps">
          </el-tree>
        </div>
        <div class="test-case-list">
          <div class="test-case-list-toolbar">
            <el-button @click="onNew" size="small" icon="el-icon-plus">新增</el-button>
            <el-button size="small" icon="el-icon-upload2" @click="uploadFile" :loading="isUploadingFile">导入</el-button>
            <input id="importExcel" type="file" accept=".xls,.xlsx" @change="onFileSelect"/>
          </div>
          <div class="test-case-list-table">
            <el-table
              :data="caseList"
              :max-height="tableHeight"
              border
              show-summary
              :summary-method="getSummaries"
              :default-sort = "{prop: 'sort', order: 'ascending'}"
              style="width: 100%">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="id" width="80" label="用例编号"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="name" label="用例名称"></el-table-column>
              <el-table-column width="80" prop="backlogId" label="故事编号"></el-table-column>
              <el-table-column
                :formatter="userFormatter"
                :filters="userFilter"
                :filter-method="filterHandler"
                prop="createUserId"
                width="90"
                label="创建者"></el-table-column>
              <el-table-column
                :formatter="typeFormater"
                :filters="typeFilter"
                :filter-method="filterHandler"
                prop="type"
                width="90"
                label="类型"></el-table-column>
              <el-table-column
                sortable
                :formatter="levelFormater"
                prop="sort"
                width="90"
                label="优先级"></el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="onCopy(scope.row)">复制</el-button>
                  <el-button size="small" type="text" @click="onEdit(scope.row)">编辑</el-button>
                  <el-button size="small" type="text" @click="onDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import { mapMutations } from 'vuex'
import testCaseService from '../service/TestCaseService'
export default {
  data () {
    return {
      testSet: [],
      searchText: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      tableName: 'testcase',
      curNode: {},
      topNode: {},
      userFilter: [],
      typeFilter: [],
      levelFilter: [],
      levels: [],
      types: [],
      isUploadingFile: false
    }
  },
  computed: {
    tableHeight () {
      return this.$utils.getClientHeight() - 160
    },
    caseList () {
      return this.$store.getters.filterDataList
    },
    userList () {
      return this.$store.state.userList
    }
  },
  watch: {
    searchText () {
      this.setFilterText(this.searchText)
    }
  },
  methods: {
    ...mapMutations(['setDataList', 'setFilterText', 'deleteCase', 'addCase']),
    initData () {
      this.findDataByOrgId('testset').then(data => {
        this.testSet = data
        this.$enumService.getEnum('TEST_CASE_LEVEL').then((data) => {
          this.levels = data
          return this.$enumService.getEnum('TEST_CASE_TYPE')
        }).then((data) => {
          this.types = data
          this.calcFilter()
        })
      })
    },
    calcFilter () {
      this.levelFilter = []
      this.typeFilter = []
      this.userFilter = []

      this.levels.forEach(item => {
        this.levelFilter.push({
          text: item.name,
          value: item.id
        })
      })

      this.types.forEach(item => {
        this.typeFilter.push({
          text: item.name,
          value: item.id
        })
      })

      this.caseList.forEach(item => {
        if (!this.userFilter.find(user => user.value === item.createUserId)) {
          this.userFilter.push({
            text: this.$utils.userFormatter(item.createUserId, this.userList),
            value: item.createUserId
          })
        }
      })
    },
    getSummaries (param) {
      const { data } = param
      const sums = []
      sums[0] = '合计：'
      sums[1] = data.length
      return sums
    },
    onSetClick (data, node) {
      this.curNode = data
      let setids = []
      this.getChildrenIds(data, setids)
      this.findCondition = {
        'setId': { $in: setids },
        'orgId': this.user.orgId[0]
      }
      this.findDataByCondition().then(data => {
        this.setDataList(data)
      })

      let tmpNode = node
      while (tmpNode.level > 1) {
        tmpNode = tmpNode.parent
      }
      this.topNode = tmpNode.data
    },
    getChildrenIds (data, result) {
      result.push(data.id)

      if (!data.children) {
        return
      }
      for (let i = 0, len = data.children.length; i < len; i++) {
        this.getChildrenIds(data.children[i], result)
      }
    },
    onNew () {
      this.$router.push({ path: 'case/detail', query: { setId: this.curNode.id, productId: this.topNode.productId } })
    },
    onEdit (data) {
      this.$router.push({ path: 'case/detail', query: { id: data.id } })
    },
    levelFormater (row, column, cellValue) {
      return this.$enumService.enumFormat('TEST_CASE_LEVEL', cellValue)
    },
    typeFormater (row, column, cellValue) {
      return this.$enumService.enumFormat('TEST_CASE_TYPE', cellValue)
    },
    doAfterDelete (data) {
      this.deleteCase(data._id)
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    onCopy (data) {
      this.getSequence('test_case_key').then((id) => {
        this.curData = this.$utils.deepCopy(data)
        this.curData.id = id
        this.curData.createTime = new Date()
        this.curData.createUserId = this.user.email
        this.curData.name = this.curData.name + '[复制]'
        delete this.curData._id
        this.doAdd().then((data) => {
          this.addCase(data)
        })
      })
    },
    onFileSelect (e) {
      this.isUploadingFile = true
      let setId = (this.curNode && this.curNode.id) || -1
      testCaseService.importExcelData(e.target.files, setId).then((res) => {
        this.isUploadingFile = false
        this.clearFile()
        if (res.data && (Number(res.data.code) === 1)) {
          this.$message.error(res.data.message)
        } else {
          if (this.curNode) {
            this.onSetClick(this.curNode, {})
          }
          this.$message('导入成功')
        }
      }).catch(() => {
        this.isUploadingFile = false
        this.clearFile()
      })
    },
    clearFile () {
      let file = document.querySelector('#importExcel')
      file.value = ''
    },
    uploadFile () {
      let fileUploader = document.querySelector('#importExcel')
      fileUploader.click()
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
  .test-case-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .test-case-toolbar{
      flex: 0 0 50px;
      align-items: center;
      border-bottom: 1px solid #eee;
    }
    .test-case-content{
      flex: 1 1 auto;
      display: flex;
      .test-case-set{
        height: 100%;
        flex: 0 0 250px;
        overflow-y: auto;
        border-right: 1px solid #eee;
      }
      .test-case-list{
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        .test-case-list-toolbar{
          flex: 0 0 40px;
          display: flex;
          align-items: center;
          padding-left: 10px;
        }
        .test-case-list-table{
          flex: 1 1 auto;
          padding-left: 10px;
        }
      }
    }
    #importExcel {
      display: none;
    }
  }
  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

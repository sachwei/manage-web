<template>
  <panel>
    <div class="backlog-list-wrapper">
      <div class="backlog-list-toolbar">
        <el-input v-model="searchText" suffix-icon="el-icon-search" style="width:300px" placeholder="请输入搜索内容"></el-input>
      </div>
      <el-table
        border
        :data="backlogList"
        :highlight-current-row="true"
        style="width: 100%;margin-top:10px"
        show-summary
        :max-height="tableHeight"
        :summary-method="getSummaries"
        :default-sort = "{prop: 'important', order: 'descending'}">
        <el-table-column
          prop="id"
          label="ID"
          width="70">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="important"
          label="重要级别"
          sortable
          width="110">
        </el-table-column>
        <el-table-column
          prop="track"
          label="类别"
          :filters="trackFilter"
          :filter-method="filterHandler"
          width="180">
        </el-table-column>
        <el-table-column
          prop="estimate"
          label="故事点"
          width="80">
        </el-table-column>
        <el-table-column
          prop="createUserId"
          label="创建人"
          :formatter="userFormatter"
          :filters="createUserFilter"
          :filter-method="filterHandler"
          width="90">
        </el-table-column>
        <el-table-column
          prop="uiUserId"
          label="设计"
          :formatter="userFormatter"
          :filters="uiFilter"
          :filter-method="filterHandler"
          width="90">
        </el-table-column>
        <el-table-column
          prop="testUserId"
          label="测试"
          :formatter="userFormatter"
          :filters="testFilter"
          :filter-method="filterHandler"
          width="90">
        </el-table-column>
        <el-table-column
          prop="note"
          width="120"
          label="备注">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <div class="backlog-operator">
              <i @click="onEdit(scope.row)" class="fa fa-edit"></i>
              <i @click="onBacklogView(scope.row)" class="fa fa-eye"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="backlog-list-footer">
        <el-button @click="onExport">导出</el-button>
        <el-button type="primary" @click="goBack">关闭</el-button>
      </div>
    </div>
    <view-html ref="viewHtml"></view-html>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import ViewHtml from '../../../components/quill-editor/quillEditorView'
import { mapActions } from 'vuex'
export default {
  components: {
    ViewHtml
  },
  data () {
    return {
      sprintId: 0,
      createUserFilter: [],
      uiFilter: [],
      testFilter: [],
      trackFilter: [],
      searchText: ''
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    backlogList () {
      return this.$store.state.backlog.backlogList.filter(item => {
        return (item.name.indexOf(this.searchText) !== -1) || (String(item.id).indexOf(this.searchText) !== -1) || (item.track.indexOf(this.searchText) !== -1)
      })
    },
    tableHeight () {
      return this.$utils.getClientHeight() - 160
    }
  },
  watch: {
    sprintId () {
      this.findSprintBacklogs(this.sprintId).then(() => {
        this.calcFilter()
      })
    }
  },
  methods: {
    initData () {
      let id = this.$route.params.id
      if (id) {
        this.sprintId = id
      }
    },
    getSummaries (param) {
      const { data } = param
      const sums = []
      sums[0] = '合计：'
      sums[1] = data.length
      return sums
    },
    onBacklogView (row) {
      this.$refs.viewHtml.show(row.how)
    },
    onEdit (data) {
      this.$router.push({ name: 'backlogDetail1', params: { id: data.id } })
    },
    onExport () {
      let condition = {
        query: {
          sprintId: this.sprintId
        },
        sort: { 'important': -1 }
      }
      this.$http.post('/excel/export/backlog', condition, { responseType: 'arraybuffer' }).then((res) => {
        if (res && res.data) {
          this.downloadExcel(res.data, 'backlog.xls')
        }
      })
    },
    calcFilter () {
      this.createUserFilter = []
      this.uiFilter = []
      this.testFilter = []
      this.trackFilter = []

      this.backlogList.forEach(item => {
        if (!this.createUserFilter.find(user => user.value === item.createUserId)) {
          this.createUserFilter.push({
            text: this.$utils.userFormatter(item.createUserId, this.userList),
            value: item.createUserId
          })
        }
      })

      this.backlogList.forEach(item => {
        if (!this.testFilter.find(user => user.value === item.testUserId)) {
          this.testFilter.push({
            text: this.$utils.userFormatter(item.testUserId, this.userList),
            value: item.testUserId
          })
        }
      })

      this.backlogList.forEach(data => {
        if (!this.trackFilter.find(item => item.value === data.track)) {
          this.trackFilter.push({
            text: data.track,
            value: data.track
          })
        }
      })

      this.backlogList.forEach(data => {
        if (!this.uiFilter.find(item => item.value === data.uiUserId)) {
          this.uiFilter.push({
            text: this.$utils.userFormatter(data.uiUserId, this.userList),
            value: data.uiUserId
          })
        }
      })
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    ...mapActions(['findSprintBacklogs'])
  }
}
</script>

<style scoped lang="scss">
  .backlog-list-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .backlog-operator{
    font-size: 18px;

    .fa{
      margin-left: 5px;
      cursor: pointer;
    }

    .fa:hover{
      color: red;
      transform: scale(1.1)
    }
  }

  .backlog-list-footer{
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

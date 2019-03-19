<template>
  <el-table
    :data="bugList"
    border style="width: 100%"
    show-summary
    :summary-method="getSummaries"
    :default-sort="{prop: 'createTime', order: 'descending'}"
    :height="tableHeight">
    <el-table-column type="index" width="65"></el-table-column>
    <el-table-column prop="id" align="center" width="70" label="编码"></el-table-column>
    <el-table-column prop="name" label="摘要">
      <template slot-scope="scope">
        <div class="text-ellipsis cursor" @click='onBugEdit(scope.row)'>
          <i class="fa fa-paperclip" v-if="scope.row.attachs.length > 0"></i>
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="track"
      width="160"
      :filters="trackFilter"
      :filter-method="filterHandler"
      label="分类">
      <template slot-scope="scope">
        <div class="text-ellipsis cursor">
          <span>{{ scope.row.track }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="level"
      width="80"
      :formatter="levelFormater"
      :filters="levelFilter"
      :filter-method="filterHandler"
      label="等级">
    </el-table-column>
    <el-table-column
      prop="state"
      width="80"
      :formatter="stateFormater"
      :filters="stateFilter"
      :filter-method="filterHandler"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="commitUser"
      width="90"
      :formatter="userFormatter"
      :filters="userFilter"
      :filter-method="filterHandler"
      label="提交人">
    </el-table-column>
    <el-table-column
      prop="curUserId"
      width="110"
      :filters="curUserFilter"
      :filter-method="filterHandler"
      :formatter="userFormatter"
      label="当前处理人">
    </el-table-column>
    <el-table-column prop="createTime" sortable width="120" :formatter="dateFormatter" label="创建时间"></el-table-column>
    <el-table-column label="操作" width="100">
      <template slot-scope="scope">
        <div class="quick-operation">
          <i class="fa fa-edit" @click="onBugEdit(scope.row)"></i>
          <i class="fa fa-copy" @click="onCopy(scope.row)"></i>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapMutations } from 'vuex'
import bugOrbit from './bug-orbit'
export default {
  data () {
    return {
      levels: [],
      levelFilter: [],
      states: [],
      stateFilter: [],
      userFilter: [],
      tableName: 'bugs',
      trackFilter: [],
      curUserFilter: []
    }
  },
  components: {
    bugOrbit
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    bugList () {
      return this.$store.getters.filterBugList
    },
    tableHeight () {
      return this.$utils.getClientHeight() - 120
    }
  },
  watch: {
    bugList () {
      this.calcFilter()
    }
  },
  methods: {
    initData () {
      this.$enumService.getEnum('BUG_LEVEL').then((data) => {
        this.levels = data
        return this.$enumService.getEnum('BUG_STATE')
      }).then((data) => {
        this.states = data
        this.calcFilter()
      })
    },
    calcFilter () {
      this.levelFilter = []
      this.stateFilter = []
      this.userFilter = []

      this.levels.forEach(item => {
        this.levelFilter.push({
          text: item.name,
          value: item.id
        })
      })

      this.states.forEach(item => {
        this.stateFilter.push({
          text: item.name,
          value: item.id
        })
      })

      this.bugList.forEach(item => {
        if (!this.userFilter.find(user => user.value === item.commitUser)) {
          this.userFilter.push({
            text: this.$utils.userFormatter(item.commitUser, this.userList),
            value: item.commitUser
          })
        }
      })

      this.bugList.forEach(bug => {
        if (!this.trackFilter.find(item => item.value === bug.track)) {
          this.trackFilter.push({
            text: bug.track,
            value: bug.track
          })
        }
      })

      this.bugList.forEach(bug => {
        if (!this.curUserFilter.find(item => item.value === bug.curUserId)) {
          this.curUserFilter.push({
            text: this.$utils.userFormatter(bug.curUserId, this.userList),
            value: bug.curUserId
          })
        }
      })
    },
    getId () {
      return this.getSequence('bug_key')
    },
    onCopy (bug) {
      this.getId().then((id) => {
        this.curData = this.$utils.deepCopy(bug)
        this.curData.id = id
        this.curData.commentId = ''
        this.curData.attachs = []
        this.curData.createTime = new Date()
        this.curData.orbits = []
        this.curData.name = this.curData.name + '[复制]'
        delete this.curData._id
        this.doAdd().then((data) => {
          this.addBug(data)
        })
      })
    },
    getSummaries (param) {
      const { data } = param
      const sums = []
      sums[0] = '合计：'
      sums[1] = data.length
      return sums
    },
    hasImage (attachs) {
      return attachs.find(item => item.type.indexOf('image') !== -1)
    },
    hasVedio (attachs) {
      return attachs.find(item => item.type.indexOf('video') !== -1)
    },
    onBugEdit (bug) {
      this.$router.push({ path: 'list/detail', query: { id: bug.id } })
    },
    doAfterDelete (bug) {
      this.deleteBug(bug._id)
    },
    levelFormater (row, column, cellValue) {
      return this.$enumService.enumFormat('BUG_LEVEL', cellValue)
    },
    stateFormater (row, column, cellValue) {
      return this.$enumService.enumFormat('BUG_STATE', cellValue)
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    ...mapMutations(['deleteBug', 'addBug'])
  }
}
</script>

<style>
  .el-icon-arrow-down:before{
    font-size: 14px;
    margin-left: 5px;
  }
</style>

<style scoped lang="scss">
  .bug-summary{
    cursor: pointer;
  }

  .fa-angle-double-down{
    cursor: pointer;
  }

  .quick-operation{
    cursor: pointer;
    font-size: 16px;

    .fa-trash{
      color: #F56C6C !important;
    }

    .fa{
      margin-right: 5px;
      color: #409EFF;
    }
  }
</style>

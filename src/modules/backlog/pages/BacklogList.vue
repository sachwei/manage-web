<template>
  <div class="backlog-list-wrapper">
    <div class="backlog-list-toolbar">
      <el-input
        class="toolbar-search"
        size="small"
        placeholder="请输入搜索内容"
        prefix-icon="el-icon-search"
        v-model="searchText">
      </el-input>
      <add-button class="margin-left-10" @onClick="onAddData"></add-button>
    </div>
    <el-table
      border
      :data="filterDataList"
      :highlight-current-row="true"
      :max-height="tableHeight"
      @row-dblclick="onEditBacklog"
      style="width: 100%"
      :default-sort = "{prop: 'important', order: 'descending'}">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="名称">
        <template slot-scope="scope">
          <div class="text-ellipsis cursor" @click='onEditBacklog(scope.row)'>{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="important"
        label="重要级别"
        sortable
        width="110">
      </el-table-column>
      <el-table-column
        prop="createUserId"
        label="创建人"
        :formatter="userFormatter"
        sortable
        width="90">
      </el-table-column>
      <el-table-column
        prop="track"
        label="类别"
        width="200">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div class="backlog-operator">
            <i @click="onEditBacklog(scope.row)" class="fa fa-edit"></i>
            <i v-if="user.email === scope.row.createUserId" @click="onDelete(scope.row)" class="fa fa-trash-o"></i>
            <i @click="onBacklogView(scope.row)" class="fa fa-eye"></i>
            <i @click="onEstimate(scope.row)" class="fa fa-gavel"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <view-html ref="viewHtml"></view-html>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ViewHtml from '../../../components/quill-editor/quillEditorView'
import AddButton from '../../../components/add-button/add-button'
export default {
  components: {
    ViewHtml,
    AddButton
  },
  data () {
    return {
      backlog: {},
      searchText: '',
      findCondition: {},
      tableName: 'backlogs'
    }
  },
  computed: {
    ...mapGetters(['todoBacklogList']),
    tableHeight () {
      return this.$utils.getClientHeight() - 140
    },
    filterDataList () {
      return this.todoBacklogList.filter(item => {
        return item.name.indexOf(this.searchText) !== -1
      })
    },
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    onEstimate (row) {
      this.backlog = row
      this.$router.push({ name: 'estimate', params: { id: row.id } })
    },
    onBacklogView (row) {
      this.$refs.viewHtml.show(row.how)
    },
    onEditBacklog (data) {
      this.$router.push({ name: 'backlogDetail', params: { id: data.id } })
    },
    onAddData () {
      this.$router.push({ name: 'backlogDetail' })
    },
    doAfterDelete (data) {
      this.deleteBacklog(data._id)
    },
    ...mapMutations(['deleteBacklog'])
  }
}
</script>

<style>
  .el-form-item__content{
    line-height: 24px;
  }
  .el-table--border:after, .el-table--group:after, .el-table:before {
    z-index: inherit !important;
  }
</style>

<style scoped lang="scss">
  .backlog-list-wrapper{
    width: 100%;
    height: 100%;
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

  .backlog-list-toolbar{
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .toolbar-search{
      width: 200px;
    }

    .toolbar-add-btn{
      margin-left: 10px;
    }
  }

  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

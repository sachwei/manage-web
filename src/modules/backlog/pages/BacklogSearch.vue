<template>
  <panel>
    <div class="backlog-search-wrapper">
      <product-tab
        class="product-tabs"
        @onTabClick="onProductClick">
      </product-tab>
      <div class="backlog-content">
        <ul class="track-list">
          <li class="track-item text-ellipsis" @click="onTrackSelect(track.value)" v-for="(track, index) in restaurants" :key="index">
            {{ track.value }}
          </li>
        </ul>
        <div class="backlog-table">
          <div class="backlog-table-toolbar">
            <el-button @click="onExport">导出</el-button>
          </div>
          <el-table
            border
            :data="backlogList"
            :highlight-current-row="true"
            style="width: 100%;margin-top:10px"
            show-summary
            :max-height="tableHeight"
            :summary-method="getSummaries"
            :default-sort = "{prop: 'createDate', order: 'descending'}">
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
              width="90">
            </el-table-column>
            <el-table-column
              prop="uiUserId"
              label="设计"
              :formatter="userFormatter"
              width="90">
            </el-table-column>
            <el-table-column
              prop="testUserId"
              label="测试"
              :formatter="userFormatter"
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
        </div>
      </div>
      <view-html ref="viewHtml"></view-html>
      <transition mode="out-in" name="fade" appear>
        <router-view></router-view>
      </transition>
    </div>
  </panel>
</template>

<script>
import ProductTab from '../../product/components/product-tab'
import ViewHtml from '../../../components/quill-editor/quillEditorView'
import { mapActions, mapMutations } from 'vuex'
export default {
  components: {
    ProductTab,
    ViewHtml
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    tableHeight () {
      return this.$utils.getClientHeight() - 100
    },
    product () {
      return this.$store.state.sprint.product
    }
  },
  data () {
    return {
      restaurants: [],
      backlogList: [],
      conditions: {}
    }
  },
  methods: {
    onProductClick (item) {
      this.switchProduct(item)
      this.groupBacklogTrack(item.id)
      this.findAllBacklog()
    },
    groupBacklogTrack (productId) {
      this.restaurants = []
      let conditions = {
        'productId': productId
      }
      let groupCondition = [
        { $match: conditions },
        { $group: { _id: { 'value': '$track' }, count: {'$sum': 1} } }
      ]

      this.$dataService.group(this.$apiUrl.WORK_GROUP_BACKLOG, groupCondition).then((data) => {
        data.forEach(item => {
          this.restaurants.push(item._id)
        })
        this.restaurants.sort((a, b) => {
          return a.value.localeCompare(b.value, 'zh-CN')
        })
      })
    },
    onExport () {
      let condition = {
        query: this.conditions,
        sort: { 'createDate': -1 }
      }
      this.$http.post('/excel/export/backlog', condition, { responseType: 'arraybuffer' }).then((res) => {
        if (res && res.data) {
          this.downloadExcel(res.data, 'backlog.xls')
        }
      })
    },
    findAllBacklog () {
      this.conditions = {
        'productId': this.product.id
      }
      this.$dataService.find(this.$apiUrl.BASE_FIND + 'backlogs', this.conditions).then((data) => {
        this.backlogList = data
        this.setBacklogList(data)
      })
    },
    onTrackSelect (track) {
      this.conditions = {
        condition: {
          'productId': this.product.id
        },
        like: {
          'track': track
        }
      }
      this.$dataService.find(this.$apiUrl.BASE_FIND + 'backlogs', this.conditions).then((data) => {
        this.backlogList = data
        this.setBacklogList(data)
      })
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
    ...mapMutations(['setBacklogList']),
    ...mapActions(['switchProduct'])
  }
}
</script>

<style scoped lang="scss">
  .backlog-search-wrapper{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: 100%;
    width: 100%;
    display: flex;

    .product-tabs{
      flex: 0 0 180px;
      animation: fadeInLeft .5s;
    }

    .backlog-content{
      height: 100%;
      width: 200px;
      flex: 1 1 200px;
      margin-left: 10px;
      display: flex;
      .track-list{
        height: 100%;
        overflow-y: auto;
        flex: 0 0 220px;
        list-style: none;
        padding: 0;
        margin: 0;
        .track-item:hover{
          background-color: #eee;
        }
        .track-item{
          padding: 10px 10px;
          cursor: pointer;
        }
      }
      .backlog-table{
        flex: 1 1 auto;
        .backlog-table-toolbar{
          display: flex;
          justify-content: flex-end;
          padding: 10px 10px 0 0;
        }
      }
      .backlog-operator{
        cursor: pointer;
        .fa-eye{
          margin-left: 5px;
        }
      }
    }
  }
</style>

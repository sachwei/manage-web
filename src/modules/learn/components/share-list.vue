<template>
  <div class="share-list-wrapper">
    <div class="data-list">
      <share-item :item="item" v-for="item in shareList" :key="item._id"></share-item>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="data-pagination"
      background
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import shareItem from './share-item'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      tableName: 'shareCourses',
      options: {
        pageSize: 10,
        page: 1,
        sort: { createDate: 1 }
      }
    }
  },
  components: {
    shareItem
  },
  computed: {
    shareList () {
      return this.$store.state.learn.shareList
    },
    total () {
      return this.$store.state.learn.total
    },
    types () {
      return this.$store.state.learn.types
    }
  },
  methods: {
    initData () {
      this.findShareListWithPage(this.options)
    },
    handleSizeChange (value) {
      this.options.pageSize = value
      this.options.page = 1
      this.initData()
    },
    handleCurrentChange (value) {
      this.options.page = value
      this.initData()
    },
    ...mapActions(['findShareListWithPage'])
  }
}
</script>

<style scoped lang="scss">
  .share-list-wrapper{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .data-list{
      width: 100%;
      flex: 1 1 200px;
      overflow-y: auto;
    }

    .data-pagination{
      flex: 0 0 28px;
    }
  }
</style>

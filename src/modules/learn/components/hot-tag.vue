<template>
  <div class="hot-tag-wrapper">
    <div class="hot-tag-item" v-for="(item, index) in hotTagList" :key="index">
      <span class="hot-tag">{{ item._id.tag }} ({{ item.count }})</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hotTagList: []
    }
  },
  methods: {
    initData () {
      this.findHotTag()
    },
    findHotTag () {
      return new Promise((resolve, reject) => {
        let groupCondition = [
          { $unwind: '$tags' },
          { $group: { _id: { 'tag': '$tags' }, count: {'$sum': 1} } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]
        this.$dataService.group(this.$apiUrl.BASE_GROUP + 'shareCourses', groupCondition).then((data) => {
          this.hotTagList = data
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .hot-tag-wrapper{
    display: flex;
    flex-wrap: wrap;

    .hot-tag-item:hover{
      background-color: rgb(116, 120, 124);
      color: white;
    }

    .hot-tag-item{
      background-color: #F5F5F5;
      padding: 5px 8px;
      margin: 0 8px 8px 0;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>

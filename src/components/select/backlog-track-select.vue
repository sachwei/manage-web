<template>
  <el-autocomplete
    style="width:100%"
    :value="value"
    :clearable="true"
    @input="onItemChage"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
  ></el-autocomplete>
</template>

<script>
export default {
  props: [
    'productId',
    'value'
  ],
  data () {
    return {
      restaurants: []
    }
  },
  watch: {
    productId () {
      this.groupBacklogTrack()
    }
  },
  methods: {
    initData () {
      this.groupBacklogTrack()
    },
    groupBacklogTrack () {
      this.restaurants = []
      let conditions = {
        'productId': this.productId
      }
      let groupCondition = [
        { $match: conditions },
        { $group: { _id: { 'value': '$track' }, count: {'$sum': 1} } }
      ]

      this.$dataService.group(this.$apiUrl.WORK_GROUP_BACKLOG, groupCondition).then((data) => {
        data.forEach(item => {
          this.restaurants.push(item._id)
        })
      })
    },
    querySearch (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    onItemChage (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

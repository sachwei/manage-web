<template>
  <div class="radio-group">
    <div
      @click="onItemClick(item)"
      :class="{'radio-btn-check': item[keyName] === curItem[keyName]}"
      class="radio-btn"
      v-for="item in dataList" :key="item[keyName]">
      {{ item[titleName] }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enumTypeId: String,
    list: Array,
    keyName: {
      default: 'id'
    },
    titleName: {
      default: 'name'
    },
    value: Object
  },
  data () {
    return {
      curItem: {}
    }
  },
  watch: {
    list () {
      this.dataList = this.list
    },
    value () {
      this.curItem = this.value
    }
  },
  methods: {
    initParam () {
      this.dataList = this.list
    },
    initData () {
      if (this.enumTypeId) {
        this.$enumService.getEnum(this.enumTypeId).then((data) => {
          this.dataList = data
        })
      }
    },
    onItemClick (item) {
      this.curItem = item
      this.$emit('input', this.curItem)
    }
  }
}
</script>

<style scoped lang="scss">
  .radio-group{
    display: flex;
    flex-wrap: wrap;

    .radio-btn-check{
      background-color: #446E9B !important;
      color: white !important;
    }

    .radio-btn:hover{
      background-color: rgb(116, 120, 124);
      color: white;
    }
    .radio-btn{
      margin-right: 5px;
      border-radius: 4px;
      line-height: 30px;
      height: 30px;
      padding: 0 10px;
      background-color: #F5F5F5;
      color: #666666;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      transition: all .3s;
      margin-bottom: 5px;
    }
  }
</style>

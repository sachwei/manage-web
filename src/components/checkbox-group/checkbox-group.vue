<template>
  <div class="check-group">
    <div
      @click="onItemClick(item[keyName])"
      :class="{'check-btn-check': checkVals.join('').indexOf(item[keyName]) !== -1}"
      class="check-btn"
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
    value: Array
  },
  data () {
    return {
      checkVals: []
    }
  },
  watch: {
    list () {
      this.dataList = this.list
    }
  },
  methods: {
    initParam () {
      this.checkVals = this.value
    },
    initData () {
      if (this.enumTypeId) {
        this.$enumService.getEnum(this.enumTypeId).then((data) => {
          this.dataList = data
        })
      }
      if (this.dataList.length === 0) {
        this.dataList = this.list
      }
    },
    onItemClick (id) {
      this.check(id, this.checkVals)
    },
    isCheck (id, arr) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index]
        if (element === id) {
          return true
        }
      }
      return false
    },
    check (id, arr) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index]
        if (element === id) {
          arr.splice(index, 1)
          return
        }
      }
      arr.push(id)
      this.$emit('input', this.checkVals)
    }
  }
}
</script>

<style scoped lang="scss">
  .check-group{
    display: flex;
    flex-wrap: wrap;

    .check-btn-check{
      background-color: #446E9B !important;
      color: white !important;
    }

    .check-btn:hover{
      background-color: rgb(116, 120, 124);
      color: white;
    }
    .check-btn{
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

<template>
  <div class="product-tabs">
    <div
      :class="['product-tab', { active: currentTab === item }]"
      v-for="item in dataList"
      @click="onTabClick(item)"
      :key="item._id">
      <img :src="imageUrl + item.logo" alt="">
      <span class="product-name">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTab: {},
      tableName: 'products'
    }
  },
  methods: {
    initData () {
      this.findDataByOrgId().then((data) => {
        this.dataList = data
        if (this.dataList.length > 0) {
          this.currentTab = this.dataList[0]
          this.onTabClick(this.currentTab)
        }
      })
    },
    onTabClick (item) {
      this.currentTab = item
      this.$emit('onTabClick', this.currentTab)
    }
  }
}
</script>

<style scoped lang="scss">
  .product-tabs{
    width: 100%;
    height: 100%;
    background-color: #eee;

    .product-tab.active{
      background-color: white;
    }

    .product-tab:hover{
      background-color: #e0e0dd;
    }

    .product-tab{
      padding-left: 10px;
      height: 55px;
      display: flex;
      align-items: center;
      background-color: #eee;
      cursor: pointer;
      transition: background-color .3s;

      img {
        width: 30px;
        height: 30px;
      }
      .product-name{
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
</style>

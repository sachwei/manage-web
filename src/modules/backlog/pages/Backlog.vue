<template>
  <panel>
    <div class="backlog-wrapper">
      <product-tab
        class="product-tabs"
        @onTabClick="onProductClick">
      </product-tab>
      <backlog-list class="backlog-table"></backlog-list>
    </div>
  </panel>
</template>

<script>
import ProductTab from '../../product/components/product-tab'
import BacklogList from './BacklogList'
import { mapActions } from 'vuex'

export default {
  components: {
    ProductTab,
    BacklogList
  },
  data () {
    return {
    }
  },
  methods: {
    onProductClick (item) {
      this.switchProduct(item)
    },
    ...mapActions(['switchProduct'])
  }
}
</script>

<style scoped lang="scss">
  .backlog-wrapper{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: 100%;
    width: 100%;
    display: flex;

    .product-tabs{
      flex: 0 0 180px;
      animation: fadeInLeft .5s;
    }

    .backlog-table{
      width: 200px;
      flex: 1 1 200px;
      margin-left: 10px;
    }
  }
</style>

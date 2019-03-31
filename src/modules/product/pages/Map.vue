<template>
  <panel>
    <div class="product-map-wrapper">
      <product-tab
        class="product-tabs"
        @onTabClick="onProductClick">
      </product-tab>
      <div class="product-view">
        <img class="page-wrapper" src="../../../assets/cwjy/phone.png" alt=""/>
        <map name="planetmap" id="planetmap">
          <area shape="rect" coords="0,0,99,99" alt="sum" nohref="nohref">
        </map>
      </div>
    </div>
  </panel>
</template>

<script>
import ProductTab from '../components/product-tab'

export default {
  components: {
    ProductTab
  },
  data () {
    return {
      product: {}
    }
  },
  methods: {
    onProductClick (data) {
      this.product = data
    }
  }
}
</script>

<style scoped lang="scss">

  .product-list{
    flex: 0 0 200px;

    .product-new-btn{
      cursor: pointer;
      margin-top: 10px;
      width: 50px;
      img{
        width: 100%;
      }
    }
  }

  .product-map-wrapper{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: 100%;
    width: 100%;
    display: flex;

    .product-tabs {
      flex: 0 0 200px;
      animation: fadeInLeft .5s;
    }
    .product-view{
      flex: 0 0 400px;
      display: flex;
      justify-content: center;
      position: relative;
      animation: fadeIn 1s;

      .page-wrapper{
        width: 360px;
        height: 700px;
      }

      .product-page{
        position: absolute;
        top: 110px;
        width: 272px;
        height: 480px;
        margin-top: -16px;
      }
    }
  }

  .product-backlog{
    flex: 1 1 auto;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

</style>

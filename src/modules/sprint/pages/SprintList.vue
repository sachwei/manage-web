<template>
  <panel>
    <div class="sprint-list-wrapper">
      <product-tab
        class="product-tabs"
        @onTabClick="onProductClick">
      </product-tab>
      <div class="sprint-list-content">
        <div class="sprint-list-toolbar">
          <div class="toolbar-left">
          </div>
          <div class="toolbar-right">
            <i @click="onOpenSprintChart" class="fa fa-line-chart margin-right-10"></i>
            <add-button @onClick="onAddData"></add-button>
          </div>
        </div>
        <div class="sprint-list">
          <sprint-item
            v-for="item in sprintList"
            :key="item.id"
            @dblclick.native="onEditSprint(item)"
            :sprint="item">
          </sprint-item>
        </div>
      </div>
    </div>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import ProductTab from '../../product/components/product-tab'
import AddButton from '../../../components/add-button/add-button'
import SprintItem from '../components/sprint-item'
import { mapActions } from 'vuex'

export default {
  components: {
    ProductTab,
    AddButton,
    SprintItem
  },
  data () {
    return {
    }
  },
  computed: {
    sprintList () {
      return this.$store.state.sprint.sprintList
    }
  },
  methods: {
    onOpenSprintChart () {
      this.$router.push({ name: 'sprintAnalyse' })
    },
    onProductClick (item) {
      this.switchProduct(item)
    },
    onAddData () {
      this.$router.push({ name: 'sprintDetail' })
    },
    onEditSprint (data) {
      this.$router.push({ name: 'sprintDetail', params: {id: data.id} })
    },
    ...mapActions(['switchProduct'])
  }
}
</script>

<style scoped lang="scss">
  .sprint-list-wrapper{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: 100%;
    width: 100%;
    display: flex;

    .product-tabs{
      flex: 0 0 180px;
      animation: fadeInLeft .5s;
    }

    .sprint-list-content{
      margin-left: 10px;
      width: 200px;
      height: 100%;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
    }

    .sprint-list-toolbar{
      display: flex;
      margin-bottom: 10px;

      .toolbar-left{
        flex: 1 1 600px;
      }
      .toolbar-right{
        margin: 10px 10px 0 0;
        justify-content: flex-end;
        display: flex;
        align-items: center;
        color: #aaa;
        font-size: 16px;

        .fa:hover{
          color: #555;
        }

        .fa{
          cursor: pointer;
        }
      }
    }

    .sprint-list{
      flex: 1 1 200px;
      overflow: auto;
    }
  }

  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

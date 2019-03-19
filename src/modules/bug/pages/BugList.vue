<template>
  <panel>
    <div class="bug-list-wrapper">
      <div class="bug-list-toolbar">
        <div class="toolbar-left">
          <product-select class="product-select" v-model="selectProductId" ></product-select>
          <sprint-select class="sprint-select margin-left-5" :state="[1,2,3]" :productId="productId" v-model="sprintId"></sprint-select>
        </div>
        <div class="toolbar-right">
          <i @click="onAnalyse" class="fa fa-pie-chart margin-right-10"></i>
          <i @click="onExport" class="fa fa-download margin-right-10"></i>
        </div>
      </div>
      <bug-list></bug-list>
      <div class="bug-list-footer" v-if="sprint">
        <el-button type="primary" @click="goBack">关闭</el-button>
      </div>
    </div>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import bugList from '../components/bug-list'
import sprintSelect from '../../../components/select/sprint-select'
import productSelect from '../../../components/select/product-select'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      selectProductId: undefined,
      sprintId: undefined,
      tableName: 'bugs',
      sprint: null
    }
  },
  computed: {
    productId () {
      return this.selectProductId
    }
  },
  watch: {
    sprintId () {
      this.setCurSprintId(this.sprintId)
      this.fingBugList()
    }
  },
  beforeDestroy () {
    this.$localStore.set('bugListCondition', {
      productId: this.selectProductId,
      sprintId: this.sprintId
    })
  },
  components: {
    bugList,
    sprintSelect,
    productSelect
  },
  methods: {
    initParam () {
      this.setIsTodo('-1')
      this.sprint = this.$route.params.sprint
      if (this.sprint) {
        this.selectProductId = this.sprint.productId
        this.sprintId = this.sprint.id
      } else {
        let condition = this.$localStore.get('bugListCondition')
        if (condition) {
          this.selectProductId = condition.productId
          this.sprintId = condition.sprintId
        }
      }
    },
    initData () {
      this.setBugList([])
    },
    fingBugList () {
      this.findCondition = {
        productId: this.productId,
        sprintId: this.sprintId
      }
      this.findDataByCondition().then(data => {
        setTimeout(() => {
          this.setBugList(data)
        }, 500)
      })
    },
    onAnalyse () {
      this.$router.push({ name: 'bugAnalyse' })
    },
    onExport () {
      let condition = {
        query: this.findCondition,
        sort: { 'createTime': -1 }
      }
      this.$http.post('/excel/export/bug', condition, { responseType: 'arraybuffer' }).then((res) => {
        if (res && res.data) {
          this.downloadExcel(res.data, 'bugFile.xls')
        }
      })
    },
    ...mapMutations(['setCurSprintId', 'setBugList', 'setIsTodo'])
  }
}
</script>

<style scoped lang="scss">
  .bug-list-wrapper{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .bug-list-toolbar{
      display: flex;
      margin-bottom: 10px;

      .product-select, .sprint-select{
        width: 200px !important;
      }

      .toolbar-left{
        flex: 1 1 600px;
      }
      .toolbar-right{
        justify-content: flex-end;
        display: flex;
        align-items: center;
        color: #aaa;
        font-size: 20px;

        .fa:hover{
          color: #555;
        }

        .fa{
          cursor: pointer;
        }
      }
    }

    .bug-list-footer{
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

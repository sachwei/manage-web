<template>
  <panel>
    <div class="share-wrapper">
      <el-row :gutter="10" style="width:100%;height:100%">
        <el-col :span="18" style="height:100%">
          <el-card class="data-list">
            <share-list class="share-list"></share-list>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchText">
          </el-input>
          <el-card class="margin-top-10">
            <div slot="header" class="clearfix">
              <span>分类</span>
            </div>
            <share-type class="share-type"></share-type>
          </el-card>
          <el-card class="margin-top-10">
            <div slot="header" class="clearfix">
              <span>热门标签</span>
            </div>
            <hot-tag class="hot-tag"></hot-tag>
          </el-card>
          <el-button @click="onAddShare" style="margin-top:10px" type="primary">新建</el-button>
        </el-col>
      </el-row>
    </div>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import shareList from '../components/share-list'
import hotTag from '../components/hot-tag'
import shareType from '../components/share-type'
export default {
  data () {
    return {
      searchText: ''
    }
  },
  components: {
    shareList,
    hotTag,
    shareType
  },
  methods: {
    onAddShare () {
      this.$router.push({ name: 'addShare' })
    }
  }
}
</script>

<style>
  .el-card__body{
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
  }
</style>

<style scoped lang="scss">
  .share-wrapper {
    height: 100%;
    width: 100%;
    display: flex;

    .data-list {
      height: 100%;
      flex: 1 1 900px;
    }

    .classify {
      flex: 0 0 300px;
    }
  }
  .fade-enter-active {
    animation: fadeIn .5s;
  }
  .fade-leave-active {
    animation: fadeOut .5s;
  }
</style>

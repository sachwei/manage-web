<template>
  <div id="app">
    <Header></Header>
    <div class="content">
      <SideMenu class="left-menu"></SideMenu>
      <div class="page-content">
        <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header.vue'
import SideMenu from '../../components/SideMenu.vue'
import { mapActions, mapMutations } from 'vuex'
import mutationTypes from '../../store/mutation-types'

export default {
  name: 'Home',
  components: {
    Header,
    SideMenu
  },
  methods: {
    initParam () {
      if (!this.user.roleIds || (this.user.roleIds.length === 0)) {
        this.$alert('你好，请联系管理员进行权限配置。', '提醒', {
          confirmButtonText: '知道了',
          type: 'info'
        })
      }
    },
    initData () {
      this.setUser(this.user)
      this.getUserList(this.user.orgId[0])
    },
    ...mapMutations({
      setUser: mutationTypes.SET_USER_INFO
    }),
    ...mapActions(['getUserList'])
  }
}
</script>

<style lang="scss">
  #app{
    display: flex;
    flex-direction: column;
  }
  .content{
    width: 100%;
    flex: 1 1 auto;
    height: 100%;
    background-color: #eee;
    display: flex;
  }

  .left-menu{
    flex: 0 0 auto;
  }

  .page-content {
    flex: 1 1 auto;
    height: 100%;
    position: relative;
  }

</style>

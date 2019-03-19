<template>
  <div>
    <div class="header-toggle" v-show="headerVisible" @click="onShowHeader">
      <i class="fa fa-angle-double-down"></i>
    </div>
    <el-menu  :default-active="activeMenu"
              background-color="#373D47"
              text-color="#fff"
              active-text-color="#ffd04b"
              class="side-menu"
              :collapse="collapsed"
              router
              @select="menuSelect">
      <template v-for="item in menuTreeData">
        <sub-menu :param="item" :key="item.id"></sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import subMenu from './subMenu.vue'
import { mapMutations } from 'vuex'
import mutationTypes from '../store/mutation-types'

export default {
  data () {
    return {
      allMenuList: [],
      menuList: [],
      user: {}
    }
  },
  components: {
    subMenu
  },
  computed: {
    collapsed () {
      return this.$store.state.sidebar.collapsed
    },
    menuTreeData () {
      return this.$utils.arrayToTree(this.menuList)
    },
    headerVisible () {
      return this.$store.state.headerVisible
    },
    activeMenu () {
      return this.$store.state.curMenu
    }
  },
  methods: {
    initParam () {
      if (this.$route.path !== '/') return
      if (this.$localStore.get('menuIndex')) {
        this.setCurMenu(this.$localStore.get('menuIndex'))
        this.$router.push({ path: this.activeMenu })
      } else {
        this.setCurMenu('/dashboard/board')
        this.$router.push({ path: '/dashboard/board' })
      }
    },
    initData () {
      if (!this.user.roleIds || (this.user.roleIds.length === 0)) {
        return
      }
      this.findAllMenu().then((data) => {
        this.allMenuList = data
        return this.getUserRoleMenu()
      }).then((data) => {
        this.filterUserMenu(data)
      })
    },
    filterUserMenu (data) {
      let menuIds = new Set()
      let item
      for (let i = 0, len = data.length; i < len; i++) {
        item = data[i]
        menuIds.add(item.menuId)
      }
      this.menuList = this.allMenuList.filter(item => menuIds.has(item.id))
      this.menuList.sort((a, b) => {
        return a.sort - b.sort
      })
    },
    getUserRoleMenu () {
      let condition = {
        roleId: { $in: this.user.roleIds }
      }
      return this.$dataService.find(this.$apiUrl.SYS_FIND_ROLEMENU, condition)
    },
    onShowHeader () {
      this.toggleHeader(false)
    },
    menuSelect (index, indexPath) {
      this.setCurMenu(index)
      this.$localStore.set('menuIndex', index)
    },
    ...mapMutations({
      toggleHeader: mutationTypes.TOGGLE_HEADER
    }),
    ...mapMutations(['setCurMenu'])
  }
}
</script>

<style scoped lang="scss">
  .header-toggle:hover{
    background-color: #2C3139;
  }
  .header-toggle{
    cursor: pointer;
    background-color: #373D47;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    .fa{
      color: white;
    }
  }
  .side-menu{
    background-color: white;
    border-right: none;
    height: 100%;
    z-index: 200;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .side-menu:not(.el-menu--collapse){
    width: 230px;
  }
</style>

<template>
  <div class="header-wrapper" :class="{'header-display': hideHeader}">
    <el-row class="toolbar">
      <el-col :span="4" class="toolbar-logo">
        <i class="iconfont icon-easy"></i>
        <span class='sys-title' :class="{'sys-title-close': collapsed}">Easy work</span>
        <div class="menu-collapse" :class="{'menu-collapse-close': collapsed}" @click="onToggleSidebar">
          <div class="line line1" :class="{line1: !collapsed, line4: collapsed}"></div>
          <div class="line line2" :class="{line2: !collapsed, line5: collapsed}"></div>
          <div class="line line3" :class="{line3: !collapsed, line6: collapsed}"></div>
        </div>
      </el-col>
      <div class="toolbar-left">
        <span class="orgName" :class="{'orgName-close': collapsed}">{{ orgName }}</span>
      </div>
      <div class="toolbar-right">
        <div class="message">
          <!-- <el-popover
            placement="bottom"
            width="300"
            trigger="click">
            <div class="message-body">
              <div class="message-item" v-for="item in dataList" :key="item._id">
                <img :src="headUrl + user.email" alt="">
                <div class="message-info">
                  <div class="name-time">
                    <span class="message-type">{{ item.type | enumFilter('MESSAGE_TYPE') }}</span>
                    <span class="message-time">{{ item.createTime | dateFilter('MM月dd日') }}</span>
                  </div>
                  <span class="message-content text-ellipsis">{{ item.content }}</span>
                </div>
              </div>
            </div>
            <div slot="reference">
              <el-badge :value="dataList.length" class="item">
                <i class="fa fa-envelope-o"></i>
              </el-badge>
            </div>
          </el-popover> -->
        </div>
        <div class="v-line"></div>
        <div class="userInfo">
          <img class="user-head" :src="headUrl + user.email" alt=""/>
          <span class="user-name">{{ user.userName }}</span>
        </div>
        <div class="v-line"></div>
        <div class="func">
          <i class="fa fa-cog"></i>
          <i class="fa fa-power-off" @click="exit"></i>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import mutationTypes from '../store/mutation-types'

export default {
  data () {
    return {
      orgName: ''
    }
  },
  computed: {
    collapsed () {
      return this.$store.state.sidebar.collapsed
    },
    hideHeader () {
      return this.$store.state.headerVisible
    }
  },
  methods: {
    initData () {
      this.$enumService.getEnum('MESSAGE_TYPE').then(() => {
        this.findMessages()
      })
    },
    onToggleSidebar () {
      this.toggleSidebar()
    },
    findUserOrgName (orgId) {
      let condition = {
        'id': orgId
      }
      this.$dataService.find(this.$apiUrl.SYS_FIND_ORG, condition).then((data) => {
        if (data && data[0]) {
          this.orgName = data[0].name
        }
      })
    },
    findMessages () {
      this.$dataService.find(this.$apiUrl.BASE_FIND_ALL + 'messages').then(data => {
        this.dataList = data
      })
    },
    exit () {
      this.$confirm('确认退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$http.get(this.$apiUrl.LOGOUT).then(() => {
          this.$localStore.remove('menuIndex')
          this.$router.push({ path: '/login' })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '退出失败!'
          })
        })
      })
    },
    ...mapMutations({
      toggleSidebar: mutationTypes.TOGGLE_SIDEBAR
    })
  }
}
</script>

<style>
  .el-popover{
    padding: 12px 0 !important;
  }
</style>

<style scoped lang="scss">
  .message-body{
    display: flex;
    flex-direction: column;
    text-align: center;
    min-height: 300px;
    position: relative;

    .type-radio{
      margin-bottom: 10px;
    }
    .message-item:hover{
      background-color: #eee;
    }
    .message-item{
      display: flex;
      padding: 10px 12px;

      img{
        width: 32px;
        height: 32px;
        border-radius: 16px;
      }

      .message-info{
        width: 100%;
        margin-left: 10px;
        display: flex;
        flex-direction: column;

        .name-time{
          display: flex;

          .message-type{
            flex: 1 1 100px;
            text-align: left;
            color: #409EFF;
          }

          .message-time{
            flex: 0 0 80px;
            font-size: 13px;
            color: #bbb;
          }
        }

        .message-content{
          text-align: left;
          width: 234px;
        }
      }
    }
  }

  .header-display{
    display: none;
  }
  .header-wrapper{
    z-index: 200;
  }
  .v-line{
    height: 30px;
    width: 1px;
    background-color: #ddd;
  }
  .toolbar{
    z-index: 200;
    animation: fadeInDown .35s 1 ease;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);

    .toolbar-logo{
      transition:all .3s ease-in-out;
      width: 230px;
      height: 50px;
      display: flex;
      align-items: center;

      .sys-title{
        transition:all .35s;
      }

      .sys-title-close {
        position: absolute;
        display: none;
      }

      i{
        margin-left: 10px;
        font-size: 20px;
        color: red;
        flex: 0 0 auto;
      }

      span{
        margin-left: 10px;
        font-size: 20px;
        font-family: "Times New Roman";
        flex: 1 1 auto;
      }

      .menu-collapse-close{
        margin-left: 10px;
      }

      .menu-collapse:hover .line1{
        transform: rotate(15deg);
      }

      .menu-collapse:hover .line2{
        transform: translateX(-5px)
      }

      .menu-collapse:hover .line3{
        transform: rotate(-15deg);
      }

      .menu-collapse:hover .line4{
        transform: rotate(-15deg);
      }

      .menu-collapse:hover .line5{
        transform: translateX(5px)
      }

      .menu-collapse:hover .line6{
        transform: rotate(15deg);
      }

      .menu-collapse{
        display: flex;
        flex-direction: column;
        cursor: pointer;

        .line{
          margin-top: 4px;
          width: 20px;
          height: 2px;
          background-color: #333;
          transition: all .3s;
        }
      }
    }

    .toolbar-left{
      flex: 1 1 auto;

      .orgName{
        margin-left: 10px;
        color: #ccc;
        display: none;
      }

      .orgName-close{
        margin-left: -160px;
      }
    }

    .toolbar-right{
      display: flex;
      height: 100%;
      align-items: center;

      .message{
        margin-right: 30px;
        cursor: pointer;
      }

      .userInfo:hover{
        cursor: pointer;
      }

      .userInfo{
        display: flex;
        align-items: center;
        height: 100%;
        padding-left: 10px;
      }

      .user-name{
        font-size: 14px;
        line-height: 32px;
        margin: 0 10px 0 5px;
      }
      .user-head{
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .func{
        cursor: pointer;
        margin-left: 10px;
        margin-right: 5px;
        color: #ccc;
      }

      .fa{
        margin-right: 5px;
      }
      .fa:hover{
        color: red;
      }
    }
  }
</style>

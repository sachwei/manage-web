<template>
  <ew-card title="服务部署" style="height: 350px" refresh="true" @onRefresh="onRefresh">
    <el-table
      :data="servers"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="服务名称"
        width="150">
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0">运行中</span>
          <span v-else>重启中<i class="el-icon-loading"></i></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="info"
        label="最近一次操作信息">
      </el-table-column>
      <el-table-column
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="restart(scope.row)" :disabled="scope.row.state !== 0" size="small" type="text">重启</el-button>
          <el-button @click="onCancel(scope.row)" v-if="scope.row.state !== 0" type="text" size="small">重置</el-button>
          <el-button @click="downloadLog(scope.row)" type="text" size="small">编译日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </ew-card>
</template>

<script>
import fileDownload from 'js-file-download'
export default {
  data () {
    return {
      servers: [],
      tableName: 'deployhistory',
      lastDataList: [],
      curDataList: [],
      t1: {}
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    initData () {
      this.findServers().then(data => {
        this.servers = data
        this.findCurRecord()
      })
    },
    onRefresh () {
      this.initData()
    },
    findServers () {
      return new Promise((resolve, reject) => {
        this.$dataService.getXtcs('DEPLOY_SERVERS').then(data => {
          if (data) {
            resolve(JSON.parse(data.csValue))
          }
        })
      })
    },
    findCurRecord () {
      this.findCondition = {
        'state': 0
      }
      this.findDataByCondition().then(data => {
        this.curDataList = data
        let server
        for (let i = 0, len = this.servers.length; i < len; i++) {
          server = this.servers[i]
          server.state = 0
          server.info = ''
          for (let i = 0, len = this.curDataList.length; i < len; i++) {
            if (server.type === this.curDataList[i].serverType) {
              let curR = this.curDataList[i]
              server._id = this.curDataList[i]._id
              server.state = 1
              server.info = `${this.userFormatter(curR.optUser)}操作于${this.$utils.formatDateTime(curR.optTime, 'MM月dd日 hh:mm:ss')}`
            }
          }
        }
        this.findLastRecord()
      })
    },
    userFormatter (userId) {
      return this.$utils.userFormatter(userId, this.userList)
    },
    findLastRecord () {
      let queryParam = {
        query: {
          orgId: this.user.orgId[0],
          state: 1
        },
        sort: { 'optTime': -1 }
      }
      this.$dataService.find(this.$apiUrl.BASE_FIND_TOPONE + this.tableName, queryParam).then(data => {
        this.lastDataList = data
        console.log(this.lastDataList)
        this.servers.forEach(server => {
          for (let i = 0, len = this.lastDataList.length; i < len; i++) {
            if (server.type === this.lastDataList[i].serverType) {
              let curR = this.lastDataList[i]
              server.info = `${this.$utils.userFormatter(curR.optUser, this.userList)}操作于${this.$utils.formatDateTime(curR.optTime, 'MM月dd日 hh:mm:ss')}`
              break
            }
          }
        })
      })
    },
    restart (server) {
      this.saveDeployInfo(server).then(data => {
        this.sendMessage(server)
        let param = {
          'userName': this.user.userName,
          'type': server.type
        }
        this.$http.get(server.restartUrl + '/' + encodeURIComponent(JSON.stringify(param)))
        this.initData()
      })
    },
    onCancel (server) {
      this.curData = {
        _id: server._id,
        state: 1
      }
      this.doUpdate().then(data => {
        this.initData()
      })
    },
    saveDeployInfo (server) {
      this.curData = {
        'optTime': new Date(),
        'optUser': this.user.email,
        'state': 0,
        'serverName': server.name,
        'serverType': server.type,
        'checkUrl': server.checkUrl,
        'restartUrl': server.restartUrl,
        'orgId': this.user.orgId[0]
      }
      return this.doAdd()
    },
    sendMessage (server) {
      this.findCondition = {
        type: 0
      }
      this.findDataByCondition('subscription').then(data => {
        this.$messageService.sendMessages(data[0].userId, `${this.userFormatter(this.user.email)}开始升级${server.name}`)
      })
    },
    downloadLog (server) {
      this.$http.get(server.logUrl).then(response => {
        fileDownload(response.data, server.name + '.log')
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>

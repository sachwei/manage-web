<template>
  <panel>
    <div class="api-list-wrapper">
      <div class="api-toolbar">
        <el-input v-model="searchText" suffix-icon="el-icon-search" style="width:300px" placeholder="请输入搜索内容"></el-input>
      </div>
      <div class="api-list">
        <div class="api-classify">
          <!-- <el-tree :data="treeData"
            :default-expanded-keys="defaultExpandKey"
            @node-click="onNodeClick"
            :load="loadData"
            lazy
            :props="props"></el-tree> -->
          <el-tree :data="treeData"
                   @node-click="onNodeClick"
                   :expand-on-click-node="false"
                   :props="props"></el-tree>
        </div>
        <div class="api-detail-list">
          <el-collapse>
            <el-collapse-item v-for="(api, index) in curApiList" :key="index" :title="(index + 1) + '、' + api.name">
              <div class="api-info">
                <pre><code>{{ JSON.stringify(api, null, 2) }}</code></pre>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      apiJson: {},
      treeData: [],
      apiList: [],
      defaultExpandKey: [1],
      searchText: '',
      props: {
        children: 'item',
        label: 'name'
      }
    }
  },
  computed: {
    curApiList () {
      return this.apiList.filter(re => re.name.indexOf(this.searchText) !== -1)
    }
  },
  methods: {
    initData () {
      this.$http.get('/static/data/api.json').then(res => {
        this.treeData.push({
          'name': res.data.info.name,
          'item': res.data.item
        })
      })
    },
    initApiList () {
      let requests = this.apiJson.requests
      this.curApiList = requests
    },
    loadData (node, resolve) {
      if (node.level === 0) {
        this.getTopNode(resolve)
      } else if (node.level === 1) {
        this.getFirstLevelNode(node, resolve)
      } else {
        this.getOtherNode(node, resolve)
      }
    },
    getTopNode (resolve) {
      this.$http.get('https://***.com/api/api.json').then(res => {
        this.apiJson = res.data
        this.initApiList()
        resolve([{
          'id': this.apiJson.id,
          'name': this.apiJson.name,
          'description': this.apiJson.description
        }])
      })
    },
    getFirstLevelNode (node, resolve) {
      let result = []
      let folders = this.apiJson.folders
      this.apiJson.folders_order.forEach(fo => {
        for (let i = 0, len = folders.length; i < len; i++) {
          if (folders[i].id === fo) {
            result.push(folders[i])
            break
          }
        }
      })
      resolve(result)
    },
    getOtherNode (node, resolve) {
      let result = []
      let folders = this.apiJson.folders
      node.data.folders_order.forEach(fo => {
        for (let i = 0, len = folders.length; i < len; i++) {
          if (folders[i].id === fo) {
            result.push(folders[i])
            break
          }
        }
      })
      resolve(result)
    },
    onNodeClick (data, node) {
      this.apiList = this.getLeafNode(data)
    },
    getLeafNode (json) {
      if (!json.item || (json.item.length === 0)) {
        if (json.request) {
          return [json]
        } else {
          return []
        }
      } else {
        let requests = []
        for (let i = 0; i < json.item.length; i++) {
          requests = requests.concat(this.getLeafNode(json.item[i]))
        }
        return requests
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .api-list-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .api-toolbar{
      flex: 0 0 50px;
    }
    .api-list{
      flex: 1 1 auto;
      overflow-y: auto;
      display: flex;
      .api-classify{
        flex: 0 0 200px;
        border: 1px solid #eee;
      }
      .api-detail-list{
        flex: 1 1 auto;
        overflow-x: auto;
        padding-left: 10px;
        overflow-x: hidden;
        .api-info{
          padding: 15px;
          background: #111;
          code{
            color: #a6e22e;
            font-size: 15px;
            font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
            border-radius: 2px;
          }
        }
      }
    }
  }
</style>

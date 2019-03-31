/*
 * 通用方法
 * @Author: 490232365@qq.com
 * @Date: 2018-05-08 17:32:30
 */

export default {
  data () {
    return {
      user: {},
      imageUrl: '',
      headUrl: '',
      sequenceKey: '',

      tableName: '',
      dataList: [],
      curData: {},
      findCondition: {}
    }
  },
  mounted () {
    this._init_()
    this.initParam()
    this.initData()
  },
  methods: {
    _init_ () {
      this.user = this.$localStore.get('ewuser')
      this.headUrl = this.$httpService.getSmartHeadUrl
      this.imageUrl = this.$httpService.getBaseUrl + this.$apiUrl.SYS_FIND_IMAGE
    },
    initParam () {
      // 初始化参数
    },
    initData () {
      // 初始化数据
    },
    findAllData (tbName) {
      return new Promise((resolve, reject) => {
        let curTbName = tbName || this.tableName
        this.$dataService.find(this.$apiUrl.BASE_FIND_ALL + curTbName).then((data) => {
          this.dataList = data
          resolve(data)
        }).catch(() => {
          reject(new Error())
        })
      })
    },
    findDataByOrgId (tbName) {
      return new Promise((resolve, reject) => {
        let curTbName = tbName || this.tableName
        let condition = {
          orgId: { $in: [this.user.orgId[0]] }
        }
        this.$dataService.find(this.$apiUrl.BASE_FIND + curTbName, condition).then((data) => {
          this.dataList = data
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    findDataByCondition (tbName) {
      return new Promise((resolve, reject) => {
        let curTbName = tbName || this.tableName
        this.$dataService.find(this.$apiUrl.BASE_FIND + curTbName, this.findCondition).then((data) => {
          this.dataList = data
          resolve(data)
        }).catch(() => {
          reject(new Error())
        })
      })
    },
    newDataForm () {
      this.curData = {}
    },
    afterAddData () {
      // 新建后执行方法
    },
    onAddData () {
      this.newDataForm()
      this.afterAddData()
    },
    onEditData (item) {
      return new Promise((resolve, reject) => {
        this.curData = item
      })
    },
    validate () {
      return new Promise((resolve, reject) => {
        if (this.$refs.dataForm) {
          this.$refs.dataForm.validate((valid) => {
            if (valid) {
              resolve(valid)
            }
          })
        } else {
          resolve()
        }
      })
    },
    doSaveBefore () {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    onSave () {
      this.validate().then(() => {
        this.doSaveBefore().then(() => {
          if (this.curData._id) {
            this.doUpdate()
          } else {
            this.doAdd()
          }
        })
      })
    },
    doUpdate (tbName) {
      return new Promise((resolve, reject) => {
        let curTbName = tbName || this.tableName
        this.$dataService.update(this.$apiUrl.BASE_UPDATE + curTbName + '/' + this.curData._id, this.curData).then((data) => {
          this.doAfterUpdate(this.curData)
          resolve(this.curData)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    doAfterUpdate (data) {
      // 更新后执行
    },
    doAdd (tbName) {
      return new Promise((resolve, reject) => {
        let curTbName = tbName || this.tableName
        this.$dataService.save(this.$apiUrl.BASE_SAVE + curTbName, this.curData).then((data) => {
          this.dataList.push(data)
          this.doAfterAdd(data)
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    doAfterAdd (data) {
      // 新增后执行
    },
    onAfterSave (data) {
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        if (this.dataList[i]._id === data._id) {
          this.dataList[i] = data
          return
        }
      }
      this.dataList.push(data)
    },
    onDelete (item) {
      console.log(item)
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.doDelete(item)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doDelete (item) {
      this.$dataService.deleteById(this.$apiUrl.BASE_DELETE_ID + this.tableName + '/' + item._id).then(() => {
        this.doAfterDelete(item)
      })
    },
    doAfterDelete (data) {
      // 删除后操作
    }
  }
}

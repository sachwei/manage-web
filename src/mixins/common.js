/*
 * 通用方法
 * @Author: sachuangwei@ygsoft.com
 * @Date: 2018-05-08 17:32:30
 */
import fileDownload from 'js-file-download'
export default {
  methods: {
    downloadExcel (dataList, fileName) {
      fileDownload(dataList, fileName)
    },
    getSequence (key) {
      let sk
      if (key) {
        sk = key
      } else if (this.sequenceKey) {
        sk = this.sequenceKey
      } else {
        console.log('请设置sequenceKey或者传入Key')
      }
      return this.$dataService.getSequence(sk)
    },
    goBack () {
      this.$router.back()
    },
    userFormatter (row, column, cellValue) {
      return this.$utils.userFormatter(cellValue, this.userList)
    },
    dateFormatter (row, column, cellValue) {
      if (cellValue) {
        return this.$utils.formatDateTime(new Date(cellValue).getTime(), 'yyyy-MM-dd')
      } else {
        return ''
      }
    },
    enumFormatter (key, value) {
      return this.$enumService.enumFormat(key, value)
    },
    doSaveImage (image) {
      return this.$dataService.save(this.$apiUrl.SYS_SAVE_IMAGE, {'content': image})
    },
    doSaveAttach (data) {
      return this.$dataService.save(this.$apiUrl.SYS_SAVE_IMAGE, data)
    }
  }
}

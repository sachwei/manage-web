import Vue from 'vue'

const thisVue = Vue

const api = {
  importExcelData: '/excel/import/testcase/'
}

// 导入数据
function importExcelData (file, setId) {
  let form = new FormData()
  form.append('file', file[0])
  return thisVue.http.post(api.importExcelData + setId, form, {
    timeout: 1000 * 60 * 5
  })
}

export default {
  importExcelData
}

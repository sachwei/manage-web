/**
 * @description 图片功能拓展： 增加上传 拖动 复制
 */
import Vue from 'vue'

export class ImageExtend {
  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: action, headers, editForm start end error  size response
   */
  constructor (quill, config = {}) {
    this.id = Math.random()
    this.quill = quill
    this.quill.id = this.id
    this.config = config
    this.file = ''
    quill.root.addEventListener('paste', this.pasteHandle.bind(this), false)
    quill.root.addEventListener('drop', this.dropHandle.bind(this), false)
    quill.root.addEventListener('dropover', function (e) {
      e.preventDefault()
    }, false)
    this.cursorIndex = 0
  }

  /**
   * @description 粘贴
   * @param e
   */
  pasteHandle (e) {
    let clipboardData = e.clipboardData
    let i = 0
    let items, item, types

    if (clipboardData) {
      items = clipboardData.items
      if (!items) {
        return
      }
      item = items[0]
      types = clipboardData.types || []

      for (; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i]
          break
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        this.file = item.getAsFile()
        let self = this
        // 如果图片限制大小
        if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
          if (self.config.sizeError) {
            self.config.sizeError()
          }
          return
        }
        self.uploadImg()
      }
    }
  }

  /**
   * 拖拽
   * @param e
   */
  dropHandle (e) {
    const self = this
    e.preventDefault()
    // 如果图片限制大小
    if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
      if (self.config.sizeError) {
        self.config.sizeError()
      }
      return
    }
    // 获取到第一个上传的文件对象
    self.file = e.dataTransfer.files[0]
    self.uploadImg()
  }

  /**
   * @description 将图片转为base4
   */
  uploadImg () {
    const self = this
    const reader = new FileReader()
    reader.onload = (e) => {
      let imgData = {
        content: reader.result,
        size: self.file.size,
        fileName: self.file.name,
        type: self.file.type
      }
      self.insertImg(imgData)
    }
    reader.readAsDataURL(self.file)
  }

  /**
   * @description 往富文本编辑器插入图片
   */
  insertImg (imgData) {
    const self = this
    Vue.dataService.save(Vue.apiUrl.SYS_SAVE_IMAGE, imgData).then((data) => {
      self.quill.insertEmbed(this.quill.getSelection().index, 'image', self.config.imageUrl + data._id)
      self.quill.update()
      self.quill.setSelection(this.quill.getSelection().index + 1)
    })
  }
}

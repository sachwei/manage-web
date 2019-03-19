<template>
  <div>
    <quill-editor
      style="height:100%"
      @click="onEditorClick(e)"
      v-model="content"
      ref="myTextEditor"
      id="quillEditor"
      :options="editorOption"
      @change="onChange">
      <div id="toolbar" slot="toolbar">
        <button type="button" class="ql-bold"></button>
        <button type="button" class="ql-italic"></button>
        <button type="button" class="ql-underline"></button>
        <button type="button" class="ql-strike"></button>
        <button type="button" class="ql-blockquote"></button>
        <button type="button" class="ql-code-block"></button>
        <select class="ql-align"></select>
        <select class="ql-font"></select>
        <select class="ql-size"></select>
        <select class="ql-color"></select>
        <button type="button" @click="imgClick" style="outline:none">
          <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
        </button>
        <button type="button" class="ql-clean"></button>
        <button type="button" @click="contentView"><i class="fa fa-eye"></i></button>
      </div>
    </quill-editor>
    <view-html ref="viewHtml"></view-html>
  </div>
</template>

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import { ImageExtend } from './ImageExtend'
import ViewHtml from './quillEditorView'
Quill.register('modules/imageExtend', ImageExtend)

export default {
  props: ['value', 'scale'],
  components: {
    ViewHtml,
    quillEditor
  },
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: '#toolbar',
          imageExtend: {
            imageUrl: this.$httpService.getBaseUrl + this.$apiUrl.SYS_FIND_IMAGE
          }
        }
      },
      content: ''
    }
  },
  watch: {
    value () {
      this.content = this.value
    }
  },
  computed: {
    editor () {
      return this.$refs.myTextEditor.quill
    }
  },
  methods: {
    contentView () {
      this.$refs.viewHtml.show(this.content, this.scale)
    },
    onChange () {
      this.$emit('input', this.content)
    },
    fileCheck (fileInput) {
      let result = true
      if (fileInput.files.length === 0) {
        result = false
      }
      this.editor.focus()
      if (fileInput.files[0].size > 1024 * 1024 * 100) {
        this.$alert('图片不能大于600KB', '图片尺寸过大', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        result = false
      }
      return result
    },
    onFileChange (e) {
      var fileInput = e.path[0]
      if (this.fileCheck(fileInput)) {
        let uploadFile = fileInput.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(uploadFile)
        reader.onloadend = () => {
          let imgData = {
            content: reader.result,
            size: uploadFile.size,
            fileName: uploadFile.name,
            type: uploadFile.type
          }
          this.doSaveAttach(imgData).then((data) => {
            this.editor.insertEmbed(this.editor.getSelection().index, 'image', this.imageUrl + data._id)
          })
        }
      }
    },
    imgClick () {
      var input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/jpeg,image/png,image/jpg,image/gif'
      input.onchange = this.onFileChange
      input.click()
    },
    onEditorClick (e) {
      console.log(e)
    }
  }
}
</script>

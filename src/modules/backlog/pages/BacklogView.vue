<template>
  <div class="backlog-view-wrapper cover">
    <quill-editor-view ref="viewHtml"></quill-editor-view>
  </div>
</template>

<script>
import quillEditorView from '../../../components/quill-editor/quillEditorView'
export default {
  data () {
    return {
      tableName: 'backlogs'
    }
  },
  components: {
    quillEditorView
  },
  methods: {
    initParam () {
      this.findCondition = {
        id: this.$route.params.backlogId
      }
      this.findBacklog()
    },
    findBacklog () {
      this.findDataByCondition().then(data => {
        if (data.length === 1) {
          this.$refs.viewHtml.show(data[0].how)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>

<template>
  <panel>
    <div class="share-detail-wrapper" :class="{'max-width': resize}" ref="shareDetail">
      <div class="ql-snow">
        <div class="ql-editor">
          <span ref="content" v-html="content"></span>
        </div>
      </div>
      <div class="toolbar">
        <i class="fa fa-reply" @click="goBack"></i>
        <i class="fa fa-arrows-alt" @click="onResize"></i>
        <i class="fa fa-arrow-up" @click="onScrollTop"></i>
      </div>
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      content: '',
      resize: false
    }
  },
  components: {

  },
  methods: {
    initParam () {
      this.$refs.content.style.lineHeight = '1.6'
      this.$refs.content.style.letterSpacing = '.02em'
      this.content = this.$route.params.content
    },
    onResize () {
      this.resize = !this.resize
    },
    onScrollTop () {
      this.$refs.shareDetail.scrollTop = 0
    }
  }
}
</script>

<style scoped lang="scss">
  .max-width {
    max-width: 1200px;
  }
  .share-detail-wrapper{
    height: 100%;
    width: 100%;
    overflow-y: auto;

    .toolbar{
      position: fixed;
      bottom: 30px;
      right: 30px;
      display: flex;
      flex-direction: column;

      .fa:hover{
        background-color: #f44444;
      }

      .fa {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        margin-bottom: 2px;
        color: white;
        cursor: pointer;
        height: 44px;
        width: 44px;
        background-color: #ccc;
      }
    }

    .ql-container.ql-snow{
      border: none;
    }
  }
</style>

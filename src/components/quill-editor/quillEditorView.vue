<template>
  <div class="quill-editor-view" :class="{'quill-editor-view-hide': hide}">
    <div class="ql-container ql-snow">
      <div @click="onContentClick" class="ql-editor">
        <span ref="content" v-html="content"></span>
      </div>
    </div>
    <div class="toolbar">
      <i @click="onClose" class="fa fa-close fa-2x"></i>
      <el-slider
        class="zoom-slider"
        v-model="zoomValue"
        vertical
        height="200px"></el-slider>
    </div>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'
export default {
  data () {
    return {
      zoomValue: 10,
      hide: true,
      content: '',
      imageView: {}
    }
  },
  watch: {
    zoomValue () {
      this.changeSlider()
    }
  },
  methods: {
    initParam () {
      this.changeSlider()
    },
    changeSlider () {
      this.$refs.content.style.fontSize = 14 + this.zoomValue + 'px'
      this.$refs.content.style.lineHeight = 14 + this.zoomValue * 2 + 'px'
    },
    onClose () {
      this.hide = true
    },
    show (data, zoomValue = 10) {
      this.zoomValue = zoomValue
      this.content = data
      this.hide = false
    },
    onContentClick (e) {
      if (e.target.nodeName === 'IMG') {
        this.imageView = new Viewer(e.target)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .quill-editor-view-hide{
    display: none;
  }

  .ql-container.ql-snow{
    border: none;
  }

  .quill-editor-view{
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;
    padding: 20px 50px 0;
    overflow: auto;
    transition: all .3s;

    .toolbar{
      position: fixed;
      display: flex;
      flex-direction: column;
      justify-content: center;
      top: 20px;
      right: 10px;
      margin-left: 10px;

      .fa-close:hover{
        color: #aaa;
        transform: scale(1.2, 1.2);
      }

      .fa-close{
        color: #999;
        cursor: pointer;
        transition: all .3s;
        text-align: center;
      }

      .zoom-slider{
        margin-top: 10px;
      }
    }
  }

</style>

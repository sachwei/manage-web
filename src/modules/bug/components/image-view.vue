<template>
  <transition name="slide-fade">
    <div class="image-preview" :class="{'image-view-hide': hide}">
      <i class="fa fa-close fa-4x" @click="hide = true"></i>
      <el-carousel trigger="click" :initial-index="curIndex" :autoplay="false" class="car-view">
        <el-carousel-item v-for="(attach, index) in attachs" :key="index">
          <img v-if="attach.type.indexOf('image') !== -1" :src="imageUrl + attach.attachId" alt="">
          <video-player v-else class="vjs-custom-skin"
            ref="videoPlayer"
            :options="{
              autoplay: false,
              sources: [{
                type: 'video/mp4',
                src: imageUrl + attach.attachId
              }],
              poster: '/static/img/timg.gif'
            }"
            :playsinline="true">
          </video-player>
        </el-carousel-item>
      </el-carousel>
    </div>
  </transition>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'ImageView',
  components: {
    videoPlayer
  },
  data () {
    return {
      hide: true,
      curIndex: 0
    }
  },
  props: [
    'attachs'
  ],
  methods: {
    show (index) {
      this.curIndex = index
      this.hide = false
    }
  }
}
</script>

<style>
  .el-carousel__container{
    height: 100% !important;
  }

  .el-carousel__item{
    display: flex !important;
    justify-content: center;
    align-items: center;
  }

  .video-js{
    height: 100% !important;
    width: 100% !important;
  }

  .video-js .vjs-big-play-button{
    top: 50% !important;
    left: 50% !important;
    margin-left: -43px;
    margin-top: -20px;
  }
</style>

<style lang="scss" scoped>

  .fa-close{
    position: fixed;
    right: 38px;
    top: 38px;
    color: #fff;
    cursor: pointer;
    z-index: 9999;
  }

  .image-view-hide{
    display: none;
  }

  .image-preview{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .6);
    overflow: auto;
    z-index: 9999;

    .car-view{
      height: 100%;
      width: 100%;

      img{
        max-width: 100%;
        max-height: 100%;
      }

      .vjs-custom-skin{
        height: 100%;
        width: 100%;
      }
    }
  }

  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-1000px);
  }
</style>

<template>
  <div class="attach-view">
    <div class="attachs" v-for="(attach, index) in attachs" :key="index">
      <img v-if="attach.type.indexOf('image') !== -1" src="../../../assets/img/picture.png" alt=''/>
      <img v-else src="../../../assets/img/vedio.png" alt=''/>
      <div class="attach-tool" @click="attachView(attach, index)">
        <i class="el-icon-delete" @click.stop="onDelete(attach)"></i>
      </div>
    </div>
    <div class="img-view" v-loading="uploading">
      <img src="../../../assets/img/icon_addpic.png" alt="">
      <input type="file" id="uploads"
        accept="image/png, image/jpeg, image/gif, image/jpg, video/ogg, video/mp4" @change="uploadImg">
    </div>
    <image-view ref="imageView" :attachs="attachs"></image-view>
  </div>
</template>

<script>
import imageView from './image-view'
export default {
  props: [
    'value'
  ],
  components: {
    imageView
  },
  data () {
    return {
      attachs: [],
      attachData: [],
      uploading: false,
      tableName: 'imgs'
    }
  },
  watch: {
    value () {
      this.attachs = this.value
    }
  },
  methods: {
    uploadImg (e, num) {
      this.uploading = true
      var file = e.target.files[0]
      if (!file) {
        this.uploading = false
        return
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.saveAttach({
          content: reader.result,
          size: file.size,
          fileName: file.name,
          type: file.type
        })
      }
      reader.onerror = () => {
        this.uploading = false
        this.$message.error('读取文件失败')
      }
    },
    saveAttach (data) {
      this.doSaveAttach(data).then((data) => {
        this.uploading = false
        this.attachs.push({
          attachId: data._id,
          type: data.type
        })
        this.$emit('input', this.attachs)
      })
    },
    doDelete (item) {
      this.$dataService.deleteById(this.$apiUrl.BASE_DELETE_ID + this.tableName + '/' + item.attachId).then(() => {
        this.doAfterDelete(item)
      })
    },
    doAfterDelete (item) {
      this.attachs = this.attachs.filter(attach => attach.attachId !== item.attachId)
      this.$emit('input', this.attachs)
    },
    attachView (attach, index) {
      this.$refs.imageView.show(index)
    }
  }
}
</script>

<style scoped lang="scss">
  .attach-view {
    display: flex;
  }

  .attach-tool {
    transition: all 0.3s;
    opacity: 0; /* 支持opacity的浏览器*/
    filter:alpha(opacity=0); /* IE */
    -moz-opacity: 0; /* 老版Mozilla */
    -khtml-opacity: 0; /* 老版Safari */
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    display: flex;
    justify-content: flex-end;

    i {
      margin-right: 10px;
      margin-top: 10px;
      cursor: pointer;
      height: 16px;
    }
  }

  .attachs:hover .attach-tool {
    opacity: 1; /* 支持opacity的浏览器*/
    filter:alpha(opacity=100); /* IE */
    -moz-opacity: 1; /* 老版Mozilla */
    -khtml-opacity: 1; /* 老版Safari */
  }

  .attachs {
    position: relative;
    width: 82px;
    height: 82px;
    margin-right: 8px;
    border: 1px dotted #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      max-width: 100%;
    }
  }

  .img-view {
    box-sizing: border-box;
    width: 82px;
    height: 82px;
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    input {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
</style>

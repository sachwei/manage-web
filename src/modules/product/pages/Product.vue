<template>
  <panel>
    <div class="product-wrapper">
      <div class="toolbar">
        <add-button @onClick="onAddData"></add-button>
      </div>
      <transition-group name="list" class="product-list">
        <el-card class="product-card" v-for="product in dataList" :key="product._id">
          <div class="product-info" @dblclick="onProductClick(product)">
            <img v-if="product.logo" class="product-logo" :src="imageUrl + product.logo" alt="">
            <img v-else class="product-logo" src="../../../assets/img/default-product.png" alt="">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-note">{{ product.note }}</span>
          </div>
        </el-card>
      </transition-group>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="curData" label-width="100px" style="width: 96%">
        <el-form-item label="产品名称">
          <el-input v-model="curData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="立项时间">
          <el-date-picker style="width:100%" v-model="curData.createDate" type="date" placeholder="选择月"></el-date-picker>
        </el-form-item>
        <el-form-item label="产品LOGO">
          <img class="img-view" v-if="curData.logo" :src="imageUrl + curData.logo" alt="">
          <div v-else style="width:100px;line-height:15px">
            <div class="img-view" v-loading="uploading">
              <img src="../../../assets/img/icon_addpic.png" alt="">
              <input type="file" id="uploads"
                accept="image/png, image/jpeg, image/gif, image/jpg, video/ogg, video/mp4" @change="uploadImg">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="curData.note" :rows="4" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="onDelete(curData)">删除</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </panel>
</template>

<script>
import PictureInput from 'vue-picture-input'
import AddButton from '../../../components/add-button/add-button'
export default {
  data () {
    return {
      addDialogVisible: false,
      dialogTitle: '',
      tableName: 'products',
      uploading: false
    }
  },
  components: {
    PictureInput,
    AddButton
  },
  methods: {
    initData () {
      this.findDataByOrgId()
    },
    newDataForm () {
      this.getSequence('product_key').then((data) => {
        this.curData = {
          id: data,
          name: '',
          logo: '',
          note: '',
          createDate: new Date(),
          state: 1,
          orgId: this.user.orgId[0]
        }
      }).catch(() => {
        this.$message('获取ID失败')
      })
    },
    afterAddData () {
      this.dialogTitle = '新增'
      this.addDialogVisible = true
    },
    onProductClick (item) {
      this.dialogTitle = '修改'
      this.curData = item
      this.addDialogVisible = true
    },
    doAfterAdd () {
      this.addDialogVisible = false
    },
    doAfterUpdate () {
      this.addDialogVisible = false
    },
    doAfterDelete (item) {
      this.dataList = this.dataList.filter(data => data._id !== item._id)
      this.addDialogVisible = false
    },
    onLogoChange (image) {
      this.$dataService.save(this.$apiUrl.SYS_SAVE_IMAGE, {'content': image}).then((data) => {
        this.curData.logo = data._id
      })
    },
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
        this.curData.logo = data._id
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .product-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .toolbar{
      margin-bottom: 10px;
      flex: 0 0 40px;
      align-items: center;
    }

    .product-list{
      height: 200px;
      flex: 1 1 auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;

      .product-card{
        margin: 0 10px 10px 0;
        width: 240px;
        height: 260px;
      }

      .product-info{
        display: flex;
        flex-direction: column;
        align-items: center;

        .product-logo{
          width: 80px;
          height: 80px;
        }

        .product-name{
          margin-top: 10px;
          font-size: 14px;
          color: #333;
        }

        .product-note{
          margin-top: 10px;
          height: 100px;
          font-size: 14px;
          color: #bbb;
          overflow: auto;
          text-indent: 30px;
        }
      }
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

  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
</style>

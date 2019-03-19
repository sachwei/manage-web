<template>
  <panel>
    <div class="add-share-wrapper">
      <div class="add-share-content">
        <el-form :model="curData" :rules="dataForm" ref="dataForm" style="height: 100%">
          <el-col :span="24" style="display:flex;flex-direction:column">
            <el-row>
              <form-item style="margin-top:10px" title="标题" prop="name" :titleSpan="2" :itemSpan="16">
                <el-input v-model="curData.name" placeholder="请输入标题" style="width:100%"></el-input>
              </form-item>
              <form-item style="margin-top:10px" :titleSpan="1" :itemSpan="3">
                <el-switch v-model="curData.original" active-text="原创" inactive-text="转载"></el-switch>
              </form-item>
            </el-row>
            <form-item title="正文" prop="content" :titleSpan="2" :itemSpan="20">
              <quill-editor
                :scale="0"
                v-model="curData.content"
                style="height:600px">
              </quill-editor>
            </form-item>
            <el-row>
              <form-item style="margin-top:40px" title="分类" prop="name" :titleSpan="2" :itemSpan="4">
                <enum-select :default=1 v-model="curData.type" enumTypeKey="SHARE_TYPE"></enum-select>
              </form-item>
              <form-item title="自定义标签" prop="name" :titleSpan="3" :itemSpan="13">
                <el-tag
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </form-item>
            </el-row>
          </el-col>
        </el-form>
      </div>
      <div class="add-share-toolbar">
        <el-button @click="goBack">关闭</el-button>
        <el-button @click="onSave" type="primary">发布</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import quillEditor from '../../../components/quill-editor/quillEditor'
import formItem from '../../bug/components/form-item'
import enumSelect from '../../../components/select/enum-select'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      tableName: 'shareCourses',
      inputVisible: false,
      inputValue: '',
      dynamicTags: [],
      dataForm: {
        name: [{ required: true, trigger: 'blur' }],
        summary: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  components: {
    quillEditor,
    formItem,
    enumSelect
  },
  watch: {
    dynamicTags () {
      this.curData.tags = this.dynamicTags
    }
  },
  methods: {
    initParam () {
      let shareId = this.$route.params.id
      if (shareId) {
        this.curData = this.$store.getters.getShare(shareId)
      } else {
        this.curData.original = true
        this.curData.viewCount = 0
        this.curData.pariseCount = 0
      }
    },
    getId () {
      return this.getSequence('share_key')
    },
    doSaveBefore () {
      return new Promise((resolve, reject) => {
        if (!this.curData._id) {
          this.getId().then(data => {
            this.curData.id = data
            this.curData.createUserId = this.user.email
            this.curData.createDate = new Date()
            resolve()
          })
        }
        resolve()
      })
    },
    doAfterAdd (data) {
      this.addShare(data)
      this.goBack()
    },
    doAfterUpdate (data) {
      this.updateShare(data)
      this.goBack()
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    ...mapMutations(['addShare', 'updateShare'])
  }
}
</script>

<style scoped lang="scss">
  .add-share-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .add-share-content{
      flex: 1 1 auto;
      overflow-y: auto;
    }

    .add-share-toolbar{
      flex: 0 0 60px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .el-tag + .el-tag {
      margin-left: 10px;
      margin-bottom: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
</style>

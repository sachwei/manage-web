<template>
  <panel>
    <div class="backlog-detail-wrapper">
      <el-form
        class="backlog-detail-form"
        :rules="dataRule"
        :model="curData"
        ref="backlogForm"
        style="width: 98%">
        <el-form-item>
          <form-item title="名称" :titleSpan="2" :itemSpan="8" prop="name">
            <el-input v-model="curData.name" auto-complete="off"></el-input>
          </form-item>
          <form-item title="类别" :titleSpan="2" :itemSpan="8" prop="track">
            <backlog-track-select v-model="curData.track" :productId="productId"></backlog-track-select>
          </form-item>
        </el-form-item>
        <el-form-item>
          <form-item title="UI" :titleSpan="2" :itemSpan="8">
            <user-select v-model="curData.uiUserId"></user-select>
          </form-item>
          <form-item title="测试" :titleSpan="2" :itemSpan="8">
            <user-select v-model="curData.testUserId"></user-select>
          </form-item>
        </el-form-item>
        <el-form-item>
          <form-item title="重要级别" :titleSpan="2" :itemSpan="8" prop="important">
            <el-input v-model="curData.important" auto-complete="off"></el-input>
          </form-item>
          <form-item title="故事来源" :titleSpan="2" :itemSpan="8" prop="where">
            <enum-select v-model="curData.where" enumTypeKey="BACKLOG_WHERE"></enum-select>
          </form-item>
        </el-form-item>
        <el-form-item>
          <form-item title="如何演示" :titleSpan="2" :itemSpan="22" prop="how">
            <quill-editor
              v-model="curData.how"
              style="height:400px">
            </quill-editor>
          </form-item>
        </el-form-item>
        <el-form-item v-if="curData.sprintId">
          <form-item title="变更记录" :titleSpan="2" :itemSpan="22" prop="commentId" style="margin-top:60px">
            <comment autosize v-model="curData.commentId"></comment>
          </form-item>
        </el-form-item>
      </el-form>
      <div class="backlog-detail-footer">
        <el-button @click="goBack">取消</el-button>
        <el-button v-if="canSave" type="primary" @click="onOnlySave">仅保存</el-button>
        <el-button v-if="canSave" type="primary" @click="onSaveAndBack">保存并返回</el-button>
      </div>
    </div>
    <estimate-bar v-if="!curData.sprintId" @click.native="onOpenEstimate" v-show="curData._id"></estimate-bar>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </panel>
</template>

<script>
import quillEditor from '../../../components/quill-editor/quillEditor'
import estimateBar from '../components/estimate-bar'
import backlogTrackSelect from '../../../components/select/backlog-track-select'
import enumSelect from '../../../components/select/enum-select'
import userSelect from '../../../components/select/user-select'
import formItem from '../../bug/components/form-item'
import comment from '../../../components/comment/comment'
import { mapMutations, mapActions } from 'vuex'

export default {
  components: {
    quillEditor,
    estimateBar,
    backlogTrackSelect,
    enumSelect,
    formItem,
    userSelect,
    comment
  },
  data () {
    return {
      tableName: 'backlogs',
      back: true,
      dataRule: {
        name: [
          { required: true, message: '请输入故事名称', trigger: 'change' }
        ],
        track: [
          { required: true, message: '请输入类别', trigger: 'change' }
        ],
        note: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    },
    productId () {
      return this.$store.state.backlog.product.id
    },
    canSave () {
      if (this.user.roleIds && this.user.roleIds.indexOf) {
        return (this.user.roleIds.indexOf(9) !== -1) || (this.user.roleIds.indexOf(11) !== -1) || (this.user.roleIds.indexOf(12) !== -1)
      } else {
        return false
      }
    }
  },
  methods: {
    initParam () {
      let backlogId = this.$route.params.id
      if (backlogId) {
        this.curData = this.$store.getters.getBacklog(backlogId)
      } else {
        this.getId().then((id) => {
          this.newDataForm(id)
        })
      }
    },
    openImage () {
      this.$router.push({ name: 'imageView' })
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.backlogForm.validate((valid) => {
          if (valid) {
            resolve(valid)
          } else {
            reject(new Error())
          }
        })
      })
    },
    onOnlySave () {
      this.back = false
      this.onSave()
    },
    onSaveAndBack () {
      this.back = true
      this.onSave()
    },
    onSave () {
      this.validate().then(() => {
        if (this.curData._id) {
          this.doUpdate().then((data) => {
            this.updateBacklog(this.curData)
            this.afterSave()
          })
        } else {
          this.newBacklog(this.curData).then((data) => {
            this.curData = data
            this.afterSave()
          })
        }
      })
    },
    afterSave () {
      if (this.back) {
        this.goBack()
      }
    },
    getId () {
      return this.getSequence('backlog_key')
    },
    newDataForm (id) {
      this.curData = {
        id: id,
        important: 50,
        estimate: 0,
        state: 0,
        orgId: this.user.orgId[0],
        createUserId: this.user.email,
        createDate: new Date()
      }
    },
    onOpenEstimate () {
      this.$router.push({ name: 'estimate', params: {id: this.curData.id} })
    },
    ...mapMutations(['updateBacklog']),
    ...mapActions(['newBacklog'])
  }
}
</script>

<style>
  .el-form-item__content{
    line-height: 24px;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    z-index: inherit;
  }
</style>

<style lang="scss" scoped>
  .backlog-detail-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .el-form-item__label{
      width:100%;
    }

    .backlog-detail-form{
      flex: 1 1 auto;
      margin-top: 10px;
      overflow: auto;
    }

    .backlog-detail-footer{
      flex: 0 0 120px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 30px;
    }

    .inline-input{
      width: 50%;
    }
  }

  .fade-enter-active {
    animation: fadeInDown .5s;
  }
  .fade-leave-active {
    animation: fadeOutUp .5s;
  }
</style>

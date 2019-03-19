<template>
  <panel>
    <div class="bug-wrapper">
      <div class="bug-form">
        <el-form
        :model="curData"
        :rules="dataRule"
        ref="dataForm">
          <el-col :span="17" style="display:flex;flex-direction:column">
            <group-title title="单据描述"></group-title>
            <form-item title="编码" prop="id" :titleSpan="3" :itemSpan="20">
              <el-input autosize :disabled="true" v-model="curData.id"></el-input>
            </form-item>
            <form-item title="摘要" prop="name" :titleSpan="3" :itemSpan="20">
              <el-input autosize v-model="curData.name"></el-input>
            </form-item>
            <form-item title="操作描述" :titleSpan="3" :itemSpan="20">
              <quill-editor
                :scale="0"
                ref="quillEditor"
                v-model="curData.summary"
                style="height:300px">
              </quill-editor>
            </form-item>
            <form-item style="margin-top:60px" title="附件" :titleSpan="3" :itemSpan="19">
              <attach-list v-model="curData.attachs"></attach-list>
            </form-item>

            <group-title title="处理信息"></group-title>
            <el-row>
              <form-item title="状态" prop="state" :titleSpan="3" :itemSpan="8">
                <enum-select :default=1 v-model="curData.state" enumTypeKey="BUG_STATE"></enum-select>
              </form-item>
              <form-item title="处理人" prop="curUserId" :titleSpan="3" :itemSpan="8">
                <user-select v-model="curData.curUserId"></user-select>
              </form-item>
            </el-row>
            <el-row>
              <form-item title="缺陷原因" :titleSpan="3" :itemSpan="8">
                <enum-select v-model="curData.solutionType" enumTypeKey="BUG_REASON"></enum-select>
              </form-item>
              <form-item title="处理方法" :titleSpan="3" :itemSpan="8">
                <el-input type="textarea" :rows="3" v-model="curData.solution"></el-input>
              </form-item>
            </el-row>

            <form-item title="历史记录" :titleSpan="3" :itemSpan="19" style="margin-top:20px">
              <history-list :orbits="curData.orbits"></history-list>
            </form-item>

            <form-item title="评论" :titleSpan="3" :itemSpan="19">
              <comment autosize v-model="curData.commentId"></comment>
            </form-item>
          </el-col>

          <el-col :span="7">
            <group-title title="详细信息"></group-title>
            <form-item title="产品" prop="productId" :titleSpan="5" :itemSpan="15">
              <product-select v-model="curData.productId"></product-select>
            </form-item>
            <form-item title="版本" prop="sprintId" :titleSpan="5" :itemSpan="15">
              <sprint-select :productId="productId" v-model="curData.sprintId"></sprint-select>
            </form-item>
            <form-item title="分类" prop="track" :titleSpan="5" :itemSpan="15">
              <backlog-track-select :productId="productId" v-model="curData.track"></backlog-track-select>
            </form-item>
            <form-item title="级别" prop="level" :titleSpan="5" :itemSpan="15">
              <enum-select v-model="curData.level" enumTypeKey="BUG_LEVEL"></enum-select>
            </form-item>
            <form-item title="系统" prop="system" :titleSpan="5" :itemSpan="15">
              <enum-select v-model="curData.system" enumTypeKey="BUG_SYSTEM_TYPE"></enum-select>
            </form-item>
            <form-item title="故事" :titleSpan="5" :itemSpan="15">
              <backlog-select :sprintId="sprintId" v-model="curData.backlogId"></backlog-select>
            </form-item>
          </el-col>
        </el-form>
      </div>
      <div class="footbar">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import imageView from '../components/image-view'
import groupTitle from '../components/group-title'
import formItem from '../components/form-item'
import attachList from '../components/attach-list'
import enumSelect from '../../../components/select/enum-select'
import userSelect from '../../../components/select/user-select'
import productSelect from '../../../components/select/product-select'
import backlogTrackSelect from '../../../components/select/backlog-track-select'
import sprintSelect from '../../../components/select/sprint-select'
import backlogSelect from '../../../components/select/backlog-select'
import comment from '../../../components/comment/comment'
import historyList from '../components/history-list'
import quillEditor from '../../../components/quill-editor/quillEditor'
import { mapMutations, mapActions } from 'vuex'
import mutationTypes from '../../../store/mutation-types'

export default {
  components: {
    imageView,
    groupTitle,
    formItem,
    attachList,
    enumSelect,
    userSelect,
    productSelect,
    backlogTrackSelect,
    sprintSelect,
    backlogSelect,
    comment,
    historyList,
    quillEditor
  },
  data () {
    return {
      bugId: undefined,
      backlogId: undefined,
      tableName: 'bugs',
      dataRule: {
        name: [{ required: true, trigger: 'blur' }],
        state: [{ required: true, trigger: 'change' }],
        curUserId: [{ required: true, trigger: 'change' }],
        productId: [{ required: true, trigger: 'change' }],
        sprintId: [{ required: true, trigger: 'change' }],
        track: [{ required: true, trigger: 'change' }],
        level: [{ required: true, trigger: 'change' }],
        system: [{ required: true, trigger: 'change' }]
      }
    }
  },
  computed: {
    productId () {
      return this.curData.productId
    },
    sprintId () {
      return this.curData.sprintId
    }
  },
  methods: {
    initParam () {
      this.bugId = this.$route.query.id
      this.backlogId = this.$route.params.backlogId
    },
    initData () {
      this.setUser(this.user)
      if (this.backlogId) {
        this.getId().then((id) => {
          this.newDataFormByBacklog(id)
        })
      } else if (this.bugId) {
        this.curData = this.$store.getters.getBug(this.bugId)
      } else {
        this.getId().then((id) => {
          this.newDataForm(id)
        })
      }
    },
    getId () {
      return this.getSequence('bug_key')
    },
    newDataFormByBacklog (id) {
      this.curData = {
        id: id,
        commitUser: this.user.email,
        orgId: this.user.orgId[0],
        createTime: new Date(),
        orbits: [],
        summary: '<blockquote>﻿<span style="color: rgb(90, 94, 102);">[步骤]</span></blockquote><p><br></p><p><br></p><blockquote><span style="color: rgb(90, 94, 102);">[结果]</span></blockquote><p><br></p><p><br></p><blockquote><span style="color: rgb(90, 94, 102);">[期望]</span></blockquote><p><br></p><p><br></p>'
      }

      this.findCondition = {
        id: this.backlogId
      }
      this.findDataByCondition('backlogs').then(data => {
        if (data && data.length === 1) {
          let backlog = data[0]
          this.curData.productId = backlog.productId
          this.curData.sprintId = backlog.sprintId
          this.curData.track = backlog.track
          this.curData.backlogId = backlog.id
          this.$set(this.curData, 'name', backlog.name)
        }
      })
    },
    newDataForm (id) {
      this.curData = {
        id: id,
        commitUser: this.user.email,
        orgId: this.user.orgId[0],
        createTime: new Date(),
        orbits: [],
        summary: '<blockquote>﻿<span style="color: rgb(90, 94, 102);">[步骤]</span></blockquote><p><br></p><p><br></p><blockquote><span style="color: rgb(90, 94, 102);">[结果]</span></blockquote><p><br></p><p><br></p><blockquote><span style="color: rgb(90, 94, 102);">[期望]</span></blockquote><p><br></p><p><br></p>'
      }
    },
    calcOrbit () {
      let data = {
        toUserId: this.curData.curUserId,
        optTime: new Date(),
        optUserId: this.user.email,
        state: this.curData.state
      }
      if (this.curData.orbits.length === 0) {
        this.curData.orbits.push({
          optTime: new Date(),
          optUserId: this.user.email,
          state: this.curData.state
        })
        data.fromUserId = this.user.email
        this.curData.orbits.push(data)
      } else {
        let last = this.curData.orbits[this.curData.orbits.length - 1]
        if ((last.state === data.state) && (last.toUserId === data.toUserId)) {
          return
        } else {
          data.fromUserId = last.toUserId
          last.stayTime = this.$utils.subDate(data.optTime, new Date(last.optTime))
        }
        this.curData.orbits.push(data)
      }
      this.sendMessage()
    },
    sendMessage () {
      this.$dataService.sendMessage({
        toEmail: this.curData.curUserId,
        content: `你有一个缺陷单${this.curData.id}待处理`
      })
    },
    onSubmit () {
      this.calcOrbit()
      this.onSave()
    },
    doAfterUpdate (data) {
      this.updateBug(data)
      this.goBack()
    },
    doAfterAdd (data) {
      this.addBug(data)
      this.goBack()
    },
    ...mapActions(['updateBug']),
    ...mapMutations(['addBug']),
    ...mapMutations({
      setUser: mutationTypes.SET_USER_INFO
    })
  }
}
</script>

<style>
  .el-form-item__content{
    line-height: 24px;
  }
</style>

<style lang="scss" scoped>
  .bug-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .bug-form {
    overflow-y: auto;
    flex: 1 1 200px;
  }

  .footbar {
    flex: 0 0 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;
  }

</style>

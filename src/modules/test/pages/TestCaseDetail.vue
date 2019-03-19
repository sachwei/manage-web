<template>
  <panel>
    <div class="test-case-detail-wrapper">
      <div class="case-form">
        <el-form
        :model="curData"
        :rules="dataRule"
        ref="dataForm">
          <el-col :span="17" style="display:flex;flex-direction:column">
            <group-title title="用例描述"></group-title>
            <form-item title="用例编号" prop="id" :titleSpan="3" :itemSpan="20">
              <el-input autosize :disabled="true" v-model="curData.id"></el-input>
            </form-item>
            <form-item title="用例名称" prop="name" :titleSpan="3" :itemSpan="20">
              <el-input autosize v-model="curData.name"></el-input>
            </form-item>
            <form-item title="前置条件" prop="beforeCondition" :titleSpan="3" :itemSpan="20">
              <el-input autosize v-model="curData.beforeCondition"></el-input>
            </form-item>
             <form-item title="操作步骤" prop="step" :titleSpan="3" :itemSpan="20">
              <case-step v-model="curData.step"></case-step>
            </form-item>
            <form-item title="摘要" prop="summary" :titleSpan="3" :itemSpan="20">
              <quill-editor
                :scale="0"
                ref="quillEditor"
                v-model="curData.summary"
                style="height:300px">
              </quill-editor>
            </form-item>
          </el-col>

          <el-col :span="7">
            <group-title title="详细信息"></group-title>
            <form-item title="用例集" prop="setId" :titleSpan="5" :itemSpan="15">
              <test-set-select v-model="curData.setId"></test-set-select>
            </form-item>
            <form-item title="优先级" prop="sort" :titleSpan="5" :itemSpan="15">
              <enum-select :default=1 v-model="curData.sort" enumTypeKey="TEST_CASE_LEVEL"></enum-select>
            </form-item>
            <form-item title="类型" prop="type" :titleSpan="5" :itemSpan="15">
              <enum-select :default=1 v-model="curData.type" enumTypeKey="TEST_CASE_TYPE"></enum-select>
            </form-item>
            <form-item title="所属产品" :titleSpan="5" :itemSpan="15">
              <product-select v-model="curData.productId"></product-select>
            </form-item>
            <form-item title="版本" :titleSpan="5" :itemSpan="15">
              <sprint-select :productId="productId" v-model="curData.sprintId"></sprint-select>
            </form-item>
            <form-item title="故事" :titleSpan="5" :itemSpan="15">
              <backlog-select :sprintId="sprintId" v-model="curData.backlogId"></backlog-select>
            </form-item>
          </el-col>
        </el-form>
      </div>
      <div class="footbar">
        <el-button @click="goBack">取消</el-button>
        <el-button :loading="saveing" type="primary" @click="onSave">提交</el-button>
      </div>
    </div>
  </panel>
</template>

<script>
import groupTitle from '../../bug/components/group-title'
import formItem from '../../bug/components/form-item'
import enumSelect from '../../../components/select/enum-select'
import userSelect from '../../../components/select/user-select'
import productSelect from '../../../components/select/product-select'
import backlogSelect from '../../../components/select/backlog-select'
import quillEditor from '../../../components/quill-editor/quillEditor'
import sprintSelect from '../../../components/select/sprint-select'
import testSetSelect from '../../../components/select/test-set-select'
import caseStep from '../components/case-step'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      dataRule: {
        name: [{ required: true, trigger: 'blur' }],
        beforeCondition: [{ required: true, trigger: 'blur' }],
        step: [{ required: true, trigger: 'blur' }],
        summary: [{ required: true, trigger: 'blur' }],
        setId: [{ required: true, trigger: 'blur' }],
        sort: [{ required: true, trigger: 'blur' }]
      },
      caseId: undefined,
      setId: undefined,
      tableName: 'testcase',
      saveing: false
    }
  },
  components: {
    groupTitle,
    formItem,
    enumSelect,
    userSelect,
    backlogSelect,
    productSelect,
    quillEditor,
    sprintSelect,
    testSetSelect,
    caseStep
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
      this.caseId = this.$route.query.id
      this.setId = this.$route.query.setId
    },
    initData () {
      if (this.caseId) {
        this.curData = this.$store.getters.getCase(this.caseId)
      } else {
        this.getSequence('test_case_key').then(id => {
          this.curData = {
            'id': id,
            'createTime': new Date(),
            'orgId': this.user.orgId[0],
            'createUserId': this.user.email,
            'setId': this.setId,
            'productId': this.$route.query.productId
          }
        })
      }
    },
    doSaveBefore () {
      return new Promise((resolve, reject) => {
        this.saveing = true
        resolve()
      })
    },
    doAfterUpdate (data) {
      this.goBack()
      this.saveing = false
    },
    doAfterAdd (data) {
      this.addCase(data)
      this.goBack()
      this.saveing = false
    },
    ...mapMutations(['addCase'])
  }
}
</script>

<style scoped lang="scss">
  .test-case-detail-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: inherit;
  }
  .case-form {
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

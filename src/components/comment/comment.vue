<template>
  <div class="opinion-list">
    <ul v-if="curData.comments && (curData.comments.length > 0)">
      <li v-for="(item, index) in curData.comments" :key="index">
        <span>{{ index + 1 }}.</span>
        <img :src="headUrl + item.userId" alt=''>
        <span class="name">{{ item.userId | userFilter(userList) }}</span>
        <span class="txt">{{ item.comment }}</span>
        <span class="time">{{ item.commentDate | dateFilter('yyyy-MM-dd hh:mm:ss') }}</span>
      </li>
    </ul>
    <span v-else>暂时没有记录~~</span>
    <div class="text-input">
      <el-input type="text"  v-model="comment"></el-input>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data () {
    return {
      commentId: undefined,
      comment: '',
      tableName: 'comments'
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  watch: {
    value () {
      this.commentId = this.value
      this.initData()
    }
  },
  methods: {
    initData () {
      if (this.value) {
        this.commentId = this.value
        this.findCondition = {
          id: this.commentId
        }
        this.findDataByCondition().then((data) => {
          if (data.length === 1) {
            this.curData = data[0]
          }
        })
      }
    },
    getId () {
      return this.getSequence('comments_key')
    },
    newDataForm (id) {
      this.curData = {
        id: id,
        comments: []
      }
    },
    onSubmit () {
      if (this.commentId) {
        this.curData.comments.push({
          userId: this.user.email,
          commentDate: new Date(),
          comment: this.comment
        })
        this.onSave()
      } else {
        this.getId().then((id) => {
          this.commentId = id
          this.newDataForm(id)

          this.curData.comments.push({
            userId: this.user.email,
            commentDate: new Date(),
            comment: this.comment
          })
          this.onSave()
        })
      }
    },
    doAfterAdd () {
      this.comment = ''
      this.$emit('input', this.commentId)
    },
    doAfterUpdate () {
      this.comment = ''
    }
  }
}
</script>

<style scoped lang="scss">
  .opinion-list {
    font-size: 14px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;

    .text-input {
      margin-top: 10px;
      display: flex;

      .el-button {
        margin-left: 10px;
      }
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        display: flex;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #eee;
        line-height: 20px;
        padding: 10px 0;

        img {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          margin-left: 5px;
        }

        .name {
          margin-left: 5px;
          color: #aaa;
        }

        .txt {
          width: 100px;
          flex: 1 1 auto;
          color: #444;
          margin: 0 10px;
        }

        .time {
          color: #aaa;
        }
      }
    }
  }
</style>

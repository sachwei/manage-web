<template>
  <div class="share-item">
    <div class="item-banner" @click="onOpenView">
      <img :src="`/work/static/img/share-type/${ item.type }.jpg`" alt="">
    </div>
    <div class="item-content">
      <div class="item-name" @click="onOpenView">
        <span v-if="item.original">【原创】</span>
        <span v-else>【转载】</span>
        <span>{{ item.name }}</span>
      </div>
      <div class="item-info">
        <div class="info-left">
          <div class="item-create-user margin-right-10" @dblclick="onEdit">
            <span>作者：{{ item.createUserId | userFilter(userList) }}</span>
          </div>
          <div class="item-type margin-right-10">
            <span>类别：{{ item.type | enumFilter('SHARE_TYPE') }}</span>
          </div>
          <div class="item-tag margin-right-10" v-if="item.tags.length">
            <i class="fa fa-tags"></i>
            <span v-for="(tag, index) in item.tags" :key="index">{{ tag }}</span>
          </div>
          <div class="item-date margin-right-10">
            <i class="fa fa-clock-o"></i>
            <span>{{ item.createDate | dateFilter('yyyy-MM-dd') }}</span>
          </div>
        </div>
        <div class="info-right">
          <div class="parise-count margin-left-10" @click="onParise">
            <i class="fa fa-thumbs-o-up"></i>
            <span>{{ item.pariseCount || 0 }}</span>
          </div>
          <div class="item-viewCount margin-left-10">
            <span>阅读：{{ item.viewCount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  props: [
    'item'
  ],
  methods: {
    onOpenView () {
      this.item.viewCount = this.item.viewCount + 1
      this.curData = {
        _id: this.item._id,
        viewCount: this.item.viewCount
      }
      this.doUpdate('shareCourses').then(() => {
        this.updateShare(this.item)
      })
      this.$router.push({ name: 'shareDetail', params: { content: this.item.content } })
    },
    onEdit () {
      this.$router.push({ name: 'shareEdit', params: { id: this.item.id } })
    },
    onParise () {
      this.item.pariseCount = this.item.pariseCount + 1
      this.curData = {
        _id: this.item._id,
        pariseCount: this.item.pariseCount
      }
      this.doUpdate('shareCourses').then(() => {
        this.updateShare(this.item)
      })
    },
    ...mapMutations(['updateShare'])
  }
}
</script>

<style scoped lang="scss">
  .share-item{
    padding-right: 10px;
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    display: flex;

    .item-banner{
      flex: 0 0 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 50px;
      }
    }

    .item-content{
      width: 100px;
      flex: 1 1 100px;
      display: flex;
      flex-direction: column;

      .item-name{
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 10px;
      }

      .item-info{
        display: flex;
        font-size: 13px;
        color: #aaa;

        .info-left{
          margin-left: 8px;
          flex: 1 1 auto;
          display: flex;
          align-items: center;

          .item-create-user{
            display: flex;
            align-items: center;
          }

          .user-head{
            width: 26px;
            height: 26px;
          }
        }

        .info-right {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .fa-thumbs-o-up{
            cursor: pointer;
            font-size: 14px;
          }

          .fa-thumbs-o-up:hover{
            color: red;
          }
        }
      }
    }
  }
</style>

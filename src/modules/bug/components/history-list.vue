<template>
  <div class="opinion-list" style="margin-bottom: 0px;">
    <ul v-if="orbits && orbits.length > 0">
      <li v-for="(item, index) in orbits" :key="index">
        <span>{{ index + 1 }}.
          <img class="head-img" :src="headUrl + item.optUserId" alt=''>
          <span>{{ item.optUserId | userFilter(userList) }}</span>
          <span v-if="item.fromUserId">
            <span>将单据状态置为“{{ enumFormatter('BUG_STATE', item.state) }}”</span>
            <span>, 给了</span>
            <img class="head-img" :src="headUrl + item.toUserId" alt=''>
            <span>{{ item.toUserId | userFilter(userList) }}</span>
          </span>
          <span v-else>创建了该缺陷单</span>
          <span class="opt-time"> {{ item.optTime | dateFilter('yyyy-MM-dd hh:mm:ss') }}</span>
        </span>
      </li>
    </ul>
    <span v-else>暂时没有历史记录~~</span>
  </div>
</template>

<script>
export default {
  props: [
    'orbits'
  ],
  data () {
    return {
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .opinion-list {
    font-size: 14px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 100px;
    padding: 10px;
    box-sizing: border-box;

    .text-input {
      margin-top: 10px;
      display: flex;

      .el-button {
        margin-left: 10px;
      }
    }

    .head-img {
      width: 24px;
      height: 24px;
      border-radius: 12px;
      margin-left: 5px;
      line-height: 48px;
      vertical-align: middle;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        line-height: 38px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #eee;

        .opt-time {
          color: #aaa;
        }
      }
    }
  }
</style>

<template>
  <el-popover
    placement="bottom-end"
    width="300"
    trigger="click">
    <ul>
      <li v-for="(item, index) in bug.orbits" :key="item._id">
        <span>{{ index + 1 }}.
          <span class="user-name">{{ item.optUserId | userFilter(userList) }}</span>
          <span v-if="item.fromUserId">
            <span>将单据状态置为“{{ enumFormatter('BUG_STATE', item.state) }}”</span>
            <span>, 给了</span>
            <span class="user-name">{{ item.toUserId | userFilter(userList) }}</span>
          </span>
          <span v-else>创建了该缺陷单</span>
          <span class="opt-time"> {{ item.optTime | dateFilter('MM-dd hh:mm:ss') }}</span>
        </span>
      </li>
    </ul>
    <div slot="reference">
      <span>{{bug.curUserId | userFilter(userList)}}</span>
      <i class="fa fa-angle-double-down margin-left-5"></i>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: [
    'bug'
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
    stateFormater (row, column, cellValue) {
      return this.$enumService.enumFormat('BUG_STATE', cellValue)
    }
  }
}
</script>

<style scoped lang="scss">
  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      line-height: 24px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding: 5px 0;

      .opt-time {
        color: #aaa;
      }

      .user-name{
        font-weight: bold;
      }
    }
  }
  .fa-angle-double-down{
    cursor: pointer;
  }
</style>

<template>
  <div class="task-item-wrapper">
    <el-select
      class="task-item-space"
      style="width:200px"
      v-model="value.type"
      @change="taskItemChange"
      placeholder="请选择">
      <el-option
        v-for="item in tyeps"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input-number class="task-item-space" v-model="value.estimate" controls-position="right" :step="0.5" :min="0.5" :max="10"></el-input-number>
    <el-select class="task-item-space" :clearable="true" v-model="value.userId" filterable placeholder="请选择">
      <el-option
        v-for="item in userList"
        :key="item.email"
        :label="item.userName"
        :value="item.email">
      </el-option>
    </el-select>
    <el-input class="task-item-space task-item-note" v-model="value.note" placeholder="备注"></el-input>
    <i class="fa fa-trash-o fa-lg" @click="onDelete"></i>
  </div>
</template>

<script>
const taskTypes = [
  {value: 'h5'},
  {value: 'android'},
  {value: 'ios'},
  {value: 'web'},
  {value: 'java'},
  {value: 'study'}
]
export default {
  props: [
    'value',
    'userList'
  ],
  data () {
    return {
      tyeps: taskTypes
    }
  },
  methods: {
    onDelete () {
      this.$emit('delete', this.value)
    },
    taskItemChange () {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style scoped lang="scss">
  .task-item-wrapper{
    display: flex;
    margin-bottom: 10px;
    align-items: center;

    .task-item-note{
      width: 500px;
    }

    .task-item-space{
      margin-right: 15px;
    }

    .fa-trash-o{
      color: red;
      cursor: pointer;
    }

    .fa-trash-o:hover{
      transform: scale(1.1)
    }
  }
</style>

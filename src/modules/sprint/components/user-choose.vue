<template>
  <div class="user-choose-wrapper">
    <div class="user-item" v-for="user in team" :key="user.email">
      <img class="user-item-pic" :src="headUrl + user.email" alt="">

    </div>
    <img @click="onOpenAddDialog" class="add-user-btn user-item-pic" src="../../../assets/img/icon_addpic.png" alt="">

    <el-dialog title="新增团队成员" :visible.sync="addUserDialogVisible">
      <el-form :model="userItemForm">
        <el-form-item style="margin-bottom: 22px" label="名称" label-width="80px">
          <el-select v-model="userItemForm.email" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in userList"
              :key="item.email"
              :label="item.userName"
              :value="item.email">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 22px" label="投入系数" label-width="80px">
          <el-input-number v-model="userItemForm.rate" :min="0.1" :step="0.1" :max="1" style="width: 200px"></el-input-number>
        </el-form-item>
        <el-form-item style="margin-bottom: 22px" label="备注" label-width="80px">
          <el-input type="textarea" :rows="3" v-model="userItemForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addUserDialogVisible: false,
      userItemForm: {
        rate: 1
      },
      userList: []
    }
  },
  props: [
    'team'
  ],
  methods: {
    initData () {
      this.findDataByOrgId('users').then((data) => {
        this.userList = data
      })
    },
    onOpenAddDialog () {
      this.addUserDialogVisible = true
    },
    onSave () {
      if (this.validate(this.userItemForm)) {
        this.$message('该成员已存在。')
      } else {
        this.team.push(this.userItemForm)
        this.userItemForm = {
          rate: 1
        }
        this.addUserDialogVisible = false
      }
    },
    validate (data) {
      return this.team.find(item => item.email === data.email)
    }
  }
}
</script>

<style scoped lang="scss">
  .user-choose-wrapper{
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .user-item{
      margin-right: 10px;
    }

    .user-item-pic{
      width: 50px;
      height: 50px;
    }

    .add-user-btn:hover{
      cursor: pointer;
    }
  }
</style>

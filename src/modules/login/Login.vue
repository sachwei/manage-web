<template>
  <div class="login-wrapper cover">
    <img class="user-head" :src="headUrl + user.email" alt="">
    <span v-if="userCnName" class="user-name">{{ userCnName }}，欢迎登录：）</span>
    <div class="login-box">
      <div class="user-info">
        <span class="user-info-title">Username:</span>
        <el-input v-model="userName"></el-input>

        <span class="user-info-title">Password:</span>
        <el-input type="password" @keydown.enter.native="onSubmit" v-model="password"></el-input>
      </div>
      <div class="login-btn-box">
        <el-checkbox class="keep-login-chk" v-model="autoLogin">keep me logged in</el-checkbox>
        <el-button class="login-btn" type="primary" round @click="onSubmit">Login</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      autoLogin: true,
      userName: '',
      password: '',
      userCnName: ''
    }
  },
  watch: {
    userName () {
      if (this.user && (this.user.email.indexOf(this.userName) !== -1)) {
        this.userCnName = this.user.userName
      }
    }
  },
  mounted () {
    this.autoLogin = this.$localStore.get('autoLogin') && true
  },
  methods: {
    onSubmit () {
      const userName = encodeURIComponent(this.userName)
      const password = encodeURIComponent(this.$encrypt.encrypt(this.password, this.userName))
      const param = `userName=${userName}&password=${password}&loginCode=&loginType=1&deviceId=00%3A15%3A5d%3A04%3A0f%3A00`
      this.$http.post(this.$apiUrl.LOGIN, {key: param}).then((response) => {
        if (response && response.data) {
          this.$localStore.set('ewuser', response.data)
          this.$localStore.set('autoLogin', this.autoLogin)
          this.$router.push({ path: '/' })
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
          title: '警告',
          message: '登陆失败',
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .login-wrapper{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: #ECF0F3;

    .user-head{
      margin-top: -100px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      animation: head-grow 1s 1;
    }

    .user-name{
      margin-top: 10px;
      color: #aaa;
      letter-spacing: 1px;
    }

    @keyframes head-grow {
      0% {
        width: 60px;
        height: 60px;
      }
      100% {
        width: 100px;
        height: 100px;
      }
    }

    .login-box{
      margin-top: 20px;
      box-shadow: 2px 2px 2px #ddd;
    }

    .user-info {
      padding: 20px 30px;
      width: 320px;
      background-color: white;
      border: 1px solid #ddd;

      .user-info-title{
        display: block;
        margin: 10px 0;
      }
    }

    .login-btn-box{
      height: 70px;
      border-top: none;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      background-color: #F1F6F9;

      display: flex;
      align-items: center;
      padding: 0 30px;

      .keep-login-chk{
        flex: 1 1 auto;
      }
    }
  }
</style>

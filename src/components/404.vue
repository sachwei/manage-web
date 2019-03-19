<template>
  <div class="error-page">
    <img class="error-image" src="../assets/img/404_error.png"/>
    <h2 class="title">PAGE NOT FOUND</h2>
    <router-link to="/" class="backBtn" tag="span">返回首页</router-link>
  </div>
</template>
<script type="text/javascript">
export default{
}
</script>

<style scoped lang='scss'>
  .error-page {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .error-image{
      width: 260px;
      margin-top: 20%;
    }

    .backBtn {
      width: 80px;
      padding: 10px;
      margin-top: 20px;
      text-align: center;
      color: rgba(51, 51, 51, 0.705);
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
    }
  }
</style>

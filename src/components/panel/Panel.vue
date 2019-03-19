<template>
  <div class="panel-wrapper fill-content">
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
  .panel-wrapper{
    background-color: #ddd;

    .panel-content{
      height: 100%;
      background-color: white;
      box-sizing: border-box;
      border-radius: 5px;
      padding: 10px;
      display: flex;
      justify-content: center;
    }
  }
</style>

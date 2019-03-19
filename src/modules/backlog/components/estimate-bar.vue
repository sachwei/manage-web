<template>
  <div class="estimate-bar-wrapper" v-drag>
    <div class="estimate-bar">
      <i class="fa fa-gavel"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
  .estimate-bar-wrapper{
    position: fixed;
    right: 80px;
    top: 40px;
  }

  .estimate-bar{
    cursor: pointer;
    width: 50px;
    height: 50px;
    background-color: #F56C6C;
    border-radius: 25px;
    box-shadow: 0 5px 8px hsla(0, 0%, 7%, .3), 0 0 0 1px hsla(0, 0%, 7%, .1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease-out;

    .fa{
      font-size: 22px;
      color: white;
    }
  }

  .estimate-bar:hover{
    box-shadow: 0 5px 10px hsla(0, 0%, 7%, .2), 0 0 0 1px hsla(0, 0%, 7%, .1);
    transform: translateY(2px);
  }
</style>

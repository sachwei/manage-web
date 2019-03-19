<template>
  <el-breadcrumb separator="/" style="margin-bottom: 20px;">
    <template v-for="child in currentMenus">
        <el-breadcrumb-item :to="{ path: child.href }" :key="child.id">{{child.name}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script>
 export default {
   data () {
     return {
       currentMenus: []
     }
   },
   components: {

   }
 }
</script>

<style scoped>

</style>

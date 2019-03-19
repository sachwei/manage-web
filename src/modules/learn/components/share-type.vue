<template>
  <div class="share-type-wrapper">
    <checkbox-group enumTypeId="SHARE_TYPE" v-model="typeChecks"></checkbox-group>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      typeChecks: []
    }
  },
  watch: {
    typeChecks () {
      this.setTypes(this.typeChecks)
      this.findShareList()
    }
  },
  methods: {
    findShareList () {
      let options = {
        pageSize: 10,
        page: 1,
        sort: { createDate: 1 }
      }
      this.findShareListWithPage(options)
    },
    ...mapMutations(['setTypes']),
    ...mapActions(['findShareListWithPage'])
  }
}
</script>

<style scoped lang="scss">

</style>

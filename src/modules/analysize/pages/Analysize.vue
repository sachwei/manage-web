<template>
  <panel>
    <div class="analysize-wrapper">
      <div class="analysize-condition">
        <el-form>
          <form-item title="时间" :titleSpan="1" :itemSpan="23">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </form-item>
        </el-form>
      </div>
      <div class="analysize-list">
        <el-row :gutter="10">
          <el-col :span="12">
            <ew-card title="提单数量" style="height: 350px">
              <bug-create-pie ref="burnDownChart"></bug-create-pie>
            </ew-card>
          </el-col>
          <el-col :span="12">
            <ew-card title="平均验证时间" style="height: 350px">
              <bug-vertify-bar ref="burnDownChart"></bug-vertify-bar>
            </ew-card>
          </el-col>
          <el-col :span="12" class="margin-top-10">
            <ew-card title="工作量" style="height: 350px">
              <task-done-pie ref="burnDownChart"></task-done-pie>
            </ew-card>
          </el-col>
          <el-col :span="12" class="margin-top-10">
            <ew-card title="平均缺陷处理时间" style="height: 350px">
              <bug-process-avg-time></bug-process-avg-time>
            </ew-card>
          </el-col>
          <el-col :span="12" class="margin-top-10">
            <ew-card title="处理缺陷总数" style="height: 350px">
              <bug-process-sum></bug-process-sum>
            </ew-card>
          </el-col>
          <!-- <el-col :span="12" class="margin-top-10">
            <ew-card title="处理缺陷总数" style="height: 350px">
              <bug-process-sum></bug-process-sum>
            </ew-card>
          </el-col> -->
        </el-row>
      </div>
    </div>
  </panel>
</template>

<script>
import formItem from '../../bug/components/form-item'
import bugCreatePie from '../components/bug-create-pie'
import bugVertifyBar from '../components/bug-vertify-bar'
import taskDonePie from '../components/task-done-pie'
import bugProcessAvgTime from '../components/bug-process-avg-time'
import bugProcessSum from '../components/bug-process-sum'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      timeRange: [new Date(), new Date()],
      checkUsers: []
    }
  },
  components: {
    formItem,
    bugCreatePie,
    bugVertifyBar,
    taskDonePie,
    bugProcessAvgTime,
    bugProcessSum
  },
  watch: {
    timeRange () {
      this.setDateRange(this.timeRange)
    }
  },
  methods: {
    initParam () {
      let curDate = new Date()
      let [year, month] = [curDate.getFullYear(), curDate.getMonth()]
      let stateDate = new Date(year, month, 1)
      this.timeRange = [stateDate, curDate]
    },
    ...mapMutations(['setDateRange'])
  }
}
</script>

<style scoped lang="scss">
  .analysize-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .analysize-list{
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>

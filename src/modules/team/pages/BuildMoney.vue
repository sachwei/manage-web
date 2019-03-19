<template>
  <div class="build-money-view">
    <el-col :span="14">
      <div id="totalChart"></div>
      <div id="moneyChart"></div>
    </el-col>
    <el-col :span="9">
      <div class="money-data">
        <div class="total">
          <span><span class="total-info">还有</span><span class="total-money" @click="openDialog">￥{{ formatTotalMoney }}</span></span>
        </div>
        <div class="list">
          <el-table :show-header="false"
                    :data="moneyList"
                    height="600"
                    :maxHeight="maxHeight"
                    style="width: 100%">
            <el-table-column label="日期" width="120">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ formatDate(null, null, scope.row.buildDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="costType" label="类型" width="80"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
            <el-table-column prop="costMoney" label="金额" align="right" :formatter="moneyFormat" width="100"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-col>

    <el-dialog
      title="录入经费"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="80px" :model="moneyRecord" :rules="itemRule" ref="itemForm" style="width: 96%;">
        <el-form-item label="日期" prop="buildDate">
          <el-date-picker type="date" v-model="moneyRecord.buildDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="费用" prop="costMoney">
          <el-input v-model="moneyRecord.costMoney" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="costType">
          <el-select v-model="moneyRecord.costType" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="moneyRecord.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog('itemForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveMoney('itemForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/utils/utils'
import echarts from 'echarts'

export default {
  data () {
    return {
      maxHeight: 1000,
      dialogVisible: false,
      moneyList: [],
      moneyRecord: {},
      userInfo: {},
      options: [
        { label: '收入' },
        { label: '水果' },
        { label: '猪扒包' },
        { label: '蛋糕' },
        { label: '麦当劳' },
        { label: '披萨' },
        { label: '甜点' },
        { label: '糖水' },
        { label: '聚餐' },
        { label: '活动' },
        { label: '其他' }
      ],
      amendEmails: '',
      itemRule: {
        buildDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        costMoney: [
          { required: true, message: '请输入费用', trigger: 'blur' }
        ],
        costType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      tableName: 'buildMoney'
    }
  },
  computed: {
    // 计算属性的 getter
    formatTotalMoney () {
      return util.formatMoney(this.totalMoney, 2)
    },
    totalMoney () {
      let total = 0
      if (this.moneyList.length === 0) {
        return 0
      }
      this.moneyList.forEach((item) => {
        if (item.costType === '收入') {
          total += item.costMoney
        } else {
          total -= item.costMoney
        }
      })
      return total
    }
  },
  methods: {
    initData () {
      this.maxHeight = util.getClientHeight() - 150
      this.userInfo = this.$localStore.get('ewuser')
      this.findMoneyList()
    },
    moneyFormat (row, column, cellValue) {
      return '￥' + util.formatMoney(cellValue, 2)
    },
    formatDate (row, column, cellValue) {
      let date = new Date(cellValue)
      return util.formatDate(date.getTime())
    },
    openDialog () {
      if (this.userInfo.roleIds.indexOf(1) > -1) {
        this.dialogVisible = true
      }
    },
    closeDialog (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    findMoneyList () {
      this.findDataByOrgId().then(data => {
        this.moneyList = data
        this.moneyList.sort((a, b) => {
          return new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime()
        })
        this.drawChart()
        this.drawTotalChart()
      })
    },
    saveMoney (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (isNaN(this.moneyRecord.costMoney)) {
            this.$message({ message: '输入有误,费用为数值', type: 'error' })
            return
          }
          this.$http.post('/data/save/buildMoney', this.moneyRecord).then((res) => {
            if (res && res.data && res.data !== '保存失败') {
              this.$message({
                message: '录入成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.moneyRecord = {}
              this.findMoneyList()
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          })
        }
      })
    },
    randomColor () {
      let color = ['#1C91DB']
      return color[Math.floor(Math.random() * 100 % color.length)]
    },
    drawTotalChart () {
      let costTotal = 0
      this.moneyList.forEach((item) => {
        if (item.costType !== '收入') {
          costTotal += item.costMoney
        }
      })
      let groupData = [
        { value: costTotal, name: '累计消费' },
        { value: this.totalMoney, name: '剩余费用' }
      ]

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('totalChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '2017年9月开始费用统计',
          subtext: '看看我们还有多少钱可以造',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [{
          name: '费用统计',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: groupData
        }]
      })
    },
    drawChart () {
      let group = []
      let groupTitle = []
      let groupData = []
      this.moneyList.forEach((item) => {
        if (group[item.costType]) {
          group[item.costType] += item.costMoney
        } else {
          group[item.costType] = item.costMoney
        }
      })
      for (let x in group) {
        if (x === '收入') continue
        groupTitle.push(x)
        groupData.push({
          value: group[x],
          itemStyle: {
            normal: {
              color: this.randomColor()
            }
          }
        })
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('moneyChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '观众喜爱的下午茶',
          subtext: '看看哪个下午茶最受宠爱',
          left: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: groupTitle
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: groupData
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .build-money-view{
    height: 100%;
    width: 100%;
    background-color: white;
    padding-top: 50px;
  }
  .total-money{
    color: rgb(0, 182, 0);
    font-size: 30px;
    font-weight: bold;
  }

  .total-info{
    color: gray;
    font-size: .8rem;
  }

  .money-head{
    width: 5rem;
    height: 5rem;
  }

  .money-data{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .total{
      cursor: pointer;
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .list{
      height: 100%;
      width:100%;
      margin-top: 10px;

      .el-icon-minus{
        color: red;
      }
      .el-icon-plus{
        color: #00c500;
      }
      .icon-cake{
        width:1rem;
        height: 1rem;
      }
    }
  }

  #moneyChart, #totalChart{
    width:100%;
    height: 320px;
    margin-top: 10px;
  }

</style>

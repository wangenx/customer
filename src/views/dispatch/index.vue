<template>
  <div class="dispatch">
    <div class="sale-data clearfix">
      <div class="data">
        <div class="title">销售数据</div>
      </div>
      <div class="money">
        <div class="title">派单</div>
        <div class="main clearfix">
          <div class="quota">
            <div>现有额度/总购买额度</div>
            <div>5874/67487</div>
          </div>
          <div class="balance">
            <div>账户余额</div>
            <div>32万元</div>
          </div>
        </div>
        <div class="price" @click="dialogShow = true">派单 0.6元/条</div>
      </div>
    </div>
    <div class="situation">
      <div class="title">销售人员个人情况</div>
      <div class="con">
        <div class="search clearfix">
          <div class="left">
            <el-input v-model="input" size="small" placeholder="请输入内容"></el-input>
            <el-button size="small" type="primary">查询</el-button>
          </div>
          <div class="right">
            <el-select v-model="value" size="small" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value1" size="small" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-radio-group v-model="radio" size="small">
              <el-radio-button label="本日"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="-"
              size="small"
              value-format="yy-MM-dd mm-dd-ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="tabel">
          <el-table
            :data="tableData"
            :default-sort = "{prop: 'totalClue', order: 'descending'}"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="账户名">
            </el-table-column>
            <el-table-column
              prop="totalClue"
              align="center"
              sortable
              label="分配线索">
            </el-table-column>
            <el-table-column
              prop="totalPhoneCount"
              align="center"
              sortable
              label="拨通电话">
            </el-table-column>
            <el-table-column
              prop="totalPhoneTime"
              align="center"
              sortable
              label="通话总时长">
            </el-table-column>
            <el-table-column
              prop="totalCustom"
              align="center"
              sortable
              label="录入客户">
            </el-table-column>
            <el-table-column
              prop="totalACustom"
              align="center"
              sortable
              label="A类客户">
            </el-table-column>
            <el-table-column
              prop="totalFinishCustom"
              align="center"
              sortable
              label="成交客户">
            </el-table-column>
            <el-table-column
              prop="totalExpiredTask"
              align="center"
              sortable
              label="超时任务">
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pagination.pageSize"
            layout="prev, pager, next, sizes, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="dialog" v-show="dialogShow">
      <div class="dialog-mask" @click="dialogShow = false"></div>
      <div class="dialog-main">
        <div class="dialog-top"></div>
        <el-form ref="form" :model="form" label-width="124px">
          <el-form-item label="指派给：">
            <el-select v-model="form.region" size="small" placeholder="选择分组">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买条数：">
            <el-input v-model="form.num" size="small" placeholder="请输入条数"></el-input>
          </el-form-item>
          <el-form-item label="超时设置：">
            <el-date-picker
              v-model="form.date"
              type="date"
              size="small"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="已超时回收条数：">
            <el-input v-model="form.num1" size="small" placeholder="请输入条数"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-price">
          <div class="calculation clearfix" v-show="true">
            <div class="price-icon"></div>
            <div>价格方案计算中。。。</div>
          </div>
          <div class="programme clearfix" v-show="false">
            <div class="price-icon"></div>
            <div class="programme-font">
              <div>价格方案：（3000条-30条）*0.6元= 4000元</div>
              <div>分配方案： 小组一每人分配 99条</div>
            </div>
          </div>
        </div>
        <div class="save" @click="dialogShow = false">派单</div>
        <div class="number-tips">0.6/条</div>
        <div class="overtime-recovery">现有剩余37条</div>
      </div>
    </div>
  </div>
</template>

<script>
import { dispatchList } from '@/api/api'
export default {
  data () {
    return {
      input: '',
      options: [{
        value: '选项1',
        label: '人员分组'
      }, {
        value: '选项2',
        label: '任务'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '人员分组',
      value1: '任务',
      radio: '本日',
      date: [],
      tableData: [{
        distribution: '34562',
        name: '思林兰卡',
        phone: '34562',
        duration: '34小时56分',
        enterCustomer: '34562',
        aCustomer: '34562',
        transactionCustomer: '34562',
        overtime: '34562'
      }, {
        distribution: '34562',
        name: '托尔斯泰',
        phone: '34562',
        duration: '34小时56分',
        enterCustomer: '34562',
        aCustomer: '34562',
        transactionCustomer: '34562',
        overtime: '34562'
      }],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        region: '',
        num: '',
        date: [],
        num1: ''
      },
      dialogShow: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      dispatchList().then(res => {
        if (res.code === 0) {
          this.tableData = res.data.personTasks
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style lang="stylus" scoped>
.dispatch
  min-width 1160px
  overflow-y auto

.sale-data
  > div
    float left
    height 370px
    background-color #fff
    border-radius 2px
  > .data
    width 64.37%
  > .money
    width 33.67%
    margin-left 1.95%
    float right
    .main
      width 340px
      height 108px
      padding-top 50px
      margin 32px auto 35px
      background-color #f6f6f7
      border-radius 10px
      > div
        float left
      > .quota
        width 192px
        height 58px
        border-right 1px solid #e8e8e8
        > div:first-child
          font-size 14px
          color rgba(0, 0, 0, 0.45)
          text-align center
          line-height 22px
          margin-bottom 4px
        > div:last-child
          color rgba(0, 0, 0, 0.85)
          text-align center
          font-size 24px
          line-height 32px
          font-weight 600
      > .balance
        width 146px
        border-right none
        > div:first-child
          font-size 14px
          color rgba(0, 0, 0, 0.45)
          text-align center
          line-height 22px
          margin-bottom 4px
        > div:last-child
          color rgba(0, 0, 0, 0.85)
          text-align center
          font-size 24px
          line-height 32px
          font-weight 600
    .price
      width 340px
      height 58px
      background-color #4891fe
      border-radius 10px
      text-align center
      line-height 58px
      color #ffffff
      font-size 20px
      margin 0 auto
      cursor pointer

.title
  height 50px
  line-height 50px
  border-bottom 1px solid #f1f2f7
  font-size 14px
  color #a3a3a3
  padding-left 28px

.situation
  background-color #fff
  margin-top 12px
  padding-bottom 46px
  border-radius 2px
  .con
    padding 0 24px 0 32px
  .search
    margin-top 16px
    .left
      float left
      width 354px
      >>> .el-input
        width 272px
        margin-right 16px
    .right
      float right    
      width 576px
      >>> .el-select
        width 104px
        margin-left 16px 
      >>> .el-radio-group
        margin-left 8px  
      >>> .el-date-editor--daterange.el-input__inner
        width 209px
        margin-left 8px
  .tabel
    margin-top 18px
    >>> .el-table th
      background-color #fafafa 
  .page
    margin-top 90px
    text-align right
    >>> .el-pagination.is-background .el-pager li:not(.disabled).active
      background-color #e2e2e2
      color #595959
    >>> .el-pagination.is-background .btn-next, /deep/ .el-pagination.is-background .btn-prev, /deep/ .el-pagination.is-background .el-pager li  
      background-color #fff
      border 1px solid #d9d9d9
    >>> .el-pagination__jump
      margin-left 0
    >>> el-pagination__sizes
      margin-right 8px

.dialog
  width 100%
  height 100vh
  position absolute
  z-index 1000
  top 0
  left 0
  .dialog-mask
    width 100%
    height 100%
    position absolute
    z-index 1000
    left 0
    top 0
    background-color #000
    opacity 0.5
  .dialog-main
    width 432px
    height 250px
    padding-top 130px
    position absolute
    top calc(50% - 202px)
    left calc(50% - 216px)
    z-index 1001
    background url('../../assets/images/dispatch-dialog-bg.png') no-repeat
    background-size 100%
    .dialog-top
      width 185px
      height 125px
      position absolute
      top -26px
      left calc(50% - 92px)
      background url('../../assets/images/dispatch-dialog-top.png') no-repeat
    /deep/ .el-form
      padding-left 62px
      /deep/ .el-select, /deep/ .el-input
        width 130px
        line-height 32px
      /deep/ .el-form-item
        margin-bottom 8px
      /deep/ .el-form-item__label
        line-height 32px  
      /deep/ .el-form-item__content
        line-height 32px
    > .save
      width 340px
      height 48px
      line-height 48px
      color #ffffff
      text-align center
      border-radius 10px
      background-color #4891fe
      position absolute
      left calc(50% - 170px)
      bottom -24px
      font-size 18px
      cursor pointer
    > .number-tips
      position absolute
      left 324px
      bottom 183px
      color #ff0000
      font-size 14px
      line-height 20px
    > .overtime-recovery
      color #ff0000
      font-size 14px
      line-height 20px
      left 324px
      bottom 103px
      position absolute


.dialog-price
  margin-top 16px
  > .calculation
    font-size 14px
    color #ff0000
    line-height 26px
    padding-left 126px
    > div
      float left
    > .price-icon
      width 26px
      height 26px
      margin-right 10px
      background-color #ccc
  > .programme
    padding-left 62px
    > div
      float left
    > .price-icon
      width 26px
      height 26px
      background-color #ccc
    > .programme-font
      font-size 14px
      color #4891fe
      margin-left 10px
      font-weight 500
      > div
        line-height 20px   

</style>>

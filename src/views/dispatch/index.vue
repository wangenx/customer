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
            <div>{{ totalQuery.currentQuota }}/{{ totalQuery.totalQuota }}</div>
          </div>
          <div class="balance">
            <div>账户余额</div>
            <div>{{ totalQuery.restMoney }}万元</div>
          </div>
        </div>
        <div class="price" @click="dialogShow = true">派单 {{ totalQuery.perCastMoney }}元/条</div>
      </div>
    </div>
    <div class="situation">
      <div class="title">销售人员个人情况</div>
      <div class="con">
        <div class="search clearfix">
          <div class="left">
            <el-input v-model="searchData.key" size="small" placeholder="请输入内容"></el-input>
            <el-button size="small" type="primary" @click="getList()">查询</el-button>
          </div>
          <div class="right">
            <el-select v-model="searchData.groupId" size="small" placeholder="请选择分组">
              <el-option
                v-for="item in accountQuery"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
            <el-select v-model="searchData.taskId" size="small" placeholder="请选择任务">
              <el-option
                v-for="item in taskList"
                :key="item.taskId"
                :label="item.taskName"
                :value="item.taskId">
              </el-option>
            </el-select>
            <el-radio-group v-model="searchData.dateType" @change="searchData.date = []" size="small">
              <el-radio-button label="1">本日</el-radio-button>
              <el-radio-button label="2">本月</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="searchData.date"
              @change="searchData.dateType = ''"
              type="daterange"
              range-separator="-"
              size="small"
              value-format="yy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="tabel">
          <el-table
            :data="tableData"
            @sort-change="sort"
            :default-sort = "{prop: 'date', order: 'descending'}"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="账户名">
            </el-table-column>
            <el-table-column
              prop="totalClue"
              align="center"
              sortable="custom"
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
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="指派给：" prop="groupId">
            <el-select v-model="form.groupId" size="small" placeholder="请选择分组">
              <el-option
                v-for="item in accountQuery"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买条数：" prop="purchaseNum">
            <el-input v-model="form.purchaseNum" @change="changePurchaseNum" size="small" placeholder="请输入条数"></el-input>
          </el-form-item>
          <el-form-item label="超时设置：" prop="expirationDate">
            <el-date-picker
              v-model="form.expirationDate"
              type="date"
              size="small"
              value-format="yy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="已超时回收条数：" prop="expirationNum">
            <el-input v-model="form.expirationNum" @change="changePurchaseNum" size="small" placeholder="请输入条数"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-price">
          <div class="calculation clearfix" v-show="isCalculation">
            <div class="price-icon"></div>
            <div>价格方案计算中。。。</div>
          </div>
          <div class="programme clearfix" v-show="!isCalculation">
            <div class="price-icon"></div>
            <div class="programme-font">
              <div>价格方案：（3000条-30条）*0.6元= 4000元</div>
              <div>分配方案： 小组一每人分配 99条</div>
            </div>
          </div>
        </div>
        <div class="save" @click="taskSubmit('ruleForm')">派单</div>
        <div class="number-tips">{{ totalQuery.perCastMoney }}/条</div>
        <div class="overtime-recovery">现有剩余{{ taskExpirationNum }}条</div>
      </div>
    </div>
  </div>
</template>

<script>
import { dispatchList, postTotalQuery, postAccountQuery, postTaskQuery, postTaskExpiration, postTaskCreate } from '@/api/api'
export default {
  data () {
    var validatePurchaseNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入购买条数'))
      } else {
        callback()
      }
    }
    var validateGroupId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择分组'))
      } else {
        callback()
      }
    }

    var validateExpirationDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请设置超时时间'))
      } else {
        callback()
      }
    }

    var validateExpirationNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入超时回收条数'))
      } else {
        callback()
      }
    }
    return {
      totalQuery: {}, // 额度
      searchData: {
        key: '',
        groupId: '',
        taskId: '',
        dateType: '',
        pageNo: '',
        date: [],
        sortStr: '',
        sortType: ''
      },
      accountQuery: [], // 分组list
      taskList: [], // 任务list
      tableData: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        groupId: '',
        purchaseNum: '',
        expirationDate: '',
        expirationNum: ''
      },
      rules: {
        groupId: [{ validator: validateGroupId, trigger: 'change' }],
        purchaseNum: [{  validator: validatePurchaseNum, trigger: 'blur' }],
        expirationDate: [{validator: validateExpirationDate, trigger: 'change' }],
        expirationNum: [{ validator: validateExpirationNum, trigger: 'blur' }]
      },
      dialogShow: false,
      taskExpirationNum: 0,
      isCalculation: true
    }
  },
  created () {
    this.totalQueryData()
    this.getList()
    postAccountQuery().then(res => {
      if (res.code === 0) {
        this.accountQuery = res.data.groups
      }
    })
    postTaskQuery().then(res => {
      if (res.code === 0) {
        this.taskList = res.data.subTasks
      }
    })
    postTaskExpiration().then(res => {
      if (res.code === 0) {
        this.taskExpirationNum =  res.data.totalCount
      }
    })
  },
  methods: {
    // 派单提交
    taskSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            groupId: this.form.groupId,
            purchaseNum: this.form.purchaseNum,
            expirationDate: this.form.expirationDate,
            expirationNum: this.form.expirationNum
          }
          postTaskCreate(params).then(res => {
            if (res.code === 0) {
              this.$message.success('派单成功')
              this.dialogShow = false
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    // 是否显示计算
    changePurchaseNum () {
      if (this.form.purchaseNum !== '' && this.form.expirationNum !== '') {
        this.isCalculation = false
      } else {
        this.isCalculation = true
      }
    },
    // 排序
    sort(row) {
      this.searchData.sortStr = row.prop
      this.searchData.sortType = row.order
      this.getList()
    },
    getList () {
      const params = {
        key: this.searchData.key,
        groupId: this.searchData.groupId,
        taskId: this.searchData.taskId,
        dateType: this.searchData.dateType,
        beginTime: this.searchData.date[0],
        endTime: this.searchData.date[1],
        sortStr: this.searchData.sortStr,
        sortType: this.searchData.sortType,
        pageNo: this.pagination.page,
        pageSize: this.pagination.pageSize
      }
      dispatchList(params).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.personTasks
          this.pagination.total = Number(res.totalCount)
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getList()
    },
    // 获取额度
    totalQueryData () {
      postTotalQuery().then(res => {
        if (res.code === 0) {
          this.totalQuery = res.data
        }
      })
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
    height 300px
    padding-top 130px
    position absolute
    top calc(50% - 202px)
    left calc(50% - 216px)
    z-index 1001
    background url('../../assets/images/dispatch-dialog-bg.png') no-repeat
    background-size 100%
    background-color #fff
    border-radius 10px

    .dialog-top
      width 185px
      height 125px
      position absolute
      top -26px
      left calc(50% - 92px)
      background url('../../assets/images/dispatch-dialog-top.png') no-repeat
    /deep/ .el-form
      padding-left 36px
      /deep/ .el-select, /deep/ .el-input
        width 130px
        line-height 32px
      // /deep/ .el-form-item
      //   margin-bottom 8px
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
      left 312px
      bottom 163px
      color #ff0000
      font-size 14px
      line-height 20px
    > .overtime-recovery
      color #ff0000
      font-size 14px
      line-height 20px
      left 312px
      bottom 106px
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

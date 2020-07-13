<template>
  <div class="rule">
    <div class="title">
      账号管理
    </div>
    <div class="rule-head clearfix">
      <div class="search">
        <el-input v-model="ruleInput" size="small" placeholder="请输入内容"></el-input>
        <el-button size="small" type="primary">查询</el-button>
      </div>
      <div class="operation">
        <el-button size="small" type="primary" @click="addRule"><i class="el-icon-plus"></i>新建规则</el-button>
      </div>
    </div>
    <div class="tabel">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="订单名称"
          width="120">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          prop="condition"
          label="条件"
          width="240"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="distributor"
          label="分配人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div class="operation clearfix">
              <span @click="editRule(scope.row.id)">修改</span>
              <span></span>
              <el-popover
                v-model="scope.row.isDeleteRule"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-rule">
                  <el-button @click="deleteRule(scope.row.id, scope.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="scope.row.isDeleteRule = false" size="small" type="info" plain>取消</el-button>
                </div>
                <span slot="reference">删除</span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <div class="select-all">
        <el-checkbox size="small" v-model="selectAll" label="全选" border></el-checkbox>
        <el-button size="small" @click="deleteDialogVisible = true">删除</el-button>
      </div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.page"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="prev, pager, next, sizes, jumper"
        :total="400">
      </el-pagination>
    </div>
    <div class="dialog">
      <el-dialog
        title="删除"
        :visible.sync="deleteDialogVisible"
        width="480px"
        :before-close="handleClosDelete">
        <div class="dialog-line"></div>
        <span>是否删除选中规则？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="deleteDialogVisible = false">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="ruleFormTitle"
        :visible.sync="newRuleDialogVisible"
        width="480px"
        :before-close="handleClose">
        <div class="dialog-line"></div>
        <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入规则名称"></el-input>
          </el-form-item>
          <el-form-item label="条件">
            <div class="condition">
              <el-select v-model="ruleForm.address" placeholder="请选择">
                <el-option label="城市" value="chengshi"></el-option>
                <el-option label="地区" value="diqu"></el-option>
              </el-select>
              <el-select v-model="ruleForm.size" placeholder="请选择">
                <el-option label="等于" value="dengyu"></el-option>
                <el-option label="小于" value="xiaoyu"></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.city"
                multiple
                filterable
                allow-create
                default-first-option>
                <el-option
                  v-for="item in optionsCity"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span>删除</span>
            </div>
            <div class="condition">
              <el-select v-model="ruleForm.address" placeholder="请选择">
                <el-option label="城市" value="chengshi"></el-option>
                <el-option label="地区" value="diqu"></el-option>
              </el-select>
              <el-select v-model="ruleForm.size" placeholder="请选择">
                <el-option label="等于" value="dengyu"></el-option>
                <el-option label="小于" value="xiaoyu"></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.city"
                multiple
                filterable
                allow-create
                default-first-option>
                <el-option
                  v-for="item in optionsCity"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span>删除</span>
            </div>
            <span class="addCondition"><i class="el-icon-plus"></i>新增</span>
          </el-form-item>
          <el-form-item label="分配给" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option label="分组一" value="shanghai"></el-option>
              <el-option label="分组二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newRuleDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="newRuleDialogVisible = false">{{ butoonText }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleInput: '',
      tableData: [{
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;',
        id: 1,
        isDeleteRule: false
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;',
        id: 2,
        isDeleteRule: false
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;',
        id: 3,
        isDeleteRule: false
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;',
        id: 4,
        isDeleteRule: false
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;',
        id: 4,
        isDeleteRule: false
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;',
        id: 5,
        isDeleteRule: false
      }],
      selectAll: false, // 下边全选按钮
      deleteDialogVisible: false,
      page: {
        page: 5
      },
      ruleFormTitle: '新建规则',
      butoonText: '添加',
      newRuleDialogVisible: false,
      ruleForm: {
        name: '',
        remarks: '',
        region: '',
        city: ['shanghai'],
        address: ''
      },
      rules: {
        name: [
           { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        remarks: [
           { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        region: [
           { required: true, message: '请选择分配给', trigger: 'change' }
        ]
      },
      optionsCity: [{
        value: 'shanghai',
        label: '上海'
      }, {
        value: 'beijing',
        label: '北京'
      }, {
        value: 'shenzhen',
        label: '深圳'
      }]
    }
  },
  methods: {
    addRule () {
      this.newRuleDialogVisible = true
      this.ruleFormTitle = '新建规则',
      this.butoonText = '添加'
    },
    editRule (id) {
      console.log(id)
      this.newRuleDialogVisible = true
      this.ruleFormTitle = '修改规则'
      this.butoonText = '提交'
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 关闭删除弹窗
    handleClosDelete () {
      this.deleteDialogVisible = false
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 关闭新建规则弹窗
    handleClose () {
      this.newRuleDialogVisible = false
    },
    // 删除规则气泡
    deleteRule (id, row) {
      console.log(id)
      row.isDeleteRule = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.rule
  min-width 1160px
  overflow-x auto
  min-height 100%
  background-color #fff

.title
  height 50px
  line-height 50px
  border-bottom 1px solid #f1f2f7
  font-size 14px
  color #a3a3a3
  padding-left 32px

.rule-head
  padding 0 40px 0 32px
  margin-top 16px
  .search
    float left
    /deep/ .el-input
      width 272px
      margin-right 16px
  .operation
    float right
    /deep/ i
      margin-right 9px

.tabel
  padding 18px 76px 0 32px

.operation
  > span
    color #1890FF
    font-size 14px
    float left
  > span:first-child
    margin-right 8px
    cursor pointer
  > span:nth-child(2)
    display inline-block
    width 1px
    height 14px
    background-color #e9e9e9
    margin-right 8px
    margin-top 4px
  > span:last-child
    cursor pointer

.delete-rule
  text-align center
  /deep/ .el-button
    padding 6px 18px

.page
  margin-top 90px
  text-align right
  padding 0 70px 26px 40px
  >>> .el-pagination.is-background .el-pager li:not(.disabled).active
    background-color #e2e2e2
    color #595959
  >>> .el-pagination.is-background .btn-next, /deep/ .el-pagination.is-background .btn-prev, /deep/ .el-pagination.is-background .el-pager li  
    background-color #fff
    border 1px solid #d9d9d9
  >>> .el-pagination__jump
    margin-left 0
  >>> .el-pagination__sizes
    margin-right 8px
  .select-all
    float left
    /deep/ .el-checkbox
      padding 5px 25px 5px 17px
    /deep/ .el-button
      margin-left 8px
      padding 9px 32px

.dialog
  /deep/ .el-dialog__header
    padding 16px
    .el-dialog__title
      font-size 16px
  /deep/ .el-dialog__body
    padding 0px 16px 22px
  /deep/ .el-dialog__footer
    padding 0 16px 16px
  /deep/ .el-input, /deep/ .el-select
    width 294px
  /deep/ .el-form-item--small.el-form-item
    margin-bottom 16px
  /deep/ .el-dialog
    border-radius 4px

.dialog-line
  height 1px
  margin-bottom 16px
  background-color #d9d9d9

.condition
  margin-bottom 8px
  /deep/ .el-select
    width 86px
    margin-right 8px
    .el-input
      width 100%
    .el-tag
      background-color #d8d8d8
      color #454545
      font-size 12px
    .el-tag__close.el-icon-close
      background-color #d8d8d8
      color #454545
  /deep/ .el-select:nth-child(3)
    width 172px
  span
    font-size 14px
    color #1890FF
    cursor pointer

.addCondition
  color #1890FF
  font-size 14px
  line-height 22px
  cursor pointer
</style>>

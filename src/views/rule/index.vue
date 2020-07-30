<template>
  <div class="rule">
    <div class="title">
      客户列表
    </div>
    <div class="rule-head clearfix">
      <div class="search">
        <el-input v-model="key" size="small" placeholder="请输入内容"></el-input>
        <el-button size="small" @click="searchList" type="primary">查询</el-button>
      </div>
      <div class="operation">
        <el-button size="small" type="primary" @click="addRule"><i class="el-icon-plus"></i>新建规则</el-button>
      </div>
    </div>
    <div class="tabel">
      <el-table
        ref="multipleTable"
        v-loading="ruleLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="规则名称"
          show-overflow-tooltip
          width="120">
          <template slot-scope="scope">{{ scope.row.ruleName }}</template>
        </el-table-column>
        <el-table-column
          prop="condition"
          label="条件"
          width="240"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.conditions" :key="index">
              <div>{{ item.conditionName }}&nbsp;{{ item.conditionRule }}&nbsp;{{ item.conditionVal }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="分配人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div class="operation clearfix">
              <span @click="editRule(scope.row)">修改</span>
              <span></span>
              <el-popover
                v-model="scope.row.isDeleteRule"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-rule">
                  <el-button @click="deleteRule(scope.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="scope.row.isDeleteRule = false" size="small" type="info" plain>取消</el-button>
                </div>
                <span slot="reference">删除</span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page clearfix" style="padding-bottom: 40px;">
      <div class="select-all">
        <el-checkbox size="small" v-model="selectAll" @change="selectRules" label="全选" border></el-checkbox>
        <el-button size="small" @click="DeleteRules">删除</el-button>
      </div>
      <el-pagination
        v-show="pagination.total > pagination.pageSize"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        layout="prev, pager, next, sizes, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <div class="dialog">
      <el-dialog
        title="删除"
        :close-on-click-modal="false"
        :visible.sync="deleteDialogVisible"
        width="480px"
        :before-close="handleClosDelete">
        <div class="dialog-line"></div>
        <span>是否删除选中规则？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="deteleRuleAll">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="ruleFormTitle"
        :close-on-click-modal="false"
        :visible.sync="newRuleDialogVisible"
        width="480px"
        :before-close="handleClose">
        <div class="dialog-line"></div>
        <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="ruleForm.ruleName" placeholder="请输入规则名称"></el-input>
          </el-form-item>
          <el-form-item label="条件">
            <div v-for="(item, index) in ruleForm.conditions" :key="index" class="condition">
              <el-select v-model="item.conditionName" placeholder="请选择">
                <el-option label="省市" value="省市"></el-option>
              </el-select>
              <el-select v-model="item.conditionRule" placeholder="请选择">
                <el-option label="等于" value="等于"></el-option>
              </el-select>
              <el-select
                v-model="item.conditionVal"
                placeholder="请选择城市">
                <el-option
                  v-for="e in optionsCity"
                  :key="e.value"
                  :label="e.label"
                  :value="e.value">
                </el-option>
              </el-select>
              <span @click="deleteConditions(item)">删除</span>
            </div>
            <span class="addCondition" @click="addConditions"><i class="el-icon-plus"></i>新增</span>
          </el-form-item>
          <el-form-item label="分配给" prop="chargeGroupId">
            <el-select v-model="ruleForm.chargeGroupId" filterable placeholder="请选择分组">
              <el-option
                v-for="item in groupArr"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newRuleDialogVisible = false">取消</el-button>
          <el-button :disabled="isSubmit" size="small" type="primary" @click="newRule('ruleForm')">{{ butoonText }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { postAccountQuery, postRuleCreate, postRuleQuery, postRuleEdit, postRuleDelete } from '@/api/api'
export default {
  data () {
    return {
      key: '',
      tableData: [],
      selectAll: false, // 下边全选按钮
      deleteDialogVisible: false,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      ruleFormTitle: '新建规则',
      butoonText: '添加',
      newRuleDialogVisible: false,
      ruleForm: {
        ruleId: '',
        ruleName: '',
        chargeGroupId: '',
        conditions: [
          {
            conditionName: '省市',
            conditionRule: '',
            conditionVal: ''
          }
        ],
      },
      groupArr: [], // 下拉框分组列表
      rules: {
        ruleName: [
           { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        chargeGroupId: [
           { required: true, message: '请输选择分组', trigger: 'change' }
        ]
      },
      deleteRuleArr: [],
      optionsCity: [
        {
        value: '辽宁',
        label: '辽宁'
        },
        {
        value: '吉林',
        label: '吉林'
        },
        {
          value: '黑龙江',
          label: '黑龙江'
        },
        {
        value: '河北',
        label: '河北'
        },
        {
        value: '山西',
        label: '山西'
        },
        {
          value: '陕西',
          label: '陕西'
        },

        {
        value: '甘肃',
        label: '甘肃'
        },
        {
        value: '青海',
        label: '青海'
        },
        {
          value: '山东',
          label: '山东'
        },
        {
        value: '安徽',
        label: '安徽'
        },
        {
        value: '江苏',
        label: '江苏'
        },
        {
          value: '浙江',
          label: '浙江'
        },
        {
        value: '河南',
        label: '河南'
        },
        {
        value: '湖北',
        label: '湖北'
        },
        {
          value: '湖南',
          label: '湖南'
        },
        {
        value: '江西',
        label: '江西'
        },
        {
        value: '台湾',
        label: '台湾'
        },
        {
          value: '福建',
          label: '福建'
        },
        {
        value: '云南',
        label: '云南'
        },
        {
        value: '海南',
        label: '海南'
        },
        {
          value: '四川',
          label: '四川'
        },
        {
        value: '贵州',
        label: '贵州'
        },
        {
        value: '广东',
        label: '广东'
        },
        {
          value: '内蒙古',
          label: '内蒙古'
        },
        {
        value: '新疆',
        label: '新疆'
        },
        {
        value: '广西',
        label: '广西'
        },
        {
          value: '西藏',
          label: '西藏'
        },
        {
        value: '北京',
        label: '北京'
        },
        {
        value: '上海',
        label: '上海'
        },
        {
          value: '天津',
          label: '天津'
        },
        {
        value: '重庆',
        label: '重庆'
        },
        {
        value: '香港',
        label: '香港'
        },
        {
          value: '澳门',
          label: '澳门'
        }
      ],
      ruleLoading: false,
      isSubmit: false
    }
  },
  created () {
    this.getRuleList()
    postAccountQuery({}).then(res => {
      if (res.code === 200) {
        this.groupArr = res.data.groups
      }
    })
  },
  methods: {
    // 点击搜索按钮
    searchList () {
      this.pagination.page = 1
      this.pagination.pageSize = 10
      this.getRuleList()
    },
    // 获取规则列表
    getRuleList () {
      const params = {
        key: this.key,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.page
      }
      this.ruleLoading = true
      postRuleQuery(params).then(res => {
        if (res.code === 200) {
          res.data.rules.forEach(e => {
            e.isDeleteRule = false
          })
          this.tableData = res.data.rules
          this.pagination.total = Number(res.data.totalCount)
          this.ruleLoading = false
        } else {
          this.ruleLoading = false
        }
      })
    },
    // 新增新建账号条件
    addConditions () {
      this.ruleForm.conditions.push({
        conditionName: '省市',
        conditionRule: '',
        conditionVal: ''
      })
    },
    // 删除新增账号条件
    deleteConditions(item) {
      if (this.ruleForm.conditions.length === 1) return this.$message.error('至少保留一个条件')
      this.ruleForm.conditions.splice(this.ruleForm.conditions.indexOf(item), 1)
    },
    addRule () {
      this.ruleForm.ruleId = ''
      this.ruleForm.ruleName = ''
      this.ruleForm.chargeGroupId = ''
      this.ruleForm.conditions = [
        {
          conditionName: '省市',
          conditionRule: '',
          conditionVal: ''
        }
      ]
      this.newRuleDialogVisible = true
      this.ruleFormTitle = '新建规则',
      this.butoonText = '添加'
    },
    // 新建条件提交
    newRule (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.ruleForm.conditions.length; i++) {
            if (this.ruleForm.conditions[i].conditionRule === '' || this.ruleForm.conditions[i].conditionVal === '') {
              return this.$message.error('请填写条件')
            }
          }
          this.isSubmit = true
          if (this.ruleFormTitle === '新建规则') {
            const params = {
              ruleName: this.ruleForm.ruleName,
              chargeGroupId: this.ruleForm.chargeGroupId,
              conditions: this.ruleForm.conditions
            }
            postRuleCreate(params).then(res => {
              if (res.code === 200) {
                this.$message.success('新建规则成功')
                this.getRuleList()
                this.newRuleDialogVisible = false
                this.isSubmit = false
              } else {
                this.isSubmit = false
              }
            })
          } else if (this.ruleFormTitle === '修改规则') {
            const params = {
              ruleId: this.ruleForm.ruleId,
              ruleName: this.ruleForm.ruleName,
              chargeGroupId: this.ruleForm.chargeGroupId,
              conditions: this.ruleForm.conditions
            }
            postRuleEdit(params).then(res => {
              if (res.code === 200) {
                this.$message.success('修改规则成功')
                this.newRuleDialogVisible = false
                this.isSubmit = false
                this.getRuleList()
              } else {
                this.isSubmit = false
              }
            })
          }
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editRule (row) {
      this.ruleForm.ruleId = row.ruleId
      this.ruleForm.ruleName = row.ruleName
      this.ruleForm.chargeGroupId = row.groupId
      let conditions = JSON.stringify(row.conditions)
      this.ruleForm.conditions = JSON.parse(conditions)
      this.newRuleDialogVisible = true
      this.ruleFormTitle = '修改规则'
      this.butoonText = '提交'
    },
    // 表格全选按钮
    handleSelectionChange (val) {
      this.deleteRuleArr = val
      this.deleteRuleArr.length === this.tableData.length ? this.selectAll = true : this.selectAll = false
    },
    // 关闭删除弹窗
    handleClosDelete () {
      this.deleteDialogVisible = false
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getRuleList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getRuleList()
    },
    // 关闭新建规则弹窗
    handleClose () {
      this.newRuleDialogVisible = false
    },
    // 删除规则气泡
    deleteRule (row) {
      postRuleDelete([row.ruleId]).then(res => {
        if (res.code === 200) {
          this.$message.success('删除规则成功')
          this.getRuleList()
        }
      })
    },
    // 底部全选按钮
    selectRules () {
      if (this.selectAll) {
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
        this.deleteRuleArr = this.tableData
      } else {
        this.$refs.multipleTable.clearSelection();
        this.deleteRuleArr = []
      }
    },
    // 删除多个规则
    DeleteRules () {
      if (this.deleteRuleArr.length > 0) {
        this.deleteDialogVisible = true
        // const params = this.deleteRuleArr.map(e => {
        //   return e.ruleId
        // })
        // postRuleDelete(params).then(res => {
        //   if (res.code === 200) {
        //     this.$message.success('删除规则成功')
        //     this.getRuleList()
        //     this.selectAll = false
        //     this.deleteRuleArr = []
        //   }
        // })
      } else {
        this.$message.warning('请选择规则')
      }
    },
    deteleRuleAll () {
      const params = this.deleteRuleArr.map(e => {
        return e.ruleId
      })
      postRuleDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除规则成功')
          this.getRuleList()
          this.selectAll = false
          this.deleteDialogVisible = false
          this.deleteRuleArr = []
        }
      })
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

<template>
  <div class="cusmoter">
    <div class="title">
      客户管理
    </div>
    <div class="cusmoter-head clearfix">
      <div class="search">
        <el-input v-model="key" size="small" placeholder="请输入内容"></el-input>
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-select v-model="groupId" filterable size="small" placeholder="筛选分组">
          <el-option
            v-for="item in groupArr"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId">
          </el-option>
        </el-select>
      </div>
      <div class="operation">
        <el-button size="small" type="primary" @click="addCusmoter"><i class="el-icon-plus"></i>新建客户</el-button>
        <el-button size="small" type="primary" @click="search(1)"><i class="el-icon-refresh"></i></el-button>
      </div>
    </div>
    <div class="tabel">
      <el-table
        ref="multipleTable"
        :data="tableData"
        v-loading="customerLoading"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户姓名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="客户分级">
          <template slot-scope="scope">{{ scope.row.customerLevel }}</template>
        </el-table-column>
        <el-table-column
          prop="customerPhone"
          label="手机号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="公司名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="customerPost"
          label="客户职位"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="customerTagList"
          label="客户标签"
          min-width="258">
          <template slot-scope="scope">
            <span class="tag">
              <el-tag size="small" type="info" v-for="(item, index) in scope.row.customerTagList" :key="index">{{ item }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="managerName"
          label="所属人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220">
          <template slot-scope="scope">
            <div class="operation clearfix">
              <span @click="distribution(scope.row)">分配</span>
              <span></span>
              <span @click="editCusmoter(scope.row)">修改</span>
              <span></span>
              <el-popover
                v-model="scope.row.isDeleteCusmoter"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-cusmoter">
                  <el-button @click="deleteCustomer(scope.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="scope.row.isDeleteCusmoter = false" size="small" type="info" plain>取消</el-button>
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
        <el-checkbox size="small" v-model="selectAll" @change="selectAllList" label="全选" border></el-checkbox>
        <el-button size="small" @click="distributionAll">批量分配</el-button>
        <el-button size="small" @click="deleteAllDialog">批量删除</el-button>
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
        :visible.sync="deleteDialogVisible"
        :close-on-click-modal="false"
        width="480px"
        :before-close="handleClosDelete">
        <div class="dialog-line"></div>
        <span>是否删除选中客户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="deleteCustomerAll">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="cusmoterFormTitle"
        :visible.sync="newCusmoterDialogVisible"
        :close-on-click-modal="false"
        width="480px"
        :before-close="handleClose">
        <div class="dialog-line"></div>
        <el-form :model="cusmoterForm" :rules="rules" v-if="newCusmoterDialogVisible" size="small" ref="cusmoterForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="客户姓名" prop="customName">
            <el-input v-model="cusmoterForm.customName" placeholder="请输入客户姓名"></el-input>
          </el-form-item>
          <el-form-item label="客户分级" prop="level">
            <el-select v-model="cusmoterForm.level" placeholder="请选择">
              <el-option
                v-for="item in customerLevelList"
                :key="item.levelName"
                :label="item.levelName"
                :value="item.levelName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="customPhone">
            <el-input v-model="cusmoterForm.customPhone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="cusmoterForm.companyName" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="客户职位" prop="customPost">
            <el-select v-model="cusmoterForm.customPost" filterable placeholder="请选择">
              <el-option
                v-for="item in postsList"
                :key="item.postId"
                :label="item.postName"
                :value="item.postName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户标签">
            <div class="tag-arr">
              <el-checkbox-group v-model="cusmoterForm.customTags" size="small">
                <el-checkbox size="small" v-for="tag in tagList" :label="tag" :key="tag">{{ tag }}<i class="el-icon-check"></i></el-checkbox>
              </el-checkbox-group>
              <div class="add-tag" @click="isAdd ? isAdd = false : isAdd = true"><i class="el-icon-plus"></i>新增标签</div>
              <div class="input-tag" v-show="!isAdd">
                <el-input size="small" v-model="addTag"></el-input>
                <el-button size="small" @click="newTag" type="primary">新增</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="所属人" v-if="cusmoterFormTitle === '新建客户'">
            <el-select v-model="cusmoterForm.chargeManId" filterable placeholder="请选择">
              <el-option
                v-for="item in accountList"
                :key="item.kcSalesId"
                :label="item.realName"
                :value="item.kcSalesId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newCusmoterDialogVisible = false">取消</el-button>
          <el-button :disabled="isSunmit" size="small" type="primary" @click="newCustomer('cusmoterForm')">{{ butoonText }}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="分配至"
        :visible.sync="distributionDialogVisible"
        :close-on-click-modal="false"
        width="480px"
        :before-close="handleClosDistribution">
        <div class="dialog-line"></div>
        <el-form :model="distributionRuleForm" :rules="distributionRules" v-if="distributionDialogVisible" size="small" ref="distributionRuleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="所属人" prop="chargeManId">
            <el-select v-model="distributionRuleForm.chargeManId" filterable placeholder="请选择">
              <el-option
                v-for="item in accountList"
                :key="item.kcSalesId"
                :label="item.realName"
                :value="item.kcSalesId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="distributionDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="distributionSave">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { postAccountQuery, postCustomerQuery, postCommonLevel, postCommonTag, postCommonTagAdd, postAccountAllList, postCommonCreate, postCustomEdit, postCustomDelete, postCustomBtachGroup, postCommonPost } from '@/api/api'
export default {
  data () {
    return {
      key: '',
      groupId: '',
      groupArr: [], // 分组下拉框列表
      tableData: [],
      selectAll: false, // 下边全选按钮
      deleteDialogVisible: false,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      cusmoterFormTitle: '新建客户',
      butoonText: '添加',
      newCusmoterDialogVisible: false,
      cusmoterForm: {
        customId: '',
        customName: '',
        remarks: '',
        chargeManId: '',
        level: '',
        customPhone: '',
        customPost: '',
        companyName: '',
        customTags: []
      },
      addTag: '',
      rules: {
        level: [
           { required: true, message: '请选择客户分级', trigger: 'change' }
        ],
        remarks: [
           { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        customName: [
           { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        customPhone: [
           { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        companyName: [
           { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        customPost: [
           { required: true, message: '请选择客户职位', trigger: 'change' }
        ],
        customTags: [
            { type: 'array', required: true, message: '请至少选择一个客户标签', trigger: 'change' }
          ],
        chargeManId: [
           { required: true, message: '请选择所属人', trigger: 'change' }
        ]
      },
      tagOptions: ['有意向', '潜在客户', '战略投资', 'B轮融资', '战略'],
      isAdd: true,
      distributionDialogVisible: false,
      distributionRuleForm: {
        chargeManId: ''
      },
      distributionRules: {
        chargeManId: [
           { required: true, message: '请选择所属人', trigger: 'change' }
        ]
      },

      customerLevelList: [],
      tagList: [],
      accountList: [],
      deleteCustomerArr: [],
      distributionCustomId: '',
      customerLoading: false,
      isSunmit: false,
      postsList: []
    }
  },
  created () {
    this.getCustomerList()
    // 获取客户职位
    postCommonPost().then(res => {
      if (res.code === 200) {
        console.log(res)
        this.postsList = res.data.posts
      }
    })
    // 获取全部分组
    postAccountQuery({}).then(res => {
      if (res.code === 200) {
        this.groupArr = [
          {
            groupId: '',
            groupName: '全部分组'
          }
        ]
        this.groupArr = [...this.groupArr, ...res.data.groups]
      }
    })
    postCommonLevel({}).then(res => {
      if (res.code === 200) {
        this.customerLevelList = res.data.levels
      }
    })
    postCommonTag({}).then(res => {
      if (res.code === 200) {
        this.tagList = res.data.tags.map(e => {
          return e.tagName
        })
      }
    })
    postAccountAllList({}).then(res => {
      if (res.code === 200) {
        this.accountList = res.data.accounts
      }
    })
  },
  methods: {
    // 全选底部按钮
    selectAllList () {
      if (this.selectAll) {
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
        this.deleteCustomerArr = this.tableData
      } else {
        this.$refs.multipleTable.clearSelection();
        this.deleteCustomerArr = []
      }
    },
    // 新建标签
    newTag () {
      if (this.addTag === '') return this.$message.warning('请输入标签名')
      postCommonTagAdd(this.addTag).then(res => {
        if (res.code === 200) {
          this.tagList.push(this.addTag)
          this.$message.success('添加标签成功')
        }
      })
    },
    // 点击查询按钮
    search (num) {
      if (num === 1) {
        this.key = '',
        this.groupId = ''
      }
      this.pagination.page = 1
      this.pagination.pageSize = 10
      this.getCustomerList()
    },
    // 获取客户列表
    getCustomerList () {
      const params = {
        key: this.key,
        pageNo: this.pagination.page,
        pageSize: this.pagination.pageSize,
        groupId: this.groupId
      }
      this.customerLoading = true
      postCustomerQuery(params).then(res => {
        if (res.code === 200) {
          if (res.data.customs !== null) {
            res.data.customs.forEach(e => {
              e.isDeleteCusmoter = false
              if (e.customerTagList[0] === '') {
                e.customerTagList = []
              }
            })
            this.tableData = res.data.customs
            this.pagination.total = Number(res.data.totalCount)
          } else {
            this.tableData = []
          }
          this.customerLoading = false
        } else {
          this.customerLoading = false
        }
      })
    },
    addCusmoter () {
      this.cusmoterForm.customId = ''
      this.cusmoterForm.level = ''
      this.cusmoterForm.customName = ''
      this.cusmoterForm.companyName = ''
      this.cusmoterForm.customPhone = ''
      this.cusmoterForm.customPost = ''
      this.cusmoterForm.customTags = []
      this.cusmoterForm.chargeManId = ''
      this.isAdd = false
      this.addTag = ''
      this.newCusmoterDialogVisible = true
      this.cusmoterFormTitle = '新建客户',
      this.butoonText = '添加'
    },
    // 新建客户
    newCustomer (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.cusmoterFormTitle === '新建客户') {
            const params = {
              level: this.cusmoterForm.level,
              customName: this.cusmoterForm.customName,
              companyName: this.cusmoterForm.companyName,
              customPhone: this.cusmoterForm.customPhone,
              customPost: this.cusmoterForm.customPost,
              customTags: this.cusmoterForm.customTags,
              chargeManId: this.cusmoterForm.chargeManId
            }
            this.isSunmit = true
            postCommonCreate(params).then(res => {
              if (res.code === 200) {
                this.$message.success('新建客户成功')
                this.getCustomerList()
                this.newCusmoterDialogVisible = false
                this.isSunmit = false
              } else {
                this.isSunmit = false
              }
            })
          } else if (this.cusmoterFormTitle === '修改客户') {
            const params = {
              customerId: this.cusmoterForm.customerId,
              chargeManId:this.cusmoterForm.chargeManId,
              level: this.cusmoterForm.level,
              customName: this.cusmoterForm.customName,
              companyName: this.cusmoterForm.companyName,
              customPhone: this.cusmoterForm.customPhone,
              customPost: this.cusmoterForm.customPost,
              customTags: this.cusmoterForm.customTags,
            }
            this.isSunmit = true
            postCustomEdit(params).then(res => {
              if (res.code === 200) {
                this.$message.success('修改客户成功')
                this.getCustomerList()
                this.newCusmoterDialogVisible = false
                this.isSunmit = false
              } else {
                this.isSunmit = false
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editCusmoter (row) {
      this.cusmoterForm.customerId = row.customerId
      this.cusmoterForm.chargeManId = row.managerId
      this.cusmoterForm.level = row.customerLevel
      this.cusmoterForm.customName = row.customerName
      this.cusmoterForm.companyName = row.companyName
      this.cusmoterForm.customPhone = row.customerPhone
      this.cusmoterForm.customPost = row.customerPost
      this.cusmoterForm.customTags = row.customerTagList
      this.isAdd = false
      this.addTag = ''
      this.newCusmoterDialogVisible = true
      this.cusmoterFormTitle = '修改客户'
      this.butoonText = '提交'
    },
    handleSelectionChange (val) {
      this.deleteCustomerArr = val
      this.deleteCustomerArr.length === this.tableData.length ? this.selectAll = true : this.selectAll = false
    },
    // 关闭分配弹窗
    handleClosDistribution () {
      this.distributionDialogVisible = false
    },
    // 关闭删除弹窗
    handleClosDelete () {
      this.deleteDialogVisible = false
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getCustomerList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getCustomerList()
    },
    // 关闭新客户则弹窗
    handleClose () {
      this.newCusmoterDialogVisible = false
    },
    // 删除客户气泡
    deleteCustomer (row) {
      const params = [row.customerId]
      postCustomDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除客户成功')
          this.getCustomerList()
          row.isDeleteCusmoter = false
        }
      })
    },
    // 删除选中客户
    deleteAllDialog () {
      if (this.deleteCustomerArr.length === 0) return this.$message.warning('请选择客户')
      this.deleteDialogVisible = true
    },
    deleteCustomerAll () {
      const params = this.deleteCustomerArr.map(e => {
        return e.customerId
      })
      postCustomDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除客户成功')
          this.getCustomerList()
          this.deleteDialogVisible = false
          this.selectAll = false
          this.deleteCustomerArr = []
        }
      })
    },
    // 分配
    distribution (row) {
      this.distributionDialogVisible = true
      this.distributionCustomId = row.customerId
    },
    distributionAll () {
      if (this.deleteCustomerArr.length === 0) return this.$message.warning('请选择客户')
      this.distributionDialogVisible = true
    },
    distributionSave () {
      if (this.distributionCustomId) {
        const params = {
          customIds: [this.distributionCustomId],
          chargeManId: this.distributionRuleForm.chargeManId
        }
        postCustomBtachGroup(params).then(res => {
          if (res.code === 200) {
            this.$message.success('分配成功')
            this.distributionCustomId = ''
            this.getCustomerList()
            this.distributionDialogVisible = false
          }
        })
      } else {
        const params = {
          customIds: this.deleteCustomerArr.map(e => {
            return e.customerId
          }),
          chargeManId: this.distributionRuleForm.chargeManId
        }
        postCustomBtachGroup(params).then(res => {
          if (res.code === 200) {
            this.$message.success('分配成功')
            this.distributionCustomId = ''
            this.getCustomerList()
            this.distributionDialogVisible = false
            this.selectAll = false
            this.deleteCustomerArr = []
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.cusmoter
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

.cusmoter-head
  padding 0 40px 0 32px
  margin-top 16px
  .search
    float left
    /deep/ .el-input
      width 272px
      margin-right 16px
    /deep/ .el-select
      margin-left 14px
      .el-input
        width 104px
  .operation
    float right
    /deep/ i
      margin-right 9px
    .el-button:last-child
      padding 6px 8px
      /deep/ .el-icon-refresh
        font-size 16px
        line-height 18px
        margin-right 0 

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
  > span:nth-child(3)
    margin-right 8px
    cursor pointer
  > span:nth-child(4), > span:nth-child(2)
    display inline-block
    width 1px
    height 14px
    background-color #e9e9e9
    margin-right 8px
    margin-top 4px
  > span:last-child
    cursor pointer

.delete-cusmoter
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
    margin-bottom 12px
  /deep/ .el-dialog
    border-radius 4px

.dialog-line
  height 1px
  margin-bottom 16px
  background-color #d9d9d9

.tag
  .el-tag
    margin-right 12px
    margin-bottom 4px

.tag-arr
  /deep/ .el-checkbox
    margin-right 20px
    line-height 18px
    background-color #EEE
    color #616161
    font-size 12px
    border-radius 2px
    padding-right 10px
    .el-checkbox__input
      display none
    i
      display none
  /deep/ .is-checked
    margin-right 20px
    line-height 18px
    font-size 12px
    border-radius 2px
    padding-right 10px
    color #fff !important
    background-color #4891FE
    /deep/ .el-checkbox__label
      color #fff
      i
        display inline-block
  .add-tag
    padding 0 8px
    background-color #4891FE
    color #ffffff
    line-height 18px
    font-size 12px
    width 66px
    border-radius 2px
    cursor pointer
    i
      margin-right 2px

.input-tag
  margin-top 8px
  .el-input
    margin-right 12px

     
</style>>

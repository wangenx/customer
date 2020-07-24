<template>
  <div class="account">
    <div class="title">
      <div>账号管理</div>
    </div>
    <div class="account-head clearfix">
      <div class="search">
        <el-select v-model="form.groupId" size="small" placeholder="人员分组">
          <el-option
            v-for="item in groupArr"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId">
          </el-option>
        </el-select>
        <el-button size="small" @click="getGroupList()" type="primary">查询分组</el-button>
        <el-input v-model="form.key" size="small" placeholder="请输入账号名"></el-input>
        <el-button size="small" @click="getAccountList()" type="primary">查询账号</el-button>
      </div>
      <div class="operation">
        <el-button size="small" @click="addGroup">新建分组</el-button>
        <el-button size="small" type="primary" @click="addAccount"><i class="el-icon-plus"></i>新建账号</el-button>
      </div>
    </div>
    <div class="tabel">
      <el-table
        v-show="isGroup"
        :data="tableData"
        v-loading="groupLoading"
        ref="multipleTable"
        @expand-change="expandChange"
        style="width: 100%;margin-bottom: 20px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.children"
              :show-header="false"
              max-height="240"
              style="width: 100%">
              <el-table-column
                prop="accountName"
                label="账号"
                align="right"
                width="273">
                <template slot-scope="scope">
                  <span @click="accountRowClick(scope.row)" :class="[scope.row.isClick ? 'account-click' : 'account-noclick']">{{ scope.row.accountName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注">
                <template slot-scope="scope">
                  <span @click="accountRowClick(scope.row)" :class="[scope.row.isClick ? 'account-click' : 'account-noclick']">{{ scope.row.remarks }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="操作">
                <template slot-scope="props">
                  <div class="group-operation">
                    <span @click="replaceGroup(props.row)">更换分组</span>
                    <span class="el-icon-edit" title="编辑账号" @click="editAccount(props.row, scope.row.groupId)"></span>
                    <el-popover
                      v-model="props.row.isDelete"
                      placement="top"
                      width="160"
                      trigger="click">
                      <div class="delete-personal">
                        <el-button @click="deleteAccount(props.row, scope.row)" size="small" type="primary">删除</el-button>
                        <el-button @click="props.row.isPop = false" size="small" type="info" plain>取消</el-button>
                      </div>
                      <span slot="reference" title="删除账号" class="el-icon-delete"></span>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div>账号列表{{props.row.name}}</div> -->
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="组名/账号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="operation"
          width="180"
          align="left"
          label="操作">
          <template slot-scope="props">
            <div class="group-operation">
              <span class="el-icon-edit" title="编辑分组" @click="editGroup(props.row)"></span>
              <el-popover
                v-model="props.row.isDelete"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-personal">
                  <el-button @click="deleteGroup(props.row.groupId, props.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="props.row.isDelete = false" size="small" type="info" plain>取消</el-button>
                </div>
                <span slot="reference" title="删除分组" class="el-icon-delete"></span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="!isGroup"
        ref="tabelAccount"
        v-loading="accountLoading"
        :data="tableDataAccount"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="phoneNum"
          label="账号名">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="分组">
        </el-table-column>
        <el-table-column
          prop="staffId"
          label="员工ID">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          width="180"
          label="操作">
          <template slot-scope="props">
            <div class="group-operation">
              <span class="el-icon-edit" title="编辑账号" @click="editAccount(props.row)"></span>
              <el-popover
                v-model="props.row.isDelete"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-personal">
                  <el-button @click="deleteAccount(props.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="props.row.isPop = false" size="small" type="info" plain>取消</el-button>
                </div>
                <span slot="reference" title="删除账号" class="el-icon-delete"></span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page clearfix" style="padding-bottom: 40px;">
      <div class="select-all">
        <el-checkbox size="small" v-model="selectAll" @change="handleSelectionChangeCheckbox" label="全选" border></el-checkbox>
        <el-button v-show="isGroup" size="small" @click="deleteAllGroup">删除分组</el-button>
        <el-button v-show="isGroup" size="small" @click="deleteAllAccount">删除账号</el-button>
        <el-button v-show="!isGroup" size="small" @click="deleteAllAccount1">删除账号</el-button>
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
        :title="ruleFormTitle"
        :visible.sync="newAccountDialogVisible"
        width="480px"
        :before-close="handleClose">
        <div class="dialog-line"></div>
        <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="账号名" prop="userName">
            <el-input :disabled="this.ruleFormTitle === '编辑账号'" v-model="ruleForm.userName" placeholder="请输入账号名"></el-input>
          </el-form-item>
          <el-form-item label="员工ID">
            <el-input v-model="ruleForm.staffId" placeholder="请输入员工ID"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名" prop="realName">
            <el-input v-model="ruleForm.realName" placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="ruleForm.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="选择组" prop="groupId">
            <el-select v-model="ruleForm.groupId" placeholder="请选择">
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
          <el-button size="small" @click="newAccountDialogVisible = false">取消</el-button>
          <el-button :disabled="isAccountSave" size="small" type="primary" @click="newAccount('ruleForm')">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="ruleFormGroupingTitle"
        :visible.sync="newGroupingDialogVisible"
        width="480px"
        :before-close="handleCloseGrouping">
        <div class="dialog-line"></div>
        <el-form :model="ruleFormGrouping" :rules="rulesGrouping" size="small" ref="ruleFormGrouping" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="分组名称" prop="groupName">
            <el-input v-model="ruleFormGrouping.groupName" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="ruleFormGrouping.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newGroupingDialogVisible = false">取消</el-button>
          <el-button :disabled="isGroupSave" size="small" type="primary" @click="newGroup('ruleFormGrouping')">提交</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="分配至"
        :visible.sync="distributionDialogVisible"
        width="480px"
        :before-close="handleClosDistribution">
        <div class="dialog-line"></div>
        <el-form :model="distributionRuleForm" :rules="distributionRules" size="small" ref="distributionRuleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="选择组" prop="groupId">
            <el-select v-model="distributionRuleForm.groupId" placeholder="请选择">
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
          <el-button size="small" @click="distributionDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="replaceGroupSave">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="删除"
        :visible.sync="deleteDialogVisible"
        width="480px"
        :before-close="handleClosDelete">
        <div class="dialog-line"></div>
        <span>是否删除选中分组？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="deleteGroupAll">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="删除"
        :visible.sync="deleteAccountDialogVisible"
        width="480px"
        :before-close="handleClosDeleteAccount">
        <div class="dialog-line"></div>
        <span>是否删除选中选中账号？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteAccountDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="deleteAccountAll">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { postCroupCreate, postAccountQuery, postCroupEdit, postCroupDelete, postAccountCreate, postAccountEdit, postAccountList, postAccountDelete, postAccountAllList, postAccountGroupChange } from '@/api/api'
export default {
  data () {
    return {
      styleObject: {
        textAlign: 'right'
      },
      form: {
        groupId: '',
        key: ''
      },
      tableData: [],
      tableDataAccount: [],
      isGroup: true,
      selectAll: false, // 下边全选按钮
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      newAccountDialogVisible: false, // 账号开关
      newGroupingDialogVisible: false, // 新建分组dialog开关
      distributionDialogVisible: false, // 分配组dialog开关
      deleteDialogVisible: false, // 删除弹窗
      deleteAccountDialogVisible: false, // 删除账号弹窗
      ruleForm: {
        userName: '',
        staffId: '',
        remarks: '',
        groupId: '',
        realName: '',
        accountId: ''
      },
      groupArr: [], // 下拉框分组列表
      ruleFormTitle: '新建账号',
      ruleFormGrouping: {
        groupId: '',
        groupName: '',
        remarks: ''
      },
      editGrousData: {},
      ruleFormGroupingTitle: '新建分组',
      distributionRuleForm: {
        groupId: '',
        userId: ''
      },
      deleteArrGroup: [],
      deleteArrAccount: [],
      rules: {
        userName: [
           { required: true, message: '请输入账号名', trigger: 'blur' }
        ],
        realName: [
           { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        remarks: [
           { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        groupId: [
           { required: true, message: '请选择分组', trigger: 'change' }
        ]
      },
      rulesGrouping: {
        groupName: [
           { required: true, message: '请输入分组名', trigger: 'blur' }
        ],
        remarks: [
           { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        region: [
           { required: true, message: '请选择组', trigger: 'change' }
        ]
      },
      distributionRules: {
        groupId: [
           { required: true, message: '请选择组', trigger: 'change' }
        ]
      },
      groupLoading: false,
      accountLoading: false,
      isAccountSave: false,
      isGroupSave: false
    }
  },
  created () {
    this.getGroupList()
    this.getGroupAllList()
  },
  methods: {
    // 删除全部账号
    deleteAllAccount1 () {
      this.deleteArrAccount.length > 0 ? this.deleteAccountDialogVisible = true : this.$message.warning('请选择账号')
    },
    // 获取账号列表
    getAccountList () {
      this.isGroup = false
      const params = {
        key: this.form.key,
        pageNo: this.pagination.page,
        pageSize: this.pagination.pageSize
      }
      this.accountLoading = true
      postAccountAllList(params).then(res => {
        if (res.code === 200) {
          res.data.accounts.forEach(e => {
            e.isPop = false
            e.isClick = false
          })
          this.tableDataAccount = res.data.accounts
          this.pagination.total = res.data.totalCount
          this.accountLoading = false
        } else {
          this.accountLoading = false
        }
      })
    },
    // 获取全部分组
    getGroupAllList () {
      postAccountQuery({}).then(res => {
        if (res.code === 200) {
          this.groupArr = res.data.groups
        }
      })
    },
    // 点击搜索按钮
    searchList () {
      this.pagination.page = 1
      this.pagination.pageSize = 10
      this.getGroupList()
    },
    // 点击账号每一行
    accountRowClick (row) {
      row.isClick = true
      if (this.deleteArrAccount.indexOf(row) > -1) {
        row.isClick = false
        this.deleteArrAccount.splice(this.deleteArrAccount.indexOf(row), 1)
      } else (
        this.deleteArrAccount.push(row)
      )
    },
    deleteAllAccount () {
      this.deleteArrAccount.length > 0 ? this.deleteAccountDialogVisible = true : this.$message.warning('请选择账号')
    },
    // 查询分组列表
    getGroupList () {
      this.isGroup = true
      const params = {
        groupId: this.form.groupId,
        pageNo: this.pagination.page,
        pageSize: this.pagination.pageSize
      }
      this.groupLoading = true
      postAccountQuery(params).then(res => {
        if (res.code === 200) {
          res.data.groups.forEach(e => {
            e.isDelete = false
            e.children = []
          })
          this.tableData = res.data.groups
          this.pagination.total = Number(res.data.totalCount)
          this.groupLoading = false
        } else {
          this.groupLoading = false
        }
      })
    },
    // 点击每一行获取分组下边的账号
    expandChange (row, expandedRows) {
      if (expandedRows.length > 0) {
        this.getGroupAccountList(row)
      }
    },
    // 获取分组下边账号
    getGroupAccountList (row) {
      postAccountList(row.groupId).then(res => {
        if (res.code === 200) {
          res.data.accounts.forEach(e => {
            e.isPop = false
            e.isClick = false
          })
          row.children = res.data.accounts
        }
      })
    },
    deleteAccountAll () {
      const params = this.deleteArrAccount.map(e => {
        return e.accountId ? e.accountId : e.kcSalesId
      })
      postAccountDelete(params).then(res => {
        if (res.code === 200) {
          if (this.isGroup) {
            this.$message.success('删除账号成功')
            this.getGroupList()
            this.deleteAccountDialogVisible = false
          } else {
            this.$message.success('删除账号成功')
            this.getAccountList()
            this.deleteAccountDialogVisible = false
          }
        }
      })
    },
    // 全选分组
    handleSelectionChange(val) {
      if (this.isGroup) {
        this.deleteArrGroup = val
        this.deleteArrGroup.length === this.tableData.length ? this.selectAll = true : this.selectAll = false
      } else {
        this.deleteArrAccount = val
        this.deleteArrAccount.length === this.tableDataAccount.length ? this.selectAll = true : this.selectAll = false
      }
      
    },
    handleSelectionChangeCheckbox () {
      if (this.isGroup) {
        if (this.selectAll) {
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
          this.deleteArrGroup = this.tableData
        } else {
          this.$refs.multipleTable.clearSelection();
          this.deleteArrGroup = []
        }
      } else {
        if (this.selectAll) {
          this.tableDataAccount.forEach(row => {
            this.$refs.tabelAccount.toggleRowSelection(row)
          })
          this.deleteArrAccount = this.tableDataAccount
        } else {
          this.$refs.tabelAccount.clearSelection();
          this.deleteArrAccount = []
        }
      }
      
    },
    // 多选删除分组
    deleteAllGroup () {
      if (this.deleteArrGroup.length > 0) {
        this.deleteDialogVisible = true
      } else {
        this.$message.warning('请选择分组')
      }
    },
    deleteGroupAll () {
      const params = this.deleteArrGroup.map(e => {
        return e.groupId
      })
      postCroupDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除分组成功')
          this.getGroupList()
          this.getGroupAllList()
          this.deleteDialogVisible = false
          this.selectAll = false
          this.deleteArrGroup = []
        }
      })
    },
    // 删除账号
    deleteAccount (row, groupRow) {
      postAccountDelete([row.accountId ? row.accountId : row.kcSalesId]).then(res => {
        if (res.code === 200) {
          this.$message.success('删除账号成功')
          row.isPop = false
          this.isGroup ? this.getGroupAccountList(groupRow) : this.getAccountList()
        }
      })
    },
    // 删除分组
    deleteGroup (id, row) {
      const params = [id]
      postCroupDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除分组成功')
          this.getGroupList()
          this.getGroupAllList()
          row.isDelete = false
        }
      })
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.isGroup ? this.getGroupList() : this.getAccountList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.isGroup ? this.getGroupList() : this.getAccountList()
    },
    // 关闭新建账号弹窗
    handleClose () {
      this.newAccountDialogVisible = false
    },
    handleCloseGrouping () {
      this.newGroupingDialogVisible = false
    },
    handleClosDistribution () {
      this.distributionDialogVisible = false
    },
    handleClosDelete () {
      this.deleteDialogVisible = false
    },
    handleClosDeleteAccount () {
      this.deleteAccountDialogVisible = false
    },
    // 更换分组
    replaceGroup (row) {
      this.distributionRuleForm.groupId = row.groupId
      this.distributionRuleForm.userId = row.accountId ? row.accountId : row.kcSalesId
      this.distributionDialogVisible = true
    },
    // 提交更换分组
    replaceGroupSave () {
      const params = {
        groupId: this.distributionRuleForm.groupId,
        userIds: [this.distributionRuleForm.userId]
      }
      postAccountGroupChange(params).then(res => {
        if (res.code === 0) {
          this.$message.success('更换分组成功')
          this.getGroupAllList()
          this.distributionDialogVisible = false
        }
      })
    },
    // 编辑分组
    editGroup (row) {
      this.ruleFormGrouping.groupId = row.groupId
      this.ruleFormGrouping.groupName = row.groupName
      this.ruleFormGrouping.remarks = row.remarks
      this.ruleFormGroupingTitle = '编辑分组'
      this.newGroupingDialogVisible = true
    },
    // 添加分组
    addGroup () {
      this.ruleFormGrouping.groupId = ''
      this.ruleFormGrouping.groupName = ''
      this.ruleFormGrouping.remarks = ''
      this.ruleFormGroupingTitle = '新建分组'
      this.newGroupingDialogVisible = true
    },
    newGroup (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isGroupSave = true
          if (this.ruleFormGroupingTitle === '编辑分组') {
            const params = {
              groupId: this.ruleFormGrouping.groupId,
              groupName: this.ruleFormGrouping.groupName,
              remarks: this.ruleFormGrouping.remarks
            }
            postCroupEdit(params).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑分组成功')
                this.getGroupList()
                this.getGroupAllList()
                this.newGroupingDialogVisible = false
                this.$refs[formName].resetFields()
                this.isGroupSave = false
              } else {
                this.isGroupSave = false
              }
            })
          } else if (this.ruleFormGroupingTitle === '新建分组') {
            const params ={
              groupName: this.ruleFormGrouping.groupName,
              remarks: this.ruleFormGrouping.remarks
            }
            postCroupCreate(params).then(res => {
              if (res.code === 200) {
                this.$message.success('新建分组成功')
                this.getGroupList()
                this.getGroupAllList()
                this.newGroupingDialogVisible = false
                this.$refs[formName].resetFields()
                this.isGroupSave = false
              } else {
                this.isGroupSave = false
              }
            })
          }
          
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    // 编辑账号
    editAccount (row, groupId) {
      this.ruleForm.accountId = row.accountId ? row.accountId : row.kcSalesId
      this.ruleForm.userName = row.accountName ? row.accountName : row.phoneNum
      this.ruleForm.staffId = row.staffId
      this.ruleForm.remarks = row.remarks ? row.remarks : row.remark
      this.ruleForm.groupId = groupId ? groupId : row.groupId
      this.ruleForm.realName = row.realName
      this.ruleFormTitle = '编辑账号'
      this.newAccountDialogVisible = true
    },
    // 新建账号
    addAccount () {
      this.ruleForm.accountId = ''
      this.ruleForm.userName = ''
      this.ruleForm.staffId = ''
      this.ruleForm.remarks = ''
      this.ruleForm.groupId = ''
      this.ruleForm.realName = ''
      this.ruleFormTitle = '新建账号'
      this.newAccountDialogVisible = true
    },
    // 新建、编辑账号提交
    newAccount (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isAccountSave = true
          if (this.ruleFormTitle === '新建账号') {
            const params = {
              userName: this.ruleForm.userName,
              staffId: this.ruleForm.staffId,
              remarks: this.ruleForm.staffId,
              groupId: this.ruleForm.groupId,
              realName: this.ruleForm.realName
            }
            postAccountCreate(params).then(res => {
              if (res.code === 200) {
                this.$message.success('新建账号成功')
                this.isGroup ? this.getGroupList() : this.getAccountList()
                this.newAccountDialogVisible = false
                this.isAccountSave = false
              } else {
                this.isAccountSave = false
              }
            })
          } else if (this.ruleFormTitle === '编辑账号') {
            const params = {
              accountId: this.ruleForm.accountId,
              staffId: this.ruleForm.staffId,
              remarks: this.ruleForm.staffId,
              groupId: this.ruleForm.groupId,
              realName: this.ruleForm.realName
            }
            postAccountEdit(params).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑账号成功')
                this.isGroup ? this.getGroupList() : this.getAccountList()
                this.newAccountDialogVisible = false
                this.isAccountSave = false
              } else {
                this.isAccountSave = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.account
  min-width 1160px
  min-height 100%
  overflow-x auto
  background-color #fff

.title
  padding 0 13px 0 7px
  div
    height 50px
    line-height 50px
    border-bottom 1px solid #f1f2f7
    font-size 14px
    color #a3a3a3
    padding-left 32px

.account-head
  padding 0 34px 0 40px
  margin-top 16px
  .search
    float left
    /deep/ .el-select
      width 272px
      margin-right 10px
      .el-input
        width 100%
    /deep/ .el-input
      width 272px
      margin-right 16px
    /deep/ .el-button
      margin-right 40px  
  .operation
    float right
    /deep/ i
      margin-right 9px

.tabel
  padding 18px 70px 0 40px
  /deep/ .el-table th
    background-color #fafafa
  /deep/ .el-table [class*=el-table__row--level] .el-table__expand-icon
    float left
  /deep/ .el-table__indent, /deep/ .el-table__placeholder
    display none   

/deep/ .el-table__expanded-cell
  padding 0 0 0 50px
  overflow-y auto
  /deep/ .el-table td
    border-bottom 0
  /deep/ .el-table::before
    height 0 
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td
    background-color #fff

.account-noclick
  cursor pointer

.account-click
  color #1989FA
  cursor pointer

.groupName
  float left
  width calc(100% - 23px)
  > div
    float left
  > .name
    width calc(100% - 62px)
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

.group-operation
  width 100%
  > span
    font-size 14px
    cursor pointer
    font-weight 500
    margin-right 10px
  > span:first-child
    margin-right 10px
  > span:hover
    color #409EFF

.groupName-no
  width 100%
  > .name
    width 100%
    > span
      padding-right 12px

.operation
  > span
    font-size 14px
    color #1890FF
    cursor pointer
    float left
  > span:first-child
    margin-right 8px
  > span:nth-child(2), > span:nth-child(4)
    display inline-block
    width 1px
    height 14px
    margin-top 4px
    background-color #e9e9e9
    margin-right 8px
  > span:nth-child(4)
    margin-left 8px 

.delete-personal
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
  
</style>>

<template>
  <div class="account">
    <div class="title">
      <div>账号管理</div>
    </div>
    <div class="account-head clearfix">
      <div class="search">
        <el-select v-model="form.grouping" size="small" placeholder="人员分组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.input" size="small" placeholder="请输入内容"></el-input>
        <el-button size="small" type="primary">查询</el-button>
      </div>
      <div class="operation">
        <el-button size="small" @click="addGroup">新建分组</el-button>
        <el-button size="small" type="primary" @click="addAccount"><i class="el-icon-plus"></i>新建账号</el-button>
      </div>
    </div>
    <div class="tabel">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template>
            <!-- <div class="groupName clearfix" :class="[props.row.child? 'groupName-no' : '']">
              <div class="groupName" :style="props.row.child ? styleObject : ''">
                <el-tooltip class="item" effect="dark" :content="props.row.name" placement="top-start">
                  <span>{{ props.row.name }}</span>
                </el-tooltip>
              </div>
              <div class="group-operation" v-show="!props.row.child">
                <span class="el-icon-edit" @click="editGroup(props.row.id)"></span>
                <el-popover
                  v-model="props.row.isDelete"
                  placement="top"
                  width="160"
                  trigger="click">
                  <div class="delete-personal">
                    <el-button @click="deleteGroup(props.row.id, props.row)" size="small" type="primary">删除</el-button>
                    <el-button @click="props.row.isDelete = false" size="small" type="info" plain>取消</el-button>
                  </div>
                  <span slot="reference" class="el-icon-delete"></span>
                </el-popover>
              </div>
            </div> -->

            <el-table
              :data="tabelChildren"
              :show-header="false"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="账号"
                align="right"
                width="273">
              </el-table-column>
              <el-table-column
                prop="date"
                label="备注">
              </el-table-column>
              <el-table-column
                width="180"
                label="操作">
                <template slot-scope="props">
                  <div class="group-operation">
                    <span class="el-icon-edit" @click="editGroup(props.row.id)"></span>
                    <el-popover
                      v-model="props.row.isDelete"
                      placement="top"
                      width="160"
                      trigger="click">
                      <div class="delete-personal">
                        <el-button @click="deleteGroup(props.row.id, props.row)" size="small" type="primary">删除</el-button>
                        <el-button @click="props.row.isDelete = false" size="small" type="info" plain>取消</el-button>
                      </div>
                      <span slot="reference" class="el-icon-delete"></span>
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
          prop="name"
          label="组名/账号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="date"
          label="备注">
          <template slot-scope="props">
            <div class="group-operation">
              <span class="el-icon-edit" @click="editGroup(props.row.id)"></span>
              <el-popover
                v-model="props.row.isDelete"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-personal">
                  <el-button @click="deleteGroup(props.row.id, props.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="props.row.isDelete = false" size="small" type="info" plain>取消</el-button>
                </div>
                <span slot="reference" class="el-icon-delete"></span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          width="180"
          align="left"
          label="操作">
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
        :title="ruleFormTitle"
        :visible.sync="newAccountDialogVisible"
        width="480px"
        :before-close="handleClose">
        <div class="dialog-line"></div>
        <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="账号名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入账号名"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="ruleForm.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="选择组" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option label="分组一" value="shanghai"></el-option>
              <el-option label="分组二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newAccountDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="newAccountDialogVisible = false">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="ruleFormGroupingTitle"
        :visible.sync="newGroupingDialogVisible"
        width="480px"
        :before-close="handleCloseGrouping">
        <div class="dialog-line"></div>
        <el-form :model="ruleFormGrouping" :rules="rulesGrouping" size="small" ref="ruleFormGrouping" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="ruleFormGrouping.name" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="ruleFormGrouping.remarks" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          <el-form-item label="选择组" prop="region">
            <el-select v-model="ruleFormGrouping.region" placeholder="请选择">
              <el-option label="分组一" value="shanghai"></el-option>
              <el-option label="分组二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newGroupingDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="newGroupingDialogVisible = false">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="分配至"
        :visible.sync="distributionDialogVisible"
        width="480px"
        :before-close="handleClosDistribution">
        <div class="dialog-line"></div>
        <el-form :model="distributionRuleForm" :rules="distributionRules" size="small" ref="distributionRuleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="选择组" prop="region">
            <el-select v-model="distributionRuleForm.region" placeholder="请选择">
              <el-option label="分组一" value="shanghai"></el-option>
              <el-option label="分组二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="distributionDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="distributionDialogVisible = false">确认</el-button>
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
          <el-button size="small" type="primary" @click="deleteDialogVisible = false">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      styleObject: {
        textAlign: 'right'
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
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
      form: {
        grouping: '',
        input: ''
      },
      tableData: [{
        id: 1,
        date: '',
        name: '未分组',
        operation: '',
        isDelete: false
      }, {
        id: 2,
        date: '',
        name: '分组一',
        operation: '',
        isDelete: false,
        children: [{
            id: 29,
            date: '2016-05-01',
            name: '账号名',
            operation: '',
            child: true,
            isPop: false
          }, {
            id: 30,
            date: '2016-05-01',
            name: '王小虎',
            operation: '',
            child: true,
            isPop: false
        }]
      }, {
        id: 3,
        date: '',
        name: '分组二',
        operation: '',
        isDelete: false
      }, {
        id: 4,
        date: '',
        name: '分组三',
        operation: '',
        isDelete: false
      }],
      tabelChildren: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          operation: '',
          child: true,
          isDelete: false,
          isPop: false
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          operation: '',
          child: true,
          isDelete: false,
          isPop: false
      }],

      selectAll: false, // 下边全选按钮
      page: {
        page: 5
      },
      newAccountDialogVisible: false, // 账号开关
      newGroupingDialogVisible: false, // 新建分组dialog开关
      distributionDialogVisible: false, // 分配组dialog开关
      deleteDialogVisible: false, // 删除弹窗
      ruleForm: {
        name: '',
        remarks: '',
        region: ''
      },
      ruleFormTitle: '新建账号',
      ruleFormGrouping: {
        name: '',
        remarks: '',
        region: ''
      },
      ruleFormGroupingTitle: '新建分组',
      distributionRuleForm: {
        region: ''
      },
      rules: {
        name: [
           { required: true, message: '请输入账号名', trigger: 'blur' }
        ],
        remarks: [
           { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        region: [
           { required: true, message: '请选择组', trigger: 'change' }
        ]
      },
      rulesGrouping: {
        name: [
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
        region: [
           { required: true, message: '请选择组', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 删除账号
    deletePersonal (id, row) {
      console.log(id)
      row.isPop = false
    },
    // 删除分组
    deleteGroup (id, row) {
      console.log(id)
      row.isDelete = false
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
    // 编辑分组
    editGroup () {
      this.ruleFormGroupingTitle = '编辑分组'
      this.newGroupingDialogVisible = true
    },
    // 添加分组
    addGroup () {
      this.ruleFormGroupingTitle = '新建分组'
      this.newGroupingDialogVisible = true
    },
    // 编辑账号
    editAccount () {
      this.ruleFormTitle = '编辑账号'
      this.newAccountDialogVisible = true
    },
    // 新建账号
    addAccount () {
      this.ruleFormTitle = '新建账号'
      this.newAccountDialogVisible = true
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
      width 104px
      margin-right 10px
      .el-input
        width 100%
    /deep/ .el-input
      width 272px
      margin-right 16px
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
  /deep/ .el-table td
    border-bottom 0
  /deep/ .el-table::before
    height 0 

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
  width 48px
  > span
    font-size 14px
    cursor pointer
    font-weight 500
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

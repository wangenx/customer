<template>
  <div class="cusmoter">
    <div class="title">
      账号管理
    </div>
    <div class="cusmoter-head clearfix">
      <div class="search">
        <el-input v-model="cusmoterInput" size="small" placeholder="请输入内容"></el-input>
        <el-button size="small" type="primary">查询</el-button>
        <el-select v-model="grouping" size="small" placeholder="筛选分组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="operation">
        <el-button size="small" type="primary" @click="addCusmoter"><i class="el-icon-plus"></i>新建客户</el-button>
        <el-button size="small" type="primary"><i class="el-icon-refresh"></i></el-button>
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
          prop="classification"
          label="客户分级">
          <template slot-scope="scope">{{ scope.row.classification }}</template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="手机号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="condition"
          label="所属行业"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户姓名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="distributor"
          label="公司名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="distributor"
          label="客户职位"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="distributor"
          label="客户标签"
          min-width="258"
          show-overflow-tooltip>
          <template>
            <div class="tag">
              <el-tag size="small" type="info">潜在客户</el-tag>
              <el-tag size="small" type="info">战略投资</el-tag>
              <el-tag size="small" type="info">B轮融资</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="people"
          label="所属人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220">
          <template slot-scope="scope">
            <div class="operation clearfix">
              <span @click="distributionDialogVisible = true">分配</span>
              <span></span>
              <span @click="editCusmoter(scope.row.id)">修改</span>
              <span></span>
              <el-popover
                v-model="scope.row.isDeleteCusmoter"
                placement="top"
                width="160"
                trigger="click">
                <div class="delete-cusmoter">
                  <el-button @click="deleteCusmoter(scope.row.id, scope.row)" size="small" type="primary">删除</el-button>
                  <el-button @click="scope.row.isDeleteCusmoter = false" size="small" type="info" plain>取消</el-button>
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
        <el-button size="small" @click="distributionDialogVisible = true">批量分配</el-button>
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
        <span>是否删除选中客户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="deleteDialogVisible = false">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="cusmoterFormTitle"
        :visible.sync="newCusmoterDialogVisible"
        width="480px"
        :before-close="handleClose">
        <div class="dialog-line"></div>
        <el-form :model="cusmoterForm" :rules="rules" size="small" ref="cusmoterForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="客户分级" prop="classification">
            <el-select v-model="cusmoterForm.classification" placeholder="请选择">
              <el-option label="最高级" value="zuigaoji"></el-option>
              <el-option label="一级" value="yiji"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属行业" prop="industry">
            <el-select v-model="cusmoterForm.industry" placeholder="请选择">
              <el-option label="电子行业" value="dianzihangye"></el-option>
              <el-option label="一级" value="yiji"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户姓名" prop="name">
            <el-input v-model="cusmoterForm.name" placeholder="请输入客户姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="tel">
            <el-input v-model="cusmoterForm.tel" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="company">
            <el-input v-model="cusmoterForm.company" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="客户职位" prop="position">
            <el-select v-model="cusmoterForm.position" placeholder="请选择">
              <el-option label="销售" value="xiaoshou"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户标签" prop="checkedTags">
            <div class="tag-arr">
              <el-checkbox-group v-model="cusmoterForm.checkedTags" size="small">
                <el-checkbox size="small" v-for="tag in tagOptions" :label="tag" :key="tag">{{tag}}<i class="el-icon-check"></i></el-checkbox>
              </el-checkbox-group>
              <div class="add-tag" @click="isAdd ? isAdd = false : isAdd = true"><i class="el-icon-plus"></i>新增标签</div>
              <div class="input-tag" v-show="isAdd">
                <el-input size="small" v-model="addTag"></el-input>
                <el-button size="small" type="primary">新增</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="所属人" prop="region">
            <el-select v-model="cusmoterForm.region" placeholder="请选择">
              <el-option label="销售1" value="xiaoshouyi"></el-option>
              <el-option label="销售2" value="销售2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="newCusmoterDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="newCusmoterDialogVisible = false">{{ butoonText }}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="分配至"
        :visible.sync="distributionDialogVisible"
        width="480px"
        :before-close="handleClosDistribution">
        <div class="dialog-line"></div>
        <el-form :model="distributionRuleForm" :rules="distributionRules" size="small" ref="distributionRuleForm" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-form-item label="所属人" prop="region">
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
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cusmoterInput: '',
      grouping: '',
      options: [{
        value: '选项1',
        label: '分组一'
      }, {
        value: '选项2',
        label: '分组二'
      }, {
        value: '选项3',
        label: '分组三'
      }, {
        value: '选项4',
        label: '分组四'
      }, {
        value: '选项5',
        label: '分组五'
      }],
      tableData: [{
        classification: '最高级',
        tel: '18810001000',
        distributor: '哈哈哈公司',
        name: '王小虎',
        condition: '电子行业',
        people: '销售',
        id: 1,
        isDeleteCusmoter: false
      }, {
        classification: '最高级',
        tel: '18810001000',
        distributor: '哈哈哈公司',
        name: '王小虎',
        condition: '电子行业',
        people: '销售',
        id: 2,
        isDeleteCusmoter: false
      }, {
        classification: '最高级',
        tel: '18810001000',
        distributor: '哈哈哈公司',
        name: '王小虎',
        condition: '电子行业',
        people: '销售',
        id: 3,
        isDeleteCusmoter: false
      }, {
        classification: '最高级',
        tel: '18810001000',
        distributor: '哈公司',
        name: '王小虎',
        condition: '电子行业',
        people: '销售',
        id: 4,
        isDeleteCusmoter: false
      }, {
        classification: '最高级',
        tel: '18810001000',
        distributor: '公司',
        name: '王小虎',
        condition: '电子行业',
        people: '销售',
        id: 4,
        isDeleteCusmoter: false
      }, {
        classification: '最高级',
        tel: '18810001000',
        distributor: '公司',
        name: '王小虎',
        condition: '电子行业',
        people: '销售',
        id: 5,
        isDeleteCusmoter: false
      }],
      selectAll: false, // 下边全选按钮
      deleteDialogVisible: false,
      page: {
        page: 5
      },
      cusmoterFormTitle: '新建客户',
      butoonText: '添加',
      newCusmoterDialogVisible: false,
      cusmoterForm: {
        name: '',
        remarks: '',
        region: '',
        classification: '',
        industry: '',
        tel: '',
        company: '',
        position: '',
        checkedTags: []
      },
      rules: {
        classification: [
           { required: true, message: '请选择客户分级', trigger: 'change' }
        ],
        industry: [
           { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        remarks: [
           { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        name: [
           { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        tel: [
           { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        company: [
           { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        position: [
           { required: true, message: '请选择客户职位', trigger: 'change' }
        ],
        checkedTags: [
            { type: 'array', required: true, message: '请至少选择一个客户标签', trigger: 'change' }
          ],
        region: [
           { required: true, message: '请选择分配给', trigger: 'change' }
        ]
      },
      tagOptions: ['有意向', '潜在客户', '战略投资', 'B轮融资', '战略'],
      isAdd: true,
      distributionDialogVisible: false,
      distributionRuleForm: {
        region: ''
      },
      distributionRules: {
        region: [
           { required: true, message: '请选择组', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addCusmoter () {
      this.newCusmoterDialogVisible = true
      this.cusmoterFormTitle = '新建客户',
      this.butoonText = '添加'
    },
    editCusmoter (id) {
      console.log(id)
      this.newCusmoterDialogVisible = true
      this.cusmoterFormTitle = '修改客户'
      this.butoonText = '提交'
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 关闭新建规则弹窗
    handleClose () {
      this.newCusmoterDialogVisible = false
    },
    // 删除规则气泡
    deleteCusmoter (id, row) {
      console.log(id)
      row.isDeleteCusmoter = false
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
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
  .el-tag
    margin-right 12px

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

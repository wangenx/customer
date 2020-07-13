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
        <el-button size="small" type="primary" @click="addAccount"><i class="el-icon-plus"></i>新建规则</el-button>
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
          prop="name"
          label="条件"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="分配人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template>
            <div>
              <span>修改</span>
              <span></span>
              <span>删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
        condition: '城市=上海；年龄>18;'
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;'
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;'
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;'
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;'
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;'
      }, {
        distributor: '小组1',
        name: '王小虎',
        condition: '城市=上海；年龄>18;'
      }]
    }
  },
  methods: {
    addAccount () {
      console.log('新建规则')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="stylus" scoped>
.rule
  height 100%
  background-color #fff
  padding-bottom 24px

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
</style>>

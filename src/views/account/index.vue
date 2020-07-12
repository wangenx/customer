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
        <el-button size="small">新建分组</el-button>
        <el-button size="small" type="primary"><i class="el-icon-plus"></i>新建账号</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.account
  min-width 1160
  overflow-y auto
  height 100%
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
</style>>

<template>
  <div class="login clearfix">
    <div class="login-main">
      <div class="login-left">
        <div class="left-icon"></div>
      </div>
      <div class="login-con" v-show="isLogin">
        <div class="title">LOGIN</div>
        <el-form :model="ruleFormLogin" :rules="loginLules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleFormLogin.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleFormLogin.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.push('home')">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="forget-pass">
          <span @click="isLogin = false">修改密码</span>
          <span></span>
          <span @click="isLogin = false">忘记密码</span>
        </div>
      </div>
      <div class="login-con forget-password" v-show="!isLogin">
        <div class="title forget-title">忘记密码</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.code" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgin">
            <el-input type="password" v-model="ruleForm.passwordAgin" placeholder="确认新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>登录</el-button>
          </el-form-item>
        </el-form>
        <div class="send-code">
          <span></span>
          <span>发送验证码</span>
        </div>
        <div class="go-login" @click="isLogin = true">返回登录</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleFormLogin: {
        username: '',
        password: ''
      },
      ruleForm: {
        username: '',
        password: '',
        code: '',
        passwordAgin: ''
      },
      loginLules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      rules: {
        username: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        passwordAgin: [
          { required: true, message: '确认新密码', trigger: 'blur' }
        ]
      },
      isLogin: true
    }
  }
};
</script>
<style lang="stylus" scoped>
.login
  min-width 1334px
  min-height 789px
  background url('../../assets/images/login-bg.png') no-repeat
  background-size auto 100%
  // padding-top 126px
  height 100vh
  .login-main
    width 100%
    padding-top 80px
    height 580px
    margin 0 auto
    // background-color #fff
    // border-radius 10px
    // box-shadow 0px 4px 18px 0px rgba(0, 0, 0, 0.3)

.login-con
  width 430px
  float left
  margin-left 380px
  padding-left 48px
  padding-top 84px
  .title
    width 344px
    font-size 48px
    line-height 66px
    color #585858
    text-align center
    margin-bottom 48px
    font-weight bold
  .forget-title
    font-size 24px
    line-height 33px  
    margin-bottom 32px
    text-align left
  .el-form
    width 344px
    /deep/ .el-input__inner
      height 48px
      line-height 48px
      border none
      border-radius 10px
      background-color #efefef
    /deep/ .el-button
      padding 15px 154px
      border-radius 10px
      background-color #4891FE
      color #ffffff
      font-size 18px
    /deep/ .el-form-item:last-child
      margin-bottom 16px  
  .forget-pass
    width 344px
    text-align right
    span
      font-size 14px
      color #b9b9b9
      line-height 14px
      cursor pointer
    > span:nth-child(2)
      display inline-block
      width 1px
      height 12px
      background-color #b9b9b9
      margin 0 6px

.forget-password
  position relative
  .el-form
    /deep/ .el-form-item
      margin-bottom 16px
    /deep/ .el-button
      margin-top 16px
  .go-login
    width 344px
    font-size 14px
    line-height 22px
    color #1890ff
    text-align right
    cursor pointer
  .send-code
    position absolute
    width 130px
    right 78px
    top 220px
    span
      float left
    > span:first-child
      display block
      width 1px
      height 36px
      background-color #b9b9b9
    > span:last-child
      color #4891fe
      font-size 18px
      line-height 36px
      margin-left 20px
      cursor pointer 

.login-left
  width 67px
  float left
  margin-left 260px
  padding-top 80px
  .left-icon
    width 67px
    height 300px
    background url('../../assets/images/login-left-icon.svg') no-repeat
</style>

<template>
  <div class="login clearfix">
    <div class="login-left"></div>
    <div class="login-main">
      <div class="login-con" v-show="isLogin">
        <div class="title">LOGIN</div>
        <el-form :model="loginFuleForm" :rules="loginRules" ref="loginFuleForm" class="demo-ruleForm">
          <el-form-item prop="userName">
            <el-input v-model="loginFuleForm.userName" placeholder="输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginFuleForm.password" placeholder="输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm('loginFuleForm')">登录</el-button>
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
          <el-form-item prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="ruleForm.code" maxlength="6" minlength="6" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input type="password" v-model="ruleForm.newPassword" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgin">
            <el-input type="password" v-model="ruleForm.passwordAgin" placeholder="确认新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="editSubmit('ruleForm')">确定</el-button>
          </el-form-item>
        </el-form>
        <div class="send-code" :class="[ isSend ? 'send-after' : '' ]">
          <span></span>
          <span v-show="!isSend" @click="sendCode">发送验证码</span>
          <span v-show="isSend">{{ num }} 秒后重新发送</span>
        </div>
        <div class="go-login" @click="isLogin = true">返回登录</div>
      </div>
    </div>
    
  </div>
</template>
<script>
import { sendCode, editPassword } from '@/api/api'
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback();
      }
    }
    var validateUsername = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.length < 6) {
        callback(new Error('请输入六位数验证码'))
      } else {
        callback()
      }
    }
    return {
      isSend: false,
      loginFuleForm: {
        userName: '',
        password: ''
      },
      ruleForm: {
        userName: '',
        newPassword: '',
        code: '',
        passwordAgin: ''
      },
      loginRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      rules: {
        userName: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ],
        passwordAgin: [
          { validator: validatePass2, trigger: 'blur'}
        ]
      },
      isLogin: true,
      num: 60,
      interval: null
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('Login', this.loginFuleForm).then(res => {
            if (res.code === 200) {
              this.$router.push('home')
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 修改密码
    editSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            userName: this.ruleForm.userName,
            code: this.ruleForm.code,
            newPassword: this.ruleForm.newPassword
          }
          editPassword(params).then(res => {
            if (res.code === 200) {
              this.$message.success('修改密码成功')
              this.isLogin = true
              this.$refs[formName].resetFields()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 发送验证码
    sendCode () {
      if (this.ruleForm.phone === '') {
        this.$message.warning('请输入手机号')
        return
      }
      sendCode().then(res => {
        if (res.code === 0) {
          this.isSend = true
          this.time()
        }
      })
    },
    time () {
      this.interval = setInterval(() => {
        this.num--
        if (this.num === 0) {
          clearInterval(this.interval)
          this.isSend = false
        }
      }, 1000)
    }
  }
}
</script>
<style lang="stylus" scoped>
.login
  height 100vh
  background-color #fff

.login-main
  width calc(100% - 66.66%)
  height 100%
  float right

.login-con
  width 344px
  margin 25.57% auto 0
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
      font-size 16px
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
    right 12px
    top 136px
    span
      float left
    > span:first-child
      display block
      width 1px
      height 36px
      background-color #b9b9b9
    > span:nth-child(2), > span:last-child
      color #4891fe
      font-size 16px
      line-height 36px
      margin-left 10px
      cursor pointer
    > span:last-child
      color #ff4441
  .send-after
    right 12px

.login-left
  width 66.66%
  height 100%
  float left
  background url('../../assets/images/login-bg.png') no-repeat
  background-size 100% 100%
  
</style>

<template>
  <div class="aside__top clearfix">
    <div class="fold" :class="[isFold ? 'fold-no' : '']" @click="foldNav"><i class="el-icon-s-fold"></i></div>
    <div class="icon clearfix">
      <span></span>
      <span>Customer</span>
    </div>
    <div class="user"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      crumbList: [],
      isFold: false
    };
  },
  methods: {
    loginOut() {
      // 退出登录
    },
    foldNav () {
      this.isFold ? this.isFold = false : this.isFold = true
      this.$store.commit('SET_FOLD', this.isFold)
    }
  }
};
</script>
<style lang="stylus" scoped>
.aside__top
  background-color #fff
  height 48px
  z-index 100
  position relative
  box-shadow 0px 2px 4px 0px rgba(0, 0, 0, 0.07)
  > div
    float left
  .fold
    width 48px
    height 48px
    text-align center
    line-height 48px
    border-right 1px solid #d8d8d8
    font-size 20px
    color #072c40
    cursor pointer
    > i
      transform rotate(0deg)
      transition transform .3s
  .fold-no
    > i
      transform rotate(180deg)    
  .icon
    margin-left 10px
    margin-top 9px
    span
      float left
    span:first-child
      display inline-block 
      background-color #ccc
      width 35px
      height 32px
      background url('../../../assets/images/fold-icon.svg') no-repeat center
    span:last-child
      font-size 18px
      line-height 32px
      color #585858
      margin-left 9px
  .user
    float right
    margin-right 48px
    width 40px
    height 40px
    background url('../../../assets/images/user-icon.svg') no-repeat center
    margin-top 4px
    cursor pointer
</style>

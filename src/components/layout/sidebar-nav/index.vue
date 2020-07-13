<template>
  <div class="nav" :class="[fold ? 'nav-fold' : '']">
    <el-menu
      :default-active="currentMenu"
      class="el-menu-vertical-demo"
      :router="true"
      @open="handleOpen"
      @close="handleClose">
      <template v-for="(item, key) in sidebarMenu">
        <el-menu-item :index="item.path" :key="key">
          <template slot="title">
            <i class="nav-icon" :class="'nav-icon' + key"></i>
            <!-- <i class="el-icon-location"></i> -->
            <span slot="title">{{ item.meta.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(["sidebarMenu"]),
    ...mapState(["currentMenu"]),
    ...mapState(['fold'])
  },
  methods: {
    gotoRoute() {
      // this.$router.push({ name });
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
};
</script>
<style lang="stylus" scoped>
.nav
  width 190px
  transition width .3s
  overflow-y hidden
  background-color #fff
  box-shadow 0px 2px 4px 0px rgba(0, 0, 0, 0.06)
  >>> .el-menu-item
    padding 0 !important
    height 40px
    line-height 40px
    margin-bottom 10px
    border-left 2px solid #ffffff
  >>> .el-menu-item.is-active
    background-color #f1f7ff
    border-left 2px solid #4891fe
  >>> .el-menu
    border-right none



.nav-icon
  display inline-block
  width 46px
  height 40px
  float left
.nav-icon0
  background url('../../../assets/images/dispatch-icon.svg') no-repeat center
.nav-icon1
  background url('../../../assets/images/account-icon.svg') no-repeat center
.nav-icon2
  background url('../../../assets/images/rule-icon.svg') no-repeat center
.nav-icon3
  background url('../../../assets/images/customer-icon.svg') no-repeat center      

.nav-fold
  width 48px

</style>

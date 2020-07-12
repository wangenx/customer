<template>
  <div class="container clearfix">
    <topAside />
    <div class="main-container clearfix">
      <sidebarNav class="sidebar" />
      <mainContent class="content" :class="[fold ? 'content-fold' : '']" />
    </div>
  </div>
</template>

<script>
import sidebarNav from "./sidebar-nav/index";
import mainContent from "./content/index";
import topAside from "./top-aside/index";
import { mapState } from "vuex"
export default {
  data() {
    return {};
  },
  components: {
    sidebarNav,
    mainContent,
    topAside
  },
  computed: {
    ...mapState(['fold'])
  }
};
</script>

<style lang="stylus" scoped>
.sidebar
  float left
  padding-top 10px
  height calc(100vh - 58px)
.main-container
  overflow auto
  width 100%
  .content
    float right
    width calc(100% - 262px)
    padding 32px 40px 0 32px
    transition width .3s
  .content-fold
    width calc(100% - 120px) 
</style>

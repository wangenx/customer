<template>
  <div class="content">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {}
  }
};
</script>
<style lang="stylus" scoped>
.content
  height calc(100vh - 90px)
  // min-width 1166px
  overflow auto

</style>

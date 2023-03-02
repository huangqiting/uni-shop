<template>
  <view class="my-container">
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('m_user', ['token'])
  }
  // onLoad() {
  //   var pages = getCurrentPages(); //获取加载的页面
  //   var currentPage = pages[pages.length - 1]; //获取当前页面的对象
  //   var url = currentPage.route; //当前页面url
  //   console.log('pages', pages);
  //   console.log('currentPage', currentPage);
  //   console.log('url', url);
  // }
};
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>

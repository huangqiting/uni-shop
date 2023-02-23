<template>
  <view>goods_list666</view>
</template>

<script>
export default {
  data() {
    return {
      // 请求参数对象
      queryObj: {
        // 查询关键词
        query: '',
        // 商品分类Id
        cid: '',
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      }
    };
  },
  onLoad(options) {
    // 将页面参数转存到 this.queryObj 对象中
    this.queryObj.cid = options.cid || '';
    this.queryObj.query = options.query || '';
  }
};
</script>

<style lang="scss"></style>

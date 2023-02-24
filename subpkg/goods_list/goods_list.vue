<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)"><my-goods :goods="goods"></my-goods></view>
    </view>
  </view>
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
      },
      // 商品列表数据
      goodsList: [],
      // 总数量，用来实现分页
      total: 0,
      // 节流阀 控制是否请求
      isloading: false
    };
  },
  onLoad(options) {
    // 将页面参数转存到 this.queryObj 对象中
    this.queryObj.cid = options.cid || '';
    this.queryObj.query = options.query || '';

    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    async getGoodsList(cb) {
      this.isloading = true;
      const { data } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
      this.isloading = false;
      // 调用函数 停止下拉刷新
      cb && cb();
      if (data.meta.status !== 200) return uni.$showMsg('获取商品列表失败！');
      4;
      this.goodsList.push(...data.message.goods);
      this.total = data.message.total;
      console.log(data);
    },
    // 跳转商品详情
    gotoDetail(goods) {
      uni.navigateTo({
        url: `/subpkg/goods_detail/goods_detail?goods_id=${goods.goods_id}`
      });
    }
  },
  // 触发触底事件
  onReachBottom() {
    // 判断是否还有更多数据
    // 页码值 * 每页显示多少条数据 >= 总数量
    if (this.queryObj.pagesize * this.queryObj.pagenum >= this.total) return uni.$showMsg('没有更多了');
    // 节流阀
    if (this.isloading) return;
    this.queryObj.pagenum++;
    this.getGoodsList();
  },
  // 监听下拉刷新
  onPullDownRefresh() {
    // 重置数据
    this.queryObj.pagenum = 1;
    this.goodsList = [];
    this.total = 0;
    this.isloading = false;
    // 重新拿数据
    this.getGoodsList(() => uni.stopPullDownRefresh());
  }
};
</script>

<style lang="scss"></style>

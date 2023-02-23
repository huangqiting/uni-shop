<template>
  <!-- 使用uni 提供的搜索组件 -->
  <view class="search-box">
    <uni-search-bar placeholder="请输入搜索内容" @input="input" :radius="100" cancelButton="none" />
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="item of searchResults" :key="item.goods_id" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list"><uni-tag :text="item" type="" v-for="(item, index) of historys" :key="index" @click="gotoGoodsList(item)"></uni-tag></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      timer: null, // 延迟定时器id
      kw: '', // 搜索关键词
      searchResults: [], // 搜索建议列表
      historyList: []
    };
  },
  computed: {
    // 返回一个翻转后的数组
    historys() {
      return [...this.historyList].reverse();
    }
  },
  onLoad() {
    // 从本地存储拿搜索关键词
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');
  },
  methods: {
    // 根据搜索关键词跳转商品列表
    gotoGoodsList(kw) {
      uni.navigateTo({
        url: `/subpkg/goods_list/goods_list?query=${kw}`
      });
    },
    // 清空搜索历史
    cleanHistory() {
      this.historyList = [];
      uni.setStorageSync('kw', '[]');
    },
    input(e) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.kw = e;
        this.getSearchResults();
      }, 500);
    },
    // 获取搜索建议列表
    async getSearchResults() {
      this.kw = this.kw.trim();
      // 输入框为空 清空搜索建议列表
      if (this.kw === '') return (this.searchResults = []);
      const { data } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw });
      if (data.meta.status !== 200) return uni.$showMsg('获取搜索建议失败！');
      this.searchResults = data.message;

      // 输入框不为空 调用方法保存搜索关键词为历史记录
      this.saveSearchHistory();
    },
    // 跳转商品详情
    gotoDetail(id) {
      uni.navigateTo({
        url: `/subpkg/goods_detail/goods_detail?goods_id=${id}`
      });
    },
    // 保存搜索关键词为历史记录
    saveSearchHistory() {
      // 使用set数组去除
      const set = new Set(this.historyList);
      // set 删除和添加返回 一个布尔值
      set.delete(this.kw);
      set.add(this.kw);
      // this.historyList = [...set];
      this.historyList = Array.from(set);
      // 把搜索关键词保存到本地存储 Sync异步的
      uni.setStorageSync('kw', JSON.stringify(this.historyList));
    }
  }
};
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;

  .sugg-list {
    padding: 0 5px;
  }
  .sugg-item {
    font-size: 14px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }

  // 历史区域样式
  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
}
</style>

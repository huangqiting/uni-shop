<template>
  <view>
    <!-- 搜索区域 -->
    <my-search @click="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滚动的区域 -->
      <scroll-view class="left-scroll-view" scroll-y="" :style="{ height: `${wh}px` }">
        <block v-for="(item, index) of cateList" :key="index">
          <!-- 数组方式 <view @click="active = index" :class="['left-scroll-view-item', index === active ? 'active' : '' ]">{{item.cat_name}}</view> -->
          <view @click="onChange(index)" :class="{ 'left-scroll-view-item': true, active: index === active }">{{ item.cat_name }}</view>
        </block>
      </scroll-view>
      <!-- 右侧滚动区域 -->
      <scroll-view :scroll-top="scrollTop" class="right-scroll-view" scroll-y="" :style="{ height: `${wh}px` }">
        <!-- 二级分类 -->
        <view class="cate-lv2" v-for="(item2, index2) of cateLevel2" :key="index2">
          <view class="cate-lv2-title">/ {{ item2.cat_name }} /</view>
          <!-- 三级分类 -->
          <view class="cate-lv3">
            <view @click="gotoGoodsList(item3)" class="cate-lv3-item" v-for="(item3, index3) of item2.children" :key="index3">
              <image :src="item3.cat_icon"></image>
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      active: 0, // 一级默认激活项
      wh: 0, // 窗口的可用高度
      cateList: [], // 一级分类数据列表
      cateLevel2: [], // 二级分类数据列表
      scrollTop: [] // 距离顶部距离
    };
  },
  onLoad() {
    // 获取设备信息 加了Sync是同步
    const sysinfo = uni.getSystemInfoSync();
    // windowWidth 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
    this.wh = sysinfo.windowHeight - 50;

    this.getCateList();
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data } = await uni.$http.get('/api/public/v1/categories');
      if (data.meta.status !== 200) return uni.$showMsg('获取分类失败!');
      // 一级分类
      this.cateList = data.message;
      // 二级分类
      this.cateLevel2 = this.cateList[this.active].children;
      // console.log(data);
    },
    onChange(index) {
      // 切换一级分类的active
      this.active = index;
      // 切换二级分类列表
      this.cateLevel2 = this.cateList[index].children;
      // 让右侧滚动条回到顶部
      // 如果值不变 是不会触发scroll-top视图更新的
      this.scrollTop = this.scrollTop ? 0 : 1;
    },
    // 点击三级分类跳转商品详情
    gotoGoodsList(item3) {
      uni.navigateTo({
        url: `/subpkg/goods_list/goods_list?cid=${item3.cat_id}`
      });
    },
    // 跳转到分包的搜索页面
    gotoSearch() {
      uni.navigateTo({
        url: '/subpkg/search/search'
      });
    }
  }
};
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-view-item {
      line-height: 60px;
      text-align: center;
      background-color: #f7f7f7;
      font-size: 12px;
      &.active {
        background-color: #fff;
        position: relative;
        &::after {
          content: ' ';
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-title {
    text-align: center;
    font-weight: bolder;
    font-size: 12px;
    padding: 15px 0;
  }
  .cate-lv3 {
    display: flex;
    flex-wrap: wrap;
    .cate-lv3-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 33.33%;
      margin-bottom: 10px;
      image {
        width: 60px;
        height: 60px;
      }
      text {
        font-size: 12px;
      }
    }
  }
}
</style>

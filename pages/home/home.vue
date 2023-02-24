<template>
  <view>
    <!-- 搜索区域 -->
    <view class="search-box"><my-search @click="gotoSearch"></my-search></view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`"><image :src="item.image_src"></image></navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" @click="navClickHandler(item)" v-for="(item, index) of navList" :key="index"><image :src="item.image_src" class="nav-img"></image></view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层每一项 -->
      <view class="floor-item" v-for="(item, index) of floorList" :key="index">
        <!-- 标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <!-- widthFix 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变 -->
            <!-- heightFix 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变 -->
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
          </navigator>
          <!-- 右侧盒子 -->
          <view class="right-img-box">
            <navigator class="item-img-box" :url="item2.url" v-for="(item2, index2) of item.product_list" :key="index2" v-if="index2 !== 0">
              <image :src="item2.image_src" :style="{ width: item2.image_width + 'rpx' }" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { $http } from '@escook/request-miniprogram';
export default {
  data() {
    return {
      swiperList: [], // 轮播图列表
      navList: [], // 一级分类列表
      floorList: [] // 首页楼层列表
    };
  },
  onLoad() {
    // 调用请求接口方法
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },
  methods: {
    // 获取首页楼层
    async getFloorList() {
      const { data } = await uni.$http.get('/api/public/v1/home/floordata');
      if (data.meta.status !== 200) return uni.$showMsg('楼层获取失败！');
      // 后台返回的目标url跟我们要跳转的路径不符合 根据这个url 拼接一个我们自己的
      data.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
        });
      });
      this.floorList = data.message;
    },
    navClickHandler(item) {
      // 点击判断 跳转到分类
      if (item.name === '分类') {
        uni.switchTab({
          url: '/pages/cate/cate'
        });
      }
    },
    // 获取轮播图列表
    async getSwiperList() {
      const { data } = await uni.$http.get('/api/public/v1/home/swiperdata');
      // 判断获取轮播图是否成功 状态码不为200 提示用户并退出
      if (data.meta.status !== 200) return uni.$showMsg('轮播图获取失败！');
      // 把数据赋值给本地轮播图列表
      this.swiperList = data.message;
    },
    // 获取分类列表
    async getNavList() {
      const { data } = await uni.$http.get('/api/public/v1/home/catitems');
      if (data.meta.status !== 200) return uni.$showMsg('分类列表获取失败！');
      this.navList = data.message;
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
swiper {
  height: 330rpx;
}

.swiper-item,
image {
  width: 100%;
  height: 100%;
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title {
  height: 60rpx;
  width: 100%;
}

.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding: 10rpx;
}
.search-box {
  // 设置定位效果为“吸顶”
  position: sticky;
  // 吸顶的“位置”
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
}
</style>

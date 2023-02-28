<template>
  <view>
    <view class="goods-detail-container">
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
        <swiper-item v-for="(item, index) of goods_info.pics" :key="index">
          <image :src="item.pics_big" @click="previewImg(index)"></image>
        </swiper-item>
      </swiper>
      <!-- 商品信息区域 -->
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="price">￥{{ goods_info.goods_price }}</view>
        <!-- 信息主题区域 -->
        <view class="goods-info-body">
          <!-- 商品名称 -->
          <view class="goods-name">{{ goods_info.goods_name }}</view>
          <!-- 收藏 -->
          <view class="favi">
            <uni-icons type="star" size="18" color="gray"></uni-icons>
            <text>收藏</text>
          </view>
        </view>
        <!-- 运费 -->
        <view class="yf">快递:免运费</view>
      </view>
      <!-- 使用富文本显示商品介绍 -->
      <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    </view>
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav
        :fill="true"
        :options="options"
        :buttonGroup="buttonGroup"
        @click="onClick"
        @buttonClick="buttonClick"
      />
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
export default {
  computed: {
    ...mapState('m_cart', []),
    ...mapGetters('m_cart', ['cartTotal'])
  },
  data() {
    return {
      // 商品详情对象
      goods_info: {},
      // 商品导底部航配置项
      options: [
        {
          icon: 'shop',
          text: '店铺',
          info: 2,
          infoBackgroundColor: '#ff0000',
          infoColor: '#fff'
        },
        {
          icon: 'cart',
          text: '购物车',
          info: 0
        }
      ],
      buttonGroup: [
        {
          text: '加入购物车',
          backgroundColor: '#ff0000',
          color: '#fff'
        },
        {
          text: '立即购买',
          backgroundColor: '#ffa200',
          color: '#fff'
        }
      ]
    };
  },
  onLoad(options) {
    // 获取传过来的id
    const goods_id = options.goods_id;
    this.getGoodsInfo(goods_id);
  },
  watch: {
    cartTotal: {
      handler(newVal) {
        // newVal就是购物车最新商品数量
        // 找到购物车那个对象 找不到为undefined
        const dataCart = this.options.find(item => item.text === '购物车');
        if (dataCart) dataCart.info = newVal;
      },
      immediate: true // 页面加载执行一次,立即监听
    }
  },
  methods: {
    // vuex 添加到购物车方法
    ...mapMutations('m_cart', ['addToCart']),
    // 获取商品详情
    async getGoodsInfo(id) {
      const { data } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id: id });
      if (data.meta?.status !== 200) return uni.$showMsg('获取商品详情失败！');
      // 去除商品介绍图片上下的间隙 因为是图片是行内块元素 解决ios不支持webp格式
      data.message.goods_introduce = data.message.goods_introduce
        .replace(/<img /g, '<img style="display:block;" ')
        .replace(/webp/g, 'jpg');
      this.goods_info = data.message;
    },
    // 预览轮播图
    previewImg(i) {
      // uni 的图片预览
      uni.previewImage({
        // 预览项 显示的图片
        current: i,
        // 所有的图片路径
        urls: this.goods_info.pics.map(x => x.pics_big)
      });
    },
    // 商品导航左侧按钮点击事件
    onClick(e) {
      // console.log(e);
      // 判断是否点击购物车 跳转到购物车页面
      if (e.content.text) {
        uni.switchTab({
          url: '/pages/cart/cart'
        });
      }
    },
    // 商品导航右侧按钮点击事件
    buttonClick(e) {
      // console.log(e);
      if (e.content.text === '加入购物车') {
        // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
        const { goods_id, goods_name, goods_price, goods_small_logo } = this.goods_info;
        const goods = {
          goods_id,
          goods_name,
          goods_price,
          goods_small_logo,
          goods_count: 1,
          goods_state: true
        };
        this.addToCart(goods);
        uni.$showMsg('加入购物车成功');
      }
    }
  }
};
</script>

<style lang="scss">
swiper {
  height: 750rpx;
}
image {
  width: 100%;
  height: 100%;
}
// 商品信息区域的样式
.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}

.goods_nav {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.goods-detail-container {
  padding-bottom: 50px;
}
</style>

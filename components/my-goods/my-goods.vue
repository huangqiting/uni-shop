<template>
  <view>
    <view class="goods-item">
      <!-- 商品左侧图片区域 -->
      <view class="goods-item-left">
        <radio
          :checked="goods.goods_state"
          @click="radioClickHandler"
          color="#c00000"
          v-if="showRadio"
        />
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 商品右侧信息区域 -->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-name">{{ goods.goods_name }}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">￥{{ goods.goods_price | toFixed }}</view>
          <!-- 商品数量 -->
          <uni-number-box
            v-if="showNum"
            @change="numChangeHandler"
            v-model="goods.goods_count"
            max="999"
            min="1"
          ></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-goods',
  props: {
    // 商品对象
    goods: {
      type: Object,
      default: {}
    },
    // 控制单选显示
    showRadio: {
      type: Boolean,
      default: false
    },
    // 控制单选显示
    showNum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 默认的空图片
      defaultPic:
        'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
    };
  },
  filters: {
    // 把数字处理为带两位小数点的数字
    toFixed(num) {
      return Number(num).toFixed(2);
    }
  },
  methods: {
    // 点击单选框 修改对应购物车商品 是否被选中
    radioClickHandler() {
      this.$emit('radio-change', {
        goods_id: this.goods.goods_id,
        goods_state: !this.goods.goods_state
      });
    },
    // 改变数组输入框 修改对应购物车商品数量
    numChangeHandler(val) {
      this.$emit('num-change', {
        goods_id: this.goods.goods_id,
        goods_count: +val
      });
    }
  }
};
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left {
    margin-right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goods-info-box {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .goods-name {
      font-size: 13px;
    }

    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>

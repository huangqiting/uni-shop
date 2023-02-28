<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <my-address></my-address>
    <!-- 购物车商品列表标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 商品列表区域 -->
    <!-- 滑动删除 -->
    <uni-swipe-action>
      <block v-for="(goods, index) of cart" :key="goods.goods_id">
        <uni-swipe-action-item
          :right-options="options"
          @click="swipeActionClickHandler(goods.goods_id)"
        >
          <my-goods
            :showNum="true"
            :showRadio="true"
            @num-change="onNumChange"
            @radio-change="onRadioChange"
            :goods="goods"
          ></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>
  <view class="empty-cart" v-else>
    <image src="../../static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('m_cart', ['cart'])
    // cart() {
    //   return this.$store.state.m_cart.cart;
    // }
  },

  data() {
    return {
      // 滑动删除配置项
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }
      ]
    };
  },
  methods: {
    // 子传父 传修改过的商品id 和 state
    onRadioChange(obj) {
      // 调用vuex updateGoodsState方法 修改购物车商品勾选状态
      this.$store.commit('m_cart/updateGoodsState', obj);
    },
    // 子传父 传修改过的商品id 和 count
    onNumChange(obj) {
      // 调用vuex updateGoodsCount方法 修改购物车商品数量
      this.$store.commit('m_cart/updateGoodsCount', obj);
    },
    // 根据商品id 点击滑动删除购物车商品
    swipeActionClickHandler(id) {
      this.$store.commit('m_cart/removeGoodsById', id);
      uni.$showMsg('删除商品成功');
    }
  }
};
</script>

<style lang="scss">
.cart-title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.cart-container {
  padding-bottom: 50px;
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  .empty-img {
    width: 90px;
    height: 90px;
  }
  .tip-text {
    font-size: 14px;
    margin-top: 15px;
    color: gray;
  }
}
</style>

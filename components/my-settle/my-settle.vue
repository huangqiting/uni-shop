<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isCheckAll" />
      <text>全选</text>
    </label>
    <!-- 合计区域 -->
    <view class="amount-box">
      合计:
      <text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'my-settle',
  data() {
    return {};
  },
  computed: {
    ...mapGetters('m_cart', ['checkedCount', 'cartTotal', 'checkedGoodsAmount']),
    // 结算全选
    isCheckAll(state) {
      return this.cartTotal === this.checkedCount && this.cartTotal !== 0;
    }
  },
  // 点击全选 更新所有购物车商品状态
  methods: {
    changeAllState() {
      // 调用vuex 更新方法
      this.$store.commit('m_cart/updateAllGoodsState', !this.isCheckAll);
    }
  }
};
</script>

<style lang="scss">
.my-settle-container {
  // 固定底部定位
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  .radio {
    padding-left: 5px;
  }
  .amount-box {
    .amount {
      color: #c00000;
    }
  }
  .btn-settle {
    padding: 0 5px;
    height: 50px;
    color: white;
    width: 100px;
    line-height: 50px;
    background-color: #c00000;
    text-align: center;
  }
}
</style>

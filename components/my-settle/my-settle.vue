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
    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'my-settle',
  data() {
    return {
      // 倒计时秒数
      seconds: 3,
      timer: null
    };
  },
  computed: {
    ...mapGetters('m_cart', ['checkedCount', 'cartTotal', 'checkedGoodsAmount']),
    ...mapState('m_cart', ['cart']),
    ...mapGetters('m_user', ['addstr']),
    ...mapState('m_user', ['token']),
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
    },
    // 购物车结算
    settlement() {
      if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！');
      if (!this.addstr) return uni.$showMsg('请选择收获地址！');
      // if (!this.token) return uni.$showMsg('请先登录！');
      if (!this.token) return this.delayNavigate();

      // 实现微信支付
      this.payOrder();
    },
    // 微信支付
    async payOrder() {
      const orderInfo = {
        // 开发期间，注释掉真实价格
        order_price: 0.01,
        consignee_addr: this.addstr,
        goods: this.cart
          .filter(item => item.goods_state)
          .map(x => {
            return {
              goods_id: x.goods_id,
              goods_number: x.goods_count,
              goods_price: x.goods_price
            };
          })
      };
      // 获取订单编号
      const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
      // if (res.meta.status !== 200) return uni.$showMsg('获取订单失败');
      const orderNumber = 'h151546813511';
      console.log(res);

      // 2. 订单预支付
      // 2.1 发起请求获取订单的支付信息
      const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
        order_number: orderNumber
      });
      // 2.2 预付订单生成失败
      if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！');
      // 2.3 得到订单支付相关的必要参数
      const payInfo = res2.message.pay;

      // 3. 发起微信支付
      // 3.1 调用 uni.requestPayment() 发起微信支付
      const [err, succ] = await uni.requestPayment(payInfo);
      // 3.2 未完成支付
      if (err) return uni.$showMsg('订单未支付！');
      // 3.3 完成了支付，进一步查询支付的结果
      const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
        order_number: orderNumber
      });
      // 3.4 检测到订单未支付
      if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！');
      // 3.5 检测到订单支付完成
      uni.showToast({
        title: '支付完成！',
        icon: 'success'
      });
    },

    // 倒计时提示
    showTips(time) {
      uni.showToast({
        icon: 'none',
        title: `请登录后再结算！${time} 秒后自动跳转到登录页`,
        duration: 1500,
        mask: true
      });
    },
    // 延时导航到登录页面
    delayNavigate() {
      this.showTips(this.seconds);
      this.timer = setInterval(() => {
        this.seconds--;
        this.showTips(this.seconds);
        if (this.seconds <= 0) {
          // 重置倒计时秒数
          this.seconds = 3;
          clearInterval(this.timer);
          uni.switchTab({
            url: '/pages/my/my',
            // 跳转成功后回调
            success: () => {
              this.$store.commit('m_user/updateRedirectInfo', {
                // 跳转方式
                openType: 'switchTab',
                // 从哪个页面跳转过去
                from: '/pages/cart/cart'
              });
            }
          });
        }
      }, 1000);
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

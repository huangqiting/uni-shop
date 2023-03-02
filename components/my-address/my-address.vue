<template>
  <view>
    <!-- 选择收货的盒子 -->
    <view class="address-choose-box" v-if="!address.userName">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">
        请选择收获地址+
      </button>
    </view>
    <!-- 收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{ address.userName }}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{ address.telNumber }}</view>
          <uni-icons type="arrowright" size="16px"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收获地址：</view>
        <view class="row2-right">{{ addstr }}</view>
      </view>
    </view>
    <!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'my-address',
  data() {
    return {
      // 收获地址
      // address: {}
    };
  },
  computed: {
    // 收获地址
    ...mapState('m_user', ['address']),
    ...mapGetters('m_user', ['addstr'])
  },
  methods: {
    // 选择收获地址
    async chooseAddress() {
      // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
      //    需要在app.json开启 chooseAddress: 获取用户地址信息
      //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
      const [err, succ] = await uni.chooseAddress().catch(err => err);
      console.log(err, succ);
      // 用户选择收获地址 点击确定
      if (err === null && succ.errMsg === 'chooseAddress:ok') {
        // 存到vuex里
        this.$store.commit('m_user/updateAddress', succ);
        uni.$showMsg('添加成功');
      }
    }
  }
};
</script>

<style lang="scss">
// 底部边框线的样式
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}
.address-choose-box {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address-info-box {
  font-size: 13px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }
  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>

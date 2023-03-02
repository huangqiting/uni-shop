<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 获取用户信息  open-type="getUserInfo" @getuserinfo 都是固定写法-->
    <button class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'my-login',
  data() {
    return {};
  },
  computed: {
    ...mapState('m_user', ['redirectInfo'])
  },
  methods: {
    // 获取用户信息
    getUserInfo(e) {
      // 判断是否获取用户信息成功
      if (e.detail.errMsg === 'getUserInfo:fail auth deny')
        return uni.$showMsg('您取消了登录授权！');
      // 把用户信息存到vuex 以及持久化处理
      this.$store.commit('m_user/updateUserInfo', e.detail.userInfo);
      this.getToken(e.detail);
    },
    // 获取token
    async getToken(info) {
      // 调用微信登录接口
      const [err, data] = await uni.login().catch(err => err);
      // 判断是否登录成功
      if (err || data.errMsg !== 'login:ok') return uni.$showMsg('登录失败!');
      // 准备获取token的参数
      const query = {
        code: data.code,
        encryptedData: info.encryptedData,
        iv: info.iv,
        rawData: info.rawData,
        signature: info.signature
      };
      // 请求token
      const { data: res } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
      // if (res.meta.status !== 200) return uni.$showMsg('登录失败!');
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      // 存一个模拟token
      this.$store.commit('m_user/updateToken', token);
      this.navigateBack();
      uni.$showMsg('登录成功!');
    },
    // 返回之前的页面
    navigateBack() {
      if (this.redirectInfo) {
        // 动态跳转tabbar 还是 页面
        uni[this.redirectInfo.openType]({
          url: this.redirectInfo.from,
          success: () => {
            this.$store.commit('m_user/updateRedirectInfo', null);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.login-container {
  height: 750rpx;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .btn-login {
    border-radius: 100px;
    width: 90%;
    background-color: #c00000;
    color: #fff;
    margin: 15px 0;
  }
  .tips-text {
    font-size: 14px;
    color: gray;
  }
}
</style>

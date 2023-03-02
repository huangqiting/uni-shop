export default {
  // 开启命名空间
  namespaced: true,
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token'),
    // 用户信息
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    // 重定向obj对象
    redirectInfo: null
  }),
  mutations: {
    updateAddress(state, address) {
      state.address = address
      // 调用持久化方法
      this.commit('m_user/saveAddressToStorage')
    },
    // 本地存储持久化
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新用户信息
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 用户信息持久化
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    // 更新token
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    // token持久化
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    // 更新重定向对象
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
      console.log(info);
    }
  },
  getters: {
    addstr(state) {
      // 用户还没选择收获地址 返回空
      if (!state.address.userName) return '';
      // 返回拼接的地址 省 市 区 具体地方
      return (
        state.address.provinceName +
        state.address.cityName +
        state.address.countyName +
        state.address.detailInfo
      );
    }
  }
}

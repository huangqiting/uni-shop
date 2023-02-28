export default {
  // 开启命名空间
  namespaced: true,
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}')
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

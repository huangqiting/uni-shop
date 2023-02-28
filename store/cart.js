export default {
  // 开启命名空间
  namespaced: true,
  state: () => ({
    // 存储购物车每个商品信息对象
    cart: JSON.parse(uni.getStorageSync('cart') || '[]') // 读取本地存储的购物车数据
  }),
  mutations: {
    // 添加到购物车
    addToCart(state, goods) {
      // 根据提交商品的id 判断购物车是否已经有该商品
      // find 找到相同的则返回该对象 和原对象是同一地址 否则返回undefined
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      // 如果找到了 则商品数量++
      if (findResult) {
        findResult.goods_count++
      } else {
        // 没找到就添加到购物车
        state.cart.push(goods)
      }
      // console.log(findResult);
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },
    // 将购物车数据持久化到本地存储
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 修改购物车商品勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    // 修改购物车商品数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据id删除购物车商品
    removeGoodsById(state, id) {
      // 把相同的id筛选掉 实现删除该商品
      state.cart = state.cart.filter(item => item.goods_id !== id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车所有商品状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(item => item.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },
  getters: {
    // 动态的修改购物车商品的数量
    cartTotal(state) {
      return state.cart.reduce((pre, item) => pre + item.goods_count, 0)
    },
    // 结算勾选商品数量
    checkedCount(state) {
      // 把勾选的筛选出来 再把数量累加
      return state.cart.filter(v => v.goods_state).reduce((count, item) => count + item.goods_count, 0)
    },
    // 已勾选商品的总价
    checkedGoodsAmount(state) {
      return state.cart.filter(v => v.goods_state).reduce((price, item) => price + (item.goods_count * item
        .goods_price), 0).toFixed(2)
    }
  }
}

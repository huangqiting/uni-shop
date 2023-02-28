import {
  mapGetters
} from 'vuex';

export default {
  computed: {
    // ...mapGetters('m_cart', ['cartTotal'])
    ...mapGetters('m_cart', {
      badge_total: 'cartTotal' // 给对象的getters起别名
    })
  },
  // 监听购物车商品数量
  watch: {
    badge_total() {
      this.setBadge();
    }
  },
  onShow() {
    this.setBadge(); // 在页面刚展示的设置数组徽章
  },
  methods: {
    setBadge() {
      // 设置右上角数组徽章
      uni.setTabBarBadge({
        index: 2, // tabbar的索引位置
        text: this.badge_total + '' // text的值必须是字符串 不能是数字
      });
    }
  }
};

import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store/index.js'
Vue.config.productionTip = false
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http
uni.$showMsg = function(title = '请求失败', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  });
}
// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
$http.beforeRequest = function(opsions) {
  uni.showLoading({
    title: '加载中'
  })
  // 判断是否是要token的接口 统一携带请求头
  if (opsions.url.indexOf('/my/') !== -1 && store.state.m_user.token) {
    // console.log(opsions);
    // console.log(store.state.m_user.token);
    opsions.header = {
      Authorization: store.state.m_user.token
    }
  }
}
$http.afterRequest = function() {
  uni.hideLoading()
}

// 全局混入购物车数量徽章
import badgeMix from "@/mixins/tabbar-badge.js"
Vue.mixin(badgeMix)


App.mpType = 'app'
const app = new Vue({
  ...App,
  store // 挂载store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

import App from './App'

// #ifndef VUE3
import Vue from 'vue'
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
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
$http.beforeRequest = function() {
  uni.showLoading({
    title: '加载中'
  })
}
$http.afterRequest = function() {
  uni.hideLoading()
}
App.mpType = 'app'
const app = new Vue({
  ...App
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

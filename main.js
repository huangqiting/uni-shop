import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
// 导入请求库
import { $http }  from "@escook/request-miniprogram"
// 挂载到顶级对象 uni
uni.$http = $http
uni.$showMsg = (title = '数据加载失败！',duration = 1500) => {
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}
// 配置基地址
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求拦截器
$http.beforeRequest = function() {
  // 显示loading
  uni.showLoading({
    title:'加载中...'
  })
}
// 响应拦截器
$http.afterRequest = function() {
  // 隐藏loading
  uni.hideLoading()
}
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
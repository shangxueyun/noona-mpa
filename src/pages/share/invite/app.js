import 'es6-promise/auto'
import Vue from 'vue'
import App from './app.vue'
import FastClick from 'fastclick'
// Vue.config.productionTip = false
window.nativePublicParams = {}
// 解决300ms延时问题
FastClick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

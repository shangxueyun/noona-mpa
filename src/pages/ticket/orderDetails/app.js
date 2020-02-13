import 'es6-promise/auto'
import Vue from 'vue'
import App from './app.vue'
import { Native } from '@/common'
Vue.config.productionTip = false

// 获取公共参数
Native.getNativePublicParams().then((nativePublicParams) => {
  window.nativePublicParams = nativePublicParams
  console.log(nativePublicParams)
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: h => h(App)
  })
})

import 'es6-promise/auto'
import Vue from 'vue'
import App from './app.vue'
import 'swiper/dist/css/swiper.css'
import { Native } from '@/common'

Vue.config.productionTip = false

// 获取公共参数
Native.getNativePublicParams().then((nativePublicParams) => {
  window.nativePublicParams = nativePublicParams
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: h => h(App)
  })
})

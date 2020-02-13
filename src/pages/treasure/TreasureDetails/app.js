import 'es6-promise/auto'
import Vue from 'vue'
import Meta from 'vue-meta'
import App from './app.vue'
import { Drawer, Progress } from 'element-ui'
import * as Utils from '@/utils'
import 'element-ui/lib/theme-chalk/index.css'
import 'swiper/dist/css/swiper.css'
import { Native } from '@/common'

// 抽屉
Vue.component(Drawer.name, Drawer)
// 进度条
Vue.component(Progress.name, Progress)

// vue-meta configuration
Vue.use(Meta)
Vue.config.productionTip = false

// 分享详情页后不调Native
const type = Utils.parseQueryString(window.location.search).phase_id.split(',')[1]
if (type) {
  window.nativePublicParams = {}
  const vRouter = new Vue({
    el: '#app',
    render: h => h(App)
  })
  Vue.use({
    vRouter
  })
} else {
  // 获取公共参数
  Native.getNativePublicParams().then((nativePublicParams) => {
    window.nativePublicParams = nativePublicParams
    /* eslint-disable no-new */
    const vRouter = new Vue({
      el: '#app',
      render: h => h(App)
    })
    Vue.use({
      vRouter
    })
  })
}

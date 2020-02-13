<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="mall-mobile-container">
      <div class="list" v-if="list.length">
        <div class="item flex" v-for="(item, i) in list" :key="i">
          <div class="mobile flex_item">
            {{ item.phone }}
          </div>
          <label>{{ i+1 }}st {{ lang.unitText }}</label>
        </div>
      </div>

      <div class="empty-box" v-if="finished && list.length == 0">
        <div class="content">
          <img src="./images/empty.png" class="img" alt="">
          <div v-html="lang.empty" />
        </div>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Log, Share, Interface } from './config'
import { Native } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'Wallet',
  data () {
    return {
      lang: {}, // 语言包
      langPkg: 'en',
      loadingText: 'loading....',
      loadingStatus: 1, // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
      loading: false,
      finished: false,
      list: []
    }
  },
  components: {
    LoadPage
  },
  watch: {},
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    // 初始化
    ininData () {
      this.loading = true
      Interface.getInitData({ page: this.page }).then((res) => {
        let resData = res && res.data
        this.loadingStatus = 0
        let list = resData.list || []
        this.loading = false
        this.finished = true
        this.list = list
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 设置语言
    setLang () {
      let langObj = Utils.getLang()
      this.langPkg = langObj.langPkg
      this.loadingText = langObj.loading
      Interface.getAreaLangPackage({ langPkg: this.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          this.lang = res.data.mall.mobile
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.ininData()
          this.loadingStatus = 0
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    // 日志投递实例
    logEvent (key = 'load', params) {
      Log.demo(key, params)
    },
    // 分享实例
    share (params) {
      Share.demo(params)
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

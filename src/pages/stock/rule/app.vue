<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="rule-container">
      <div class="rule-container-box">
        <!-- <div class="rule-container-box__title">
          {{ lang.title }}
        </div> -->
        <div class="rule-container-box__content">
          <p>{{ lang.content1 }}</p>
          <p>{{ lang.content2 }}</p>
          <p>{{ lang.content3 }}</p>
          <p>{{ lang.content4 }}</p>
          <p>{{ lang.content5 }}</p>
          <p>{{ lang.content6 }}</p>
        </div>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Interface } from './config'
import { Native } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'StockRule',
  data () {
    return {
      lang: {},
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
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
    // 设置语言
    setLang () {
      let langObj = Utils.getLang()
      this.langPkg = langObj.langPkg
      this.loadingText = langObj.loading
      // Utils.log('langObj=>', langObj)
      Interface.getAreaLangPackage({ langPkg: this.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          this.loadingStatus = 0
          this.lang = res.data.stock.rule
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

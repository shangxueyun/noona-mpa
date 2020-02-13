<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="NBAbetRules-container">
      <!-- 轮播 -->
      <div class="NBAbetRules-container-background">
        <img style="width: 100%;" src="./images/header-Bj.png">
        <span class="header_text">{{ lang.instructions }}</span>
      </div>
      <div class="NBAbetRules-container-centent">
        <div class="NBAbetRules-container-centent-model">
          <p>
            {{ lang.slots1_1 }}
          </p>
          <p>
            {{ lang.slots1_2 }}
          </p>
          <p>
            {{ lang.slots1_3 }}
          </p>
          <p>
            {{ lang.slots1_4 }}
          </p>
          <p>
            {{ lang.slots1_5 }}
          </p>
        </div>
        <div class="NBAbetRules-container-centent-model two">
          <p class="header_text">
            {{ lang.headText }}
          </p>
          <p>
            {{ lang.slots2_1 }}
          </p>
          <p>
            {{ lang.slots2_2 }}
          </p>
          <p>
            {{ lang.slots2_3 }}
          </p>
          <p>
            {{ lang.slots2_4 }}
          </p>
          <p>
            {{ lang.slots2_5 }}
          </p>
        </div>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Interface, Log } from './config'
import { Native } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'NBAbetRules',
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
    // 日志投递实例
    logEvent (key, params) {
      Log.demo(key, params)
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
          this.lang = res.data.NBAbet.Rules
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          // 规则页展示
          this.logEvent('load', { event: 'P1_rules_show' })
          this.loadingStatus = 0
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

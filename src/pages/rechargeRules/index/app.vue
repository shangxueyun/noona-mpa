<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="recharge-container">
      <div class="recharge-container-header">
        <h3>{{ lang.headerGCash }}</h3>
        <p>Mga Ka-Noona! Noona coins can now be purchased using GCash.</p>
      </div>
      <div class="recharge-container-centent">
        <h3><i></i><span>{{ lang.Tocash }}</span></h3>
        <p class="placeholder">
          &nbsp;
        </p>
        <p>{{ lang.Tocashtext1 }}</p>
        <p>{{ lang.Tocashtext2 }}</p>
        <p>{{ lang.Tocashtext3 }}</p>
        <p>{{ lang.Tocashtext4 }}</p>
        <p class="number">
          {{ lang.number }}
        </p>
        <p class="number">
          {{ lang.Patricia }}
        </p>
        <p>5. <span class="black">{{ lang.VERYIMPORTANT }}</span>{{ lang.Tocashtext5_1 }}<span class="black">{{ lang.Noona }}</span>{{ lang.Tocashtext5_2 }}</p>
        <p>{{ lang.Tocashtext6 }}</p>
        <p>{{ lang.Tocashtext6_1 }}</p>
        <p>{{ lang.Tocashtext6_2 }}</p>
        <p>{{ lang.Tocashtext6_3 }}</p>
        <p>{{ lang.Tocashtext7 }}</p>
        <p>{{ lang.Tocashtext8 }}</p>
        <div class="userIdImg"></div>
        <h3><i></i><span>{{ lang.Notes }}</span></h3>
        <p class="placeholder">
          &nbsp;
        </p>
        <p>{{ lang.Notestext1 }}</p>
        <p>{{ lang.Notestext2 }}</p>
        <p>{{ lang.Notestext3 }}</p>
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
  name: 'RechargeIndex',
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
  mounted () {
    // // 客户端关注/字体设置
    // Native.goPayOrderListFunc(({ clientParams, clientCallback }) => {
    //   Native.goPayOrderList()
    //   const callbackParams = { code: 200, msg: 'success', data: '漂亮！' }
    //   clientCallback(callbackParams)
    // }, true)
  },
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
          this.lang = res.data.rechargeRules.index
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
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
<style>
* {
  -webkit-user-select: text;
  -user-select: text;
  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
[contenteditable = "true"], input, textarea {
  -webkit-user-select: auto!important;
  -khtml-user-select: auto!important;
  -moz-user-select: auto!important;
  -ms-user-select: auto!important;
  -o-user-select: auto!important;
  user-select: auto!important;
}
</style>

<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="Rules-container">
      <!-- 轮播 -->
      <div class="Rules-container-background">
        <img style="width: 100%;" src="./images/header-Bj.png">
      </div>
      <div class="Rules-container-centent">
        <div class="Rules-container-centent-model-one">
          <div class="wire_div">
            {{ lang.HowPlay }}
            <span class="wire"><i></i></span>
            <span class="wire"><i></i></span>
          </div>
          <p class="oneInfo">
            {{ lang.Ex }}<span style="color:#E04141">5 coins</span>{{ lang.slots }}
          </p>
          <div class="ionc-div">
            <nav>
              <li>
                <p>{{ lang.slot1 }}</p>
                <img src="./images/hand1.png">
                <p>{{ lang.rate1 }}</p>
                <span class="wire"></span>
              </li>
              <li>
                <p>{{ lang.slot2 }}</p>
                <img src="./images/hand2.png">
                <p>{{ lang.rate2 }}</p>
                <span class="wire"></span>
              </li>
              <li>
                <p>{{ lang.slot1 }}</p>
                <img src="./images/hand3.png">
                <p>{{ lang.rate1 }}</p>
              </li>
            </nav>
          </div>
          <i class="ionc_left"></i>
          <i class="ionc_right"></i>
        </div>
        <div class="Rules-container-centent-model-two">
          <p class="raffleDrawn">
            {{ lang.raffleDrawn }}
          </p>
          <div class="ionc-div">
            <nav>
              <li>
                <p>Loss</p>
                <img src="./images/Loss1.png">
                <p>A</p>
              </li>
              <li>
                <p>Win</p>
                <img src="./images/Win.png">
                <p>B</p>
              </li>
              <li>
                <p>Loss</p>
                <img src="./images/Loss2.png">
                <p>C</p>
              </li>
            </nav>
          </div>
          <i class="ionc_left"></i>
          <i class="ionc_right"></i>
        </div>
        <div class="Rules-container-centent-model-three">
          <p class="header_text">
            Terms &Conditions
          </p>
          <p>1. Lucky coin game can only be played in the Noona App. </p>
          <p>2. The number of slots is determined by the value of the item. </p>
          <p>3. You need to connect your mobile phone number to participate in the Lucky coin game. </p>
          <p>4. The maximum number of slots that a single user can buy will not exceed half the number of slots needed for that item. </p>
          <p>5. Each item will have one winner. The more slots you buy, the higher the chances of winning. </p>
          <p>6. To ensure fairness, the winner is calculated by a computerized formula which automatically selects one entry as soon as the last slot is purchased. </p>
          <p>7. If the slots are not filled within 30 days, the amount you exchanged will be returned to your account. </p>
          <p>8. Noona reserves the right to disqualify entries from user accounts that are found to be fraudulent.</p>
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
  name: 'TreasureRules',
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
          this.lang = res.data.treasure.Rules
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

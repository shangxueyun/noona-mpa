<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="mall-container">
      <div class="type-tab">
        <div class="tab" :class="{cur: type ==1}" @click="switchTab(1)">
          {{ lang.globeTitle }}
        </div>
        <div class="tab" :class="{cur: type ==2}" @click="switchTab(2)">
          {{ lang.smartTitle }}
        </div>
      </div>
      <section class="recharge-box">
        <div class="gold-count">
          <!-- <label>{{ lang.yourOwn }}</label> -->
          <label>{{ lang.yourBalance }}</label>
          <div class="count" v-if="allGold <= 1">
            {{ allGold }} coin
          </div>
          <div class="count" v-else>
            {{ allGold }} coins
          </div>
        </div>
        <input
          ref="tel"
          type="tel"
          class="tel"
          v-model.trim="phone"
          maxlength="10"
          @blur="telValid"
          :placeholder="lang.enterYourPhoneNumber"
        >
        <div class="input-error">
          {{ errorMsg }}
        </div>

        <div class="list">
          <div class="item" @click="selectGold(item.key)" :class="{disabled: daylimit == 2, checked: curGold == item.key}" v-for="(item, i) in goldList" :key="i">
            <div class="tag">
              soldout
            </div>
            {{ item.value }}
          </div>
        </div>
        <div class="scale-tip">
          {{ lang.tip1 }}
        </div>
        <input
          type="button"
          v-show="isPay"
          :disabled="reChargeDisabled"
          @click="beforeRechangePhone"
          class="btn"
          :value="btnText"
        >
        <input type="button" class="btn" value="Must link phone number" v-show="isbindPhone" @click="goNativeBindPhone">
        <div class="service-box">
          <a href="javascript:;" class="link-service" @click="jumpUrl('terms')">{{ lang.tip2 }}</a>
        </div>
      </section>
    </div>
    <popup-notice v-model="alert.confirm" :is-close="false" content-class="confirm-container">
      <img src="./images/alert-head.png" class="img" alt="">
      <section class="content">
        <div class="row">
          {{ lang.popupMobile }}: {{ phone }}
        </div>
        <div class="row">
          {{ lang.popupTopUp }} : <span>{{ curGold / 100 }}P</span>
        </div>
        <div class="tip">
          {{ lang.popupTip }}
        </div>
      </section>
      <footer class="footer">
        <input type="button" class="btn cancel" @click="alert.confirm=false" :value="lang.popupBtnCancel">
        <input type="button" class="btn" :disabled="disabled" @click="rechangePhone" :value="lang.popupBtnConfirm">
      </footer>
    </popup-notice>
    <div class="header-tip" v-if="showNotice">
      Load your phone at 00:00, 07:00, 12:00, 17:00 and 20:00 daily! Check your phone for the load within 7 days!<span class="close" @click="closeNotice" />
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Interface, Log } from './config'
import { PopupNotice } from '@/components/index'
import { Native, Url } from '@/common'
import * as Validate from '@/utils/validate'
import * as Utils from '@/utils'
export default {
  name: 'Wallet',
  data () {
    return {
      lang: {}, // 语言包
      langPkg: 'en',
      loadingText: 'loading....',
      btnText: '',
      loadingStatus: 1, // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
      loading: false,
      finished: false,
      list: [],
      allGold: 0,
      type: 1,
      phone: '',
      errorMsg: '',
      daylimit: 1,
      curGold: 5000,
      disabled: false,
      reChargeDisabled: true,
      goldList: [
        {
          key: 5000,
          value: '50'
        },
        {
          key: 10000,
          value: '100'
        },
        {
          key: 20000,
          value: '200'
        }, {
          key: 30000,
          value: '300'
        },
        {
          key: 40000,
          value: '400'
        },
        {
          key: 50000,
          value: '500'
        }
      ],
      alert: {
        confirm: false
      },
      isbindPhone: null,
      isPay: null,
      showNotice: null,
      showTip: null
    }
  },
  components: {
    LoadPage,
    PopupNotice
  },
  watch: {},
  computed: {
    // disabled () {
    //   let phone = this.phone
    //   if (!phone || !Validate.isPhone(phone)) {
    //     return true
    //   }
    //   let list = this.list
    //   let item = list.find((item) => item.phone == phone)
    //   if (list.length == 3 && !item) {
    //     return true
    //   }
    //   return false
    // }
  },
  created () {
    /* eslint-disable-next-line */
    String.prototype.format = function () {
      let values = arguments
      return this.replace(/\{(\d+)\}/g, function (match, index) {
        if (values.length > index) {
          return values[index]
        } else {
          return ''
        }
      })
    }
    this.isShowBindPhoneBtn()
    this.cookiedate()
    this.logEvent('load', { event: 'load_show' })
  },
  methods: {
    // 日志投递实例
    logEvent (key, params) {
      Log.demo(key, params)
    },
    jumpUrl (type) {
      let url
      if (type == 'terms') {
        url = Utils.replaceLangUrl(Url.mallTermsPage, this.langPkg)
        this.logEvent('load', { event: 'load_terms_show' })
      }
      url && Native.setJumpUrl({ url })
    },
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
        resData.allGold = resData.allGold ? resData.allGold : 0
        this.allGold = (resData.allGold / 100).toFixed(2)
        this.daylimit = resData.daylimit
        this.finished = true
        this.exchangeBtnText()
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    getPhone () {
      Interface.getPhone().then((res) => {
        let resData = res && res.data
        let list = resData.list || []
        this.list = list
        // 数据处理
      }).catch((err) => {
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
          this.lang = res.data.mall.index
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.setNativeSubtitle()
          this.ininData()
          this.getPhone()
          this.loadingStatus = 0
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    telValid () {
      this.logEvent('load', { event: 'load_phone_click' })
      let phone = this.phone
      if (!phone || !Validate.isPhone(phone)) {
        this.errorMsg = this.lang.telErrorTip
        return this.lang.telErrorTip
      }
      let list = this.list
      let item = list.find((item) => item.phone == phone)
      if (list.length == 3 && !item) {
        this.errorMsg = this.lang.telLimitTip
        return this.lang.telLimitTip
      }
      this.errorMsg = ''
      return ''
    },
    exchangeBtnText () {
      let gold = this.curGold / 100
      let lang = this.lang
      if (gold <= 1) {
        this.btnText = lang.btnText.format(gold) + ' coin'
      } else {
        this.btnText = lang.btnText.format(gold) + ' coins'
      }
      if (this.allGold < gold || this.daylimit == 2) {
        this.reChargeDisabled = true
      } else {
        this.reChargeDisabled = false
      }
    },
    selectGold (gold) {
      this.curGold = gold
      this.exchangeBtnText()
    },
    switchTab (type) {
      this.phone = ''
      this.errorMsg = ''
      this.type = type
    },
    beforeRechangePhone () {
      this.logEvent('load', { event: 'load_deduct_click' })
      if (this.daylimit == 2 || this.allGold < (this.curGold / 100)) {
        console.log('this.daylimit == 2 || this.allGold < this.curGold')
        return false
      }
      let msg = this.telValid()
      if (msg) {
        this.errorMsg = msg
        return false
      }
      this.alert.confirm = true
    },

    // 充值
    rechangePhone () {
      this.logEvent('load', { event: 'load_click_confirm' })
      this.disabled = true
      let data = {
        type: this.type,
        phone: this.phone,
        money: this.curGold / 100
      }
      Interface.rechargePhone(data).then((res) => {
        let resData = res.data
        this.disabled = false
        this.alert.confirm = false
        if (resData.isRecharge) {
          Utils.toast({
            message: this.lang.reChangeSuccess
          })
          this.ininData()
        } else {
          Utils.toast({
            message: resData.message
          })
        }
      }).catch(err => {
        this.disabled = false
        Utils.showError(err)
      })
    },
    setNativeSubtitle () {
      Native.setNativeSubtitle({
        categroy: 1, // 1跳转，2分享
        subTitle: {
          type: 2, // 1文本，2图片
          content: this.lang.nativeNavSubTitle, // 右上角文案
          imgUrl: `${Url.Web}/static/images/common/recharge.png`, // 图片链接地址
          webUrl: Url.mallHistoryPage // 跳转地址
        },
        share: {
          title: '', // 分享标题
          desc: '', // 分享描述
          imgUrl: ``, // 分享图标链接地址
          webUrl: `` // 分享跳转地址
        }
      })
    },
    getUserId () {
      var userParams = Utils.getParams()
      console.log(userParams.userId)
    },
    /**
     * 判断用户是否绑定过手机号
     * @param userId
     */
    isShowBindPhoneBtn () {
      /* let data = Utils.getParams().userId
      console.log(data) */
      let data = {
        userId: Utils.getParams().userId
      }
      if (nativePublicParams._aKey == 'ANDROID' && parseInt(nativePublicParams._vApp) < 8277) {
        this.showTip = true
      } else if (nativePublicParams._aKey == 'IOS' && parseInt(nativePublicParams._vApp) < 4330) {
        this.showTip = true
      }
      Interface.getUserInfo(data).then((res) => {
        let data = res.data.user.binding.phone
        if (!data) {
          this.isbindPhone = true
          this.isPay = false
        } else {
          this.isbindPhone = false
          this.isPay = true
        }
      })
    },
    goNativeBindPhone () {
      if (this.showTip) {
        Utils.toast({
          message: 'You need to upgrade to the latest version'
        })
      }
      Native.bindPhone({
        sourceType: 'topup'
      }).then(res => {
        console.log('返回结果')
        console.log(res.code)
        if (res.code == 200) {
          this.isbindPhone = false
          this.isPay = true
          console.log('绑定了')
        }
      })
    },
    cookiedate () {
      var s = document.cookie
      if (s.indexOf('myad=1') != -1) {
        return
      }
      var d = new Date()
      d.setHours(d.getHours() + 24)
      document.cookie = 'myad=1;expires=' + d.toGMTString()
      this.showNotice = true
    },
    closeNotice () {
      this.showNotice = false
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

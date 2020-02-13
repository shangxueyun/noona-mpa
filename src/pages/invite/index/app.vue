<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="head">
      <img width="100%" src="./images/invite-bg3.jpg">
      <span @click="jumpUrl('rules')">Rules</span>
    </div>
    <section class="invite-container">
      <div class="icon-decorate left" />
      <div class="icon-decorate right" />
      <div class="invite-box">
        <!--      <div class="head">
           <div class="lb1">
            {{ lang.headTip.tip1 }}
          </div>
           <div class="lb2">
            {{ lang.headTip.tip2 }}
          </div>
        </div> -->
        <div
          class="invite-code flex"
          style="background: -webkit-linear-gradient(#fd7832, #fe8030); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#fd7832, #FE8030); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#fd7832, #FE8030); /* Firefox 3.6 - 15 */
  background: linear-gradient(#fd7832, #FE8030); /* 标准的语法 */"
        >
          <div class="code-box flex flex_item">
            <div class="lb">
              {{ lang.codeText }} :
            </div>
            <div class="code">
              {{ inviteData.inviteCode }}
            </div>
            <a href="javascript:;" :data-clipboard-text="inviteData.inviteCode" class="copy-btn clipboardCode" @click="recordCopy">{{ lang.copyBtnText }}</a>
          </div>
          <!-- <a href="javascript:;" :data-clipboard-text="inviteData.inviteCode" class="copy-btn clipboardCode">{{ lang.copyBtnText }}</a> -->
        </div>
        <!-- 分享 -->
        <div class="share-box">
          <div class="title">
            <span />
            <em>share</em>
            <span />
          </div>
          <div class="content">
            <div class="item" @click="callSharePanel(11)">
              <img src="./images/share-fb.png" class="img" alt="">
              <div class="name">
                Facebook
              </div>
            </div>
            <div class="item" @click="callSharePanel(10)">
              <img src="./images/share-viber.png" class="img" alt="">
              <div class="name">
                Viber
              </div>
            </div>
            <div class="item" @click="callSharePanel(9)">
              <img src="./images/share-whatsapp.png" class="img" alt="">
              <div class="name">
                whatsApp
              </div>
            </div>
            <div class="item" @click="callSharePanel(12)">
              <img src="./images/share-line.png" class="img" alt="">
              <div class="name">
                Line
              </div>
            </div>
            <div class="item" @click="callSharePanel(-1)" style="margin-right:0">
              <img src="./images/share-more.png" class="img" alt="">
              <div class="name">
                {{ lang.shareMoreText }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="daybonus">
        <div class="daybonus-title">
          {{ 'Daily Bonus' }}
          <span style="float:right; color:#7D7D86">Currency: Cents</span>
        </div>
        <div class="daybonus-list">
          <div class="daybonus-list__item" :class="{pass: item.day <= inviteData.checkDay}" v-for="item in signGoldList" :key="item.day">
            <div class="daybonus-list__item--gold">
              <i class="tag" v-if="item.tip>0 && item.day > inviteData.checkDay">+{{ item.tip }}</i>
              {{ item.gold }}
            </div>
            <div class="daybonus-list__item--label">
              <template v-if="item.day == inviteData.checkDay">
                {{ lang.bounsDayCheckedText }}
              </template>
              <template v-else>
                {{ lang.bounsDayText }}{{ item.day }}
              </template>
            </div>
          </div>
        </div>
        <!--   -->
        <input type="button" disabled v-if="inviteData.isCheck" class="daybonus-checkbtn" :value="lang.checkedInBtn">
        <input type="button" @click="check" v-else class="daybonus-checkbtn" :value="lang.checkInBtn">
      </div>
      <div class="menu">
        <!-- <div class="menu-item flex" v-if="!inviteData.isInvite" @click="alert.showBindInviteCode = true"> -->
        <div class="menu-item flex" v-if="!inviteData.isInvite" @click="goNativeBindPhone">
          <img src="./images/invite.png" class="menu-item__icon" alt="">
          <div class="menu-item__text flex_item">
            {{ lang.linkTitle1 }}
          </div>
        </div>
        <div class="menu-item flex" @click="jumpUrl('rank')">
          <img src="./images/rank.png" class="menu-item__icon" alt="">
          <div class="menu-item__text flex_item">
            {{ lang.linkTitle2 }}
          </div>
        </div>
      </div>
    </section>
    <!-- 填写邀请码 -->
    <popup-notice v-model="alert.showBindInviteCode" content-class="bind-invite-container">
      <div class="invite-box">
        <section>
          <p class="title">
            {{ lang.popupTitle }}
          </p>
          <!-- <p class="title">{{ lang.task.center.inviteTitle2 }}</p> -->
          <div class="input-code">
            <input
              type="tel"
              v-fixedInput
              v-model.trim="invite.inputCode"
              maxlength="10"
              @keyup="checkInviteCodeError"
              @afterpaste="checkInviteCodeError"
              :placeholder="lang.popupPlaceHolder"
            >
          </div>
          <div class="error-container">
            {{ invite.inputError }}
          </div>
          <button class="goBind" :disabled="checkInviteCodeError() || invite.loading" @click="bindInviteCode()">
            {{ lang.popupTipsBtn1 }}
          </button>
        </section>
      </div>
    </popup-notice>
    <!-- 绑定结果 -->
    <popup-notice v-model="alert.showBindInviteCodeResult" content-class="bind-invite-container">
      <div class="invite-box success">
        <section>
          <p class="subTitle">
            {{ lang.popupTips2 }}
          </p>
          <!-- <p class="subTitle first">Verify success</p> -->
          <p class="subTitle">
            {{ lang['popupTips2-2'] }}
          </p>
          <button class="goBindOk" @click="closeDialog">
            {{ lang.popupTipsBtn2 }}
          </button>
        </section>
      </div>
    </popup-notice>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Log, Share, Interface } from './config'
import { Native, Url } from '@/common'
import fixedInput from '@/directives/fixedInput'
import { PopupNotice } from '@/components/index'
import Clipboard from 'clipboard'
import * as Utils from '@/utils'
import * as Validate from '@/utils/validate'
export default {
  name: 'Wallet',
  data () {
    return {
      lang: {
        headTip: {}
      }, // 语言包
      langPkg: 'en',
      loadingText: 'loading....',
      loadingStatus: 1, // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
      list: [],
      signGoldList: [
        {
          day: 1,
          gold: 5,
          tip: 0
        }, {
          day: 2,
          gold: 10,
          tip: 5
        }, {
          day: 3,
          gold: 15,
          tip: 10
        }, {
          day: 4,
          gold: 20,
          tip: 15
        }, {
          day: 5,
          gold: 30,
          tip: 0
        }, {
          day: 6,
          gold: 60,
          tip: 0
        }, {
          day: 7,
          gold: 80,
          tip: 50
        }
      ],
      invite: {
        loading: false,
        inputError: '',
        inputCode: ''
      },
      inviteData: {
        checkDay: 0,
        isCheck: 0,
        isInvite: 0,
        inviteCode: '',
        userId: ''
      },
      alert: {
        showBindInviteCode: false,
        showBindInviteCodeResult: false
      },
      isbindPhone: null,
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
    //   if (this.checkInviteCodeError()) {
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  },
  directives: {
    fixedInput
  },
  methods: {
    recordCopy () {
      this.logEvent('load', { event: 'invite_copy' })
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
        if (resData) {
          this.loadingStatus = 0
          this.inviteData = {
            inviteCode: resData.private.inviteCode,
            checkDay: resData.checkDay,
            isCheck: resData.isCheck,
            isInvite: resData.isInvite,
            userId: resData.basic.userId
          }
        } else {
          this.loadingStatus = 3
        }
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
      // Utils.log('langObj=>', langObj)
      Interface.getAreaLangPackage({ langPkg: this.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          this.lang = res.data.invite
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.setNativeSubtitle()
          this.ininData()
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },

    checkInviteCodeError () {
      let inputCode = this.invite.inputCode
      let disabled = true
      if (inputCode) {
        if (Validate.isMasterCode(inputCode)) {
          this.invite.inputError = ''
          disabled = false
        } else {
          this.invite.inputError = this.lang.popupInputError
          disabled = true
        }
      } else {
        this.invite.inputError = ''
        disabled = true
      }

      return disabled
    },
    // 绑定邀请码
    bindInviteCode () {
      let inputCode = this.invite.inputCode
      if (!this.checkInviteCodeError()) {
        this.invite.loading = true
        inputCode = parseInt(inputCode)
        Interface.binding({ code: inputCode }).then((res) => {
          this.invite.loading = false
          let resData = res.data
          if (resData.isBinding) {
            this.invite.inputCode = ''
            this.inviteData.isInvite = 1
            this.showDialog('bindInviteCodeResult')
            this.logEvent('load', { event: 'invitation_code_write', state: 'success' })
          } else {
            Utils.showError(resData.message)
            console.log(888999)
            console.log(resData.message)
            this.logEvent('load', { event: 'invitation_code_write', state: 'fail' })
            // this.invite.inputError = resData.message
          }
        }).catch((err) => {
          this.invite.loading = false
          Utils.showError(err)
          // this.invite.inputError = err.msg
        })
      } else {
        this.invite.inputError = ''
      }
    },
    showDialog (key) {
      this.closeDialog()
      switch (key) {
        case 'bindInviteCode': // 绑定邀请码
          this.invite.inputCode = ''
          this.alert.showBindInviteCode = true
          Log.event({ key: 'bindInviteBtn' })
          break
        case 'bindInviteCodeResult': // 绑定邀请码
          this.invite.inputCode = ''
          this.alert.showBindInviteCodeResult = true
          break
        default:
          break
      }
    },
    closeDialog () {
      // 绑定邀请码
      this.alert.showBindInviteCode = false
      // 绑定邀请码
      this.alert.showBindInviteCodeResult = false
    },
    // 签到
    check () {
      this.logEvent('load', { event: 'checkin_click_btn' })
      Interface.check().then((res) => {
        let resData = res.data
        if (resData.isCheck) {
          this.inviteData.isCheck = resData.isCheck
          this.inviteData.checkDay++
          let signGoldList = this.signGoldList
          let item = signGoldList.find(item => item.day == this.inviteData.checkDay)
          let checkInSuccess = this.lang.checkInSuccess || ''
          let total = 0
          if (item) {
            total = (item.gold + item.tip) / 100
          }
          let message = checkInSuccess.format(total)
          if (total <= 1) {
            message += ' coin'
          } else {
            message += ' coins'
          }
          Utils.toast({
            message: message
          })
        } else {
          Utils.toast({
            message: this.lang.checkInError
          })
        }
      }).catch((err) => {
        Utils.showError(err)
      })
    },
    callSharePanel (way) {
      let lang = this.lang
      Native.callSharePanel({
        title: lang.shareTitle,
        desc: lang.shareDesc,
        imgUrl: `${Url.Web}/static/images/common/share.png`,
        from: '',
        way: way || -1,
        webUrl: `${Url.shareInvitePage}?userId=${this.inviteData.userId}&lang=${this.langPkg}`
      })
    },
    setNativeSubtitle () {
      let webUrl = Utils.replaceLangUrl(Url.inviteRulePage, this.langPkg)
      Native.setNativeSubtitle({
        categroy: 1, // 1跳转，2分享
        subTitle: {
          type: 1, // 1文本，2图片
          content: this.lang.nativeNavSubTitle, // 右上角文案
          imgUrl: '', // 图片链接地址
          webUrl: webUrl // 跳转地址
        },
        share: {
          title: '', // 分享标题
          desc: '', // 分享描述
          imgUrl: ``, // 分享图标链接地址
          webUrl: `` // 分享跳转地址
        }
      })
    },

    jumpUrl (type) {
      let url
      if (type == 'rank') {
        this.logEvent('load', { event: 'leaderboard_click_btn' })
        url = Url.inviteRankPage
      } else if (type == 'rules') {
        url = Url.inviteRulePage
        this.logEvent('load', { event: 'invite_rules_show' })
      }
      url && Native.setJumpUrl({ url })
    },
    // 日志投递实例
    // logEvent (key = 'load', params) {
    //   Log.demo(key, params)
    // },
    logEvent (key, params) {
      Log.demo(key, params)
    },
    // 分享实例
    share (params) {
      Share.demo(params)
    },
    // 复制INIT
    clipboardInit () {
      let clipboardCode = new Clipboard('.clipboardCode')
      clipboardCode.on('success', (e) => {
        Utils.toast({
          message: this.lang.copySuccess
        })
        // Log.logEvent('copy')
      })
      clipboardCode.on('error', (e) => {
        // Log.logEvent('copy')
        Utils.toast({ message: this.lang.copyError })
      })
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
        } else {
          this.isbindPhone = false
        }
      })
    },
    goNativeBindPhone () {
      if (this.showTip) {
        Utils.toast({
          message: 'You need to upgrade to the latest version'
        })
      } else if (this.isbindPhone) {
        Native.bindPhone({
          sourceType: 'invite'
        }).then(res => {
          if (res.code == 200) {
            this.isbindPhone = false
            this.alert.showBindInviteCode = true
          }
        })
      } else {
        this.alert.showBindInviteCode = true
        this.logEvent('load', { event: 'invitation_code_show' })
      }
    }
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
    this.clipboardInit()
    this.isShowBindPhoneBtn()
    this.logEvent('load', { event: 'invite_page_show' })
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

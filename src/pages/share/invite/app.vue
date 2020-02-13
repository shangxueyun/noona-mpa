<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div v-if="userInfo && userInfo.basic" class="invite-container">
      <div class="invite-container__header">
        <div class="invite-container__header-banner">
          <img src="./images/head_logo@2x.png">
          <span>Bring together local news</span>
        </div>
      </div>
      <div class="invite-container__main">
        <!-- <p class="title">
          {{ lang.share.invite.title }}
        </p>
        <p class="subTitle">
          <span>{{ lang.share.invite.subTitle }}</span>
        </p> -->
        <p class="gift">
          <img src="./images/gift@2x.png">
        </p>
        <p class="userIcon">
          <span><img v-if="userInfo.basic.userIcon" :src="userInfo.basic.userIcon"></span>
          <span>{{ userInfo.basic.nickName }}</span>
          <span>{{ lang.share.invite.inviteTxt }}</span>
        </p>
        <p class="inviteCode">
          <span>
            <em>{{ lang.share.invite.inviteCodeTxt }}</em>
            <strong>{{ userInfo.private.inviteCode }}</strong>
          </span>
          <button :data-clipboard-text="userInfo.private.inviteCode" class="clipboard">
            {{ lang.share.invite.btnCopyTxt }}
          </button>
        </p>
        <p class="copyTips">
          {{ lang.share.invite.copyTxt }}
        </p>
      </div>
      <div class="invite-container__footer">
        <button @click="logEvent('downloadBtn')">
          {{ lang.share.invite.btnDownloadTxt }}
        </button>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
// import { pageLoading, pageBanner } from '@/components/load'
import { Interface, Url } from './config'
import Clipboard from 'clipboard'
import * as Utils from '@/utils'
import DeepLink from '@/utils/deepLink'
// import defaultAvatar from '../../../../static/common/images/default-avatar@3x.png'
export default {
  name: 'ShareInvite',
  data () {
    return {
      lang: {}, // 语言包
      langPkg: 'en',
      userInfo: [], // 用户信息
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage
  },
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    // 设置语言
    setLang () {
      let _self = this
      let langObj = Utils.getLang()
      _self.langPkg = langObj.langPkg
      _self.lang = {
        share: {
          common: {
            loading: langObj.loading
          }
        }
      }
      Utils.log('langObj=>', langObj)
      Interface.getAreaLangPackage({ langPkg: _self.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          _self.lang = res.data
          _self.ininData()
        } else {
          _self.loadingStatus = 2
        }
      }).catch((error) => {
        _self.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    // 日志投递
    logEvent (key, params = {}) {
      let url = Url.sHome
      // Log.event({key, params})
      DeepLink.callApp(url)
    },
    // 重试
    retryLoad () {
      this.loadingStatus = 1
      this.ininData()
    },
    ininData () {
      let _self = this
      let userId = Utils.getQueryString('userId') || 7159395567966880000
      let lang = _self.langPkg
      Utils.log('userId=>', userId)
      if (userId) {
        // 获取用户基本信息
        Interface.getShareInviteInfo({ userId, lang }).then((res) => {
          let data = res.data
          if (data) {
            _self.loadingStatus = 0
            _self.userInfo = data.user
          } else {
            _self.loadingStatus = 3
          }
          // pv
          // Log.event({key: 'pageView'})
        }).catch((error) => {
          Utils.log('getUserInfo-error=>', error)
          _self.loadingStatus = 2
        })
      } else {
        _self.loadingStatus = 3
      }
    },
    // 复制INIT
    clipboardInit () {
      let clipboardObj = new Clipboard('.clipboard')
      clipboardObj.on('success', (e) => {
        Utils.toast({
          message: 'Successful copy'
        })
        // Log.logEvent('copy')
      })
      clipboardObj.on('error', (e) => {
        // Log.logEvent('copy')
        Utils.toast({ message: 'Copy failed, please press and copy manually' })
      })
    }
  },
  mounted () {
    this.clipboardInit()
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

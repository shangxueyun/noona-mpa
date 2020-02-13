<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="wallet-container">
      <div class="glod-box">
        <div class="money">
          <nav>
            <li>
              <span class="text">
                {{ lang.yourOwn }}
              </span>
              <span class="number">
                {{ allGold }}
              </span>
            </li>
            <li>
              <span class="text">
                {{ lang.todayIncome }}
              </span>
              <span class="number">
                {{ todayGold }}
              </span>
            </li>
          </nav>
        </div>
        <div class="button">
          <div class="centent">
            <nav>
              <li>
                <div class="centent_div" @click="jumpUrl('recharge')">
                  <i class="cash"></i>
                  <span>
                    {{ lang.Cash }}
                  </span>
                </div>
              </li>
              <!-- <li>
                <div class="centent_div" style="width: 60%;margin: 0 0 0 auto;" @click="jumpUrl('mall')">
                  <i class="Top"></i>
                  <span>
                    {{ lang.btnText }}
                  </span>
                </div>
                <span class="wire"></span>
              </li> -->
            </nav>
          </div>
        </div>
        <!-- <div class="gold flex">
          <div class="money">
            1
          </div>
          <div class="button"></div>
          <div class="flex_item gold-item">
            <div class="label">
              {{ lang.yourOwn }}
            </div>
            <div class="count">
              <span>₱</span>{{ allGold }}
            </div>
            <div class="label">
              {{ lang.todayIncome }}
            </div>
            <div class="count income">
              <span>₱</span>{{ todayGold }}
            </div>
          </div>
          <div><a href="javascript:;" class="btn-link" @click="jumpUrl('mall')">{{ lang.btnText }}</a></div>
        </div> -->
      </div>
      <div class="detail-box">
        <div class="title">
          {{ lang.detailTitle }}
        </div>
        <scroll-list :loading="loading" :loading-text="loadingText" :finished="finished" @load="ininData">
          <div class="list">
            <div class="item flex" v-for="(item, i) in list" :key="i">
              <div class="flex_item">
                <div class="item-title">
                  {{ item.typeWord }}
                </div>
                <div class="item-date">
                  {{ item.createTime }}
                </div>
              </div>
              <div class="flex item-count flex_center" :class="{subtract: item.gold < 0}">
                <template v-if="item.subType == 2">
                  - {{ item.gold / 100 }}&nbsp;<span v-if="item.gold / 100 <= 1">coin</span><span v-else>coins</span>
                </template>
                <template v-else>
                  + {{ item.gold / 100 }}&nbsp;<span v-if="item.gold / 100 <= 1">coin</span><span v-else>coins</span>
                </template>
              </div>
            </div>
            <div class="bottom-tip" v-if="list.length != 0">
              Only changes made in the last few days are shown
            </div>
          </div>
          <div class="empty" v-if="finished && list.length == 0">
            <div class="tip">
              {{ lang.noRecord }}
            </div>
            <a href="javascript:;" class="check-btn" @click="jumpUrl('invite')">{{ lang.checkInBtn }}</a>
          </div>
        </scroll-list>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import ScrollList from '@/components/scroll-list'
import { Interface, Log } from './config'
import { Native, Url } from '@/common'
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
      allGold: 0,
      todayGold: 0,
      page: 1,
      loading: true,
      finished: false,
      list: []
    }
  },
  components: {
    LoadPage,
    ScrollList
  },
  watch: {},
  created () {
    //  this.logEvent({event: 'wallet_show'})
    this.logEvent('load', { event: 'wallet_show' })
  },
  mounted () {
    Utils.visibilityChange((hidden) => {
      if (!hidden) {
        this.finished = false
        this.page = 1
        this.ininData()
      }
    })
  },
  methods: {
    // 日志投递实例
    // logEvent (key = 'load', params) {
    logEvent (key, params) {
      console.log('日志投递')
      console.log(params)
      Log.demo(key, params)
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
          let list = resData.goldList || []
          let leList = resData.goldList ? resData.goldList.length : 0
          console.log('ok')
          console.log(list)
          let size = resData.listSize || 10
          if (this.page == 1) {
            this.list = this.arryScreen(list)
          } else {
            this.list = this.arryScreen(this.list.concat(list))
          }
          resData.allGold = resData.allGold ? resData.allGold : 0
          this.allGold = (resData.allGold / 100).toFixed(2)
          if (!resData.todayGold) {
            resData.todayGold = 0
          }
          this.todayGold = (resData.todayGold / 100).toFixed(2)
          this.loading = false
          if (leList < size) {
            this.finished = true
          } else {
            this.page++
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
      Interface.getAreaLangPackage({ langPkg: this.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          this.lang = res.data.wallet.index
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
    setNativeSubtitle () {
      let webUrl = Utils.replaceLangUrl(Url.walletIntroducePage, this.langPkg)
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
      if (type == 'invite') {
        url = Url.invitePage
      } else if (type == 'mall') {
        url = Url.mallPage
        this.logEvent('load', { event: 'load_click_btn' })
      } else if (type == 'recharge') {
        url = Url.pagerechargeRules
      }
      url && Native.setJumpUrl({ url })
    },
    arryScreen (arr) {
      let obj
      let deArr = []
      arr.forEach((v, i) => {
        if (i == 0) {
          v.key = i
          obj = v
        } else {
          if (obj.type === 10 && v.type === 9) {
            if (obj.type != v.type) {
              if (obj.gold == v.gold) {
                deArr.push(obj.key, i)
              }
            }
          }
          v.key = i
          obj = v
        }
      })
      deArr.forEach((v, i) => {
        arr.splice(v - i, 1)
      })
      return arr
    }
    // bindPhone () {
    //   console.log('ok')
    //   Native.bindPhone({
    //     sourceType: 'topup'
    //   })
    // }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

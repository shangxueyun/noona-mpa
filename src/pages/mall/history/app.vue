<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="mall-history-container">
      <scroll-list :loading="loading" :loading-text="loadingText" :finished="finished" @load="ininData">
        <div class="list" v-if="list.length">
          <div class="item" v-for="(item, i) in list" :key="item.userId + '0'+i">
            <div class="item-box flex">
              <div class="info flex_item">
                <div class="mobile">
                  {{ item.phone }}
                </div>
                <div class="gold">
                  {{ item.gold / 100 }}
                </div>
              </div>
              <div class="date">
                {{ item.createTime }}
              </div>
            </div>
          </div>
        </div>
      </scroll-list>
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
import { Interface, Log } from './config'
import { Native, Url } from '@/common'
// import Detect from '@/utils/detect'
import ScrollList from '@/components/scroll-list'
import * as Utils from '@/utils'
export default {
  name: 'MallHistory',
  data () {
    return {
      lang: {}, // 语言包
      langPkg: 'en',
      loadingText: 'loading....',
      loadingStatus: 1, // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
      loading: false,
      finished: false,
      page: 1,
      list: []
    }
  },
  components: {
    LoadPage,
    ScrollList
  },
  watch: {},
  created () {
    this.logEvent('load', { event: 'load_history_show' })
  },
  methods: {
    // 日志投递实例
    logEvent (key, params) {
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
        this.loadingStatus = 0
        let list = resData.list || []
        let size = resData.listSize || 10
        this.loading = false
        if (list.length < size) {
          this.finished = true
        } else {
          this.page++
        }
        this.list = this.list.concat(list)
        // 数据处理
      }).catch((err) => {
        if (this.page == 1) {
          this.loadingStatus = 2
        } else {
          Utils.showError(err)
        }
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
          this.lang = res.data.mall.history
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.setNativeSubtitle()
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
    setNativeSubtitle () {
      Native.setNativeSubtitle({
        categroy: 1, // 1跳转，2分享
        subTitle: {
          type: 1, // 1文本，2图片
          content: this.lang.nativeNavSubTitle, // 右上角文案
          imgUrl: ``, // 图片链接地址
          webUrl: Url.mallMobilePage // 跳转地址
        },
        share: {
          title: '', // 分享标题
          desc: '', // 分享描述
          imgUrl: ``, // 分享图标链接地址
          webUrl: `` // 分享跳转地址
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

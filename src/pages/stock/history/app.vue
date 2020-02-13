<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div v-if="list && list.length > 0" class="history-container">
      <!-- <div class="history-container-title">
        {{ lang.title }}
      </div> -->
      <div class="history-container-box">
        <div class="history-container-box__header">
          <span>{{ lang.date }}</span>
          <span>{{ lang.wager }}</span>
          <span>{{ lang.result }}</span>
        </div>
        <scroll-list :loading="loading" :loading-text="loadingText" :finished="finished" @load="ininData">
          <div class="history-container-box__list" v-for="(item, index) in list" :key="index">
            <span class="time">
              <span v-html="formatCreateDate(item.create_time)" />
              <span v-html="formatCreateTime(item.create_time)" />
            </span>
            <span class="bet">
              <span v-if="item.gold <= 1">{{ item.gold }} {{ lang.unit }}</span>
              <span v-else>{{ item.gold }} {{ lang.unit }}s</span>
              <span :class="{rise: item.is_rise}">{{ item.is_rise ? lang.rise : lang.fall }}</span>
            </span>
            <span class="status">
              <span>{{ item.status_str }}</span>
              <span v-if="item.status && item.income <= 1">+{{ item.income }} {{ lang.unit }}</span>
              <span v-else-if="item.status && item.income > 1">+{{ item.income }} {{ lang.unit }}s</span>
            </span>
          </div>
        </scroll-list>
      </div>
    </div>
    <div v-else class="history-container-empty">
      <span>{{ lang.empty }}</span>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Interface, Log } from './config'
import { Native } from '@/common'
import ScrollList from '@/components/scroll-list'
import * as Utils from '@/utils'
export default {
  name: 'StockRule',
  data () {
    return {
      lang: {},
      langPkg: 'en',
      loadingText: 'loading....',
      loadingStatus: 1, // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
      loading: false,
      finished: false,
      page: 1,
      size: 20,
      list: []
    }
  },
  components: {
    LoadPage,
    ScrollList
  },
  mounted () {
    Log.event('betHistoryShow')
  },
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    // 初始化
    ininData () {
      this.loading = true
      let page = this.page
      let size = this.size
      Interface.getInitData({ page, size }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.loadingStatus = 0
          let list = resData || []
          this.loading = false
          if (list.length < size) {
            this.finished = true
          } else {
            this.page++
          }
          this.list = this.list.concat(list)
        } else {
          this.loadingStatus = 2
        }
      }).catch((err) => {
        this.loadingStatus = 2
        if (this.page == 1) {
          this.loadingStatus = 2
        } else {
          Utils.showError(err)
        }
      })
    },
    // 格式化时间
    formatCreateDate (time) {
      let res = time
      const timeArr = time.toString().split(' ')
      if (timeArr && timeArr[0]) {
        const dateArr = timeArr[0].toString().split('-')
        res = dateArr[1] + '-' + dateArr[2]
      }
      return res
    },
    formatCreateTime (time) {
      let res = time
      const timeArr = time.toString().split(' ')
      if (timeArr && timeArr[1]) {
        const dateArr = timeArr[1].toString().split(':')
        res = dateArr[0] + ':' + dateArr[1]
      }
      return res
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
          // this.loadingStatus = 0
          this.lang = res.data.stock.history
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.ininData()
        } else {
          // this.loadingStatus = 2
        }
      }).catch((error) => {
        // this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

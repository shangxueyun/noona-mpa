<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="rank-container">
      <div class="type-tab">
        <div class="tab-box">
          <div class="tab" :class="{cur: type==1}" @click="switchTab(1)" style="border: 1px solid #fff;">
            {{ lang.totalListTitle }}
          </div>
          <div class="tab " :class="{cur: type==2}" @click="switchTab(2)" style="border: 1px solid #fff;">
            {{ lang.myListTitle }}
          </div>
        </div>
      </div>
      <div class="rank-list" v-if="type==1">
        <div class="rank-item flex" v-for="(item, i) in list" :key="item.basic.userId">
          <div class="rank-item__no">
            NO. <span>{{ i+1 }}</span>
          </div>
          <div class="rank-item__photo" :class="`top${i+1}`">
            <i />
            <img :src="item.basic.userIcon" alt="">
          </div>
          <div class="rank-item__ct flex_item">
            <div class="rank-item__nick">
              {{ item.basic.nickName }}
            </div>
            <div class="rank-item__count">
              Invited {{ item.count }} people
            </div>
          </div>
          <div class="rank-item__gold">
            + {{ parseInt(item.gold / 100) }}
          </div>
        </div>
        <div class="bottom-tip">
          Only showing Top 20 users
        </div>
        <div class="empty" v-if="list.length == 0 && finished">
          <div class="tip">
            {{ lang.emptyTip }}
          </div>
          <a href="javascript:;" class="check-btn" @click="jumpUrl('invite')">{{ lang.inviteFriendBtn }}</a>
        </div>
      </div>
      <div class="rank-list" v-if="type==2">
        <scroll-list :loading="loading2" :loading-text="loadingText" :finished="finished2" @load="getMyInviteList">
          <div class="rank-item flex" v-for="(item) in list2" :key="item.basic.userId">
            <div class="rank-item__photo">
              <i />
              <img :src="item.basic.userIcon" alt="">
            </div>
            <div class="rank-item__ct flex_item">
              <div class="rank-item__nick">
                <!-- <span class="no">NO.{{ i+1 }}</span> -->
                {{ item.basic.nickName }}
              </div>
              <div class="rank-item__count">
                {{ item.time }}
              </div>
            </div>
            <div class="rank-item__gold">
              + {{ parseInt(item.gold / 100).toFixed(2) }}&nbsp;<span v-if="parseInt(item.gold / 100).toFixed(2) <= 1">coin</span><span v-else>coins</span>
            </div>
          </div>
          <div class="empty" v-if="list2.length == 0 && finished2">
            <div class="tip">
              {{ lang.emptyTip }}
            </div>
            <a href="javascript:;" class="check-btn" @click="jumpUrl('invite')">{{ lang.inviteFriendBtn }}</a>
          </div>
        </scroll-list>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Interface, Log } from './config'
import ScrollList from '@/components/scroll-list'
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
      loading: false,
      finished: false,
      list: [],
      page: 1,
      loading2: false,
      finished2: false,
      list2: [],
      type: 1
    }
  },
  components: {
    LoadPage,
    ScrollList
  },
  watch: {},
  created () {
    this.logEvent('load', { event: 'leaderboard_show' })
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
    getInviteList () {
      this.loading = true
      Interface.getInviteList().then((res) => {
        let resData = res && res.data
        this.loading = false
        this.loadingStatus = 0
        let list = resData.list || []
        this.list = list
        this.finished = true
        // 数据处理
      }).catch((err) => {
        if (this.page == 1) {
          this.loadingStatus = 2
        }
        Utils.showError(err)
      })
    },
    getMyInviteList () {
      this.loading2 = true
      Interface.getMyInviteList({ page: this.page }).then((res) => {
        let resData = res && res.data
        let list = resData.list || []
        let size = resData.listSize || 10
        this.loading2 = false
        if (list.length < size) {
          this.finished2 = true
        } else {
          this.page++
        }
        this.list2 = this.list2.concat(list)
        console.log(this.list2)
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
          this.lang = res.data.inviteRank
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.getInviteList()
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    switchTab (type) {
      this.type = type
      if (type == 2 && !this.loading2 && !this.finished2) {
        this.getMyInviteList()
        this.logEvent('load', { event: 'leaderboard_mine_btn' })
        this.logEvent('load', { event: 'leaderboard_mine_show' })
      }
    },
    jumpUrl (type) {
      let url
      if (type == 'invite') {
        url = Url.invitePage
      }
      url && Native.setJumpUrl({ url })
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

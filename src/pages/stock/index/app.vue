<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="stock-container">
      <div class="stock-container-box">
        <!-- 规则 -->
        <div class="stock-container-rule" @click="jump('rule')">
          {{ lang.index.rule }}
        </div>
        <!-- 奖金池 -->
        <div class="stock-container-layout stock-container-pool">
          <div class="stock-container-pool__money">
            {{ lang.index.poolTitle }}
            <span class="amount" v-for="(item, index) in potMoney" :key="index">{{ item }}</span>
          </div>
          <div class="stock-container-pool__desc">
            {{ lang.index.poolDesc }}
          </div>
        </div>
        <!-- 押注 -->
        <div class="stock-container-layout stock-container-bet">
          <div class="stock-container-bet__update">
            Last updated: {{ baseInfo.lastTime }}
          </div>
          <div class="stock-container-bet__state">
            <span class="date">{{ baseInfo.lastDate }} {{ baseInfo.stock_market }}</span>
            <span class="index" :class="{fall: parseFloat(baseInfo.change_value) < 0}">{{ baseInfo.index_points }} {{ baseInfo.percentage_change_str }}</span>
          </div>
          <div class="stock-container-bet__progress">
            <span :style="{'width': baseInfo.rise_percent_str }" class="stock-container-bet__progress-percent" />
            <span class="stock-container-bet__progress-left">
              {{ baseInfo.rise_percent_str }}
            </span>
            <span class="stock-container-bet__progress-right">
              {{ baseInfo.fall_percent_str }}
            </span>
          </div>
          <!-- 已下注等待开奖 2未下注开奖中 4已下注未开奖 5已下注开奖中-->
          <div v-if="baseInfo.curr_status == 2 || baseInfo.curr_status == 5" class="stock-container-bet__wait">
            <p v-if="baseInfo.curr_status_str">
              {{ baseInfo.curr_status_str }}
            </p>
            <p v-if="baseInfo.curr_status_sub_str">
              {{ baseInfo.curr_status_sub_str }}
            </p>
          </div>
          <!-- 下注操作 -->
          <div v-else class="stock-container-bet__action">
            <img class="stock-container-bet__action-btn" @click="handleBet(1)" src="./images/button-rise@2x.png">
            <img class="stock-container-bet__action-btn" @click="handleBet(0)" src="./images/button-fall@2x.png">
          </div>
          <div class="stock-container-bet__history" @click="jump('history')">
            History
          </div>
        </div>
        <div v-if="baseInfo.curr_status != 2 && baseInfo.curr_status != 5" class="stock-container-tips">
          {{ baseInfo.curr_status_str }}
        </div>
        <div v-else class="stock-container-tips__empty" />
        <!-- 下注记录 -->
        <div v-if="historyList && historyList.length > 0" class="stock-container-layout stock-container-record">
          <div class="stock-container-record__subTitle">
            <span>{{ lang.history.subTitle }}</span>
          </div>
          <div class="stock-container-record__header">
            <span>{{ lang.history.date }}</span>
            <span>{{ lang.history.wager }}</span>
            <span>{{ lang.history.result }}</span>
          </div>
          <template v-for="(item, index) in historyList">
            <div v-if="index <= 2" class="stock-container-record__list" :key="index">
              <span class="time">
                <span v-html="formatCreateDate(item.create_time)" />
                <span v-html="formatCreateTime(item.create_time)" />
              </span>
              <span class="bet">
                <span>{{ item.gold }}</span>
                <span :class="{rise: item.is_rise}">{{ item.is_rise ? lang.history.rise : lang.history.fall }}</span>
              </span>
              <span class="status">
                <span>{{ item.status_str }}</span>
                <span v-if="item.status">+{{ item.income }}</span>
              </span>
            </div>
          </template>
          <div v-if="historyList && historyList.length > 3" class="stock-container-record__more" @click="jump('history')">
            {{ lang.history.more }}
          </div>
        </div>
        <!-- 排行榜 -->
        <div v-if="topList && topList.length > 0" class="stock-container-layout stock-container-top">
          <div class="stock-container-top__title">
            {{ lang.index.topTitle }}
          </div>
          <div class="stock-container-top__desc">
            {{ lang.index.topDesc }}
          </div>
          <div class="stock-container-top__header">
            <div class="second">
              <span class="avatar"><img v-if="topList[1] && topList[1].basic.userIcon" :src="topList[1].basic.userIcon"><i>2</i></span>
              <span class="nickName">{{ topList[1] && topList[1].basic.nickName }}</span>
              <span class="amount">{{ topList[1] && topList[1].income }}</span>
            </div>
            <div class="first">
              <span class="avatar"><img v-if="topList[0] && topList[0].basic.userIcon" :src="topList[0].basic.userIcon"><i>1</i></span>
              <span class="nickName">{{ topList[0] && topList[0].basic.nickName }}</span>
              <span class="amount">{{ topList[0] && topList[0].income }}</span>
            </div>
            <div class="third">
              <span class="avatar"><img v-if="topList[2] && topList[2].basic.userIcon" :src="topList[2].basic.userIcon"><i>3</i></span>
              <span class="nickName">{{ topList[2] && topList[2].basic.nickName }}</span>
              <span class="amount">{{ topList[2] && topList[2].income }}</span>
            </div>
          </div>
          <ul class="stock-container-top__list">
            <template v-for="(item, index) in topList">
              <li v-if="index > 2" :key="item.basic.userId">
                <span class="sort">{{ index + 1 }}</span>
                <span class="avatar"><img v-if="item.basic.userIcon" :src="item.basic.userIcon"></span>
                <span class="nickName">{{ item.basic.nickName }}</span>
                <span class="amount">{{ item.income }}</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <!-- 涨跌弹窗 -->
      <popup-notice v-model="alert.bet" @on-hide="handleBtnAction('btnBetClose')" content-class="dialog-container dialog-container-fall">
        <div class="header" :class="{rise: betActive}">
          <span>Bet on</span>
          <span v-if="betActive">"rise"</span>
          <span v-else>"fall"</span>
        </div>
        <div class="balance" v-if="baseInfo.user_banlance <= 1">
          {{ lang.index.balance }} {{ baseInfo.user_banlance }} {{ lang.index.unit }}
        </div>
        <div class="balance" v-else>
          {{ lang.index.balance }} {{ baseInfo.user_banlance }} {{ lang.index.unit }}s
        </div>
        <div class="amount">
          <p class="select">
            {{ lang.index.selectAmount }}
          </p>
          <p class="item">
            <span v-for="(amount, index) in betAmount" :key="index" :class="{active: currentIndex == index}" @click="handleBetAmount(index, amount)">{{ amount }}</span>
          </p>
          <p class="right">
            Win up to <span v-if="betIncome <= 1">{{ betIncome }} {{ lang.index.unit }}</span><span v-else>{{ betIncome }} {{ lang.index.unit }}s</span>! Check the final prize when betting closes!
          </p>
        </div>
        <div class="dialog-container-footer fall">
          <button @click="handleBtnAction('btnConfirm')">
            {{ lang.index.btnConfirm }}
          </button>
        </div>
      </popup-notice>
      <!-- 开奖弹窗 -->
      <popup-notice v-model="alert.lottery" @on-hide="handleBtnAction('btnLotteryClose')" content-class="dialog-container dialog-container-lottery">
        <img src="./images/lottery@2x.png" class="img">
        <p class="title">
          {{ lang.index.rewardTitle }}
        </p>
        <p class="subTitle">
          {{ lang.index.rewardSubtitle }}
        </p>
        <div class="dialog-container-footer lottery">
          <button @click="handleBtnAction('btnLotteryGo')">
            Go
          </button>
        </div>
      </popup-notice>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Interface, Log } from './config'
import { Native, Url } from '@/common'
import { PopupNotice } from '@/components/index'
import * as Utils from '@/utils'
export default {
  name: 'StockIndex',
  data () {
    return {
      lang: {
        index: {},
        history: {}
      },
      alert: {
        bet: false, // 下注
        lottery: false // 中奖
      },
      isRefreshData: false, // 刷新数据
      potMoney: [0, 0, 0, 0, 0],
      currentIndex: 1, // 当前下注
      currentAmount: 5, // 当前下注金额
      betIncome: 0, // 下注收益
      betActive: 0, // 下注 0跌 1涨
      betAmount: ['1', '5', '20', '50'], // 下注金额
      baseInfo: {}, // 奖金池和指数
      historyList: [], // 历史记录
      topList: [], // 排行榜
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage,
    PopupNotice
  },
  mounted () {
    // 下注历史
    this.getStockBetHistoryRecord()
    // 排行榜
    this.getStockTop()
    // 曝光
    Log.event('betPageShow')
  },
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    initData () {
      Interface.getInitData({ page: this.page }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.loadingStatus = 0
          this.baseInfo = resData
          // 开奖并有收益
          if (!this.isRefreshData && resData.is_alert) {
            setTimeout(() => {
              this.alert.lottery = true
              Log.event('drawPopupShow')
            }, 1000)
          }
          // 格式化奖金池
          if (resData.total_gold) {
            let totalGoldArr = resData.total_gold.toString().split('')
            if (totalGoldArr && totalGoldArr.length < 5) {
              const potMoney = this.potMoney
              let reversedArr = totalGoldArr.reverse()
              let reversedPotArr = potMoney.reverse()
              reversedPotArr.forEach((item, index) => {
                if (reversedArr[index]) {
                  reversedPotArr[index] = reversedArr[index]
                } else {
                  reversedPotArr[index] = 0
                }
              })
              this.potMoney = reversedPotArr.reverse()
            } else {
              this.potMoney = totalGoldArr
            }
          }
          // 时间格式化
          if (resData.last_open_time) {
            const dateArr = resData.last_open_time.toString().split(' ')
            this.baseInfo.lastDate = dateArr[0]
            this.baseInfo.lastTime = dateArr[1]
          }
        } else {
          this.loadingStatus = 2
        }
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 获取排行榜数据
    getStockTop () {
      Interface.getStockTop({}).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.topList = resData
        }
        // 数据处理
      }).catch((err) => {
        Utils.showError(err)
      })
    },
    // 获取当期下注记录
    getStockBetHistoryRecord () {
      Interface.getStockBetHistoryRecord({ page: 1, size: 5, is_curr_phase: 1 }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.historyList = resData
        }
        // 数据处理
      }).catch((err) => {
        Utils.showError(err)
      })
    },
    // 下注收益
    getStockBetIncome () {
      const isRise = this.betActive
      const gold = this.currentAmount
      Interface.getStockBetIncome({ isRise, gold }).then((res) => {
        const resData = res && res.data
        if (resData && resData.income) {
          this.betIncome = resData.income
        } else {
          Utils.toast({ message: resData.message })
        }
      }).catch((err) => {
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
          // this.loadingStatus = 0
          this.lang = res.data.stock
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.index.title
          Native.setNativeTitle({ title: this.lang.index.title })

          this.initData()
        } else {
          // this.loadingStatus = 2
        }
      }).catch((error) => {
        // this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    // 处理下注操作
    handleBet (active) {
      this.betActive = active
      this.alert.bet = true
      if (active) {
        Log.event('betRisebtnClick')
      } else {
        Log.event('betFallbtnClick')
      }
      Log.event('betPopupShow')
      // 下注收益
      this.getStockBetIncome()
    },
    // 选择下注金额
    handleBetAmount (index, amount) {
      this.currentIndex = index
      this.currentAmount = amount
      this.getStockBetIncome()
    },
    handleBtnAction (action) {
      switch (action) {
        case 'btnBetClose': // 下注关闭
          break
        case 'btnLotteryClose': // 开奖关闭
          Log.event('drawPopupCloseClick')
          break
        case 'btnLotteryGo': // 开奖go
          this.alert.lottery = false
          Log.event('drawPopupGoClick')
          this.jump('history')
          break
        case 'btnConfirm': // 确认下注
          const isRise = this.betActive
          const gold = this.currentAmount
          const userBanlance = this.baseInfo.user_banlance
          if (userBanlance >= gold) {
            Log.event('betPopupConfirm')
            Interface.setStockBet({ isRise, gold }).then((res) => {
              let resData = res && res.data
              if (resData && resData.isBetting) {
                this.alert.bet = false
                this.isRefreshData = true
                // 刷新数据
                this.initData()
                this.getStockBetHistoryRecord()
                Utils.toast({ message: resData.message })
                // 更新余额
                // const totalGold = Number(this.baseInfo.total_gold) + Number(gold)
                // this.potMoney = totalGold.toString().split('')
                // this.baseInfo.user_banlance = resData.balance
                // 下注成功投递
                const type = isRise ? 1 : 2
                Log.event('betConfirmSuccess', { amount: gold, type })
              } else {
                Utils.toast({ message: resData.message })
              }
            }).catch((err) => {
              Utils.showError(err)
            })
          } else {
            const lang = this.lang
            Utils.toast({ message: lang.index.insufficient })
          }
          break
        default:
          break
      }
    },
    jump (type) {
      let url
      switch (type) {
        case 'rule':
          url = Url.pageStockRule
          break
        case 'history':
          url = Url.pageStockHistory
          break
        default:
          break
      }
      url && Native.setJumpUrl({ url })
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
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

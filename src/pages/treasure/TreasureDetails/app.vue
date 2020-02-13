<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="TreasureDetails-container" @click="scheme">
      <!-- 轮播 -->
      <div class="TreasureDetails-container-swiper">
        <swiper v-if="mediaData.cover.length > 0" :options="swiperOption">
          <swiper-slide v-for="(item,key) in mediaData.cover" :key="key">
            <div class="swiper-img-div">
              <a href="javascript:void(0);">
                <img style="width:100%;height:100%" :src="item.url" alt="">
              </a>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <!-- 分享 -->
      <div v-if="shareBle" class="TreasureDetails-container-share">
        <div class="share-ionc">
          <i></i>
        </div>
        <div class="centent-scroll">
          <div class="share-centent" id="shareScroll">
            <div class="share-model" v-for="(item,key) in scrollDataList" :key="key">
              {{ lang.CongratulationsID }} <span style="color:#FF7700">{{ item.userId }} </span>{{ lang.Acquire }} <span style="color:#E04141">{{ item.summary }}</span>
            </div>
          </div>
        </div>
      </div>
      <span class="TreasureDetails-container-wire"></span>
      <div class="TreasureDetails-container-content">
        <div class="product_name">
          {{ mediaData.summary }}
        </div>
        <div class="Progress-text">
          <p>{{ lang.issueNumber }} {{ mediaData.phase }}</p>
          <el-progress :percentage="mediaData.progress" :stroke-width="14" color="#FF7700" :format="format"></el-progress>
          <p><span>{{ lang.Total }} <i style="color:#323232">{{ mediaData.totalPerson }}</i></span><span>{{ lang.Remaining }} <i style="color:#E04141">{{ mediaData.currPerson }}</i></span></p>
        </div>
      </div>
      <span class="TreasureDetails-container-wire"></span>
      <div class="Input-text-box">
        <!-- 已下注未开奖||未下注待开奖 -->
        <p v-if="globalStatus == 3 || globalStatus == 0">
          {{ lang.SelectedParticipants }}
        </p>
        <div class="Input-text-box-button">
          <!-- activate Fall -->
          <!-- 已下注未开奖||未下注待开奖 -->
          <div v-if="globalStatus == 3 || globalStatus == 0">
            <nav v-if="NeedArrFlg" class="Input-text-box-button-nav">
              <li v-for="(item,key) in NeedArr" :key="key" :ref="key == 0?'activate':''" :class="key == 0?'Input-text-box-button-li activate':'Input-text-box-button-li'">
                <span class="Input-text-box-button-span">{{ item.value * 10 }} coins</span>
                <button ref="activatebutton" :disabled="item.buttonGray?true:false || shareBle" :class="item.buttonGray?'Input-text-box-button-button buttonGray':'Input-text-box-button-button'" @click="AmountActivate($event, item.value)">
                  {{ item.value }}
                </button>
              </li>
              <li class="Input-text-box-button-li">
                <button v-if="!globalOut" class="Input-text-box-button-button" @click="betAmountDrawer">
                  {{ lang.More }}
                </button>
                <button v-else class="Input-text-box-button-button" style="border: 1px solid #D8D8D8;color:#D8D8D8">
                  {{ lang.More }}
                </button>
              </li>
            </nav>
          </div>
          <div v-if="globalStatus == 3 && !globalOut || globalStatus == 0 && !globalOut" class="Input-text-box-affirm" @click="betAmountDrawer(null)">
            {{ lang.CHECKOUTNOW }}
          </div>
          <div v-if="globalStatus == 3 && globalOut || globalStatus == 0 && globalOut" style="background:#ccc" class="Input-text-box-affirm">
            {{ lang.LimitExceeded }}
          </div>
          <!-- 开奖中 -->
          <div v-if="globalStatus == 4 || globalStatus == 5" class="Input-text-box-In_lottery">
            <p>{{ lang.WaitingDraw }}</p>
            <p>{{ lang.calculationWill }}</p>
          </div>
          <!-- 已下注已开奖 -->
          <lottery v-if="globalStatus == 1 || globalStatus == 2" :lottery="mediaData.lottery" :lang="lang"></lottery>
          <!-- 已下注 -->
          <div v-if="globalStatus == 1 || globalStatus == 3 || globalStatus == 4" class="Input-text-box-Have_bet">
            <p>{{ lang.participatedPurchase }} <a href="javascript:;" @click="jump">{{ lang.seeMore }}</a> </p>
          </div>
          <!-- 已下注 -->
          <div v-if="globalStatus == 6" class="Input-text-box-Flow_bureau">
            <p>{{ lang.Sorry }}</p>
            <p>{{ lang.notEnough }}</p>
          </div>
        </div>
      </div>
      <span class="TreasureDetails-container-wire"></span>
      <div class="fold">
        <transition name="fade">
          <div class="selectList">
            <p>
              {{ lang.productDetails }}
              <i v-show="up" data="up" @click="selectListF"></i>
              <i data="down" v-show="down" @click="selectListF"></i>
            </p>
            <div class="selectList-info" v-show="selectList">
              <nav>
                <li v-for="(item,key) in mediaData.content" :key="key">
                  {{ item }}
                </li>
              </nav>
            </div>
          </div>
        </transition>
      </div>
      <!-- 下注金额弹框 -->
      <div id="betAmountDrawer" v-if="betAmountDrawerVisible" class="TreasureDetails-container-betAmountDrawer">
        <div class="betAmountDrawer-centent" style="bottom: -40%">
          <!-- 内容 -->
          <p>{{ lang.SelectedParticiPay }}</p>
          <p v-if="allGold <= 1">
            {{ lang.Balance }} {{ allGold }} coin
          </p>
          <p v-else>
            {{ lang.Balance }} {{ allGold }} coins
          </p>
          <!-- 输入控件 -->
          <div class="Amount-input">
            <!--  -->
            <input-number
              :min="1"
              :max="currentBet"
              :number-value="AmountNum"
              @IsAndroid="IsAndroid"
              @AmountNumValue="AmountChange"
            ></input-number>
          </div>
          <p>
            <span class="Pspan" v-if="AmountNum <= 1">{{ lang.needYou }} {{ AmountNum * 10 }} coin more</span>
            <span class="Pspan" v-else>{{ lang.needYou }} {{ AmountNum * 10 }} coins more</span>
          </p>
          <div v-if="isbindPhone" class="TreasureDetails-container-betAmountDrawer-button" @click="goNativeBindPhone">
            Must link phone number
          </div>
          <div v-else class="TreasureDetails-container-betAmountDrawer-button" @click="performBet">
            {{ lang.Confirm }}
          </div>
          <span class="before-close" @click="betAmountClose"></span>
        </div>
      </div>
      <!-- 下注金额备份弹框 -->
      <el-drawer
        title=""
        :visible.sync="betAmountBackupDrawerVisible"
        direction="btt"
        class="TreasureDetails-container-betAmountBackup"
        size="40%"
        :show-close="false"
        :before-close="betAmountClose"
      >
        <!-- 内容 -->
        <div class="betAmountBackup-div">
          <img src="./images/await.png">
        </div>
        <p class="betAmountBackup-text">
          {{ lang.Betwait }}
          <span class="dong">...</span>
        </p>
      </el-drawer>
    </div>
    <!-- 下注成功弹框 -->
    <div v-if="bettingSuccessVisible" class="Betting-success">
      <div class="Betting-success-centent">
        <span class="Betting-success-centent-close" @click="bettingSuccessFunc">X</span>
        <div class="Betting-success-centent-div">
          <img src="./images/succeed@2x.png" alt="">
        </div>
        <p class="Betting-success-centent-text">
          Congratulations!
        </p>
        <p class="Betting-success-centent-info">
          You have successfully participated in this session!
        </p>
        <div class="Betting-success-centent-button" @click="jump">
          {{ lang.view }}
        </div>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import Lottery from '@/components/lottery'
import InputNumber from '@/components/inputNumber'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Interface, Log } from './config'
import DeepLink from '@/utils/deepLink'
import { Native, Url } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'TreasureTreasureDetails',
  data () {
    return {
      lang: {},
      swiperOption: {

      },
      mediaData: {
        cover: [],
        content: [],
        lottery: {
          nickname: '',
          No: '',
          betNumber: '',
          phase: ''
        }
      },
      showTip: null,
      isbindPhone: true,
      selectList: true,
      up: true,
      down: false,
      metaUrl: '',
      shareImgUrl: '',
      shareDesc: '',
      // 用户金币
      allGold: '',
      // 动态
      NeedArr: [
        {
          value: 1
        },
        {
          value: 5
        },
        {
          value: 10
        }
      ],
      performBetPart: 1,
      schemeDisabled: false,
      currentBet: 0,
      currentBetNumber: 0,
      NeedArrFlg: true,
      scrollHeight: 0,
      globalOut: false,
      globalStatus: 0, // 0未下注待开奖1已下注已开奖 2未下注已开奖 3已下注未开奖 4已下注开奖中 5未下注开奖中 6流局
      phase_id: Utils.parseQueryString(window.location.search).phase_id,
      mediaId: '',
      // 中奖公告
      shareBle: false,
      scrollDataList: [],
      page: 1,
      // 详情显示激活
      activeNames: ['1'],
      // 下注金额显示
      betAmountDrawerVisible: false,
      betAmountBackupDrawerVisible: false,
      bettingSuccessVisible: false,
      AmountNum: 0,
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage,
    swiper,
    swiperSlide,
    Lottery,
    InputNumber
  },
  watch: {},
  mounted () {

  },
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    // 日志投递实例
    logEvent (key, params) {
      Log.demo(key, params)
    },
    initData () {
      // 一元夺宝分享拿token
      if (this.phase_id.split(',')[1]) {
        if (this.phase_id.split(',')[0]) {
          this.postPhaseInfo(this.phase_id.split(',')[0])
        } else {
          // 测试phase_id
          // this.phase_id = '7776357830682832384'
          this.postPhaseInfo(this.phase_id)
        }
      } else {
        this.getInitDataAjax()
      }
    },
    getInitDataAjax () {
      Interface.getInitData({ page: this.page }).then((res) => {
        let resData = res && res.data
        if (resData) {
          if (this.phase_id.split(',')[0]) {
            this.postPhaseInfo(this.phase_id.split(',')[0])
          } else {
            // 测试phase_id
            // this.phase_id = '7776357830682832384'
            this.postPhaseInfo(this.phase_id)
          }
        }
        this.allGold = (resData.allGold / 100).toFixed(2)
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    postPhaseInfo (phase) {
      // 数据获取
      this.NeedArrFlg = false
      Interface.postPhaseInfo({ phase_id: phase }).then((res) => {
        let resData = res && res.data
        if (resData) {
          let mediaObj = resData.phase_info.media_info
          // 分享type=1
          this.NeedArrFlg = true
          if (this.phase_id.split(',')[1]) {
            this.shareBle = true
            this.scrollData()
          } else {
            Native.setNativeTitle({ title: 'Details' })
            // 右上角分享按钮
            this.setNativeSubtitleShare()
            // ios安卓数据实时传递
            Native.updateTreasureInfo(JSON.parse(JSON.stringify(res && res.data)))
            // 判断用户是否绑定过手机号
            this.isShowBindPhoneBtn()
            // this.isbindPhone = false
          }
          document.title = 'Details'
          // 分享信息配置
          let summary = resData.phase_info.media_info.basic.summary
          summary = summary.length > 100 ? summary.slice(0, 100) : summary
          this.shareImgUrl = mediaObj.cover[0]['1'].url
          this.shareDesc = summary
          // 基础夺宝详情参数配置
          let coverArr = []
          mediaObj.cover.forEach((v1, i1) => {
            if (i1 > 1) {
              coverArr.push(v1['1'])
            }
          })
          this.phase_id = this.phase_id.split(',')[0]
          mediaObj = mediaObj.basic
          mediaObj.content = mediaObj.content.split(/\n/g)
          mediaObj.cover = coverArr
          // 如果图片为一张就不滚动
          if (mediaObj.cover.length > 1) {
            this.swiperOption = {
              loop: true,
              autoplay: {
                delay: 4000,
                disableOnInteraction: false
              },
              pagination: {
                el: '.swiper-pagination',
                clickable: true
              }
            }
          }
          // 基础夺宝详情参数配置end
          // 逻辑参数配置progress
          let currPerson = resData.phase_info.phase_detail.currPerson ? resData.phase_info.phase_detail.currPerson : 0
          let totalPerson = Number(resData.phase_info.phase_detail.totalPerson)
          mediaObj = Object.assign({
            totalPerson: totalPerson,
            currPerson: currPerson,
            phase: resData.phase_info.phase_detail.phaseStr,
            progress: ((totalPerson - currPerson) / totalPerson) * 100
          }, mediaObj)
          // 流局判断 添加为6
          let status = resData.phase_info.phase_detail.status
          if (status && status == 3) {
            this.globalStatus = 6
          } else {
            this.globalStatus = resData.status
          }
          // 全局配置
          this.mediaId = resData.phase_info.media_info.mediaId
          this.NeedArrFlg = true
          this.currentBet = mediaObj.currPerson
          this.currentBetNumber = resData.bet_number ? resData.bet_number : 0
          // 禁用
          if (mediaObj.currPerson - 5 < 0) {
            this.NeedArr[1].buttonGray = true
          }
          if (mediaObj.currPerson - 10 < 0) {
            this.NeedArr[2].buttonGray = true
          }
          // 获奖信息
          if (this.globalStatus == 1 || this.globalStatus == 2) {
            mediaObj.lottery = {
              nickname: resData.reward_info.reward_user.userName,
              No: resData.reward_info.reward_user.userId,
              betNumber: resData.reward_info.reward_record.betNumber ? resData.reward_info.reward_record.betNumber : 0,
              ionc: resData.reward_info.reward_user.userIcon,
              phase: resData.reward_info.reward_record.number
            }
          }
          this.mediaData = mediaObj
          // 商品详情页展示
          this.logEvent('load', { event: 'P1_detailsPage_show', media_id: this.mediaId, phase: this.phase_id })
          this.loadingStatus = 0
          if (this.globalStatus == 3 || this.globalStatus == 0) {
            window.setTimeout(() => {
              // 当前可下注 =（总库存/2）-当前自己下了多少注 和 剩余可下注比较，哪个小取哪个
              let cuncc
              let current = parseInt((this.mediaData.totalPerson / 2) - this.currentBetNumber)
              if (current - this.mediaData.currPerson > 0) {
                cuncc = this.mediaData.currPerson
              } else {
                cuncc = current
              }
              if (cuncc == 0) {
                this.NeedArr[0].buttonGray = true
                this.NeedArr[1].buttonGray = true
                this.NeedArr[2].buttonGray = true
                this.globalOut = true
                // 禁用
                this.Fall(this.$refs.activatebutton[0])
              }
            }, 0)
          }
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 滚动数据
    scrollData () {
      this.loadingStatus = 1
      Interface.getAwardRecord({ page: 1, size: 30, type: 3 }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.scrollDataList = []
          resData.list.forEach((v, i) => {
            this.scrollDataList.push({
              summary: v.phase_info.media_info.basic.summary,
              userId: v.reward_info.reward_user.nickName
            })
          })
          this.loadingStatus = 0
          // gund
          var vm = this
          window.setTimeout(() => {
            vm.shareScroll()
          }, 1000)
        } else {
          this.shareBle = false
          this.loadingStatus = 0
          Utils.toast({ message: this.lang.winningRecord })
        }
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 进度条控制
    format (percentage) {
      // return percentage === 100 ? '' : `${percentage}%`
      return ''
    },
    // 折叠
    selectListF (e) {
      if (this.mediaData.content.length < 5 || this.shareBle) {
        return
      }
      if (e.target.attributes.data.value == 'down') {
        this.down = false
        this.up = true
        this.selectList = true
      } else {
        this.down = true
        this.up = false
        this.selectList = false
      }
    },
    // 抽屉close事件
    betAmountClose (done) {
      this.DsetTimeout(false)
      this.betAmountDrawerVisible = false
      this.betAmountBackupDrawerVisible = false
    },
    // 打开输入金额抽屉
    betAmountDrawer (ele) {
      // var clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      // debugger
      // window.scrollTo(0, Math.max(clientHeight - 1, 0))
      if (!this.shareBle) {
        if (isNaN(Number(ele))) {
          this.Fall(ele)
          this.AmountNum = 20
          this.betAmountDrawerVisible = true
          this.DsetTimeout(true)
        } else {
          if (this.performBetPart) {
            this.AmountNum = this.performBetPart
            // 每次等于1 1为激活状态
            this.Fall(this.$refs.activatebutton[0])
            if (this.performBetPart == 1) {
              this.$refs.activate[0].className = 'Input-text-box-button-li activate'
            } else if (this.performBetPart == 5) {
              this.$refs.activatebutton[1].parentElement.className = 'Input-text-box-button-li activate'
            } else if (this.performBetPart == 10) {
              this.$refs.activatebutton[2].parentElement.className = 'Input-text-box-button-li activate'
            }
            this.betAmountDrawerVisible = true
            this.DsetTimeout(true)
          }
        }
      }
      // 详情页点击checkout按钮
      this.logEvent('load', { event: 'P1_checkout_click' })
    },
    AmountChange (val) {
      this.AmountNum = val
    },
    // 输入
    bettingSuccessFunc () {
      this.loadingStatus = 1
      this.bettingSuccessVisible = false
      this.initData()
    },
    // 兼容安卓手机输入弹出向上
    IsAndroid (val) {
      let ele = document.getElementById('betAmountDrawer').firstElementChild
      if (val == 1) {
        // 处理input focus时被键盘遮挡问题
        if (/Android/g.test(window.navigator.userAgent)) {
          Native.getKeyboardHeight().then((res) => {
            let height = res
            ele.style.height = ((height.data.height / 5) * 2) + 'px'
          })
        } else {
          document.getElementById('betAmountDrawer').firstElementChild.position = 'absolute'
          document.getElementById('betAmountDrawer').firstElementChild.style.bottom = '0%'
        }
      } else {
        if (/Android/g.test(window.navigator.userAgent)) {
          ele.style.height = '40%'
        } else {
          // ios移动端，键盘收起以后页面不归位
          document.getElementById('betAmountDrawer').firstElementChild.position = 'fixed'
          document.getElementById('betAmountDrawer').firstElementChild.style.bottom = '0%'
          window.setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
            window.scrollTo(0, Math.max(scrollHeight - 1, 0))
          }, 100)
        }
      }
    },
    DsetTimeout (type) {
      if (type) {
        window.setTimeout(() => {
          document.getElementById('betAmountDrawer').firstElementChild.style.bottom = '0%'
        }, 0)
      } else {
        document.getElementById('betAmountDrawer').firstElementChild.style.bottom = '-40%'
      }
    },
    // 激活
    AmountActivate (ele, val) {
      if (this.mediaData.currPerson - val >= 0) {
        this.performBetPart = val
        this.Fall(ele)
        ele.target.parentElement.className = 'Input-text-box-button-li activate'
      }
    },
    // 下注
    performBet () {
      let bets = this.AmountNum * 10
      if (this.allGold - bets >= 0) {
        if (this.globalStatus == 3) {
          // 当前可下注 =（总库存/2）-当前自己下了多少注 和 剩余可下注比较，哪个小取哪个
          let current = parseInt((this.mediaData.totalPerson / 2) - this.currentBetNumber)
          if (current - this.mediaData.currPerson > 0) {
            this.currentBet = this.mediaData.currPerson
          } else {
            this.currentBet = current
          }
          if (this.currentBet - this.AmountNum >= 0) {
            this.goBuy()
          } else {
            // 禁用
            if (this.currentBet - 5 < 0) {
              this.NeedArr[1].buttonGray = true
            }
            if (this.currentBet - 10 < 0) {
              this.NeedArr[2].buttonGray = true
            }
            if (this.currentBet > 20) {
              this.AmountNum = 20
            } else {
              this.AmountNum = this.currentBet
            }
            this.Fall(this.$refs.activatebutton[0])
            Utils.toast({ message: this.lang.availableCurrent })
            if (this.currentBet == 0) {
              this.NeedArr[0].buttonGray = true
              this.globalOut = true
              this.DsetTimeout(false)
              this.betAmountDrawerVisible = false
            }
          }
        } else {
          this.goBuy()
        }
      } else {
        Utils.toast({ message: this.lang.insufficient })
      }
    },
    goBuy () {
      this.betAmountBackupDrawerVisible = true
      // 延迟2秒请求
      window.setTimeout(() => {
        Interface.getBuy({ phase_id: this.phase_id, bet_number: this.AmountNum }).then((res) => {
          let resData = res && res.data
          this.betAmountBackupDrawerVisible = false
          if (resData.ret) {
            this.DsetTimeout(false)
            this.betAmountDrawerVisible = false
            this.bettingSuccessVisible = true
          } else {
            Utils.toast({ message: resData.msg })
            if (resData.surplusBets) {
              this.mediaData.currPerson = resData.surplusBets
              let current = parseInt((this.mediaData.totalPerson / 2) - this.currentBetNumber)
              this.currentBet = (current - resData.surplusBets) > 0 ? resData.surplusBets : current
              let progress = this.mediaData.totalPerson - this.mediaData.currPerson
              this.mediaData.progress = (progress / this.mediaData.totalPerson) * 100
              // 禁用
              if (this.currentBet - 5 < 0) {
                this.NeedArr[1].buttonGray = true
              }
              if (this.currentBet - 10 < 0) {
                this.NeedArr[2].buttonGray = true
              }
              this.Fall(this.$refs.activatebutton[0])
              this.AmountNum = this.currentBet
            } else {
              var vm = this
              // 延迟2秒刷新
              window.setTimeout(() => {
                vm.loadingStatus = 1
                vm.DsetTimeout(false)
                vm.betAmountDrawerVisible = false
                vm.initData()
              }, 2000)
            }
          }
          // 点击下注确认按钮 后
          this.logEvent('load', { event: 'P1_confirm_click', success: resData.ret ? 1 : 0, phase: this.phase_id, amount: this.AmountNum, media_id: this.mediaId })
          // 数据处理
        }).catch((err) => {
          this.loadingStatus = 2
          this.betAmountBackupDrawerVisible = false
          Utils.showError(err)
        })
      }, 2000)
    },
    jump (row) {
      if (!this.shareBle) {
        this.bettingSuccessFunc()
        Native.checkMyNumber({ phase_id: this.phase_id })
      }
    },
    scheme () {
      if (this.shareBle) {
        const url = `newspark://web/p?pid=${this.phase_id}`
        DeepLink.callApp(url)
      }
    },
    // 判断用户是否绑定过手机号
    isShowBindPhoneBtn () {
      this.isbindPhone = false
      // let data = {
      //   userId: Utils.getParams().userId
      // }
      // if (nativePublicParams._aKey == 'ANDROID' && parseInt(nativePublicParams._vApp) < 8277) {
      //   this.showTip = true
      // } else if (nativePublicParams._aKey == 'IOS' && parseInt(nativePublicParams._vApp) < 4330) {
      //   this.showTip = true
      // }
      // Interface.getUserInfo(data).then((res) => {
      //   let data = res.data.user.binding.phone
      //   if (data) {
      //     this.isbindPhone = false
      //   } else {
      //     this.isbindPhone = true
      //   }
      // })
    },
    goNativeBindPhone () {
      if (this.showTip) {
        Utils.toast({
          message: 'You need to upgrade to the latest version'
        })
      }
      Native.bindPhone().then(res => {
        console.log('返回结果')
        console.log(res.code)
        if (res.code == 200) {
          this.isbindPhone = false
          console.log('绑定了')
        }
      })
    },
    // 滚动
    shareScroll () {
      if (this.shareBle) {
        let shareScroll = document.getElementById('shareScroll')
        let num = shareScroll.children[0].clientHeight
        window.transformLeng = -((this.scrollDataList.length * num) - (num * 2))
        window.setInterval(() => {
          // transform: translateY(-20px) -webkit-transform:translateY(-20px) /\((.+)\)/g.exec("translateY(-20px)")[1].replace('px','')
          let leng = window.transformLeng
          let shareScrollwebkit = shareScroll.style.webkitTransform
          if (shareScrollwebkit != '') {
            shareScrollwebkit = /\((.+)\)/g.exec(shareScrollwebkit)[1].replace('px', '')
          }
          let shareScrolltransform = shareScroll.style.transform
          if (shareScrolltransform != '') {
            shareScrolltransform = /\((.+)\)/g.exec(shareScrolltransform)[1].replace('px', '')
          }
          let transform = shareScrollwebkit || shareScrolltransform
          if (Number(transform) >= leng) {
            shareScroll.style.webkitTransform = `translateY(${Number(transform) - num}px)`
            shareScroll.style.transform = `translateY(${Number(transform) - num}px)`
            shareScroll.style.webkitTransition = 'transform 1s'
            shareScroll.style.transition = 'transform 1s'
          } else {
            shareScroll.style.webkitTransition = 'none'
            shareScroll.style.transition = 'none'
            shareScroll.style.webkitTransform = `translateY(0px)`
            shareScroll.style.transform = `translateY(0px)`
          }
        }, 3000)
      }
    },
    setNativeSubtitleShare () {
      let webUrl = Url.Web.replace(/\/inside/g, '')
      const option = {
        categroy: 2, // 1跳转，2分享
        subTitle: {
          type: 2, // 1文本，2图片
          content: '', // 右上角文案
          desc: this.shareDesc, // 分享描述
          imgUrl: `${Url.Web}/static/images/common/main-share.png`, // 图片链接地址ShareWeb
          webUrl: `${webUrl}/newspark/share/treasure?phase_id=${this.phase_id}` // 跳转地址
        },
        share: {
          title: 'Lucky Coin Game - Win big prizes for just 1 coin.', // 分享标题
          page: 55,
          media_id: this.mediaId,
          desc: this.shareDesc, // 分享描述
          imgUrl: this.shareImgUrl, // 图片链接地址ShareWeb
          webUrl: `${webUrl}/newspark/share/treasure?phase_id=${this.phase_id}` // 跳转地址
        }
      }
      Native.setNativeSubtitle(option)
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
          this.lang = res.data.treasure.TreasureDetails
          Utils.log('getAreaLangPackage-res=>', this.lang)
          this.initData()
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
    },
    Fall (ele) {
      let children
      if (ele.target) {
        children = ele.target.parentElement.parentElement.children
      } else {
        children = ele.parentElement.parentElement.children
      }
      for (let i in children) {
        if (i != 'length') {
          children[i].className = 'Input-text-box-button-li Fall'
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>
<style>
html,body{
  width: 100vw;
}
/* 修改抽屉样式 */
.before-close:before {
  content: "" !important;
  display: block;
  width: 20px;
  height: 20px;
  background: url('./images/dislike@2x.png') no-repeat;
  background-size: 100%;
}
.el-drawer__header {
  margin: 0 !important;
}
.el-icon-minus:before {
  content: "—" !important;
  display: block;
  font-size: 18px;
}
.el-icon-plus:before {
  content: "+" !important;
  font-size: 20px;
  display: block;
}
.el-input-number {
  width: 52%;
}
.dong {
  font-family: simsun;
}
.dong {
  display: inline-block;
  width: 1.5em;
  vertical-align: bottom;
  overflow: hidden;
}
@-webkit-keyframes dong {
  0% { width: 0; margin-right: 1.5em; }
  33% { width: .5em; margin-right: 1em; }
  66% { width: 1em; margin-right: .5em; }
  100% { width: 1.5em; margin-right: 0;}
}
.dong {
  -webkit-animation: dong 1.5s infinite step-start;
}
@keyframes dong {
  0% { width: 0; margin-right: 1.5em; }
  33% { width: .5em; margin-right: 1em; }
  66% { width: 1em; margin-right: .5em; }
  100% { width: 1.5em; margin-right: 0;}
}
.dong {
  animation: dong 1.5s infinite step-start;
}
/* body .v-modal{
  position: absolute !important;
}
body .bb-toast-container{
  position: absolute !important;
}
body .el-dialog__wrapper {
  position: absolute !important;
} */
.bb-toast-container {
    z-index: 222222 !important;
    bottom: calc(100vh - 92vh) !important;
}
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

<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="NBAbet-container" v-if="BetStaus == 1 || BetStaus == 2" :style="loadingContainer ? 'height: 100vh' : 'height: 14.28rem'">
      <div class="NBAbet-container-info-table">
        <div class="score">
          <div class="left">
            <nav>
              <li class="top">
                <span>{{ lang.DATE }}</span>
                {{ TeamInfo.TeamTime }}
              </li>
              <li>
                {{ TeamInfo.MayTeam }}
              </li>
              <li style="text-align: center;border:0;color: rgba(0, 0, 0, .85);font-size: 10px;font-weight: 400;">
                {{ lang.VS }}
              </li>
              <li>
                {{ TeamInfo.MainTeam }}
              </li>
            </nav>
          </div>
          <div class="center">
            <div class="ball_img"></div>
            <!--  v-if="settlement == 1" -->
            <!-- 后续加流局状态 -->
            <div v-if="settlement == 1" @click="winningRecord" class="button_">
              {{ lang.winnerlist }}
            </div>
          </div>
          <div class="right">
            <nav>
              <li style="border:0;color:rgba(0, 0, 0, .85)">
                {{ lang.LASTRESULT }}
                <i class="help" @click="jumpGo()">?</i>
              </li>
              <li><span style="width:70%">{{ lang.POINTS }}</span>&nbsp;&nbsp;<i class="block"></i></li>
              <li><span style="width:28%">{{ lang.BET }}</span><em v-if="CHECKFlg" @click="goNBABetHistory" style="color: #613EE8;">{{ lang.CHECK }}</em></li>
              <li v-if="!winnerStaus">
                <span style="width:28%">{{ lang.WIN }}</span>
                <span class="jackpotFont" :style="jackpot.toString().length > 6 ? 'font-size: 12px;' : ''">{{ jackpot }}</span>
              </li>
              <li v-else>
                <span style="width:28%">{{ lang.WIN }}</span>
                {{ lang.Refund }}
              </li>
            </nav>
          </div>
        </div>
        <div class="score-table">
          <table class="table_20">
            <!-- 前20个数据 -->
            <template v-for="(items,key) in BatTableInfo">
              <tr v-if="key < 5" :key="key">
                <td v-for="(item,keys) in items" :key="keys" @click="MatchBet(item.number)">
                  <div v-if="item.user && item.all" class="my">
                    {{ item.number }}
                  </div>
                  <div v-else-if="item.all" class="other">
                    {{ item.number }}
                  </div>
                  <div v-else-if="item.NoChoice" class="empty">
                    {{ item.number }}
                  </div>
                  <div v-else-if="item.user" class="my">
                    {{ item.number }}
                  </div>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
      <div class="NBAbet-container-table">
        <table class="table_40">
          <!-- 40个数据 -->
          <template v-for="(items,key) in BatTableInfo">
            <tr v-if="key > 4 && key < 15" :key="key">
              <td v-for="(item,keys) in items" :key="keys" @click="MatchBet(item.number)">
                <div v-if="item.user && item.all" class="my">
                  {{ item.number }}
                </div>
                <div v-else-if="item.all" class="other">
                  {{ item.number }}
                </div>
                <div v-else-if="item.NoChoice" class="empty">
                  {{ item.number }}
                </div>
                <div v-else-if="item.user" class="my">
                  {{ item.number }}
                </div>
              </td>
            </tr>
          </template>
        </table>
      </div>
      <div class="NBAbet-container-table">
        <table class="table_40">
          <!-- 40个数据 -->
          <template v-for="(items,key) in BatTableInfo">
            <tr v-if="key > 14" :key="key">
              <td v-for="(item,keys) in items" :key="keys" @click="MatchBet(item.number)">
                <div v-if="item.user && item.all" class="my">
                  {{ item.number }}
                </div>
                <div v-else-if="item.all" class="other">
                  {{ item.number }}
                </div>
                <div v-else-if="item.NoChoice" class="empty">
                  {{ item.number }}
                </div>
                <div v-else-if="item.user" class="my">
                  {{ item.number }}
                </div>
              </td>
            </tr>
          </template>
        </table>
      </div>
      <div class="NBAbet-container-footer">
        <nav>
          <li class="My" style="width: 12%;">
            {{ lang.My }}
          </li>
          <li class="SomeChoose" style="width:38%">
            {{ lang.SomeChoose }}
          </li>
          <li class="NoChoice" style="width:22%">
            {{ lang.NoChoice }}
          </li>
        </nav>
      </div>
      <div class="Bet-End" v-if="BetStaus == 2 || winnerStaus">
        <div class="centent">
          <!-- <div class="End_img"></div>
          <p>
            {{ lang.BettingOver }}
          </p> -->
        </div>
      </div>
    </div>
    <div class="lottery-End" v-if="BetStaus == 0">
      <div class="centent">
        <div class="End_img"></div>
        <p v-if="!BetStaus0text">
          {{ lang.started }}
        </p>
        <p v-else>
          {{ lang.started1 }}
        </p>
        <div class="button" @click="goNBABetList">
          {{ lang.Go }}
        </div>
      </div>
    </div>
    <!-- 下注弹窗 -->
    <div class="Bet-pop-up" v-if="BetVisible" @click="BetVisiblePopUp">
      <div class="centent">
        <span class="close" @click="BetVisibleConfirmFun()"></span>
        <div class="header">
          {{ lang.EndingGame }}
        </div>
        <div class="Bj-centent">
          <div class="ball-img">
            <p>
              {{ lang.YourChoice }}
            </p>
          </div>
          <p class="score">
            {{ BetNumber }}
          </p>
          <span class="wire"></span>
          <p class="money">
            <span>
              {{ lang.Balance }}
              <em v-if="allGold != '-' && allGold <= 1">{{ allGold }} coin</em>
              <em v-else-if="allGold != '-'">{{ allGold }} coins</em>
              <em v-else-if="allGold == '-'">{{ allGold }}</em>
            </span>
            <span v-if="betAmount <= 1">{{ betAmount }} {{ lang.money }}</span>
            <span v-else>{{ betAmount }} {{ lang.money }}s</span>
          </p>
          <div class="Bet-amount-button">
            <nav class="button_nav">
              <li @click="BetButton($event, 1, '1')" class="activate">
                1
              </li>
              <li @click="BetButton($event, 10, '10')">
                10
              </li>
              <li @click="BetButton($event, 50, '50')">
                50
              </li>
              <li @click="BetButton($event, 100, '100')">
                100
              </li>
              <li @click="BetButton($event, 500, '500')">
                500
              </li>
              <li @click="BetButton($event, allGold, 'max')">
                {{ lang.Max }}
              </li>
            </nav>
          </div>
          <div class="footer">
            <div class="button_" @click="ConfirmBet">
              {{ lang.Confirm }}
              <i v-if="loadingBet" class="loading"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 下注确认框 -->
    <div class="Bet-Confirm Bet-pop-up" v-if="BetVisibleConfirm">
      <div class="centent">
        <div class="header Confirm-img"></div>
        <div class="Bj-centent centent">
          <p class="confirmed">
            <i class="red-right"></i>
            {{ lang.BetConfirmed }}
          </p>
          <p class="choice">
            {{ lang.YourChoice }}:&nbsp;<span style="color:#E04141">{{ BetNumber }}</span>
          </p>
          <p class="stake">
            {{ lang.stake }}
            <span style="color:#F5742E" v-if="betAmount <= 1">{{ betAmount }} {{ lang.money }}</span>
            <span style="color:#F5742E" v-else>{{ betAmount }} {{ lang.money }}s</span>
          </p>
          <div class="footer">
            <div class="button_" @click="BetVisibleConfirmFun(1)">
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 获奖名单 -->
    <div class="winner-list Bet-pop-up" v-if="winnerListVisible">
      <div class="centent">
        <span class="close" @click="winnerListVisible = false"></span>
        <!-- header list-img-false -->
        <div v-if="AwardsList.length != 0" class="header list-img-true">
          {{ lang.ListWinners }}
        </div>
        <div v-else class="header list-img-false">
          {{ lang.ListWinners }}
        </div>
        <div v-if="AwardsList.length > 0" class="Bj-centent winner-true">
          <div class="table-header">
            <nav>
              <li style="border-right: 2px solid #FFFFFF;">
                {{ lang.Name }}
              </li>
              <li>
                {{ lang.PrizeMoney }}
              </li>
            </nav>
          </div>
          <div class="table">
            <nav>
              <div v-for="(item,keys) in AwardsList" :key="keys" class="li-div">
                <li style="border-right: 2px solid #FFFFFF;">
                  {{ item.UserName }}
                </li>
                <li>
                  {{ (item.reward / 100).toFixed(2) }}
                </li>
              </div>
            </nav>
          </div>
        </div>
        <div v-else class="Bj-centent winner-false">
          <div class="div-img"></div>
          <p>
            {{ lang.combination }}<span style="color:#E04141">{{ WinningListNumber }}</span>
          </p>
          <p>
            {{ lang.closeCombination }}
          </p>
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
import * as Utils from '@/utils'
export default {
  name: 'NBAbeIndex',
  data () {
    return {
      lang: {},
      page: 1,
      allGold: '-', // 用户金币
      betAmount: 1, // 下注金额
      betAmountType: '',
      BetNumber: '', // 下注号码
      BetVisible: false, // 下注弹框
      BetVisibleConfirm: false,
      winnerListVisible: false,
      AwardsList: [],
      gameDateEst: '', // 时间
      winnerStaus: 0, // 流局判断
      WinningListNumber: '',
      loadingBet: false,
      loadingContainer: false,
      gameId: Utils.parseQueryString(window.location.search).gameId,
      BatTableInfo: [],
      TeamInfo: {
        MayTeam: '',
        MainTeam: '',
        TeamTime: ''
      },
      CHECKFlg: true, // 控制我的下注历史
      BetStaus: 0, // 0未开始1可下注2结束
      settlement: 0, // 结算状态 0未结算 1已结算、2流盘
      BetStaus0text: false,
      jackpot: '',
      HTMLheight: document.documentElement.style.fontSize.replace(/px/g, ''),
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage
  },
  watch: {},
  methods: {
    getInitData (type) {
      if (type) {
        window.history.go()
        return false
      }
      this.loadingStatus = 1
      this.setLang()
    },
    // 日志投递实例
    logEvent (key, params) {
      Log.demo(key, params)
    },
    getInitDataAjax () {
      Interface.getInitData({ page: this.page }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.allGold = (resData.allGold / 100).toFixed(2)
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    initData () {
      // this.gameId = '0021900267'
      Interface.getNbaGameBetNumber({ gameId: this.gameId }).then((res) => {
        this.loadingStatus = 0
        if (res.data) {
          let infoObj = res.data
          let gameInfos
          for (let o in infoObj.gameInfos) {
            gameInfos = infoObj.gameInfos[o]
          }
          // 开始时间
          this.gameDateEst = gameInfos.localTime
          // 启用禁用
          if (gameInfos.betStatus) {
            // 测试放开 this.BetStaus = this.DatetimeDifference(this.gameDateEst)
            this.BetStaus = this.DatetimeDifference(this.gameDateEst) // 1可下注
            // 流局
            if (this.settlement == 2) {
              this.BetStaus = 2
            }
            this.BetStaus0text = true
          } else {
            this.BetStaus = 0
            this.BetStaus0text = false
          }
          this.BatTableInfo = this.Integration(infoObj)
          // tricode homeTeamInfo 主队
          let TeamTime = new Date(this.gameDateEst.replace(/-/g, '/'))
          TeamTime = TeamTime.toDateString()
          TeamTime = TeamTime.substr(TeamTime.indexOf(' '))
          TeamTime = TeamTime.substr(0, TeamTime.lastIndexOf(' '))

          this.TeamInfo = {
            MayTeam: gameInfos.visitorTeamInfo.tricode,
            MainTeam: gameInfos.homeTeamInfo.tricode,
            TeamTime: TeamTime
          }
          // 结算状态 0未结算 1已结算、2流盘
          this.settlement = gameInfos.settlement ? gameInfos.settlement : 0
          let userId = Utils.getParams().userId
          if (this.settlement == 1) {
            if (infoObj.userBetNumber) {
              if (userId == 0 || !userId) {} else {
                Native.readValueForKey({ key: this.gameId }).then((res) => {
                  if (!res.data.value) {
                    Native.saveValueForKey({ key: this.gameId, value: '1' })
                    this.winningRecord()
                    this.winnerListVisible = true
                  }
                })
              }
            }
          }
          this.loadingContainer = false
          if (this.BetStaus == 2) {
            if (this.settlement == 2) {
              this.winnerStaus = true
            } else {
              this.winnerStaus = false
            }
          } else {
            this.winnerStaus = false
          }

          this.jackpot = infoObj.amount ? infoObj.amount : 0
          this.jackpot = this.jackpot / 100
          if (this.jackpot.toString().length < 5 && this.jackpot != 0) {
            let le = this.jackpot.toString().length
            this.jackpot = Array(6 - le).join(0) + this.jackpot
          }
          if (infoObj.userBetNumber) {
            this.CHECKFlg = true
          } else {
            this.CHECKFlg = false
          }
          // 重置参数
          this.BetVisible = false
          this.BetVisibleConfirm = false
          this.winnerListVisible = false
          // 返回高度
          let height = this.HTMLheight * 14.28
          let NativeS = Native
          window.setTimeout(() => {
            NativeS.returnWebPageHeight({ height: height })
          }, 200)
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.showError(error)
      })
    },
    winningRecord () {
      this.loadingStatus = 1
      let Params = {
        status: 1,
        gameId: this.gameId,
        page: this.page,
        size: 999
      }
      Interface.getNbaWinnersList(Params).then((res) => {
        let resData = res && res.data
        this.loadingStatus = 0
        if (resData) {
          if (resData.list) {
            resData.list = this.UserNames(resData)
            this.AwardsList = resData.list
            this.winnerListVisible = true
          } else {
            this.loadingStatus = 1
            this.AwardsList = []
            Interface.getGameDetail({ gameId: this.gameId }).then((res) => {
              let resData = res && res.data
              this.loadingStatus = 0
              if (resData.detail) {
                let awayScore = JSON.parse(resData.detail).payload.boxscore.awayScore.toString()
                let homeScore = JSON.parse(resData.detail).payload.boxscore.homeScore.toString()
                if (awayScore - homeScore > 0) {
                  this.WinningListNumber = `${awayScore[awayScore.length - 1]} - ${homeScore[homeScore.length - 1]}`
                } else {
                  this.WinningListNumber = `${homeScore[homeScore.length - 1]} - ${awayScore[awayScore.length - 1]}`
                }
                this.winnerListVisible = true
              }
              // 数据处理
            }).catch((err) => {
              this.loadingStatus = 2
              Utils.showError(err)
            })
          }
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    ConfirmBet () {
      // 计算点击下注金额
      if (this.allGold != '-') {
        if (this.betAmountType == 'max') {
          this.betAmount = parseInt(this.allGold)
        } else if (this.betAmountType == '') {
          this.betAmount = 1
        } else {
          this.betAmount = Number(this.betAmountType)
        }
      }
      if (!this.loadingBet) {
        let userId = Utils.getParams().userId // ? Utils.getParams().userId : 7612956269819555328
        let Params = {
          userId: userId,
          gameId: this.gameId,
          number: this.BetNumber,
          betAmount: this.betAmount
        }
        if (this.allGold == '-') {
          return false
        } else {
          if (this.allGold < 1 || this.betAmount < 1) {
            Utils.toast({ message: this.lang.insufficient })
            return false
          } else if (this.allGold - this.betAmount < 0) {
            Utils.toast({ message: this.lang.insufficient })
            return false
          }
        }
        //
        let endTime = new Date(this.gameDateEst.replace(/-/g, '/'))
        let Daytime = new Date()
        if (Daytime.getTime() - endTime.getTime() > 0) {
          Utils.toast({ message: this.lang.closed })
          window.setTimeout(() => {
            window.history.go()
          }, 2000)
          return false
        }
        Params.betAmount = this.betAmount * 100
        if (!Params.betAmount) {
          return false
        }
        this.loadingBet = true
        Interface.getGameBet(Params).then((res) => {
          let resData = res
          window.setTimeout(() => {
            this.loadingBet = false
            if (resData) {
              if (resData.data.RowsAffected) {
                this.BetVisible = false
                this.BetVisibleConfirm = true
              }
            }
          }, 800)
          // 数据处理
        }).catch((err) => {
          if (err.message == 'timeout of 10000ms exceeded') {
            this.loadingStatus = 2
            Utils.showError(err)
          } else {
            Utils.toast({ message: 'Oops,Please try again' })
            window.setTimeout(() => {
              window.history.go()
            }, 2000)
            return false
          }
        })
      }
    },
    BetButton (event, value, type) {
      this.Fall(event)
      this.betAmount = 1
      this.betAmountType = type
      event.target.className = 'activate'
      if (value == this.allGold) {
        this.betAmount = parseInt(value)
      } else {
        this.betAmount = value
      }
      if (this.betAmount.toString() == 'NaN') {
        if (this.allGold == '-') {
          this.betAmount = 0
        } else {
          this.betAmount = parseInt(value)
        }
      }
    },
    MatchBet (BetValue) {
      if (this.BetStaus != 2) {
        let userId = Utils.getParams().userId // ? Utils.getParams().userId : 7612956269819555328
        if (userId == 0 || !userId) {
          Native.callLoginModule({ from: Url.pageNBAbetIndex }).then((res) => {
            Native.getNativePublicParams().then((nativePublicParams) => {
              window.nativePublicParams = nativePublicParams
            })
          })
          return false
        } else {
          this.allGold = '-'
          // 获取用户金币
          window.setTimeout(() => {
            this.getInitDataAjax()
          }, 500)
          this.BetVisible = true
          this.loadingContainer = true
          let height = (this.HTMLheight * 14.28) - ((this.HTMLheight * 14.28) * 0.16)
          let NativeS = Native
          window.setTimeout(() => {
            NativeS.returnWebPageHeight({ height: height })
          }, 50)
          this.stop()
          this.betAmount = 1
          this.BetNumber = BetValue
          Native.nbaBetConfirmDialogShow()
        }
      }
    },
    Fall (ele) {
      let children = ele.target.parentElement.children
      for (let i in children) {
        if (i != 'length') {
          children[i].className = ''
        }
      }
    },
    BetVisiblePopUp (ele) {
      if (!this.loadingBet) {
        if (ele.target.className == 'Bet-pop-up' || ele.target.className == 'close') {
          this.BetVisible = false
          this.BetVisibleConfirmFun()
        } else {
          this.BetVisible = true
          this.loadingContainer = true
          let height = (this.HTMLheight * 14.28) - ((this.HTMLheight * 14.28) * 0.16)
          let NativeS = Native
          window.setTimeout(() => {
            NativeS.returnWebPageHeight({ height: height })
          }, 50)
        }
      }
    },
    UserNames (obj) {
      obj.list.forEach((v, i) => {
        for (let o in obj.userInfos) {
          if (v.userIdStr == obj.userInfos[o].userId) {
            v.UserName = obj.userInfos[o].nickName
          }
        }
      })
      // 最大在上面
      obj.list.sort((a, b) => {
        return b.betAmount - a.betAmount
      })
      return obj.list
    },
    jumpGo () {
      let url = Url.pageNBAbetRules
      url && Native.setJumpUrl({ url })
    },
    BetVisibleConfirmFun (type) {
      // 返回高度
      let height = this.HTMLheight * 14.28
      let NativeS = Native
      window.setTimeout(() => {
        NativeS.returnWebPageHeight({ height: height })
      }, 50)
      this.BetVisibleConfirm = false
      this.loadingContainer = false
      this.BetVisible = false
      if (type) {
        this.initData()
      }
    },
    stop () {
      // window.ontouchmove=function(e){
      //     e.preventDefault && e.preventDefault();
      //     e.returnValue=false;
      //     e.stopPropagation && e.stopPropagation();
      //     return false;
      // };
      // document.body.style.overflow = 'hidden'
      // document.addEventListener('touchmove', mo, false) // 禁止页面滑动
    },
    // NBA跳转下注历史
    goNBABetHistory () {
      Native.goNBABetHistory()
    },
    // NBA跳转下注首页
    goNBABetList () {
      Native.goNBABetList()
    },
    Integration (obj) {
      let userBetNumber = obj.userBetNumber ? obj.userBetNumber : []
      let allBetNumber = obj.allBetNumber ? obj.allBetNumber : []
      let le = 10
      let newArr = []
      let trArr = []
      for (let i = 0; i < le; i++) {
        for (let o = 0; o < le; o++) {
          let Obj = {
            number: `${i}-${o}`
          }
          userBetNumber.map((v) => {
            if (v.number == Obj.number) {
              Obj.user = true
            }
          })
          allBetNumber.map((v) => {
            if (v.number == Obj.number) {
              Obj.all = true
            }
          })
          if (!Obj.user && !Obj.all) {
            Obj.NoChoice = true
          }
          if (trArr.length == 4) {
            newArr.push(trArr)
            trArr = [Obj]
          } else {
            trArr.push(Obj)
          }
        }
      }
      newArr.push(trArr)
      return newArr
    },
    DatetimeDifference (time) {
      var Daytime = new Date()
      var Month = Daytime.getMonth() + 1
      var Day = Daytime.getDate()
      var Hours = Daytime.getHours()
      var endTime = new Date(time.replace(/-/g, '/'))
      var endMonth = endTime.getMonth() + 1
      var endDay = endTime.getDate()
      var endHours = endTime.getHours()
      // 明天
      var M = Daytime.getTime() + (24 * 60 * 60 * 1000)
      if (Hours == 0) {
        Hours = 24
      }
      if (endHours == 0) {
        endHours = 24
      }
      // console.log(endDay, 'Day')
      // console.log(Daytime.getDate(), 'Day1')
      // console.log(endHours, 'Day3')
      // console.log(time, 'Day4')
      // 0未开始1可下注2结束
      if (endDay == 28 || endDay == 29 || endDay == 30 || endDay == 31) {
        if (Day - endDay < 0) {
          if (Day >= 1) {
            return 2
          } else {
            if (M - endTime.getTime() >= 0) {
              if (endTime.getTime() - Daytime.getTime() > 0) {
                return 1
              } else {
                return 2
              }
            } else {
              return 0
            }
          }
        } else {
          if (Day - endDay > 1) {
            return 2
          }
          if (Day - endDay < -1) {
            return 0
          }
          if (Day - endDay == 1) {
            return 2
          }
          if (Day - endDay == -1 || Day - endDay == 0) {
            if (M - endTime.getTime() >= 0) {
              if (endTime.getTime() - Daytime.getTime() > 0) {
                return 1
              } else {
                return 2
              }
            } else {
              return 0
            }
          } else {
            return 2
          }
        }
      } else {
        if (Month == 12 && endMonth == 1) {
          let timeday = Daytime.getTime() + (24 * 60 * 60 * 1000)
          if (endTime.getTime() - timeday > 0) {
            return 0
          } else {
            return 1
          }
        } else if (Month == 1 && endMonth == 12) {
          return 2
        }
        if (Month - endMonth > 0) {
          return 2
        }
        if (Day - endDay > 1) {
          return 2
        }
        if (Day - endDay < -1) {
          return 0
        }
        if (Day - endDay == 1) {
          return 2
        }
        if (Day - endDay == -1 || Day - endDay == 0) {
          if (M - endTime.getTime() >= 0) {
            if (endTime.getTime() - Daytime.getTime() > 0) {
              return 1
            } else {
              return 2
            }
          } else {
            return 0
          }
        } else {
          return 2
        }
      }
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
          this.lang = res.data.NBAbet.index
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.initData()
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
<style>
.bb-toast-container {
  bottom: 20% !important;
}
</style>

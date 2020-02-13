<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="orderDetails-container">
      <div v-if="headerFlg" class="orderDetails-container-successful">
        <i></i>
        {{ lang.successful }}
      </div>
      <div class="orderDetails-container-show">
        <div class="show-img">
          <img :src="orderDetails.url" alt="">
        </div>
        <div class="show-text">
          <div>{{ orderDetails.goodsName }}</div>
          <p v-if="Number(orderDetails.price)/100 <= 1">
            {{ Number(orderDetails.price)/100 }} {{ lang.unit }}
          </p>
          <p v-else>
            {{ Number(orderDetails.price)/100 }} {{ lang.unit }}s
          </p>
        </div>
        <span style="clear: both;display: block;"></span>
      </div>
      <div class="orderDetails-container-Conditions">
        <nav>
          <li>{{ lang.couponNumber }}：<span class="couponNumber">{{ orderDetails.couponNumber }}</span><a href="javascript:;" :data-clipboard-text="orderDetails.couponNumber" @click="recordCopy" class="clipboardCode">{{ lang.Copy }}</a></li>
          <li>{{ lang.Conditions }}：<span>{{ orderDetails.discountDescription }}</span></li>
          <li>{{ lang.valid }}：{{ orderDetails.couponValidity }}</li>
        </nav>
      </div>
      <div class="orderDetails-container-info">
        <nav>
          <li>{{ lang.Payment }}：<span v-if="Number(orderDetails.paymentAmount)/100 <= 1">{{ Number(orderDetails.paymentAmount)/100 }} {{ lang.unit }}</span><span v-else>{{ Number(orderDetails.paymentAmount)/100 }} {{ lang.unit }}s</span></li>
          <li>{{ lang.orderNo }}：<span>{{ orderDetails.orderNumber }}</span></li>
          <li>{{ lang.paymentTime }}：<span>{{ orderDetails.timeOfPayment }}</span></li>
        </nav>
      </div>
      <transition name="fade">
        <div class="orderDetails-container-selectList">
          <p>
            {{ lang.selectTitle }}
            <i v-show="up" data="up" @click="selectListF"></i>
            <i data="down" v-show="down" @click="selectListF"></i>
          </p>
          <div class="selectList-info" v-show="selectList">
            <nav>
              <li v-for="(item,key) in orderDetails.details" :key="key">
                {{ item }}
              </li>
            </nav>
          </div>
        </div>
      </transition>
      <div class="orderDetails-container-footer">
        <div v-if="type == 1" class="orderDetails-container-footer-button" @click="statusSwitch">
          {{ lang.confirmUsed }}
        </div>
        <div v-else class="orderDetails-container-footer-button" style="background:#C0C0C0">
          {{ lang.Used }}
        </div>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Log, Interface } from './config'
import { Native } from '@/common'
import Clipboard from 'clipboard'
import * as Utils from '@/utils'
export default {
  name: 'TicketOrderDetails',
  data () {
    return {
      lang: {},
      selectList: true,
      up: true,
      down: false,
      page: 2,
      type: '',
      order_id: '',
      orderDetails: {},
      headerFlg: true,
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage
  },
  watch: {},
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    initData () {
      let hrefObj = Utils.parseQueryString(window.location.search)
      if (hrefObj.header) {
        this.headerFlg = true
      } else {
        this.headerFlg = false
      }
      this.order_id = hrefObj.order_id
      // 订单详情返回存储type
      window.localStorage.setItem('datatype', hrefObj.type)
      this.type = hrefObj.type
      Interface.postDetailsQuery({ order_id: [hrefObj.order_id] }).then((res) => {
        let resData = res && res.data
        if (resData) {
          let newObj
          for (let i in resData) {
            newObj = this.ObjectDataNeaten(resData[i])
          }
          this.orderDetails = newObj
          this.orderDetails.details = this.orderDetails.details.split(/\n/g)
          this.loadingStatus = 0
        } else {
          this.loadingStatus = 2
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    selectListF (e) {
      if (this.orderDetails.details.length < 3) {
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
    statusSwitch (e) {
      let value = e.target.innerText
      if (value == 'Confirm used') {
        e.target.innerText = this.lang.Used
        e.target.style.background = '#C0C0C0'
      } else {
        e.target.innerText = this.lang.confirmUsed
        e.target.style.background = '#E04141'
      }
      this.loadingStatus = 1
      Interface.postCouponMark({ order_id: this.order_id }).then((res) => {
        let resData = res && res.data
        this.loadingStatus = 0
        if (resData) {
          this.type = 2
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    recordCopy () {
      this.logEvent('load', { event: 'orderDetails_copy' })
    },
    setNativeSubtitle () {
      Native.setNativeSubtitle({})
    },
    // 复制INIT
    clipboardInit () {
      let clipboardCode = new Clipboard('.clipboardCode')
      clipboardCode.on('success', (e) => {
        Utils.toast({
          message: this.lang.copySuccess
        })
      })
      clipboardCode.on('error', (e) => {
        // Log.logEvent('copy')
        Utils.toast({ message: this.lang.copyError })
      })
    },
    logEvent (key, params) {
      Log.demo(key, params)
    },
    ObjectDataNeaten (obj) {
      let Newobj = {
        discountDescription: obj.Media.group[0].basic.discountDescription,
        url: obj.Media.group[0].cover[1]['1'].url,
        price: obj.Media.group[0].basic.price,
        goodsName: obj.Media.group[0].basic.summary,
        paymentAmount: obj.Order.price,
        orderNumber: obj.order_id_str,
        timeOfPayment: obj.Order.update_time,
        details: obj.Media.group[0].basic.content, // 优惠券详情
        couponNumber: obj.Media.basic.content,
        couponValidity: this.dateFormat(Number(obj.Media.basic.expireTime) * 1000, 'yyyy-MM-dd HH:mm:ss')
      }
      return Newobj
    },
    // 当前时间差八小时处理
    dateFormat (time, format) {
      var date = new Date(time)
      var o = {
        MM: date.getMonth() + 1, // month
        dd: date.getDate(), // day
        HH: date.getHours(), // hour+8小时
        mm: date.getMinutes(), // minutes
        ss: date.getSeconds(), // second
        qq: Math.floor((date.getMonth() + 3) / 3), // quarter
        SS: date.getMilliseconds() // millisecond
      }
      if (o.HH == 24) {
        o.HH = '00'
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return format
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
          this.lang = res.data.ticket.orderDetails
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.setNativeSubtitle()
          this.initData()
        } else {
          this.loadingStatus = 2
        }
      }).catch((error) => {
        this.loadingStatus = 2
        Utils.log('getAreaLangPackage-error=>', error)
      })
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
    this.logEvent('load', { event: 'orderDetails_page_show' })
  }
}
</script>

<style lang="scss">
  @import './app';
</style>
<style>
.bb-toast-container {
    bottom: calc(100vh - 94vh) !important;
}
</style>

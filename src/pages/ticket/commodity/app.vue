<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="commodity-container">
      <!-- 轮播 -->
      <div class="commodity-container-swiper" v-if="mediaData.cover.length>0">
        <swiper :options="swiperOption">
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
      <div class="commodity-container-content">
        <p class="commodity-container-content-titleInfo">
          {{ mediaData.summary }}
        </p>
        <p v-if="Number(mediaData.price)/100 <= 1" class="commodity-container-content-money">
          {{ Number(mediaData.price)/100 }} {{ lang.unit }}
        </p>
        <p v-else class="commodity-container-content-money">
          {{ Number(mediaData.price)/100 }} {{ lang.unit }}s
        </p>
        <span class="commodity-container-content-border"></span>
        <p class="commodity-container-content-listTile">
          {{ lang.listTile }}
        </p>
        <nav class="commodity-container-content-navLi">
          <!-- 后续for数据循环 -->
          <li v-for="(item,key) in mediaData.content" :key="key">
            {{ item }}
          </li>
        </nav>
      </div>
      <!-- 后续字体颜色背景颜色切换 -->
      <div class="commodity-container-footer">
        <!-- commodity-container-footer-button storage_color -->
        <div v-if="isbindPhone" class="commodity-container-footer-button" @click="goNativeBindPhone">
          {{ lang.mustNumber }}
        </div>
        <div v-else-if="mediaData.duration && (allGold - (Number(mediaData.price)/100)) > 0" disabled="disabled" class="commodity-container-footer-button" @click="jump(mediaData)">
          {{ lang.exchange }}
        </div>
        <div v-else-if="mediaData.duration" :class="(allGold - (Number(mediaData.price)/100)) > 0?'commodity-container-footer-button':'commodity-container-footer-button storage_color'">
          {{ lang.exchange }}
        </div>
        <div v-else class="commodity-container-footer-button" style="background:#C0C0C0">
          {{ lang.soldOut }}
        </div>
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Interface } from './config'
import { Native, Url } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'TicketCommodity',
  data () {
    return {
      lang: {},
      swiperOption: {

      },
      allGold: '',
      duration: '',
      imgList: [

      ],
      mediaData: {
        cover: []
      },
      showTip: null,
      isbindPhone: false,
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage,
    swiper,
    swiperSlide
  },
  watch: {},
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    initData () {
      // 数据获取
      Interface.postMediaInfo({ videoId: Utils.parseQueryString(window.location.search).mediaId }).then((res) => {
        let resData = res && res.data
        if (resData) {
          let mediaObj = resData.media
          let coverArr = []
          this.allGold = Utils.parseQueryString(window.location.search).allGold
          this.duration = Utils.parseQueryString(window.location.search).duration
          mediaObj.cover.forEach((v1, i1) => {
            if (i1 > 1) {
              coverArr.push(v1['1'])
            }
          })
          mediaObj.basic.price = Number(JSON.parse(mediaObj.basic.privateDetail).price)
          mediaObj.basic.mediaId = mediaObj.mediaId
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
          this.mediaData = mediaObj
          this.loadingStatus = 0
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    jump (mediaData) {
      let url = Url.pageTicketOrderDetails
      url = url + `?type=1&header=true`
      // let userId = Utils.getQueryString('userId') || 7159395567966880000
      // 购买优惠券
      this.loadingStatus = 1
      Interface.postCouponPurchase({ media_id: mediaData.mediaId.toString() }).then((res) => {
        let resData = res && res.data
        if (resData.order_id) {
          url += `&order_id=${resData.order_id}`
          window.location.href = url
        } else {
          this.loadingStatus = 2
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 0
        this.allGold = 0
        this.duration = 0
        if (err.data.msg) {
          Utils.toast({ message: err.data.msg })
          window.setTimeout(() => {
            window.history.back(-1)
          }, 2000)
        } else {
          Utils.toast({ message: err.data })
        }
      })
    },
    setNativeSubtitle () {
      Native.setNativeSubtitle({})
    },
    // 判断用户是否绑定过手机号
    isShowBindPhoneBtn () {
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
        if (data) {
          this.isbindPhone = false
        } else {
          this.isbindPhone = true
        }
        this.initData()
      })
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
    // 设置语言
    setLang () {
      let langObj = Utils.getLang()
      this.langPkg = langObj.langPkg
      this.loadingText = langObj.loading
      // Utils.log('langObj=>', langObj)
      Interface.getAreaLangPackage({ langPkg: this.langPkg }).then((res) => {
        Utils.log('getAreaLangPackage-res=>', res)
        if (res && res.data) {
          this.lang = res.data.ticket.commodity
          Utils.log('getAreaLangPackage-res=>', this.lang)
          document.title = this.lang.title
          Native.setNativeTitle({ title: this.lang.title })
          this.setNativeSubtitle()
          // 清除订单返回的type值
          window.localStorage.removeItem('datatype')
          this.isShowBindPhoneBtn()
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

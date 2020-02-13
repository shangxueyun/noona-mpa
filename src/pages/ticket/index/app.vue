<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="index-container">
      <!-- 轮播 -->
      <div class="index-container-swiper">
        <swiper v-if="operationPictureFlg" :options="swiperOption">
          <swiper-slide v-for="(item,key) in imgList" :key="key">
            <div class="swiper-img-div">
              <a :href="item.href">
                <img style="width:100%;height: 100%;" :src="item.src" alt="">
              </a>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <button class="index-container-money">
          <div class="index-container-money-title">
            {{ lang.money }}
          </div>
          <div class="index-container-money-text">
            {{ allGold }}
          </div>
        </button>
      </div>
      <div class="index-container-content">
        <p class="listTile">
          {{ lang.listTile }}
        </p>
        <div class="index-container-content-group">
          <scroll-list :loading="loading" :loading-text="loadingText" :finished="finished" @load="CouponList">
            <div class="group-model margin_bot" v-for="(item,key) in commodityList" :key="key" @click="jump(item)">
              <div class="img_div">
                <img :src="item.url" alt="">
                <i class="sawtooth"></i>
              </div>
              <p>
                {{ item.summary }}
              </p>
              <div class="text-button">
                <div v-if="Number(item.price)/100 <= 1" class="text-button-text">
                  {{ Number(item.price)/100 }} {{ lang.unit }}
                </div>
                <div v-else class="text-button-text">
                  {{ Number(item.price)/100 }} {{ lang.unit }}s
                </div>
                <div v-if="item.duration" :class="(allGold - Number(item.price)/100) > 0?'text-button-button':'text-button-button storage_color'">
                  <span>{{ lang.statusTrue }}</span>
                </div>
                <div v-else class="text-button-button" style="background: rgba(0, 0, 0, .25);">
                  {{ lang.statusFalse }}
                </div>
              </div>
              <span style="clear: both;"></span>
            </div>
          </scroll-list>
        </div>
        <!-- <div class="index-container-content-footer">
          {{ lang.mores }}
        </div> -->
      </div>
    </div>
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import ScrollList from '@/components/scroll-list'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Interface } from './config'
import { Native, Url } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'TicketIndex',
  data () {
    return {
      lang: {},
      swiperOption: {

      },
      loading: false,
      finished: false,
      loadingFlg: 0,
      list: [],
      loadingText: 'loading....',
      operationPictureFlg: false,
      // 用户金币
      allGold: '',
      page: 1,
      imgList: [

      ],
      commodityList: [

      ],
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage,
    swiper,
    swiperSlide,
    ScrollList
  },
  watch: {},
  methods: {
    getInitData () {
      this.loadingStatus = 1
      this.setLang()
    },
    initData () {
      Interface.getInitData({ page: this.page }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.operationPicture()
        }
        resData.allGold = resData.allGold ? resData.allGold : 0
        this.allGold = (resData.allGold / 100).toFixed(2)
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    jump (row) {
      let url = Url.pageTicketCommodity
      url = url + `?mediaId=${row.mediaId}&allGold=${this.allGold}&duration=${row.duration}`
      window.location.href = url
    },
    setNativeSubtitle () {
      Native.setNativeSubtitle({
        categroy: 1, // 1跳转，2分享
        subTitle: {
          type: 2, // 1文本，2图片
          content: undefined, // 右上角文案
          imgUrl: `${Url.Web}/static/images/common/recharge.png`, // 图片链接地址
          webUrl: Url.pageTicketCommodityList // 跳转地址
        },
        share: {
          title: '', // 分享标题
          desc: '', // 分享描述
          imgUrl: ``, // 分享图标链接地址
          webUrl: `` // 分享跳转地址
        }
      })
    },
    operationPicture () {
      Interface.getOperationPicture({ page: this.page }).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.CouponList()
          this.imgList = []
          resData.forEach((v, i) => {
            if (v.url) {
              this.imgList.push({
                src: v.url,
                href: v.jumpUrl
              })
            }
          })
          if (this.imgList.length > 1) {
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
          this.operationPictureFlg = true
        } else {
          this.loadingStatus = 3
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    CouponList () {
      if (this.loadingFlg == 0) {
        Interface.getCouponList({ page: this.page, size: 20 }).then((res) => {
          let resData = res && res.data
          if (resData) {
            let mediaArr = resData.media
            this.commodityList = []
            this.commodityList = this.ObjectDataNeaten(mediaArr)
            this.loadingStatus = 0
          } else {
            this.commodityList = []
            this.loadingStatus = 0
            this.finished = true
          }
          // 数据处理
        }).catch((err) => {
          this.loadingStatus = 2
          Utils.showError(err)
        })
        this.loadingFlg = 2
        this.page = 2
      } else {
        if (this.loadingFlg != 1) {
          this.loading = true
          Interface.getCouponList({ page: this.page, size: 20 }).then((res) => {
            let resData = res && res.data
            if (resData) {
              let mediaArr = resData.media
              this.commodityList = this.commodityList.concat(this.ObjectDataNeaten(mediaArr))
              if (resData.pageToken != '') {
                this.page++
              } else {
                this.loadingFlg = 1
              }
            } else {
              this.commodityList = []
              this.loadingStatus = 0
              this.finished = true
            }
            this.loading = false
            // 数据处理
          }).catch((err) => {
            this.loadingStatus = 2
            Utils.showError(err)
          })
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
          this.lang = res.data.ticket.index
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
    },
    ObjectDataNeaten (obj) {
      let objArr = []
      let Newobj = {}
      obj.forEach((v, i) => {
        let { privateDetail } = v.basic
        // 0为商品列表图
        let { url } = v.cover[0]['1']
        if (privateDetail) {
          Newobj = v.basic
          Newobj.mediaId = v.mediaId
          Newobj.price = JSON.parse(privateDetail).price
          Newobj.url = url
          Newobj.cover = v.cover
        }
        objArr.push(Newobj)
      })
      return objArr
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>
<style>
.index-container-content-group .scroll-list {
  width: 100%;
}
</style>

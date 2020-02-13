<template>
  <div v-if="(item.source == 0 && item.img_url) || item.source == 900006 || item.source == 900007" class="ad-banner-com">
    <!-- 百度 -->
    <ads-baidu v-if="item.source == 900006" :ads-baidu-id="adsBaiduId" />
    <!-- 广点通 -->
    <div v-if="item.source == 900007 && gdtInfo.img_url" :id="'gdt-' + gdtInfo.view_id">
      <a href="javascript:;" class="gdt-item" @touchstart="touchstart($event)" @click="clickLog($event)">
        <div class="l">
          <div class="desc">{{ gdtInfo.description }}</div>
          <div class="title">{{ gdtInfo.title }}</div>
        </div>
        <div class="r">
          <img @load="imgLoaded" :src="gdtInfo.img_url" ref="adImg" :alt="gdtInfo.title">
          <div class="txt" v-if="isAdTip">
            <img src="./kg_gdt_ad_logo_night.png">
            <span>广告</span>
          </div>
        </div>
        <!-- <img @load="imgLoaded" :src="gdtInfo.img_url" ref="adImg" :alt="gdtInfo.title">
        <div v-if="isLoadGdt" class="ad-gdt-tip">
          <img src="../../assets/image/task/kg_gdt_ad_logo_night.png">
          <span class="ad-tip-g" v-if="isAdTip">广告</span>
        </div> -->
      </a>
    </div>
    <!-- 自营 -->
    <a v-if="item.source == 0" href="javascript:;" class="item" @touchstart="touchstart($event)" @click="clickLog($event)">
      <img :src="item.img_url" ref="adImg" :alt="item.creative_title">
      <span class="ad-tip" v-if="isAdTip">广告</span>
    </a>
  </div>
</template>

<script>
import { Native } from '@/common'
import adsBaidu from './ads-baidu'
export default {
  name: 'AdBannerCom',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    isView: {
      type: Boolean,
      default: true
    },
    isClick: {
      type: Boolean,
      default: true
    },
    isAdTip: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      timesStart: 0,
      upPosX: 0,
      upPosY: 0,
      isInitList: true,
      adsNum_GDT: 1,
      gdtInfo: {},
      adsBaiduId: '_' + Math.random().toString(36).slice(2),
      placement_id: '8050741295903244',
      isLoadGdt: false
    }
  },
  components: {
    adsBaidu
  },
  methods: {
    imgLoaded () {
      this.isLoadGdt = true
      this.viewLog(this.item)
    },
    initGDT (adsNum, callback) {
      let TencentGDT = (window.TencentGDT = window.TencentGDT || []) // (window.TencentGDT = window.TencentGDT || [])
      TencentGDT.push({
        placement_id: this.placement_id,
        app_id: '1107588800',
        type: 'native',
        count: adsNum, // 拉取广告的数量，必填，默认是3，最高支持10
        onComplete: function (obj) {
          callback && callback(obj)
        }
      })
      if (this.isInitList) {
        let s = document.createElement('script')
        let h = document.getElementsByTagName('head')[0]
        s.async = true
        s.src = '//qzs.qq.com/qzone/biz/res/i.js'
        h && h.insertBefore(s, h.firstChild)
        this.isInitList = !this.isInitList
      }
    },
    touchstart (e) {
      this.timesStart = this.getTimes()
      try {
        this.upPosX = parseInt(e.touches[0].clientX)
        this.upPosY = parseInt(e.touches[0].clientY)
      } catch (error) {
        console.log(error)
      }
    },
    getTimes () {
      return new Date().getTime()
    },
    getAdsDisplayWH () {
      let imgDom = this.$refs.adImg
      let imgW = imgDom.offsetWidth
      let imgH = imgDom.offsetHeight
      return {
        displayWidth: imgW,
        displayHeight: imgH
      }
    },
    clickLog (e) {
      if (!this.isClick) return
      if (this.item.source == 900007) {
        this.item.creative_title = this.gdtInfo.title
        let obj = {
          container: 'gdt-' + this.gdtInfo.view_id, // 广告容器Id
          advertisement_id: this.gdtInfo.view_id, // 广告Id
          placement_id: this.placement_id, // 广告位Id
          s: {
            down_x: e.clientX,
            down_y: e.clientY,
            up_x: e.clientX,
            up_y: e.clientY
          }
        }
        window.TencentGDT.NATIVE.doClick(obj)
      }
      let imgDom = this.getAdsDisplayWH()
      let tiemsEnd = this.getTimes()
      let statisticFromSource = this.item.statisticFromSource
      let params = Object.assign({}, this.item, {
        clickTime: this.timesStart,
        upPosX: this.upPosX,
        upPosY: this.upPosY,
        downPosX: e.clientX,
        downPosY: e.clientY,
        displayWidth: imgDom.displayWidth,
        displayHeight: imgDom.displayHeight,
        clickDuraiton: (tiemsEnd - this.timesStart) || 0,
        clickType: 1,
        clickinfo: 101,
        statisticFromSource
      })
      console.log('paramsClick', params)
      Native.adsClick(params)
    },
    viewLog (newVal) {
      if (!this.isView) return
      let viewTime = this.getTimes()
      let statisticFromSource = newVal.statisticFromSource
      let params = Object.assign({}, newVal, { viewTime, statisticFromSource })
      console.log('paramsView', params)
      Native.adsImpression(params)
    }
  },
  watch: {
    item (newVal, oldVal) {
      if (newVal.source == 900007) {
        this.initGDT(this.adsNum_GDT, (res) => {
          if (res.ret) { // 请求广点通成功
            if (res.data && res.data.length > 0) { // 有广告
              for (let i = 0; i < res.data.length; i++) {
                this.gdtInfo = {
                  advertisement_id: res.data[i].advertisement_id,
                  is_app: res.data[i].is_app,
                  icon_url: res.data[i].icon_url,
                  img_url: res.data[i].img_url,
                  description: res.data[i].description,
                  title: res.data[i].title,
                  view_id: res.data[i].advertisement_id
                }
                break
              }
            }
            newVal.creative_title = this.gdtInfo.title
            let obj = {
              container: 'gdt-' + this.gdtInfo.view_id, // 广告容器Id
              advertisement_id: this.gdtInfo.view_id, // 广告Id
              placement_id: this.placement_id // 广告位Id
            }
            window.TencentGDT.NATIVE.doExpose(obj)
            // this.viewLog(newVal)
          }
        })
      } else if ((newVal.source == 0 && newVal.img_url) || newVal.source == 900006) {
        this.viewLog(newVal)
      }
    }
  }
}
</script>

<style lang="scss">
.ad-banner-com{
  margin: 0 10px;
  .gdt-item {
    margin: 0 5px;
    display: flex;
    align-items: center;
    .l {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      font-family: PingFangSC-Regular;
      .desc {
        font-size: 18px;
        color: #3B424C;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: inline;
        padding-right: 15px;
      }
      .title {
        padding-top: 10px;
        font-size: 10.5px;
        color: #A2A3A5;
      }
    }
    .r {
      width: 113px;
      height: 72px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
      position: relative;
      left: 0;
      top: 0;
      .txt {
        position: absolute;
        top: 49px;
        right: 5px;
        width: 42px;
        height: 18px;
        line-height: 18px;
        opacity: 0.5;
        background: #000000;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 13px;
          width: 12px;
          display: block;
        }
        span {
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 10px;
          color: #FFFFFF;
          text-align: center;
          display: block;
          padding-left: 3px;
          padding-top: 2px;
        }
      }
    }
  }
  .item{
    cursor: pointer;
    width: 100%;
    display: block;
    position: relative;
    .img-bg {
      display: block;
      width: 100%;
      height: 140px;
      border-radius: 5px;
      background-position: center;
      background-size: cover;
    }
    img{
      display: block;
      width: 100%;
      height: auto;
      border-radius: 5px;
    }
    .ad-tip{
      position:absolute;
      bottom: 4px;
      right: 4px;
      z-index: 1;
      font-size: 12px;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      padding: 2px 3px;
      border-radius: 2px;
      transform: scale(0.5);
      transform-origin: right bottom;
    }
    .ad-gdt-tip {
      position:absolute;
      bottom: 4px;
      right: 4px;
      z-index: 1;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, .5);
      padding-left: 3px;
      border-radius: 3px;
      img {
        height: 12px;
        width: 12px;
        display: block;
      }
      .ad-tip-g{
        font-size: 12px;
        display: block;
        color: #fff;
        padding: 2px 3px;
        border-radius: 2px;
      }
    }
  }
}
.ad-banner-pt10{
  padding-top: 10px
}
.ad-banner-pb10{
  padding-bottom: 10px
}
.ad-banner-pt15{
  padding-top: 15px
}
.ad-banner-pb15{
  padding-bottom: 15px
}
</style>

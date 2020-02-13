<template>
  <div>
    <div id="adsTaBanner" v-if="adsType !== 'feed'">
      <img :src="adInfo.img_url" :alt="adInfo.activity_title">
    </div>
    <div class="ads-title" :id="adsId" v-else-if="adsType === 'feed'">
      <img :src="adInfo.img_url" :alt="adInfo.activity_title">
      <span>广告</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdsTa',
  data () {
    return {
      adInfo: {} // 广告详情
    }
  },
  props: {
    adsType: {
      type: String,
      default: ''
    },
    adsId: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 脚本加载
    loadScript (callback) {
      let adsEl = document.getElementById('taBannerScript')
      let script = null
      if (!adsEl) {
        script = document.createElement('script')
        script.src = '//yun.poppyta.com/h5-mami/msdk/tmk.js'
        script.id = 'taBannerScript'
        script.setAttribute('name', 'taBannerScript')
        let s = document.getElementsByTagName('head')[0]
        s.appendChild(script)
        if (script.readyState) {
          script.onreadystatechange = () => {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
              script.onreadystatechange = null
              typeof callback === 'function' && callback()
            }
          }
        } else {
          script.onload = () => {
            typeof callback === 'function' && callback()
          }
        }
      } else {
        typeof callback === 'function' && callback()
      }
    },
    //  初始化
    init () {
      /* eslint-disable no-new */
      new window.TuiSDK({
        container: '#adsTaBanner',
        appKey: '1TqmVgEyE5xtCUUhxbFB2P3WVMy',
        adslotId: '195666',
        success: (res) => {
          this.adInfo = res
        }
      })
    },
    // 角标广告
    initFlagAds () {
      /* eslint-disable no-new */
      new window.TuiSDK({
        container: '#adsTaBanner',
        appKey: '1TqmVgEyE5xtCUUhxbFB2P3WVMy',
        adslotId: '200432',
        success: (res) => {
          this.adInfo = res
        }
      })
    },
    test () {
      /* eslint-disable no-new */
      new window.TuiSDK({
        container: '#' + this.adsId,
        appKey: 'WZpPnk2isbzXk3975xv3t283Kzr',
        // slotId: '259765',
        slotId: '260417',
        success: (res) => {
          this.adInfo = res
        }
      })
    }
  },
  mounted () {
    this.loadScript(() => {
      if (this.adsType === 'flag') {
        this.initFlagAds()
      } else if (this.adsType === 'feed') {
        this.test()
      } else {
        this.init()
      }
    })
  }
}
</script>

<style lang="scss">
  .ads-title {
    position: relative;

    span {
      position: absolute;
      right: 0.1rem;
      bottom: 0.1rem;
      padding: 0.02rem 0.08rem;
      -webkit-border-radius: 0.04rem;
      border-radius: 0.04rem;
      font-size: 0.2rem;
      color: #FFF;
      background: rgba(0, 0, 0, 0.4);
    }
  }
</style>

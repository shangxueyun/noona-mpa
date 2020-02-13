<template>
  <div :id="adsBaiduId" />
</template>

<script>
export default {
  name: 'AdsBaidu',
  props: {
    adsBaiduId: {
      type: String,
      default: ''
    },
    adsType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // ads_baidu_id: ''
    }
  },
  methods: {
    // 脚本加载
    loadScript (callback) {
      if (document.getElementById('baiduid')) {
        typeof callback === 'function' && callback()
      } else {
        let script = document.createElement('script')
        script.id = 'baiduid'
        if (script.readyState) {
          script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
              script.onreadystatechange = null
              typeof callback === 'function' && callback()
            }
          }
        } else {
          script.onload = function () {
            typeof callback === 'function' && callback()
          }
        }
        if (this.adsType == 'feed') {
          script.src = '//cpro.baidustatic.com/cpro/ui/cm.js'
          script.async = true
          script.defer = 'defer'
        } else {
          script.src = '//dup.baidustatic.com/js/dm.js'
        }
        let s = document.getElementsByTagName('head')[0]
        s.appendChild(script)
      }
    },
    // 初始化
    init () {
      (window.slotbydup = window.slotbydup || []).push({
        id: '5895352',
        container: this.adsBaiduId,
        size: '20,4',
        display: 'inlay-fix',
        async: true
      })
    },
    // feed
    feed () {
      (window.slotbydup = window.slotbydup || []).push({
        // id: '5962068',
        // id: 'u3579487',
        id: 'u3579594',
        container: this.adsBaiduId
        // size: '20,4',
        // display: 'inlay-fix',
        // async: true
      })
    },
    // 初始化顶部广告
    initTopAds () {
      (window.slotbydup = window.slotbydup || []).push({
        id: '5899336',
        container: this.adsBaiduId,
        size: '20,5',
        display: 'inlay-fix',
        async: true
      })
    }
  },
  mounted () {
    this.loadScript(() => {
      if (this.adsType == 'top') {
        this.initTopAds()
      } else if (this.adsType == 'feed') {
        this.feed()
      } else {
        this.init()
      }
    })
  }
}
</script>

<style lang="scss">
// .baidu_main {
//   width: 100% !important;
//   #d, #c, img {
//     width: 100% !important;
//   }
// }
// .baidu_main:first-child {
//   width: 100% !important;
// }
</style>

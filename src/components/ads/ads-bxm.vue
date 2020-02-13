<template>
  <div id="adsBxmExbanner" v-if="adsType !== 'feed'" />
  <div :id="adsId" v-else-if="adsType === 'feed'" />
</template>

<script>
export default {
  name: 'AdsBxm',
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
    init () {
      let hm = document.createElement('script')
      hm.src = '//m.cudaojia.com/dist/floatModel/adMateri.js'
      hm.id = 'BxmExbannerScript'
      hm.setAttribute('name', 'BxmExbanner')
      if (this.adsType !== 'feed') {
        // 原始广告
        hm.setAttribute('data-adPositionId', '70c16a9565eb43be86606ac7f46477bf-8')
        hm.setAttribute('data-bannerContainer', 'adsBxmExbanner')
      } else {
        // feed 页面广告
        hm.setAttribute('data-adPositionId', '3b955a40b131407a8456721fd325d634-2')
        hm.setAttribute('data-bannerContainer', this.adsId)
      }
      let s = document.getElementsByTagName('head')[0]
      s.appendChild(hm)
    }
  },
  mounted () {
    this.init()
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss">
</style>

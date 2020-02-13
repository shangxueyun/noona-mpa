<template>
  <div :id="adsBaiduId" />
</template>

<script>
export default {
  props: {
    adsBaiduId: {
      type: String,
      default: ''
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
        script.src = '//dup.baidustatic.com/js/dm.js'
        let s = document.getElementsByTagName('head')[0]
        s.appendChild(script)
      }
    },
    // 初始化
    init () {
      (window.slotbydup = window.slotbydup || []).push({
        id: '5933892',
        container: this.adsBaiduId,
        size: '20,4',
        display: 'inlay-fix',
        async: true
      })
    }
  },
  mounted () {
    this.loadScript(() => {
      this.init()
    })
  }
}
</script>

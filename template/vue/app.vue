<template>
  <load-page :loading-status="loadingStatus" :init-data="getInitData">
    <div class="demo-container" />
  </load-page>
</template>

<script>
import { LoadPage } from '@/components/load'
import { Log, Share, Interface } from './config'
// import { Native, Url } from '@/common'
// import Detect from '@/utils/detect'
import * as Utils from '@/utils'
export default {
  name: 'Template',
  data () {
    return {
      loadingStatus: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    }
  },
  components: {
    LoadPage
  },
  watch: {},
  methods: {
    // 初始化
    getInitData () {
      this.loadingStatus = 1
      Interface.getInitData({}).then((res) => {
        let resData = res && res.data
        if (resData) {
          this.loadingStatus = 0
          // 数据处理
        } else {
          this.loadingStatus = 3
        }
        // 数据处理
      }).catch((err) => {
        this.loadingStatus = 2
        Utils.showError(err)
      })
    },
    // 日志投递实例
    logEvent (key = 'load', params) {
      Log.demo(key, params)
    },
    // 分享实例
    share (params) {
      Share.demo(params)
    }
  }
}
</script>

<style lang="scss">
  @import './app';
</style>

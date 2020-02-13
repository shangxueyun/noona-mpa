<template>
  <div class="main-container">
    <!-- 加载中 -->
    <div v-if="loadingStatus == 1" class="main-container__loading" />
    <!-- 重试 -->
    <div v-else-if="loadingStatus == 2" class="main-container__fail retry" @click="getInitData(true)">
      Failed to load, click to try again
    </div>
    <!-- 端外 404 -->
    <div v-else-if="loadingStatus == 3" class="main-container__fail no-found">
      The page you visited does not exist~~
    </div>
    <!-- 优惠券订单列表 -->
    <div v-else-if="loadingStatus == 7" class="main-container__fail load_div">
      <div class="load_img"></div>
      No orders yet...
    </div>
    <!-- 加载完成 -->
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'LoadPage',
  data () {
    return {}
  },
  props: {
    loadingStatus: {
      type: Number,
      default: 1 // 0加载完成，1加载中，2重试，3加载数据为空404，4删除，5审核
    },
    initData: {
      type: Function,
      default: () => {}
    }
  },
  created () {
    this.getInitData()
  },
  methods: {
    getInitData (type) {
      if (type) {
        this.initData(1)
      } else {
        typeof this.initData === 'function' && this.initData()
      }
      // this.$emit('retry')
    }
  }
}
</script>

<style lang="scss" >
.main-container {
  &__loading {
    min-height: 100vh;
    background: url(./load-page-logo.png) no-repeat center 35%;
    background-size: 98px 54px;
  }
  &__fail {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -35%);
    text-align: center;
    font-size: 14px;
    color: #A2A3A5;
    width: 100%;
    &.retry {
      padding-top: 120px;
      background: url(./load-page-retry.png) no-repeat center top;
      background-size: 116px 110px;
    }
    &.no-found {
      padding-top: 100px;
      background: url(./load-page-no-found.png) no-repeat center top;
      background-size: 132px 90px;
    }
    &.load_div{
      font-size: 15px;
      color: #9999A1;
      line-height: 30px;
    }
    .load_img{
      width: 107px;
      height: 93px;
      background: url(./load-rouse.png) no-repeat;
      background-size: 100%;
      margin: 0 auto;
    }
  }
}
</style>

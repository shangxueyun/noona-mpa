<template>
  <div class="banner-container">
    <div class="swiper-container" @click="toggleCate">
      <div class="swiper-wrapper">
        <span class="swiper-slide" v-for="(item) in list" :key="item.key" :data-key="item.key" :class="{active: item.key == active}">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
export default {
  name: 'BannerSwiper',
  data () {
    return {}
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: 'tuijian'
    }
  },
  created () {
    this.$nextTick(function () {
      /* eslint-disable no-new */
      new Swiper('.swiper-container', {
        spaceBetween: 20,
        slidesPerView: 'auto',
        freeMode: true
      })
    })
  },
  methods: {
    toggleCate (event) {
      this.$emit('swiperClick', event)
    }
  }
}
</script>

<style lang="scss">
.banner-container {
  position: relative;
  display: flex;
  flex-flow: column;
  // padding: 0 15px;
  background: #FFF;
  height: 55px;
  // border-bottom: 1px solid #ECECEC; /*no*/
  justify-content: center;
  .swiper-container {
    background: #FFF;
    max-width: 750px; /*no*/
    padding: 15px 15px 10px 15px;
    position: fixed;
    left: auto;
    top: 0;
    -webkit-overflow-scrolling: touch;
    border-bottom: 1px solid #ECECEC; /*no*/
    .swiper-slide {
      width: auto !important;
      color: #3B424C;
      font-size: 16px;
      display: inline-block;
      margin-right: 20px;
      word-break: keep-all;
      padding-bottom: 5px;
      &.active {
        color: #FD415F;
        border-bottom: 4px solid #FD415F; /*no*/
      }
    }
  }
  ul {
    background: #FFF;
    max-width: 750px; /*no*/
    padding: 15px;
    position: fixed;
    left: auto;
    right: auto;
    top: auto;
    // bottom: 0;
    z-index: 99;
    display: flex;
    // overflow: hidden;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    // padding-bottom: 20px;
    border-bottom: 1px solid #ECECEC; /*no*/
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: #fff;
    }
    li {
      color: #3B424C;
      font-size: 16px;
      display: inline-block;
      margin-right: 20px;
      word-break: keep-all;
      padding-bottom: 5px;
      &.active {
        color: #FD415F;
        border-bottom: 4px solid #FD415F; /*no*/
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  // padding-bottom: 8px;
  // border-bottom: 1px solid #ECECEC; /*no*/
}
</style>

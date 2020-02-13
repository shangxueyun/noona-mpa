<template>
  <div class="swiper-wrapper">
    <div ref="swContent" :style="contentW == 0 ? 'width:100%': {'width': contentW+'px !important'}" class="swiper-wrapper__content" @touchmove="fn">
      <div :class="className" class="swiper-wrapper__slide" @touchstart="startPos" @touchmove="movePos" @touchend="endPos">
        <slot />
      </div>
    </div>
    <div class="swiper-wrapper__pagination">
      <template v-if="slidesLength > 1">
        <span v-for="(tag, $index) in slidesLength" :class="{ show: index-1==$index }" :key="tag" />
      </template>
    </div>
  </div>
</template>

<script>
import { Native } from '@/common'
export default {
  data () {
    return {
      slidesLength: 1,
      controlWidth: 0,
      auto: true,
      slideing: true,
      timer1: '',
      className: '',
      dom: {},
      tPos: {
        sx: 0,
        s: 0,
        m: 0,
        e: 0
      },
      index: 1,
      contentW: 0
    }
  },
  props: {
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 一次滑动需要走多久
    duration: {
      type: Number,
      default: 200
    },
    // 两次滑动间隔的时间
    interval: {
      type: Number,
      default: 5000
    },
    showIndicator: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.contentW = this.getContentW()
    this.className = `sw_swiper_${Math.random().toFixed(3) * 1000}`
    setTimeout(() => {
      // 克隆dom
      this.starDom()
      this.dom.transform = `translate3d(${this.controlWidth * -1}px, 0px, 0px`
      this.dom['-webkit-transform'] = `translate3d(${this.controlWidth * -1}px, 0px, 0px`
      this.dom['-ms-transform'] = `translate3d(${this.controlWidth * -1}px, 0px, 0px`
      if (this.autoPlay) {
        this.setTime()
      }
    }, 50)
  },
  methods: {
    startPos (x) {
      // Native.disablePageSwipe(false)
      Native.setDownRefStatus({ code: 300, msg: '下拉不可用', data: '' })
      if (this.slideing) {
        this.clearTimeOut()
        this.tPos.sx = this.getTransform()
        this.tPos.s = x.touches[x.touches.length - 1].clientX
      }
    },
    movePos (x) {
      // Native.disablePageSwipe(false)
      Native.setDownRefStatus({ code: 300, msg: '下拉不可用', data: '' })
      if (this.slideing && this.tPos.s != -1) {
        this.clearTimeOut()
        this.tPos.m = x.touches[x.touches.length - 1].clientX - this.tPos.s
        this.setTransform(this.tPos.m + this.tPos.sx)
      }
    },
    endPos (x) {
      Native.setDownRefStatus({ code: 200, msg: '下拉可用', data: '' })
      if (this.slideing && this.tPos.s != -1) {
        this.clearTimeOut()
        this.setTransform(this.tPos.m + this.tPos.sx)
        let x = this.getTransform()
        x += this.tPos.m > 0 ? this.controlWidth * 0.3 : this.controlWidth * -0.3
        this.index = Math.round(x / this.controlWidth) * -1
        this.swiperHandle('touch')
      }
    },
    setTransform (num) {
      this.dom.transform = `translate3d(${num}px, 0px, 0px`
      this.dom['-webkit-transform'] = `translate3d(${num}px, 0px, 0px`
      this.dom['-ms-transform'] = `translate3d(${num}px, 0px, 0px`
    },
    getTransform () {
      var x = this.dom.transform || this.dom['-webkit-transform'] || this.dom['-ms-transform']
      x = x.substring(12)
      x = x.match(/(\S*)px/)[1]
      return Number(x)
    },
    fn (e) {
      e.preventDefault()
    },
    swiperHandle (type) {
      this.slideing = false
      this.dom.transition = type == 'touch' ? '250ms' : this.duration + 'ms'
      this.setTransform(this.index * -1 * this.controlWidth)
      this.tPos.m = 0
      this.tPos.s = -1 // 保证下次重新赋值
      if (this.autoPlay) {
        this.setTime()
      }
      var timeDuration = type == 'touch' ? '250' : this.duration
      setTimeout(() => {
        this.dom.transition = '0s'
        if (this.index >= this.slidesLength + 1) {
          this.index = 1
          this.setTransform(this.index * -1 * this.controlWidth)
        }
        if (this.index <= 0) {
          this.index = this.slidesLength
          this.setTransform(this.index * -1 * this.controlWidth)
        }
        this.auto = true
        this.slideing = true
      }, timeDuration)
    },
    prevSlide () {
      this.clearTimeOut()
      this.index--
      this.swiperHandle()
    },
    nextSlide () {
      this.clearTimeOut()
      this.index++
      this.swiperHandle()
    },
    slideTo (index) {
      this.clearTimeOut()
      this.index = index + 1
      this.swiperHandle()
    },
    setTime () {
      this.timer1 = window.setTimeout(() => {
        if (this.auto) {
          this.index++
          this.swiperHandle()
        } else {
          window.clearTimeout(this.timer1)
        }
      }, this.interval)
    },
    starDom () {
      let SlideDom = document.querySelector('.' + this.className).getElementsByClassName('swiper-container__slide')
      this.slidesLength = SlideDom.length
      if (this.slidesLength > 1) {
        let cloneDom1 = SlideDom[0].cloneNode(true) // 向最后append
        let cloneDom2 = SlideDom[this.slidesLength - 1].cloneNode(true) // 向最前append
        document.querySelector('.' + this.className).insertBefore(cloneDom2, SlideDom[0])
        document.querySelector('.' + this.className).appendChild(cloneDom1)
        this.controlWidth = document.querySelector('.' + this.className).offsetWidth
        this.dom = document.querySelector('.' + this.className).style
      }
    },
    clearTimeOut () {
      this.auto = false
      window.clearTimeout(this.timer1)
    },
    getContentW () {
      return this.$refs.swContent.offsetWidth
    }
  }
}
</script>

<style lang="scss">
.swiper-wrapper {
  padding: 16px 15px 0;
  &__content {
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  &__slide {
    width: 100%;
    display: flex;
    transition-duration: 0s linear;
  }
  &__pagination {
    padding: 6px 0;
    display: flex;
    justify-content: center;
    flex-flow: row nowrap;
    span {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin: 0 3px;
      cursor: pointer;
      border-radius: 100%;
      background: #EDEDED;
        &.show {
        background: #FD415F;
      }
    }
  }
}
</style>

<template>
  <div v-show="showNoticeBar" class="bb-marquee" :style="barStyle" @click="$emit('click')">
    <div class="bb-marquee__wrap" ref="wrap">
      <div ref="content" :class="['bb-marquee__content', animationClass]" :style="contentStyle" @animationend="onAnimationEnd" @webkitAnimationEnd="onAnimationEnd">
        <slot />
      </div>
    </div>
    <icon v-if="iconName" class="bb-marquee__right-icon" :name="iconName" @click="onClickIcon" />
  </div>
</template>

<script>
export default {
  name: 'BbMarquee',
  props: {
    height: String,
    mode: String,
    color: String,
    background: String,
    delay: {
      type: [String, Number],
      default: 1
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number, // m
      default: 0.8
    },
    listLength: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      wrapHeight: 0,
      firstRound: true,
      duration: 0,
      offsetHeight: 0,
      showNoticeBar: true,
      animationClass: ''
    }
  },
  computed: {
    iconName () {
      return this.mode === 'closeable' ? 'close' : this.mode === 'link' ? 'arrow' : ''
    },
    barStyle () {
      return {
        color: this.color,
        background: this.background,
        height: this.height
      }
    },
    contentStyle () {
      return {
        paddingTop: this.firstRound ? 0 : this.wrapHeight + 'px',
        animationDelay: (this.firstRound ? this.delay : 0) + 's',
        animationDuration: this.duration + 's'
      }
    }
  },
  updated () {
    this.$nextTick(() => {
      this.start()
    })
  },
  mounted () {
    this.start()
  },
  methods: {
    onClickIcon () {
      this.showNoticeBar = this.mode !== 'closeable'
    },
    start () {
      this.$nextTick(() => {
        console.log('nextTick satart')
        const { wrap, content } = this.$refs
        if (!wrap || !content) {
          return
        }
        console.log('listLength:' + this.listLength)
        const wrapHeight = wrap.getBoundingClientRect().height
        const offsetHeight = content.getBoundingClientRect().height
        if (this.scrollable && offsetHeight > wrapHeight) {
          this.wrapHeight = wrapHeight
          this.offsetHeight = offsetHeight
          this.duration = this.listLength * this.speed
          this.animationClass = 'bb-marquee__play'
        }
      })
    },
    onAnimationEnd () {
      this.firstRound = false
      this.$nextTick(() => {
        this.duration = (this.listLength) / this.speed
        this.animationClass = 'bb-marquee__play--infinite'
      })
    }
  }
}
</script>

<style lang="scss">
/*! 波波跑马灯组件 */
.bb-marquee {
  display: flex;
  color: #000;
  padding: 9px 15px;
  font-size: 12px;
  line-height: 1.5;
  position: relative;
  background-color: #fff7cc;
  &__wrap {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  &__content {
    position: absolute;
    white-space: nowrap;
    width: 100%;
  }
  &__play {
    animation: bb-marquee-play linear  both;
  }
  &__play--infinite {
    animation: bb-marquee-play-infinite linear infinite both;
  }
}

/**
 * Declare two same keyframes
 * In case that some mobile browsers can continue animation when className changed
 */
@keyframes bb-marquee-play {
  to { transform: translate3d(0, -100%, 0) }
}
@keyframes bb-marquee-play-infinite {
  to { transform: translate3d(0, -100%, 0) }
}
</style>

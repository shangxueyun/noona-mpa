<template>
  <div v-show="showNoticeBar" class="bb-notice-bar" :style="barStyle" @click="$emit('click')">
    <div v-if="leftIcon" :class="leftIcon" class="bb-notice-bar__left-icon" />
    <div class="bb-notice-bar__wrap" ref="wrap">
      <div ref="content" :class="['bb-notice-bar__content', animationClass]" :style="contentStyle" @animationend="onAnimationEnd" @webkitAnimationEnd="onAnimationEnd">
        <slot>
          <div v-html="text" />
        </slot>
      </div>
    </div>
    <icon v-if="iconName" class="bb-notice-bar__right-icon" :name="iconName" @click="onClickIcon" />
  </div>
</template>

<script>
export default {
  name: 'NoticeBar',
  props: {
    text: String,
    mode: String,
    color: String,
    leftIcon: String,
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
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      wrapWidth: 0,
      firstRound: true,
      duration: 0,
      offsetWidth: 0,
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
        background: this.background
      }
    },
    contentStyle () {
      return {
        paddingLeft: this.firstRound ? 0 : this.wrapWidth + 'px',
        animationDelay: (this.firstRound ? this.delay : 0) + 's',
        animationDuration: this.duration + 's'
      }
    }
  },
  watch: {
    text: {
      handler (val, old) {
        this.$nextTick(() => {
          const { wrap, content } = this.$refs
          if (!wrap || !content) {
            return
          }
          const wrapWidth = wrap.getBoundingClientRect().width
          const offsetWidth = content.getBoundingClientRect().width
          if (this.scrollable && offsetWidth > wrapWidth) {
            this.wrapWidth = wrapWidth
            this.offsetWidth = offsetWidth
            this.duration = offsetWidth / this.speed
            this.animationClass = 'bb-notice-bar__play'
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    onClickIcon () {
      this.showNoticeBar = this.mode !== 'closeable'
    },
    start () {
      this.$nextTick(() => {
        const { wrap, content } = this.$refs
        if (!wrap || !content) {
          return
        }
        const wrapWidth = wrap.getBoundingClientRect().width
        const offsetWidth = content.getBoundingClientRect().width
        if (this.scrollable && offsetWidth > wrapWidth) {
          this.wrapWidth = wrapWidth
          this.offsetWidth = offsetWidth
          this.duration = offsetWidth / this.speed
          this.animationClass = 'bb-notice-bar__play'
        }
      })
    },
    onAnimationEnd () {
      this.firstRound = false
      this.$nextTick(() => {
        this.duration = (this.offsetWidth + this.wrapWidth) / this.speed
        this.animationClass = 'bb-notice-bar__play--infinite'
      })
    }
  }
}
</script>

<style lang="scss">
/*! 波波notice bar组件 */
.bb-notice-bar {
  display: flex;
  color: #000;
  padding: 9px 15px;
  font-size: 12px;
  line-height: 1.5;
  position: relative;
  background-color: #fff7cc;
  &-item {
    display: inline-block;
  }
  &--withicon {
    position: relative;
    padding-right: 30px;
  }
  &__left-icon {
    height: 18px;
    min-width: 20px;
    // padding-top: 1px;
    box-sizing: border-box;
    background: url(./msg.png) center center no-repeat;
    background-size: 12px 12px;
    // img {
    //   width: 16px;
    //   height: 16px;
    // }
  }
  &__right-icon {
    top: 10px;
    right: 10px;
    position: absolute;
    font-size: 15px;
    line-height: 1;
  }
  &__wrap {
    flex: 1;
    height: 18px;
    overflow: hidden;
    position: relative;
  }
  &__content {
    position: absolute;
    white-space: nowrap;
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
  }
  &__play {
    animation: bb-notice-bar-play linear both;
  }
  &__play--infinite {
    animation: bb-notice-bar-play-infinite linear infinite both;
  }
}
/**
 * Declare two same keyframes
 * In case that some mobile browsers can continue animation when className changed
 */
@keyframes bb-notice-bar-play {
  to {
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes bb-notice-bar-play-infinite {
  to {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>

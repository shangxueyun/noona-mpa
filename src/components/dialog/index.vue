<template>
  <div class="bb-dialog-container" @touchmove="endMove($event)" v-show="show">
    <transition name="bb-dialog-container-mask">
      <div class="bb-dialog-container-mask" @click="hide" v-show="show" />
    </transition>
    <div class="bb-dialog-container-content" :class="{offsetTop: offsetTop && !Detect.os.ios}" v-show="show">
      <transition name="bb-dialog-container-content">
        <div v-show="show">
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Detect from '@/utils/detect'
export default {
  name: 'BbDialog',
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    fixIosFocus: {
      type: Boolean,
      default: false
    },
    hideOnBlur: Boolean,
    offsetTop: {
      type: Boolean,
      default: false
    },
    isMove: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hide () {
      if (this.hideOnBlur) {
        this.$emit('update:show', false)
        this.$emit('change', false)
        // this.$emit('on-click-mask')
      }
    },
    endMove (event) {
      if (!this.isMove) {
        event.preventDefault()
      }
    }
  },
  data () {
    return {
      Detect,
      bodyTop:
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    }
  },
  watch: {
    show (val) {
      this.$emit('update:show', val)
      const stopScroll = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (val) {
        let ios = Detect.os.ios
        if (ios && this.fixIosFocus) {
          document.body.style = 'overflow:hidden;position:fixed;width:100%;'
        } else {
          document.body.style = 'overflow:hidden;width:100%;'
        }
        if (this.isMove) {
          this.bodyTop =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
          document.body.style.top = -1 * this.bodyTop + 'px'
          document.body.style.position = 'fixed'
          document.body.addEventListener('scroll', stopScroll)
        }
      } else {
        document.body.style = 'overflow:auto'
        if (this.isMove) {
          document.body.style.position = null
          document.body.style.top = null
          document.documentElement.scrollTop = this.bodyTop
          document.body.scrollTop = this.bodyTop
          document.body.removeEventListener('scroll', stopScroll)
        }
      }
    }
  }
}
</script>

<style lang="scss">
/*! 波波dialog组件 */
.bb-dialog-container {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  &-mask {
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    &-enter, &-leave-active {
      opacity: 0;
    }
    &-leave-active, &-enter-active {
      transition: opacity 300ms;
    }
  }
  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 101;
    transform: translate(-50%, -50%);
    &.offsetTop {
      top: 0;
      transform: translate(-50%, 0);
    }
    &-enter-active {
      animation: dialog-container-in 0.5s;
    }
    &-leave-active {
      animation: dialog-container-out 0.3s;
    }
  }
}
@keyframes dialog-container-in {
  0% {
    transform: scale(1.185);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes dialog-container-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.85);
    opacity: 0;
  }
}
</style>

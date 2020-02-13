<template>
  <div class="bb-toast-container" v-show="visible">
    <div class="bb-toast-container-box" :class="customClass" v-show="visible">
      <transition name="bb-toast-container-content-pop">
        <div class="bb-toast-container-content" v-show="visible" :class="className" :style="{ 'padding': iconClass === '' ? '7px 10px' : '20px' }">
          <div v-if="topContent.contentClass && topContent.message" :class="topContent.contentClass" v-html="topContent.message" />
          <i class="bb-toast-container-content-icon" :class="iconClass" v-if="iconClass !== ''" />
          <template v-if="bottomContent.contentClass && bottomContent.message">
            <span :class="bottomContent.contentClass" :style="{ 'padding-top': iconClass === '' ? '0' : '5px 10px' }" v-html="bottomContent.message" />
          </template>
          <template v-else>
            <span class="bb-toast-container-content-text" :style="{ 'padding-top': iconClass === '' ? '0' : '5px 10px' }" v-html="message" />
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script >
export default {
  props: {
    message: String,
    className: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'middle'
    },
    iconClass: {
      type: String,
      default: ''
    },
    bottomContent: {
      type: Object,
      default: () => {
        return {
          contentClass: '',
          message: ''
        }
      }
    },
    topContent: {
      type: Object,
      default: () => {
        return {
          contentClass: '',
          message: ''
        }
      }
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    customClass () {
      var classes = []
      switch (this.position) {
        case 'top':
          classes.push('is-placetop')
          break
        case 'bottom':
          classes.push('is-placebottom')
          break
        default:
          classes.push('is-placemiddle')
      }
      // classes.push(this.className)
      return classes.join(' ')
    }
  }
}
</script>

<style lang="scss">
/*! 波波toast组件 */
.bb-toast-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  &-box {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    &.is-placetop {
      top: 50px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    &.is-placemiddle {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &.is-placebottom {
      bottom: 50px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
  &-content {
    max-width: 80%;
    border-radius: 5px;
    padding: 0 10px;
    // background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    transition: opacity 0.3s linear;
    background: linear-gradient(left, #fd8350, #fa2764)!important;
    border-radius: 50px;
    padding-left: 20px !important;
    padding-right: 20px !important;
    &-icon {
      display: block;
      text-align: center;
      font-size: 56px;
    }
    &-text {
      font-size: 14px;
      display: block;
      text-align: center;
    }
    &-pop-enter,
    &-pop-leave-active {
      opacity: 0;
    }
  }
}
</style>

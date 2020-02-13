<template>
  <bb-dialog v-model="show">
    <div class="bb-notice-wrap">
      <div class="bb-notice-content" :class="contentClass ? contentClass : ''">
        <h2><slot name="title" /></h2>
        <slot />
      </div>
      <div @click="hide" v-if="isClose" class="bb-notice-close" />
    </div>
  </bb-dialog>
</template>

<script>
import bbDialog from '@/components/dialog'
export default {
  name: 'PopupNotice',
  data () {
    return {
      show: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isClose: {
      type: Boolean,
      default: true
    },
    closeFn: {
      type: Function,
      default: null
    },
    contentClass: String
  },
  methods: {
    hide () {
      let closeFn = this.closeFn
      if (closeFn && typeof closeFn === 'function') {
        this.closeFn()
      } else {
        this.show = false
        this.$emit('on-hide', 'btnClose')
      }
    }
  },
  created () {
    if (typeof this.value !== 'undefined') {
      this.show = this.value
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$emit('on-show')
      } else {
        // this.$emit('on-hide', 'close')
      }
      this.$emit('input', val)
    },
    value (val) {
      this.show = val
    }
  },
  components: {
    bbDialog
  }
}
</script>

<style lang="scss">
/*! 波波弹出公告组件 */
.bb-notice {
  width: 100%;
  padding: 15px 0;
  font-size: 14px;
  color: #A2A3A5;
  display: flex;
  align-items: center;
  position: relative;
  &-content {
    background: #fff;
    padding: 20px 20px;
    border-radius: 10px;
    width: 320px;
    color: #4a4a4a;
    h2 {
      text-align: center;
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 15px;
      margin-top: 5px;
      text-indent: 0;
    }
    p {
      line-height: 1.5;
      font-size: 13px;
      color: #A2A3A5;
      text-align: justify;
      &.space {
        margin-top: 15px;
      }
      &.indent {
        text-indent: 2em;
      }
      // &~p {
      //   margin-bottom: 5px;
      // }
    }
    .right {
      text-align: right;
    }
    .center {
      text-align: center;
    }
    .date {
      text-align: right;
      padding: 15px 0;
    }
  }
  &-close {
    margin: 20px auto 0;
    height: 34px;
    width: 34px;
    background: url(notice-close.png) center center no-repeat;
    background-size: 34px 34px;
    cursor: pointer;
  }
}
</style>

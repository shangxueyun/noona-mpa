<template>
  <div class="scroll-list">
    <slot />
    <div v-show="loading" class="scroll-list__loading">
      <slot name="loading">
        <span class="scroll-list__loading-text">{{ loadingText }}</span>
      </slot>
    </div>
    <div v-if="length > 0 && finished" class="scroll-list__finished">
      {{ loadingFinished }}
    </div>
  </div>
</template>

<script>
import utils from './scroll'
import { on, off } from './event'
export default {
  name: 'ScrollList',
  model: {
    prop: 'loading'
  },
  props: {
    loading: Boolean,
    finished: Boolean,

    immediateCheck: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 10
    },
    length: {
      type: Number,
      default: 0
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    loadingFinished: {
      type: String,
      default: '全部加载完成~'
    }
  },
  mounted () {
    this.scroller = utils.getScrollEventTarget(this.$el)
    this.handler(true)
    if (this.immediateCheck) {
      this.$nextTick(this.onScroll)
    }
  },
  destroyed () {
    this.handler(false)
  },
  activated () {
    this.handler(true)
  },
  deactivated () {
    this.handler(false)
  },
  watch: {
    loading (val) {
      this.$nextTick(this.onScroll)
    },
    finished () {
      this.$nextTick(this.onScroll)
    }
  },
  methods: {
    onScroll () {
      if (this.loading || this.finished) {
        return
      }
      const el = this.$el
      const { scroller } = this
      const scrollerHeight = utils.getVisibleHeight(scroller)
      /* istanbul ignore next */
      if (
        !scrollerHeight ||
        utils.getComputedStyle(el).display === 'none' ||
        el.offsetParent === null
      ) {
        return
      }
      const scrollTop = utils.getScrollTop(scroller)
      const targetBottom = scrollTop + scrollerHeight
      let reachBottom = false
      /* istanbul ignore next */
      if (el === scroller) {
        reachBottom = scroller.scrollHeight - targetBottom < this.offset
      } else {
        const elBottom =
          utils.getElementTop(el) -
          utils.getElementTop(scroller) +
          utils.getVisibleHeight(el)
        reachBottom = elBottom - scrollerHeight < this.offset
      }
      /* istanbul ignore else */
      if (reachBottom) {
        this.$emit('input', true)
        this.$emit('load')
      }
    },
    handler (bind) {
      /* istanbul ignore else */
      if (this.binded !== bind) {
        this.binded = bind
        if (bind) {
          on(this.scroller, 'scroll', this.onScroll)
        } else {
          off(this.scroller, 'scroll', this.onScroll)
        }
      }
    }
  }
}
</script>

<style lang="scss">
/*! 波波滚动组件 */
.scroll-list {
  &__loading {
    text-align: center;
    .scroll-list-loading,
    &-text {
      display: inline-block;
      vertical-align: middle;
    }
    .scroll-loading {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    &-text {
      color: #a2a3a5;
      font-size: 14px;
      line-height: 50px;
    }
  }
  &__finished {
    color: #a2a3a5;
    text-align: center;
    font-size: 14px;
    padding: 10px 0;
  }
}
</style>

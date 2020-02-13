<template>
  <div>
    <slot />
    <div class="scroll-loading" v-if="loading">
      加载中...
    </div>
    <template v-else>
      <div class="scroll-loading" v-if="status == 'done'">
        全部加载完成
      </div>
      <div class="scroll-loading" v-if="status == 'nodata'">
        暂无数据
      </div>
    </template>
  </div>
</template>

<script>
let _scrollEventReay = false
export default {
  name: 'BScroll',
  data () {
    return {
      loading: false,
      status: '' // done , nodata
    }
  },
  props: {
    enableInfinite: {
      type: Boolean,
      default: true
    },
    onInfinite: {
      type: Function,
      default: undefined
    }
  },
  methods: {
    done (status = '') {
      this.loading = false
      this.status = status || ''
    },
    scroll () {
      let screenHeight = window.screen.height
      let scrollHeight = document.body.scrollHeight
      let scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      if (
        !this.enableInfinite ||
        this.loading ||
        this.status ||
        !this.onInfinite
      ) { return }
      if (screenHeight + scrollTop < scrollHeight) return
      this.loading = true
      this.onInfinite(this.done)
    }
  },
  mounted () {
    if (!_scrollEventReay) {
      _scrollEventReay = true
      let scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      if (scrollTop == 0 && this.enableInfinite) {
        this.scroll()
      }
      window.addEventListener('scroll', this.scroll)
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scroll)
    _scrollEventReay = false
  }
}
</script>

<style lang="scss">
.scroll-loading {
  justify-content: center;
  color: #a2a3a5;
  text-align: center;
  font-size: 13px;
  padding: 13px 0;
}
</style>

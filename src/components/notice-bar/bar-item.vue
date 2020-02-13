<template>
  <div class="bb-notice-bar-item">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BbNoticeBarItem',
  updated () {
    this.$nextTick(() => {
      this.$parent.start()
    })
  }
}
</script>

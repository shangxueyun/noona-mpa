<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BbMarqueeItem',
  updated () {
    this.$nextTick(() => {
      this.$parent.start()
    })
  }
}
</script>

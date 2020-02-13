<template>
  <div class="side-bar-container">
    <transition name="fade" @touchmove.stop.prevent>
      <!-- 遮罩层 -->
      <div class="side-bar-container__mask" v-show="show" @click="hide" />
    </transition>
    <!-- 侧边栏内容 -->
    <transition name="slide-fade">
      <div class="side-bar-container__content" v-show="show">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (val) {
      this.$emit('update:show', val)
    }
  },
  methods: {
    hide () {
      this.$emit('update:show', false)
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="scss">
.side-bar-container {
  width: 100%;
  height: 100%;
  &__mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 1;
    z-index: 8;
    background: rgba(0, 0, 0, 0.5);
  }
  &__content {
    position: fixed;
    width: 70%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 9;
    background: #FFF;
    -webkit-overflow-scrolling: touch;
  }
}

.fade-enter-to,
.fade-leave-to {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-to {
  transition: transform 0.3s;
  transform: translate(0, 0);
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translate(-100%, 0);
  transition: opacity 0.3s ease-in-out 0.3s, transform 0.3s ease-in-out;
}
</style>

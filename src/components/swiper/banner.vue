<template>
  <div class="swiper-container">
    <Swiper>
      <div v-for="(item, index) in list" @click="jumpToUrl(item)" :key="index" class="swiper-container__slide">
        <img class="swiper-container__img" :src="item.imageUrl">
      </div>
    </Swiper>
    <div class="swiper-container__line" />
  </div>
</template>

<script>
import Swiper from './swiper'
export default {
  name: 'SwiperBanner',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Swiper
  },
  methods: {
    jumpToUrl (item) {
      this.$emit('bannerClick', item)
    }
  }
}
</script>

<style lang="scss">
.swiper-container {
  &__line {
    height: 5px;
    width:100%;
    background: #F0F0F0;
  }
  &__slide {
    width: 100%;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  &__img {
    display: block;
    width: 100%;
    height: 60px;
    border-radius: 10px;
  }
}
</style>

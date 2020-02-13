<template>
  <div>
    <template v-if="isLogin">
      <slot />
    </template>
    <button v-else class="login-btn" :class="btnClass" @click="login">
      {{ btnText }}
    </button>
  </div>
</template>

<script>
import { Native } from '@/common'
export default {
  name: 'NativeLogin',
  props: {
    btnText: {
      type: String,
      default: '请登录'
    },
    from: {
      type: Number,
      default: 0
    },
    btnClass: {
      type: String,
      default: ''
    },
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'isLogin',
    event: 'change'
  },
  methods: {
    login () {
      this.$emit('on-click')
      Native.requestLogin(this.from)
    }
  },
  watch: {
    isLogin (val) {
      this.$emit('update:isLogin', val)
      this.$emit('change', val)
    }
  },
  created () {
    Native.reloadPage((nativePublicParams, params, type) => {
      if (type == 'login') {
        if (params == 'success') {
          this.isLogin = true
        } else if (params == 'fail') {
          // Utils.toast({
          //   message: '登录失败'
          // })
        } else {
          // Utils.toast({
          //   message: '登录取消'
          // })
        }
      }
    })
  }
}
</script>
<style>
.login-btn{
  border: 0;
}
</style>

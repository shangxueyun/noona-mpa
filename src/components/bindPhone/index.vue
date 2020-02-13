<template>
  <!-- 绑定手机号 -->
  <bb-alert v-model="show" :history="true" :fix-ios-focus="true" :offset-top="offsetTop" title="绑定手机">
    <div class="bind-phone-container">
      <div class="row">
        <input
          type="tel"
          @blur="inputFocus(false)"
          @focus="inputFocus(true)"
          maxlength="11"
          v-model.trim="bindPhoneData.phone"
          placeholder="手机号"
          class="ipt"
        >
      </div>
      <div class="row flex">
        <input
          type="tel"
          maxlength="4"
          @blur="inputFocus(false)"
          @focus="inputFocus(true)"
          v-model.trim="bindPhoneData.code"
          placeholder="验证码"
          class="ipt flex_item"
        >
        <button class="code" @click="getcaptcha" v-if="!codeSms.disabled && !codeSms.sending">
          发送验证码
        </button>
        <template v-else>
          <button class="code" v-if="!codeSms.sending">
            发送中...
          </button>
          <button class="code" v-else>
            {{ getSencod }}
          </button>
        </template>
      </div>
    </div>
    <button slot="footer" :disabled="disabled" @click="bindPhone" class="bind-alert-button">
      验证保存
    </button>
  </bb-alert>
</template>

<script>
import bbAlert from '@/components/alert'
import { Interface } from './config'
import * as Utils from '@/utils'
export default {
  name: 'BindPhone',
  data () {
    return {
      offsetTop: false,
      codeSms: {
        disabled: false,
        sending: false,
        second: 60
      },
      disabled: false,
      bindPhoneData: {
        phone: '',
        code: ''
      },
      show: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    enableToast: {
      type: Boolean,
      default: false
    },
    smsSource: {
      type: Number,
      default: 3 // 1､任务中心：绑定手机号码2､申请提现绑定手机号码3､腾讯大王卡4新春活动5绑定邀请码
    }
  },
  computed: {
    getSencod () {
      return this.codeSms.second + 's'
    }
  },
  methods: {
    hide () {
      this.show = false
    },
    inputFocus (type) {
      if (type) {
        this.offsetTop = true
      } else {
        this.offsetTop = false
      }
    },
    waitSms () {
      this.codeSms.sending = true
      let timer = setInterval(() => {
        if (this.codeSms.second <= 0) {
          this.codeSms.sending = false
          clearInterval(timer)
          this.codeSms.second = 60
          return
        }
        this.codeSms.second--
      }, 1000)
    },
    getcaptcha () {
      let { phone } = this.bindPhoneData
      if (!phone) {
        return Utils.toast({ message: '请输入手机号' })
      }
      if (!Utils.isPhone(phone)) {
        return Utils.toast({ message: '请输入正确的手机号' })
      }
      let data = {
        phone,
        source: this.smsSource
      }
      this.codeSms.disabled = true
      Interface.Getcaptcha(data)
        .then(res => {
          this.codeSms.disabled = false
          let resData = res.data
          if (resData.ret == 1) {
            Utils.toast({ message: resData.msg })
            this.waitSms()
          } else {
            Utils.toast({ message: resData.msg })
          }
        })
        .catch(err => {
          this.codeSms.disabled = false
          Utils.showError(err)
        })
    },
    bindPhone () {
      // 绑定手机号
      let { phone, code } = this.bindPhoneData
      if (!phone) {
        return Utils.toast({ message: '请输入手机号' })
      }
      if (!Utils.isPhone(phone)) {
        return Utils.toast({ message: '请输入正确的手机号' })
      }
      if (code.length == 0) {
        return Utils.toast({ message: '验证码不能为空' })
      }
      this.disabled = true
      this.bindPhoneData.source = this.smsSource
      Interface.BindPhone(this.bindPhoneData)
        .then(res => {
          let resData = res.data
          this.disabled = false
          if (resData.ret == 1) {
            if (!this.enableToast) {
              // 是否禁用toast
              Utils.toast({ message: resData.msg })
            }
            this.hide()
            this.$emit('bind-success', resData)
          } else {
            Utils.toast({ message: resData.msg })
          }
        })
        .catch(err => {
          this.disabled = false
          Utils.showError(err)
        })
    }
  },
  created () {
    if (typeof this.value !== 'undefined') {
      this.show = this.value
    }
  },
  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  },
  components: {
    bbAlert
  }
}
</script>

<style lang="scss">
/*! 波波绑定手机号组件 */
.bind-phone-container {
  padding-top: 15px;
  .row {
    height: 60px;
    border-top: 1px solid#D2D2D2; /*no*/
    border-bottom: 1px solid#D2D2D2; /*no*/
    width: 100%;
    &:last-of-type {
      border-top: 0;
    }
    .ipt {
      font-size: 15px;
      line-height: 2;
      padding: 14px 0;
    }
    .code {
      color: #3b424c;
      position: relative;
      min-width: 82px;
      background: transparent;
      border: none;
      &::after {
        content: "";
        position: absolute;
        left: -14px;
        top: 50%;
        width: 1px;
        height: 14px;
        margin-top: -7px;
        background: #d2d2d2;
      }
    }
  }
}
.bind-alert-button {
  display: block;
  width: 100%;
  height: 45px;
  border-radius: 100px;
  text-align: center;
  font-size: 17px;
  color: #fff;
  border: none;
  margin-top: 10px;
  background: linear-gradient(right bottom, #fa3b14, #ff724b);
  &.bg-39cf1a {
    background: #39cf1a;
  }
  &:disabled {
    background: #dedede;
  }
}
</style>

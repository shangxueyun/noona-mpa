<template>
  <div class="time-countdown">
    <b>{{ hour }}</b>{{ hourText }}<b>{{ minute }}</b>{{ minuteText }}<b>{{ second }}</b>{{ secondText }}
  </div>
</template>

<script>
let _timeCountDownInterval = null
export default {
  name: 'TimeCountdown',
  data () {
    return {
      hour: '00',
      minute: '00',
      second: '00'
    }
  },
  props: {
    countDownTimes: {
      type: Number,
      default: 0
    },
    hourText: {
      type: String,
      default: '时'
    },
    minuteText: {
      type: String,
      default: '分'
    },
    secondText: {
      type: String,
      default: ''
    }
  },
  methods: {
    countdown (sec) {
      let hour = 0
      let minute = 0
      let second = 0
      _timeCountDownInterval = setInterval(() => {
        if (sec >= 60) {
          minute = Math.floor(sec / 60)
          second = sec % 60
          if (minute >= 60) {
            hour = Math.floor(minute / 60)
            minute = minute % 60
          } else {
            hour = 0
          }
        } else {
          second = sec
          hour = 0
          minute = 0
        }
        this.hour = hour < 10 ? `0${hour}` : hour
        this.minute = minute < 10 ? `0${minute}` : minute
        this.second = second < 10 ? `0${second}` : second
        sec--
        if (sec < 0) {
          clearInterval(_timeCountDownInterval)
          this.$emit('on-over')
        }
      }, 1000)
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.countDownTimes > 0) {
        this.countdown(this.countDownTimes)
      }
    })
  },
  watch: {
    countDownTimes (val) {
      this.$nextTick(() => {
        this.countdown(val)
      })
    }
  },
  destroyed () {
    _timeCountDownInterval && clearInterval(_timeCountDownInterval)
  }
}
</script>
<style lang="scss">
/*! 波波倒计时组件 */
.time-countdown{
  display: flex;
  align-items: center;
}
</style>

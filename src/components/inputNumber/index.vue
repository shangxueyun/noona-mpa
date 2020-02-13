<template>
  <div class="InputNumber">
    <div ref="subtract" style="line-height: 38px;" :class="mindisabled?'subtract disabled':'subtract'" @click="subtract">
      -
    </div>
    <input
      type="number"
      v-model="Value"
      @change="AmountChange"
      @blur="IsAndroid($event, 0)"
      @focus="IsAndroid($event, 1)"
    >
    <div ref="add" style="line-height: 38px;" :class="maxdisabled?'add disabled':'add'" @click="add">
      +
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputNumber',
  data () {
    return {
      maxdisabled: false,
      mindisabled: false,
      Value: this.numberValue
    }
  },
  watch: {
    numberValue (val) {
      if (this.max == 0) {
        this.Value = 1
        this.mindisabled = true
        this.maxdisabled = true
      } else {
        if (val - this.max >= 0) {
          this.Value = this.max
          this.mindisabled = false
          this.maxdisabled = true
        } else {
          this.Value = val
        }
      }
      this.$emit('AmountNumValue', this.Value)
    }
  },
  props: {
    max: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    numberValue: {
      type: Number
    }
  },
  mounted () {
    if (this.Value - this.max >= 0) {
      this.Value = this.max
      this.maxdisabled = true
    } else if (this.Value == 1) {
      if (this.Value == this.max) {
        this.mindisabled = true
        this.maxdisabled = true
      } else {
        this.mindisabled = true
        this.maxdisabled = false
      }
    } else if (this.Value == this.max) {
      this.mindisabled = false
      this.maxdisabled = true
    } else {
      this.mindisabled = false
      this.maxdisabled = false
    }
    this.$emit('AmountNumValue', this.Value)
    // if (/Android/g.test(window.navigator.userAgent)) {
    //   debugger
    // }
    // debugger
    // this.$refs.subtract
  },
  methods: {
    AmountChange (value) {
      if (this.Value.toString().indexOf('.') > -1) {
        this.Value = this.max
      } else {
        if (this.Value - this.max >= 0) {
          this.Value = this.max
          this.mindisabled = false
          this.maxdisabled = true
        } else if (this.Value - this.min > 0) {
          this.mindisabled = false
          this.maxdisabled = false
        } else if (this.Value - this.min <= 0) {
          this.Value = this.min
          this.mindisabled = true
          this.maxdisabled = false
        }
      }
      this.$emit('AmountNumValue', this.Value)
    },
    IsAndroid (ele, type) {
      // const input = ele.target
      // let interval
      // input.onfocus = () => {
      //   interval = setInterval(() => {
      //     input.scrollIntoViewIfNeeded()
      //     input.scrollIntoView(true)
      //     document.scrollIntoView()
      //   }, 300)
      // }
      // input.onblur = () => {
      //   clearInterval(interval)
      // }
      this.$emit('IsAndroid', type)
    },
    subtract () {
      let newvalue = this.Value - 1
      if (newvalue - this.min > 0) {
        this.Value = newvalue
        this.mindisabled = false
        this.maxdisabled = false
      } else {
        this.Value = this.min
        this.mindisabled = true
        this.maxdisabled = false
      }
      this.$emit('AmountNumValue', this.Value)
    },
    add () {
      let newvalue = this.Value + 1
      if (newvalue - this.max >= 0) {
        this.Value = this.max
        this.maxdisabled = true
      } else {
        this.Value = newvalue
        this.maxdisabled = false
        this.mindisabled = false
      }
      this.$emit('AmountNumValue', this.Value)
    }
  }
}
</script>

<style>
.InputNumber .subtract{
  float: left;
  width: 56px;
  height: 44px;
  outline: 0;
  border: 1px solid #E4E4E4;
  background: #fff;
  text-align: center;
  font-size: 24px;
  color: #666;
}
.InputNumber .add{
  float: left;
  width: 56px;
  height: 44px;
  outline: 0;
  border: 1px solid #E4E4E4;
  background: #fff;
  text-align: center;
  font-size: 24px;
  color: #666;
}
.InputNumber input{
  width: calc(100% - 140px);
  float: left;
  height: 44px;
  border-top: 1px solid #E4E4E4;
  border-bottom: 1px solid #E4E4E4;
  font-size: 16px;
  text-align: center;
  color: #333;
  outline: 0;
  border-radius: 0px;
}
.InputNumber input{ -webkit-appearance: none; }
.InputNumber .disabled{
  color: #ccc !important;
}
</style>

<template>
  <div class="lottery">
    <div class="Input-text-box-Lottery_show">
      <div class="Input-text-box-Lottery_show-padding">
        <div class="Input-text-box-Lottery_show-img">
          <img :src="lottery.ionc" alt="">
        </div>
        <div class="Input-text-box-Lottery_show-div">
          <nav>
            <li>{{ lang.nickname }} {{ lottery.nickname }}</li>
            <li>ID: <span style="color:#E23F3C">{{ lottery.No }}</span></li>
            <li>{{ lang.betNumber }} {{ lottery.betNumber }}</li>
          </nav>
        </div>
      </div>
      <div class="Input-text-box-Lottery_show-button">
        {{ lang.luckyNumber }}  {{ lottery.phase }}
      </div>
      <span class="Input-text-box-Lottery_show-label">Winner</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lottery',
  data () {
    return {

    }
  },
  props: {
    lottery: {
      type: Object,
      default: Object
    },
    lang: {
      type: Object,
      default: Object
    }
  }
}
</script>

<style>
.lottery .Input-text-box-Lottery_show{
  background: #FCF6F1;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}
.lottery .Input-text-box-Lottery_show-padding{
  padding: 14px 14px 14px 36px;
}
.lottery .Input-text-box-Lottery_show-img{
  float: left;
}
.lottery .Input-text-box-Lottery_show-img img{
  width: 48px;
  height: 48px;
  border-radius: 24px;
}
.lottery .Input-text-box-Lottery_show-div{
  width: 76%;
  float: right;
}
.lottery .Input-text-box-Lottery_show-div li{
  list-style: none;
  line-height: 26px;
  color: #323232;
  font-size: 16px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.lottery .Input-text-box-Lottery_show-button{
  clear: both;
  width: 100%;
  height: 34px;
  background: #E04141;
  color: rgba(255, 255, 255, .9);
  font-size: 16px;
  line-height: 34px;
  text-align: center;
}
.lottery .Input-text-box-Lottery_show-label{
  transform: rotate(-44deg);
  width: 100px;
  height: 12px;
  font-size: 11px;
  color: #fff;
  background: #E04141;
  position: absolute;
  left: -32px;
  top: 10px;
  text-align: center;
}
</style>

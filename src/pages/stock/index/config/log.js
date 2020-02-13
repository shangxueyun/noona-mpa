import { Log } from '@/common'

let logData = {
  // 事件
  event (event, params = {}) {
    const options = {
      page: { cn: '端内H5猜涨跌', en: 'stockIndex' },
      events: {
        betPageShow: 'bet_page_show', // 首页曝光
        betRisebtnClick: 'bet_risebtn_click', // 涨按钮点击
        betFallbtnClick: 'bet_fallbtn_click', // 跌按钮点击
        betPopupShow: 'bet_popup_show', // 下注弹窗
        betPopupConfirm: 'bet_popup_confirm', // 下注确认
        betConfirmSuccess: 'bet_confirm_success', // 下注成功
        drawPopupShow: 'draw_popup_show', // 开奖弹窗
        drawPopupGoClick: 'draw_popup_go_click', // 开奖go
        drawPopupCloseClick: 'draw_popup_close_click' // 开奖关闭
      },
      params
    }
    Log.collect(options, options.events[event])
  }
  // 下注弹窗
  // betEvent (key, params = {}) {
  //   const options = {
  //     page: { from: 2, cn: '端内H5弹窗', en: 'popup' },
  //     evetnFrom: {
  //       load: { btn: 'pageView', event: 'popup_show', from: 0 },
  //       btnConfirm: { btn: 'btnConfirm', event: 'popup_click', from: 301 },
  //       btnClose: { btn: 'btnClose', event: 'popup_click', from: 302 }
  //     },
  //     params
  //   }
  //   Log.collect(options, key)
  // },
  // 中奖弹窗
  // lotteryEvent (key, params = {}) {
  //   const options = {
  //     page: { from: 3, cn: '端内H5弹窗', en: 'popup' },
  //     evetnFrom: {
  //       load: { btn: 'pageView', event: 'popup_show', from: 0 },
  //       btnGo: { btn: 'btnGo', event: 'popup_click', from: 401 },
  //       btnClose: { btn: 'btnClose', event: 'popup_click', from: 402 }
  //     },
  //     params
  //   }
  //   Log.collect(options, key)
  // }
}

export default logData

import { Log } from '@/common'

let logData = {
  // 事件
  event (event, params = {}) {
    const options = {
      page: { cn: '端内H5猜涨跌', en: 'stockHistory' },
      events: {
        betHistoryShow: 'bet_history_show' // 下注弹窗
      },
      params
    }
    Log.collect(options, options.events[event])
  }
}

export default logData

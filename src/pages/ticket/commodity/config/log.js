import { Log } from '@/common'

let logData = {
  demo (key, params = {}) {
    const options = {
      page: { from: 8, cn: 'demo', en: 'demo' },
      evetnFrom: {
        load: { btn: 'pageView', event: 'download_show', from: 0 },
        share: { btn: 'demo', event: 'demo_click', from: 0 }
      },
      params
    }
    Log.collect(options, key)
  }
}

export default logData

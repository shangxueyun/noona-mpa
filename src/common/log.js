/*
 * @Author: ouyangwei@yixia.com
 * @Date: 2018-08-17 17:10:11
 * @Last Modified by: 王少龙
 * @Last Modified time: 2018-12-08 17:02:11
 */
import Url from './url'
import * as Utils from '@/utils'
import Detect from '@/utils/detect'
import axios from 'axios' // axios
// import DeepLink from '@/utils/deepLink'

/**
 *
 *
 * @export
 * @class Log
 */
// export default class Log {
class Log {
  collect (options, event) {
    let nativeParams = Utils.getParams()
    let login = nativeParams.token ? 1 : 0
    let source = Utils.getQueryString('source')
    // 大数据投递
    let data = {
      app: 'noonaH5',
      page: options.page.en,
      pcid: options.pcid || '',
      udid: nativeParams.udid,
      abid: options.abid || '',
      event: options.params.event,
      param: {
        login: login,
        plat: Detect.os.platform,
        source: source,
        ...options.params
      }
    }
    // let image = new Image(1, 1)
    // image.onload = function () {}
    // image.src = Url.Log + '/?data=' + window.encodeURIComponent(JSON.stringify(data))
    axios.get(Url.Log + '/?data=' + window.encodeURIComponent(JSON.stringify(data))).then((res) => {
      if (res.data.data) {
        console.log('投递成功')
      }
    })
    // 唤起已安装客户端及下载
    // let key = options && options.key
    // if (options.key != 'show' && !Utils.isInside()) {
    //   DeepLink.callInstalledApp(options.params)
    // }
  }
}

export default new Log()

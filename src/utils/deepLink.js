import Detect from './detect'
// import DownloadLink from './downloadLink'
import * as Utils from './index'

/**
 * 端外落地页唤起及下载APP
 *
 * @class DeppLink
 */
class DeppLink {
  /**
   * 创建iframe
   *
   * @returns
   * @memberof DeppLink
   */
  createIframe () {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    return iframe
  }
  /**
   * 唤起已安装客户端
   *
   * @param {*} url
   * @memberof DeppLink
   */
  callApp (url) {
    let iframe = this.createIframe()
    // let scheme = Detect.os.ios ? 'sparknews' : 'newspark'
    // url = url.replace('{scheme}', scheme)
    if (!Utils.isEmptyObj(iframe) && Detect.os.android) {
      iframe.src = url
    } else {
      window.location.href = url
    }
    // 2000毫秒没有唤醒则跳转至相关渠道进行下载
    window.setTimeout(() => {
      this.downloadApp()
    }, 3000)
  }
  /**
   * 下载客户端
   *
   * @param {*} url
   * @memberof DeppLink
   */
  downloadApp () {
    if (Detect.os.ios) {
      window.location.href = 'https://itunes.apple.com/ph/app/id1446000206?l=zh&ls=1&mt=8'
    } else {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.newspark.mobile'
    }
  }
}

export default new DeppLink()

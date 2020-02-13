import Api from '@/common/api'
import Url from '@/common/url'
/**
 * 接口类
 *
 * @export
 * @class Interface
 * @extends {Api}
 */
class Interface extends Api {
  /**
   * 初始化
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getInviteList (data) {
    return this.fetch({
      url: '/v1/new/invite/list',
      data
    })
  }

  getMyInviteList (data) {
    return this.fetch({
      url: '/v1/new/user/invite/list',
      data
    })
  }

  /**
   * 获取区域语言包
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getAreaLangPackage (data) {
    return this.fetch({
      url: Url.Lang + '/' + data.langPkg + '.json',
      method: 'GET'
    })
  }
}

export default new Interface()

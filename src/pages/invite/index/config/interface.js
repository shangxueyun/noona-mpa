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
  getInitData (data) {
    return this.fetch({
      url: '/v1/new/user/inviteInfo',
      data
    })
  }

  check (data) {
    return this.fetch({
      url: '/v1/new/user/check',
      data
    })
  }

  binding (data) {
    return this.fetch({
      url: '/v1/new/user/binding',
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

  /**
   * 获取用户信息
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getUserInfo (data) {
    return this.fetch({
      url: '/v1/user/info',
      data
    })
  }
}

export default new Interface()

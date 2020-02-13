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
   * 用户的优惠券列表
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  userCouponList (data) {
    return this.fetch({
      url: '/v1/coupon/userCouponList',
      data
    })
  }
  /**
   * 初始化
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getInitData (data) {
    return this.fetch({
      url: '/api/**/**',
      data
    })
  }
}

export default new Interface()

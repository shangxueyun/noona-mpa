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
   *
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  postCouponMark (data) {
    return this.fetch({
      url: '/v1/coupon/marked',
      data
    })
  }
  /**
  *订单详情查询
  *
  * @param {*} data
  * @returns
  * @memberof Interface
  */
  postDetailsQuery (data) {
    return this.fetch({
      url: '/v1/coupon/orderInfo',
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

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
   *优惠券购买
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  postCouponPurchase (data) {
    return this.fetch({
      url: '/v1/coupon/exchange',
      data
    })
  }
  /**
   *商品详情查询
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  postMediaInfo (data) {
    return this.fetch({
      url: '/v1/video/info',
      data
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

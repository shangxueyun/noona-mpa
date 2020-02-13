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
   *获取运营位图片资源
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getOperationPicture (data) {
    return this.fetch({
      url: '/v1/coupon/banner',
      data
    })
  }

  /**
   *获取优惠券列表
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getCouponList (data) {
    return this.fetch({
      url: '/v1/coupon/list',
      data
    })
  }

  /**
   *获取用户金币
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getInitData (data) {
    return this.fetch({
      url: '/v1/new/user/gold',
      data
    })
  }
}

export default new Interface()

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
   *商品详情查询
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  postPhaseInfo (data) {
    return this.fetch({
      url: '/v1/treasure/phaseInfo',
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
  /**
   *下注
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getBuy (data) {
    return this.fetch({
      url: '/v1/treasure/buy',
      data
    })
  }
  /**
   *中奖公告
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getAwardRecord (data) {
    return this.fetch({
      url: '/v1/treasure/rewardNotice',
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

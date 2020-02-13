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
   * 初始化
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getInitData (data) {
    return this.fetch({
      url: '/v1/stock/prizePoolDetail',
      data
    })
  }
  /**
   * 用户下注
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  setStockBet (data) {
    return this.fetch({
      url: '/v1/stock/bet',
      data
    })
  }
  /**
   * 下注预计收益
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getStockBetIncome (data) {
    return this.fetch({
      url: '/v1/stock/calculateIncome',
      data
    })
  }
  /**
   * 排行榜
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getStockTop (data) {
    return this.fetch({
      url: '/v1/stock/userBetIncomeList',
      data
    })
  }
  /**
   * 下注记录
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getStockBetHistoryRecord (data) {
    return this.fetch({
      url: '/v1/stock/userBetHistoryRecord',
      data
    })
  }
}

export default new Interface()

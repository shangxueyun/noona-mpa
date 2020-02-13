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
   * 比赛下注状态汇总
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getNbaGameBetNumber (data) {
    return this.fetch({
      url: '/v1/nba/nbaGameBetNumber',
      data
    })
  }
  /**
   * 比赛下注
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getGameBet (data) {
    return this.fetch({
      url: '/v1/nba/gameBet',
      data
    })
  }
  /**
   * 比赛下注获奖者
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getNbaWinnersList (data) {
    return this.fetch({
      url: '/v1/nba/nbaWinnersList',
      data
    })
  }
  /**
   * 比赛详情
   *
   * @param {*} data
   * @returns
   * @memberof Interface
   */
  getGameDetail (data) {
    return this.fetch({
      url: '/v1/nba/gameDetail',
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

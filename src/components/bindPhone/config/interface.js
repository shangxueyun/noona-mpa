import Api from '@/common/api'
/**
 * 接口类
 *
 * @export
 * @class Interface
 * @extends {Api}
 */
class Interface extends Api {
  /**
   * 大转盘开始抽奖
   *
   * @export
   * @param {*} data
   * @returns
   */
  BindPhone (data) {
    return this.fetch({
      url: '/api/user/bindphone',
      data
    })
  }

  /**
   * 大转盘抽奖保存用户信息
   *
   * @export
   * @param {*} data
   * @returns
   */
  Getcaptcha (data) {
    return this.fetch({
      url: '/api/user/getcaptcha',
      data
    })
  }

  /**
   * 大转盘抽奖中奖记录
   *
   * @export
   * @param {*} data
   * @returns
   */
  getRewardRecord (data) {
    return this.fetch({
      url: '/api/lottery/getRewardRecord',
      data
    })
  }
}

export default new Interface()

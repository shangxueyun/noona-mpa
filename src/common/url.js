/*
 * @Author: ouyangwei@yixia.com
 * @Date: 2018-08-17 17:10:11
 * @Last Modified by: 王少龙
 * @Last Modified time: 2019-04-28 15:11:50
 */
/**
 * url全局配置
 *
 * @export
 * @class Url
 */
class Url {
  /**
   *Creates an instance of Url.
   * @memberof Url
   */
  constructor () {
    let webUrl = this.getWebUrl()
    let jumpUrl = this.getJumpUrl()
    let schemaUrl = this.getSchemaUrl()
    let allUrl = Object.assign({}, webUrl, jumpUrl, schemaUrl)
    return allUrl
  }
  /**
   * 访问&接口地址
   *
   * @memberof Url
   */
  getWebUrl () {
    let Url = {}
    let origin = window.location.origin
    let protocol = window.location.protocol || 'https:'
    if (process.env.NODE_ENV === 'production') { // 生产环境
      Url = {
        Api: `${protocol}//api.noonaapps.com`,
        ShareWeb: `${protocol}//m.noonaapps.com`,
        Web: origin + '/inside',
        Log: `http://log.noonaapps.com/h5`,
        Lang: `${origin}/inside/static/lang/`
      }
    } else if (process.env.NODE_ENV === 'test') { // 开发测试环境
      Url = {
        Api: `${protocol}//47.244.1.248:8270`,
        ShareWeb: `${protocol}//h5-test.noonaapps.com`,
        Web: origin + '/inside',
        Log: `http://log.noonaapps.com/h5`,
        Lang: `${origin}/inside/static/lang/`
      }
    } else { // 本地开发环境
      Url = {
        Api: '',
        Web: origin + '/inside',
        ShareWeb: origin,
        Log: `${protocol}//log.noonaapps.com/h5`,
        Lang: `${origin}/static/lang/`
      }
    }

    return Url
  }
  /**
   * 调整链接地址
   *
   * @returns
   * @memberof Url
   */
  getJumpUrl () {
    let Url = this.getWebUrl()
    return {
      // noona
      invitePage: `${Url.Web}/invite/index.html`,
      inviteRankPage: `${Url.Web}/invite/rank.html`,
      shareInvitePage: `${Url.ShareWeb}/newspark/share/invite`,
      // inviteRulePage: `${Url.Web}/invite/rule/{lang}.html`,
      inviteRulePage: `${Url.Web}/invite/rule/en.html`,
      mallPage: `${Url.Web}/mall/index.html`,
      mallMobilePage: `${Url.Web}/mall/mobile.html`,
      mallHistoryPage: `${Url.Web}/mall/history.html`,
      mallTermsPage: `${Url.Web}/mall/terms/{lang}.html`,
      walletIntroducePage: `${Url.Web}/wallet/introduce/{lang}.html`,

      // 股票猜涨跌规则页
      pageStockRule: `${Url.Web}/stock/rule.html`,
      pageStockHistory: `${Url.Web}/stock/history.html`,

      // 券其他页面
      pageTicketCommodity: `${Url.Web}/ticket/commodity.html`,
      pageTicketIndex: `${Url.Web}/ticket/index.html`,
      pageTicketCommodityList: `${Url.Web}/ticket/commodityList.html`,
      pageTicketOrderDetails: `${Url.Web}/ticket/orderDetails.html`,

      pageTreasureTreasureDetails: `${Url.Web}/treasure/TreasureDetails.html`,

      // NBA
      pageNBAbetIndex: `${Url.Web}/NBAbet/index.html`,
      pageNBAbetRules: `${Url.Web}/NBAbet/Rules.html`,

      // 充值
      pagerechargeRules: `${Url.Web}/rechargeRules/index.html`
    }
  }
  /**
   * schema跳转
   *
   * @returns
   * @memberof Url
   */
  getSchemaUrl () {
    return {
      // 首页
      sHome: 'newspark://web/',
      // 用户页
      sUser: 'newspark://web/u?uid={uid}',
      // 视频页
      sVideo: 'newspark://web/v?vid={vid}'
    }
  }
}

export default new Url()

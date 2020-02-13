import { Native, Url } from '@/common'
import * as Utils from '@/utils'
/**
 * options.title 分享标题
 * options.desc 分享描述
 * options.IconUrl 分享Icon地址 (必填)
 * options.webUrl 分享跳转地址(必填)
 * options.from ... 7：收徒分享面板_h5 8 : 唤醒分享面板_h5 9:炫耀分享面板_h5 32：连续收徒分享，33：连续收徒分享唤醒
 * options.way 1:微信好友，2:微信朋友圈 3:qq好友,4:qq空间,5:邮件 6：短信,7：新浪微博 8：系统分享，默认-1即调起面板
 * options.style h5(卡片), img(纯图片), text(文本)，默认h5
 * options.imgUrl style为img时图片地址
 * @param {*} options
 */
const Share = {
  // 分享配置实例
  demo (params = {}) {
    params = Utils.getParams(params)
    const options = {
      title: 'demo title',
      desc: 'demo desc',
      iconUrl: `${Url.Web}/static/images/share/share_logo.png`,
      imgUrl: `${Url.Web}/static/images/share/share_logo.png`,
      webUrl: `${Url.Web}/demourl`,
      from: 32,
      way: -1,
      style: 'h5'
    }
    Native.share(options)
  },
  // app webview 右上角配置
  setNativeSubTitle (params = {}) {
    const option = {
      categroy: 1, // 1跳转，2分享
      subTitle: {
        type: 1, // 1文本，2图片
        content: '视频教程', // 右上角文案
        imgUrl: `${Url.Web}/static/images/guide/icon.png`, // 图片链接地址
        webUrl: `` // 跳转地址
      },
      share: {
        title: '', // 分享标题
        desc: '', // 分享描述
        imgUrl: ``, // 分享图标链接地址
        webUrl: `` // 分享跳转地址
      }
    }
    Native.setNativeSubtitle(option)
  }
}

export default Share

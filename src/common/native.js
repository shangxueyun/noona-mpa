import JSBridge from './JSBridge'
import * as Utils from '@/utils'
/**
 * H5<=>Native交互
 *
 * @class Native
 * @extends {JSBridge}
 */
class Native extends JSBridge {
  /**
   * Creates an instance of JSBridge.
   * @memberof JSBridge
   */
  constructor () {
    super()
    // this.init()
    const methods = {}
    const callMethods = this.callMethods()
    Object.keys(callMethods).forEach((item) => {
      methods[item] = (h5Params = {}) => {
        return this.promiseCallMethods(callMethods[item], h5Params)
      }
    })
    methods.getNativePublicParams = this.getNativePublicParams.bind(this)

    const registerMethods = this.registerMethods()
    Object.keys(registerMethods).forEach((item) => {
      methods[item] = (h5callback, isReturn = false) => {
        this.promiseRegisterMethods(registerMethods[item], h5callback, isReturn)
      }
    })

    // schema协议
    methods.schemaMethods = this.schemaMethods()
    // 移除方法
    // methods.removeHandler = this.removeHandler.bind(this)

    return methods
  }
  /**
   * 获取客户端公共参数
   *
   * @returns
   * @memberof Native
   */
  getNativePublicParams () {
    let _self = this
    return new Promise(function (resolve, reject) {
      let nativePublicParams = {
        _token: Utils.getQueryString('token') || '',
        _udid: Utils.getQueryString('udid') || ''
      }
      _self.promiseCallMethods('getNativePublicParams').then((res) => {
        if (res && res.code == '200') {
          nativePublicParams = typeof res.data === 'object' ? res.data : JSON.parse(res.data)
        }
        resolve(nativePublicParams)
      }).catch(() => {
        resolve(nativePublicParams)
      })
    })
  }

  /**
   * 注册客户端回调
   *
   * @param {*} name
   * @memberof Native
   */
  promiseRegisterMethods (name, h5callback, isReturn) {
    Utils.log('registerHandler-params-' + name, h5callback, isReturn)
    this.registerHandler(name, (clientParams = {}, clientCallback = () => {}) => {
      Utils.log('registerHandler-res-' + name, clientParams, clientCallback)
      clientParams = (typeof clientParams === 'object') ? clientParams : JSON.parse(clientParams)
      let defaultBack = { code: 200, msg: 'success', data: { handled: false } }
      // 是否开启自定义返回值
      let callbackParams = { clientParams, clientCallback: () => {} }
      if (!isReturn && typeof clientCallback === 'function') {
        clientCallback(defaultBack)
      } else {
        callbackParams.clientCallback = clientCallback
      }
      Utils.log('h5callback=>', callbackParams)
      typeof h5callback === 'function' && h5callback(callbackParams)
    })
  }

  /**
   * h5调用客户端
   *
   * @param {*} name
   * @param {*} [params={}]
   * @returns
   * @memberof Native
   */
  promiseCallMethods (name, h5Params = {}) {
    return new Promise((resolve, reject) => {
      let result = {}
      if (!Utils.isInside()) {
        result.code = '403'
        reject(result)
      }
      try {
        Utils.log('callHandler-params-' + name, h5Params)
        this.callHandler(name, h5Params, (res) => {
          try {
            result = typeof res === 'object' ? res : JSON.parse(res)
          } catch (error) {
            Utils.log('callHandler-res-json-' + name, res, error)
          }
          Utils.log('callHandler-res-' + name, result)
          resolve(result)
        })
      } catch (error) {
        result.code = '404'
        reject(result)
      }
    }).catch((error) => {
      Utils.log(name + '-error=>', error)
      switch (error.code) {
        case '403':
          Utils.toast({ message: 'Please open it on the app client.' })
          // Utils.toast({message: '请在Seely客户端打开'})
          break
        case '404':
          Utils.toast({ message: 'Please download the latest version of the app client to open.' })
          // Utils.toast({message: '请下载最新版Seely客户端打开'})
          break
        default:
          break
      }
      if (name === 'setJumpUrl') {
        setTimeout(() => {
          window.location.href = h5Params.url
        }, 1000)
      }
    })
  }
  /**
   * H5调用客户端方法
   * @method
   */
  callMethods () {
    return {
      /**
       * 系统相关
       * @return
       */
      // getNativePublicParams: 'getNativePublicParams', // 获取客户端公共参数
      /**
       * @name 设置页面链接跳转
       * @param {url}
       * @description eg: url: http://bbobo.com
       */
      setJumpUrl: 'setJumpUrl',
      /**
       * @name 一元夺宝设置页面链接跳转
       * @param {url}
       * @description eg: url: http://bbobo.com
       */
      checkMyNumber: 'checkMyNumber',
      /**
       * @param {title}
       * @description
       * title: '标题'
       */
      setNativeTitle: 'setNativeTitle', // 设置客户端标题
      /**
       * @name 设置标题栏右上角(分享或链接)
       * @param {options}
       * @description
       */
      setNativeSubtitle: 'setNativeSubtitle',
      /**
       * @name 设置标题栏右上角(分享或链接)
       * @param {options}
       * @description
       */
      goPayOrderList: 'goPayOrderList',
      /**
       * @name 调起客户端升级面板
       * @param {}
       * @description
       */
      callUpgradePanel: 'callUpgradePanel',
      /**
       * @name 调起客户端分享面板
       * @param {title, desc, from, way, imgUrl}
       * @description
       * title: '分享的标题'
       * desc: '分享的描述'
       * imgUrl： 'icon'
       * from:  ''
       * way:  -1
       * 1:微信好友，2:微信朋友圈 3:qq好友,4:qq空间,5:邮件 6：短信,7：新浪微博 8：系统分享
       * 9:whatsapp，10:viber 11:facebook,12:line,13:kakaotalk
       * webUrl：分享跳转地址
       */
      callSharePanel: 'callSharePanel',
      /**
       * @type 调起客户端模块/组件/面板
       */
      /**
       * @name 调起客户端登录模块
       * @param {from}
       * @description  from: 来源
       */
      callLoginModule: 'callLoginModule',
      /**
       * @type 资讯详情
       */
      /**
       * @name 设置客户端状态
       * @param {type, data}
       * @description  type 1关注 2标题 3图集 data(status true关注 false取消关注),data(scrollTop),data(list, index)
       */
      setNativeActionStatus: 'setNativeActionStatus',
      /**
       * @type type
       */
      /**
       * @name 调用客户端返回功能
       * @param {type}
       * @description  type = back 返回操作
       */
      callNativeAction: 'callNativeAction',
      /**
       * @type type
       */
      /**
       * @name 调用客户端手机号绑定功能
       * @param {type}
       * @description  type = back 返回操作
       */
      bindPhone: 'bindPhone',
      /**
       * @name 一元夺宝信息传递
       * @param {options}
       * @description
       */
      updateTreasureInfo: 'updateTreasureInfo',
      /**
       * @name NBA页面参数存储||所有页面状态存储
       * @param {options}
       * @description {"key":"xxx","value":"xxx"}
       */
      saveValueForKey: 'saveValueForKey',
      /**
       * @name NBA页面参数获取||所有页面状态获取
       * @param {options}
       * @description {"key":"xxx"}
       */
      readValueForKey: 'readValueForKey',
      /**
       * @name NBA跳转下注历史
       * @param {options}
       * @description
       */
      goNBABetHistory: 'goNBABetHistory',
      /**
       * @name NBA跳转下注首页
       * @param {options}
       * @description
       */
      goNBABetList: 'goNBABetList',
      /**
       * @name NBA弹框控制
       * @param {options}
       * @description
       */
      nbaBetConfirmDialogShow: 'nbaBetConfirmDialogShow',
      /**
       * @name NBA返回客户端高度
       * @param {options}
       * @description
       */
      returnWebPageHeight: 'returnWebPageHeight',
      /**
       * @name 获取键盘高度
       * @param {options}
       * @description
       */
      getKeyboardHeight: 'getKeyboardHeight',
      getNativePublicParams: 'getNativePublicParams'
    }
  }
  /**
   * 注册客户端回调方法
   * @method
   */
  registerMethods () {
    return {
      /**
       * @name 重载⻚面
       * @param {}
       * @description
       */
      cbReloadPage: 'cbReloadPage',
      /**
       * @name 客户端操作(1左上角关闭按钮2返回键)
       * @param {type}
       * @description
       */
      cbNativeAction: 'cbNativeAction',
      /**
       * @name 客户端操作(绑定邀请码))
       * @param {type}
       * @description
       */
      cbH5DialogPanel: 'cbH5DialogPanel',
      /**
       * @name 设置h5状态
       * @param {type, data}
       * @description type1关注 2字体,data(status true关注 false取消关注),data(size 1,2,3)
       */
      setH5ActionStatus: 'setH5ActionStatus',
      /**
       * @name 设置h5状态
       * @param {type, data}
       * @description type1关注 2字体,data(status true关注 false取消关注),data(size 1,2,3)
       */
      goPayOrderListFunc: 'goPayOrderListFunc'
    }
  }
  /**
   * schema协议跳转
   * @method
   */
  schemaMethods () {
    return {
      /**
       * @name 唤起客户端首页
       * @param {}
       * @description
       */
      home: 'seely://seely.web/',
      /**
       * @name 唤起客户端用户页
       * @param {}
       * @description
       */
      user (userId) {
        return `seely://seely.web/u?uid=${userId}`
      },
      /**
       * @name 唤起客户端视频页
       * @param {}
       * @description
       */
      video (videoId) {
        return `seely://seely.web/v?vid=${videoId}`
      }
    }
  }
}

export default new Native()

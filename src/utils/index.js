import Toast from '@/components/toast'
import * as Uuid from '@/utils/uuid'
import md5 from 'js-md5'

/**
 * toast 提示
 *
 * @export
 * @param {*} options
 */
export function toast (options) {
  Toast({
    message: options.message,
    position: options.position || 'bottom',
    className: options.className || '',
    duration: options.duration || 2000,
    iconClass: options.iconClass || '',
    topContent: options.topContent || {},
    bottomContent: options.bottomContent || {}
  })
}

/**
 * 统一错误处理
 *
 * @export
 * @param {*} e
 * @returns
 */
export function showError (e) {
  // console.error(e)
  let msg = ''
  if (typeof e === 'string') {
    msg = e
  } else {
    msg = e.msg || e.message
  }
  if (!msg) return
  Toast({
    message: msg,
    position: 'bottom',
    className: 'zindex-max'
  })
  return e
}

/**
 * 获取URL参数
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)

  return (r != null) ? unescape(r[2]) : ''
}

/**
 *拼接URL参数
 *
 * @export
 * @param {*} obj
 * @returns
 */
export function setQueryString (obj) {
  let str = '?param=true'
  for (let i in obj) {
    str += `&${i}=${obj[i]}`
  }
  return str
}

/**
 *获取url所以参数
 *
 * @export
 * @param {*} url
 * @returns
 */
export function parseQueryString (url) {
  var params = {}
  var arr = url.split('?')
  if (arr.length <= 1) {
    return params
  }
  arr = arr[1].split('&')
  for (var i = 0, l = arr.length; i < l; i++) {
    var a = arr[i].split('=')
    params[a[0]] = decodeURI(a[1])
  }
  return params
}
/**
 *父子类名替换
 *
 * @export
 * @param {*} url
 * @returns
 */
export function classSelect (ele, initial, replace) {
  let eleChildren = ele.target.parentElement.children
  for (let i in eleChildren) {
    if (i != 'length') {
      eleChildren[i].className = initial
    }
  }
  ele.target.className = replace
}
/**
 * 是否在端内
 *
 * @export
 * @returns
 */
export function isInside () {
  let ua = window.navigator.userAgent.toLowerCase()
  return ua.indexOf('yixia') > -1
}

/**
 * 获取常用的的参数
 *
 * @export
 * @param {*} [params={}]
 * @returns
 */
export function getParams (params = {}) {
  let nativePublicParams = window.nativePublicParams
  let udid = nativePublicParams._udid || Uuid.getUdid() || ''
  let userId = params.userId || nativePublicParams._uId || ''
  let uid = params.uid || nativePublicParams._uId || ''
  let token = params.token || nativePublicParams._token || ''
  let lang = nativePublicParams._appLanguage || window.navigator.language
  let options = { userId, udid, uid, token, lang }
  let newParams = Object.assign({}, params, options)
  log('newParams=>', newParams)
  return newParams
}

/**
 * 日志打印
 *
 * @export
 * @param {*} options
 */
export function log (...options) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...options)
  }
}

/**
 *  是否是空对象
 *
 * @export
 * @param {*} obj
 * @returns
 */
export function isEmptyObj (obj) {
  // null and undefined are "empty"
  if (obj == null) return true

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false
  if (obj.length === 0) return true

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }

  return true
}

/**
 * 获取语言包
 *
 * @export
 */
export function getLang () {
  const langLoading = {// 英语,西班牙,法语,葡语,日语,繁体-中文,简体-中文,泰语,印尼语,马来语,韩语
    'en': 'Loading...',
    'es': 'Cargando...',
    'fr': 'Chargement...',
    'pt': 'Carregando...',
    'ja': '読み込み中...',
    'zh-TW': '加載中...',
    'zh-CN': '加载中...',
    'th': 'กำลังโหลด...',
    'id': 'Memuat...',
    'ms': 'Memuatkan...',
    'ko': '로드 중...',
    'vi': 'Tải...'
  }
  let paramsLang = getQueryString('lang')
  let nativePublicParams = window.nativePublicParams
  let langPkg
  let langParam = ',' + (nativePublicParams._appLanguage || paramsLang || 'en' || window.navigator.language) + ',' // 系统语言
  let langLibs = ',' + Object.keys(langLoading).join(',') + ','
  log('langParam=>', langParam)
  log('langLibs=>', langLibs)
  if (langLibs.indexOf(langParam) > -1) {
    langPkg = langParam.replace(/,/g, '')
    log('langParam=>', langParam)
  } else if (langParam.indexOf('-') > -1) {
    let langArr = langParam.split('-')
    let lang = langArr[0].replace(/,/g, '')
    log('langsplit=>', lang)
    // let area = langArr[1]
    if (langLibs.indexOf(lang) > -1) {
      langPkg = lang
    } else {
      langPkg = 'en'
    }
  } else {
    log('langdefault=>en')
    langPkg = 'en'
  }

  return {
    langPkg,
    loading: langLoading[langPkg]
  }
}

/**
 * 请求参数
 *
 * @export
 * @param {*} params
 */
export function getReqParams (options = {}) {
  const ua = window.navigator.userAgent
  const platform = ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'IOS' : 'ANDROID'
  const secrets = {
    'ANDROID': 'Ac$ncRR6qGg5^Pdv%4@C',
    'IOS': 'E&%D1Z!GngrXtIw&#gSn',
    'WECHAT': 'W^PdvZncRRrXtIw&#gqG'
  }
  // 一元夺宝分享拿token
  let type
  let _token
  if (parseQueryString(window.location.search).phase_id) {
    type = parseQueryString(window.location.search).phase_id.split(',')[1] ? parseQueryString(window.location.search).phase_id.split(',')[1] : 0
    if (type) {
      _token = ''
    } else {
      _token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI3ODYxODUyMjU1NjkyODc3MzEyIiwiYXBwSUQiOjEyLCJleHAiOjE1ODEyMTU5NTEsImlhdCI6MTU3ODYyMzk1MX0.X51EpXv2GqEUx-9NtcXQ4j3zOpNYXzFDKMaDXmnXzCU'
    }
  } else if (window.location.href.indexOf('NBAbet') > 0) {
    _token = ''
  } else {
    _token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI3ODYxODUyMjU1NjkyODc3MzEyIiwiYXBwSUQiOjEyLCJleHAiOjE1ODEyMTU5NTEsImlhdCI6MTU3ODYyMzk1MX0.X51EpXv2GqEUx-9NtcXQ4j3zOpNYXzFDKMaDXmnXzCU'
  }
  // end
  const commonParams = {
    '_facturer': 'HUAWEI',
    // '_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI3MTUwMDY1NDE1MjM5ODkxOTY4IiwiYXBwSUQiOjEyLCJleHAiOjE1Mzg3OTAyOTQsImlhdCI6MTUzNjE5ODI5NH0.tw4l1fE9zFXFBV0FT2-X4338qoYfgDuCx9doBpJ8ZQ4',
    '_token': _token,
    '_imei': '862538032575173',
    '_brand': 'HONOR',
    '_mac': 'd4:a1:48:ff:89:bc',
    '_appLanguage': 'en',
    '_pcId': 'norelease',
    '_dId': 'CAM-AL00',
    '_aKey': platform,
    '_vOs': '6.0',
    '_uid': '',
    '_cpu': 'arm64-v8a',
    '_devid': 'A942CC1BB69B7A3E2F9395260356207C',
    '_uId': '',
    '_vName': '1.0.0',
    '_lang': 'zh_CN',
    '_androidID': 'c521fd7e0befeffb',
    '_pgLoad': '0',
    '_pName': 'com.newspark.mobile',
    '_timezone': 'GMT+08:00_Asia Shanghai',
    '_region': 'CN',
    '_px': '720x1208',
    '_rt': '0',
    '_udid': '3BC3B86D5EFA87A14129F7E8C574EF7A',
    '_imsi': '',
    '_vApp': '5295',
    '_t': new Date().getTime(),
    '_nId': '1',
    '_abId': ''
  }
  let common
  if (options && options.common && options.common._token) {
    common = Object.assign({}, commonParams, options.common || {})
  } else {
    common = commonParams
  }
  let data = Object.assign({}, { common }, { params: options.data || {} })
  let sign = md5(JSON.stringify(data) + secrets[common._aKey]).substr(2, 20)

  return { data, sign }
}

/**
 * 多语言url lang 配置
 *
 * @export
 * @param {url, lang}
 */
export function replaceLangUrl (url, lang) {
  url = url || ''
  return url.replace(/\{(lang)\}/g, lang)
}

/**
 * 事件绑定
 *
 * @export
 * @param {element, type, handler}
 */
export function addHandler (element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler)
  } else {
    element['on' + type] = handler
  }
}

export function getDocumentVisibility () {
  var hidden, visibilityState, visibilityChange
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
    visibilityState = 'visibilityState'
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden'
    visibilityChange = 'mozvisibilitychange'
    visibilityState = 'mozVisibilityState'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
    visibilityState = 'msVisibilityState'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
    visibilityState = 'webkitVisibilityState'
  }
  return { visibilityChange, visibilityState, hidden }
}
/**
 * 页面显示/隐藏
 *
 * @export visibilityChange
 * @return cb {hidden: true/false}
 */
export function visibilityChange (cb) {
  let documentVisibility = getDocumentVisibility()
  addHandler(document, documentVisibility.visibilityChange, () => {
    let hidden = document[documentVisibility.visibilityState] == 'hidden'
    cb && typeof cb === 'function' && cb(hidden)
  })
}

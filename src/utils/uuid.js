/*
 * @Author: 王少龙#wangshaolong@yixia.com
 * @Date: 2018-06-05 15:04:35
 * @Last Modified by: 欧阳威
 * @Last Modified time: 2018-06-06 20:29:35
 */

import uuidV4 from 'uuid/v4'

/**
 * uuid 生成
 *
 * @export
 * @returns
 */
export function generateUUID () {
  let bbUuid = uuidV4()
  bbUuid = bbUuid.replace(/-/g, '')
  bbUuid = bbUuid.toUpperCase()
  window.localStorage.setItem('bb_out_uuid', bbUuid)
  return bbUuid
}

/**
 * 获取uuid
 *
 * @export
 * @returns
 */
export function getUUID () {
  let uuid = window.localStorage.getItem('bb_out_uuid') || ''
  return uuid || generateUUID()
}

/**
 *  获取udid
 *
 * @export
 * @param {*} [params={udid:String}]
 * @returns
 */
export function getUdid (params = {}) {
  let nativePublicParams = window.nativePublicParams
  let udid = ''
  if (nativePublicParams && nativePublicParams._udid) { // 端内的 udid
    udid = params.udid || nativePublicParams._udid || ''
  } else { // 端外的 udid (uuid 生成)
    udid = params.udid || getUUID() || ''
  }
  return udid
}

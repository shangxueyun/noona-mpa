import axios from 'axios' // axios
import Url from './url'
import * as Utils from '@/utils'

export default (params = {}) => {
  let nativePublicParams = window.nativePublicParams || {}
  let mode = process.env.NODE_ENV === 'production' ? 'prod' : 'test'
  let defaultParams = {
    type: 'boboJsLog',
    mode,
    app: 'boboApp',
    pages: 'index',
    action: 'init',
    params: {}, // {api: {errType, errMsg, errContent, errLine}, h5:{errType, errMsg, errContent, errLine}, client: {code, msg, data}}
    common: nativePublicParams
  }
  params = Object.assign({}, defaultParams, params)
  if (Utils.isInside()) {
    return axios.post(Url.jsLogCollect, params)
  }
}

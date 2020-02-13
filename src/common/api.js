import axios from 'axios'
import Url from './url'
// import md5 from 'js-md5'
import * as Utils from '@/utils'

/**
 *
 *
 * @export
 * @class Api
 */
export default class Api {
  fetch (options) {
    return new Promise((resolve, reject) => {
      options.common = window.nativePublicParams || {}
      // let data = Object.assign({ common }, { params: options.data || {} })
      // let sign = md5(JSON.stringify(data) + 'mMhF&FxxdK5@#WPp').substr(2, 20)
      const reqParams = Utils.getReqParams(options)
      options = Object.assign(options, { data: reqParams.data })
      const instance = axios.create({
        baseURL: Url.Api,
        withCredentials: false,
        timeout: 10 * 1000,
        method: 'POST',
        headers: {
          notsign: 1,
          noencrypt: 1
        }
      })

      // Add a request interceptor
      instance.interceptors.request.use(
        config => {
          return config
        },
        error => {
          return Promise.reject(error)
        })

      // Add a response interceptor
      instance.interceptors.response.use(
        response => {
          return response
        },
        error => {
          return Promise.reject(error)
        })

      instance(options).then((response) => {
        if (response.data && (response.data.code === 0 || response.data.code === 'A0000')) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      }).catch((error) => {
        if (error && error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('error.response', error.response.data)
          console.log('error.response', error.response.status)
          console.log('error.response', error.response.headers)
        } else if (error && error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('error.request', error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        reject(error)
      })
    })
  }
  get (options) {
    return new Promise((resolve, reject) => {
      axios.get(options.url, { params: options.params }).then((response) => {
        if (response.data && response.status == 200) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}

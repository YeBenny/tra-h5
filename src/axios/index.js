import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js/crypto-js'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BUSINESS_BASE_URL

axios.interceptors.request.use(
  (config) => {
    config.headers['X-Wegalaxy-Request-Id'] = uuidv4()
    config.headers['X-Tra-Transaction-Id'] = uuidv4()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (res) => {
    const data = res.data
    if (res.status === 200) {
      let errorCode = data.errorCode ?? data.errcode
      let errorMessage = data.errorMessage ?? data.errmsg
      if (errorCode === 0) {
        let result = data.data
        return Promise.resolve(result)
      } else {
        return Promise.reject(errorMessage)
      }
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

const getHeaders = (appId, signature, timestamp, functionName) => {
  let headers = {}
  if (appId) {
    headers['appId'] = appId
  }
  if (signature) {
    headers['signature'] = signature
  }
  if (timestamp) {
    headers['timestamp'] = timestamp
  }
  if (functionName) {
    headers['functionName'] = functionName
  }
  return headers
}

function registerUpstreamUser(upstreamUserId, appId, appSecret) {
  const httpMethod = 'POST'
  const functionName = 'registerEndUser'
  const requestBody = { upstreamUserId: upstreamUserId }
  const timestamp = Math.floor(Date.now() / 1000)
  const source = httpMethod + functionName + JSON.stringify(requestBody) + timestamp
  let hashHmacSHA256 = CryptoJS.HmacSHA256(source, appSecret)
  let signature = CryptoJS.enc.Base64.stringify(hashHmacSHA256)

  return axios.post(
    '/users/register',
    { ...requestBody },
    {
      headers: getHeaders(appId, signature, timestamp, functionName)
    }
  )
}

function issueTra(upstreamUserId, traId, remark, appId, appSecret) {
  const httpMethod = 'POST'
  const functionName = 'issueTraToUser'
  const requestBody = {
    upstreamUserId: upstreamUserId,
    traId: traId,
    remark: remark
  }
  const timestamp = Math.floor(Date.now() / 1000)
  const source = httpMethod + functionName + JSON.stringify(requestBody) + timestamp
  let hashHmacSHA256 = CryptoJS.HmacSHA256(source, appSecret)
  let signature = CryptoJS.enc.Base64.stringify(hashHmacSHA256)

  return axios.post(
    '/tras/issue',
    { ...requestBody },
    {
      headers: getHeaders(appId, signature, timestamp, functionName)
    }
  )
}

function getTokenContext(upstreamUserId, appId, appSecret) {
  const httpMethod = 'POST'
  const functionName = 'getToken'
  const requestBody = { upstreamUserId: upstreamUserId }
  const timestamp = Math.floor(Date.now() / 1000)
  const source = httpMethod + functionName + JSON.stringify(requestBody) + timestamp
  let hashHmacSHA256 = CryptoJS.HmacSHA256(source, appSecret)
  let signature = CryptoJS.enc.Base64.stringify(hashHmacSHA256)

  // return axios.post(`/get-token-context`)
  return {
    timestamp: timestamp,
    appId: appId,
    upstreamUserId: upstreamUserId,
    signature: signature
  }
}

export { registerUpstreamUser, issueTra, getTokenContext }

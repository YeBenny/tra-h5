import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useConfigStore } from '../stores/config'
import CryptoJS from 'crypto-js/crypto-js'

axios.defaults.withCredentials = true

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

const getHeaders = (appId, signature, timestamp) => {
  let headers = {}
  let { config } = useConfigStore()
  let token = config.webTraAccessToken
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (appId) {
    headers['appId'] = appId
  }
  if (signature) {
    headers['signature'] = signature
  }
  if (timestamp) {
    headers['timestamp'] = timestamp
  }
  return headers
}

function registerUpstreamUser(upstreamUserId, appId, appSecret) {
  const httpMethod = 'POST'
  const httpPath = '/v1/tra/users/register'
  const requestBody = { upstreamUserId: upstreamUserId }
  const timestamp = Math.floor(Date.now() / 1000)
  const source = httpMethod + httpPath + JSON.stringify(requestBody) + timestamp
  let hashHmacSHA256 = CryptoJS.HmacSHA256(source, appSecret)
  let signature = CryptoJS.enc.Base64.stringify(hashHmacSHA256)

  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBusinessBaseUrl}/users/register`,
    { ...requestBody },
    {
      headers: getHeaders(appId, signature, timestamp)
    }
  )
}

function issueTra(upstreamUserId, traId, remark, appId, appSecret) {
  const httpMethod = 'POST'
  const httpPath = '/v1/tra/tras/issue'
  const requestBody = {
    upstreamUserId: upstreamUserId,
    traId: traId,
    remark: remark
  }
  console.log(JSON.stringify(requestBody))
  const timestamp = Math.floor(Date.now() / 1000)
  const source = httpMethod + httpPath + JSON.stringify(requestBody) + timestamp
  let hashHmacSHA256 = CryptoJS.HmacSHA256(source, appSecret)
  let signature = CryptoJS.enc.Base64.stringify(hashHmacSHA256)

  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBusinessBaseUrl}/tras/issue`,
    { ...requestBody },
    {
      headers: getHeaders(appId, signature, timestamp)
    }
  )
}

function getTokenContext(upstreamUserId, appId, appSecret) {
  const httpMethod = 'POST'
  const httpPath = '/v1/tra/users/get-token'
  const requestBody = { upstreamUserId: upstreamUserId }
  const timestamp = Math.floor(Date.now() / 1000)
  const source = httpMethod + httpPath + JSON.stringify(requestBody) + timestamp
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

function getToken(upstreamUserId, appId, signature, timestamp) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/users/get-token`,
    {
      upstreamUserId: upstreamUserId
    },
    {
      headers: getHeaders(appId, signature, timestamp)
    }
  )
}

function getSeriesList(startIndex, pageSize) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/list`,
    {
      pageInfo: {
        startIndex: startIndex,
        pageSize: pageSize
      }
    },
    {
      headers: getHeaders()
    }
  )
}

function getSeriesDetail(id) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/get`,
    {
      id: id
    },
    {
      headers: getHeaders()
    }
  )
}

function getTraList(seriesId) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/tras/list`,
    {
      seriesId: seriesId
    },
    {
      headers: getHeaders()
    }
  )
}

function getTraDetail(id) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/tras/get`,
    {
      id: id
    },
    {
      headers: getHeaders()
    }
  )
}

function getRedemptionList(seriesId) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/redemptions/list`,
    {
      seriesId: seriesId
    },
    {
      headers: getHeaders()
    }
  )
}

export {
  registerUpstreamUser,
  issueTra,
  getTokenContext,
  getToken,
  getSeriesList,
  getSeriesDetail,
  getTraList,
  getTraDetail,
  getRedemptionList
}

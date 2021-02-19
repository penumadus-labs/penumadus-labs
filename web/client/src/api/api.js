// import axios from 'axios'
import url from '../utils/url'

// const withCredentials = process.env.NODE_ENV === 'development'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const baseURL = url + 'api/'

// export const api = axios.create({
//   baseURL,
//   headers,
//   withCredentials,
// })

// export const parseError = (error) =>
//   error.response?.statusText || error.toString()

// export const request = async (url, params = {}, method = 'get') => {
//   const { data } = await api({ method, url, params })
//   return data
// }

// export const update = async (url, data = {}, method = 'post') => {
//   const res = await api({ method, url, data })
//   return res.data
// }

const createUrl = (path, params) => {
  const url = new URL(baseURL + path)
  if (params) url.search = new URLSearchParams(params).toString()

  return url
}

export const update = async (path, data = {}) => {
  const response = await fetch(createUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(data),
  })
  if (!response.ok) throw Error(response.statusText)
}

export const request = async (...ctx) => {
  const response = await fetch(createUrl(...ctx), {
    method: 'GET',
    credentials: 'include',
    headers,
  })

  if (!response.ok) throw Error(response.statusText)
  return response.json()
}
